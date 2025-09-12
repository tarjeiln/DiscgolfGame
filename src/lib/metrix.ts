// src/lib/metrix.ts
import type { Hole } from "@models/models";

const BASE = "/metrix/api.php";

export type MetrixCourseListItem = {
  ID: string;
  Fullname: string;
  Type?: string; // '1' = parent, '2' = layout
  ParentID?: string | null;
  CountryCode?: string;
  [k: string]: any;
};
export type MetrixBasket = { Number: string; Par: string; [k: string]: any; };
export type MetrixCourse = { course?: any; baskets: MetrixBasket[]; [k: string]: any; };

function buildUrl(params: Record<string, string>) {
  const u = new URL(BASE, location.origin);
  Object.entries(params).forEach(([k, v]) => u.searchParams.set(k, v));
  return u.toString();
}
function uniqById<T extends { ID: string }>(arr: T[]) {
  const seen = new Set<string>(); return arr.filter(x => (seen.has(x.ID) ? false : (seen.add(x.ID), true)));
}
function strip(s: string) { return s.normalize('NFKD').replace(/\p{Diacritic}/gu, '').toLowerCase(); }

// --- API-kall (uendret logikk) ---
export async function metrixSearchCourses(countryCode: string, name?: string): Promise<MetrixCourseListItem[]> {
  const url = buildUrl({ content: "courses_list", country_code: countryCode, ...(name ? { name } : {}) });
  const res = await fetch(url, { method: "GET" });
  if (!res.ok) throw new Error(`courses_list: ${res.status} ${res.statusText}`);
  const data = await res.json();
  const list: unknown = Array.isArray(data) ? data
    : Array.isArray((data as any).courses) ? (data as any).courses
    : Array.isArray((data as any).data) ? (data as any).data : [];
  return (list as MetrixCourseListItem[]) ?? [];
}

export async function metrixGetCourse(id: string, code: string): Promise<MetrixCourse> {
  const url = buildUrl({ content: "course", id, code });
  const res = await fetch(url, { method: "GET" });
  if (!res.ok) throw new Error(`course: ${res.status} ${res.statusText}`);
  const data = await res.json();
  const baskets: MetrixBasket[] = Array.isArray((data as any).baskets) ? (data as any).baskets : [];
  return { ...data, baskets };
}

export function mapMetrixToHoles(m: MetrixCourse): Hole[] {
  return m.baskets.slice().sort((a, b) => Number(a.Number) - Number(b.Number))
    .map((b, i) => ({ number: i + 1, par: Math.max(2, Math.min(6, Number(b.Par) || 3)) }));
}

// --- SMART SØK + RANKING ---
export async function metrixSmartSearch(countryCode: string, query: string) {
  const q = query.trim();
  if (!q) return [];
  const parts = q.split(/\s+/).filter(Boolean);

  // Flere mønstre: prefiks, contains, og "contains i rekkefølge" (ord1%ord2%…)
  const patterns = new Set<string>([ `${q}%`, `%${q}%` ]);
  if (parts.length > 1) {
    patterns.add('%' + parts.join('%') + '%');    // %ord1%ord2%
    parts.forEach(p => patterns.add(`%${p}%`));   // hver for seg
  }

  const batches: MetrixCourseListItem[][] = [];
  for (const pat of patterns) {
    try {
      const res = await metrixSearchCourses(countryCode, pat);
      batches.push(res);
    } catch { /* ignorer enkeltfeil */ }
  }
  const list = uniqById(batches.flat());

  return list;
}

// “Poeng” for hvor godt et navn matcher søket (enkel relevansscore)
export function scoreCourseMatch(name: string, q: string): number {
  const a = strip(name), b = strip(q);
  if (a === b) return 1000;
  if (a.startsWith(b)) return 800;
  if (a.includes(b)) return 600;
  // bonus for å matche alle ord
  const words = b.split(/\s+/).filter(Boolean);
  let hits = 0; for (const w of words) if (a.includes(w)) hits++;
  return 200 + hits * 80 - Math.abs(a.length - b.length) * 0.5;
}

export type SortMode = 'relevance' | 'newest';
export function rankCourses(list: MetrixCourseListItem[], query: string, sort: SortMode, onlyLayouts: boolean) {
  let arr = onlyLayouts ? list.filter(x => x.Type === '2') : list.slice();
  if (sort === 'relevance') {
    arr.sort((x, y) => {
      const sx = scoreCourseMatch(x.Fullname ?? '', query);
      const sy = scoreCourseMatch(y.Fullname ?? '', query);
      // Relevans nedover; tie-breaker: layouts først, så "nyeste" via ID
      return (sy - sx) || ((y.Type === '2' ? 1 : 0) - (x.Type === '2' ? 1 : 0)) || (Number(y.ID) - Number(x.ID));
    });
  } else { // 'newest'
    arr.sort((x, y) => (Number(y.ID) - Number(x.ID)) || ((y.Type === '2' ? 1 : 0) - (x.Type === '2' ? 1 : 0)));
  }
  return arr;
}

/* Dev helpers (valgfritt) */
declare global { interface Window {
  mxSearch?: typeof metrixSearchCourses; mxSmart?: typeof metrixSmartSearch;
}}
if (import.meta.env.DEV) { window.mxSearch = metrixSearchCourses; window.mxSmart = metrixSmartSearch; }


// Hent layouts (Type 2) for en parent (Type 1)
export async function metrixFetchLayoutsForParent(
  countryCode: string,
  parent: MetrixCourseListItem
): Promise<MetrixCourseListItem[]> {
  // bruk eksisterende smart-søk med parent-navn
  const raw = await metrixSmartSearch(countryCode, parent.Fullname);

  // primært: match på ParentID hvis API sender den med
  let kids = raw.filter(x => x.Type === '2' && (x as any).ParentID === parent.ID);

  // fallback: match på navn (diakritikk-insensitiv contains)
  if (kids.length === 0) {
    const strip = (s: string) => s.normalize('NFKD').replace(/\p{Diacritic}/gu, '').toLowerCase();
    const p = strip(parent.Fullname ?? '');
    kids = raw.filter(x => x.Type === '2' && strip(x.Fullname ?? '').includes(p));
  }

  // sortér “nyeste først” (vi antar høyere ID ~ nyere)
  return rankCourses(kids, parent.Fullname, 'newest', true);
}

/** Finn Metrix course-id i en URL/tekst (tåler flere varianter). */
export function extractMetrixId(source: string): string | undefined {
  const s = String(source).trim();
  // ?id=12345
  let m = s.match(/[?&]id=(\d{2,})/i);
  if (m) return m[1];
  // /course/12345 eller /Course/12345
  m = s.match(/\/course\/(\d{2,})/i);
  if (m) return m[1];
  // slutt på strengen .../12345
  m = s.match(/(\d{3,})\D*$/);
  if (m) return m[1];
  return undefined;
}
