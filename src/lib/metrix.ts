// src/lib/metrix.ts
import type { Hole } from "@models/models";

/** Proxy-basert Metrix-endepunkt (dev/prod) */
export const BASE =
  import.meta.env.PROD ? "/api/metrix" : "/metrix/api.php";

export type MetrixBasket = { Number: string; Par: string; [k: string]: any };
export type MetrixCourse = { course?: any; baskets: MetrixBasket[]; [k: string]: any };

function buildUrl(params: Record<string, string>) {
  const u = new URL(BASE, location.origin);
  Object.entries(params).forEach(([k, v]) => u.searchParams.set(k, v));
  return u.toString();
}

/** Hent en spesifikk layout/bane fra Metrix med integration code */
export async function metrixGetCourse(id: string, code: string): Promise<MetrixCourse> {
  const url = buildUrl({ content: "course", id, code });
  const res = await fetch(url, { method: "GET" });
  if (!res.ok) throw new Error(`course: ${res.status} ${res.statusText}`);
  const data = await res.json();
  const baskets: MetrixBasket[] = Array.isArray((data as any).baskets) ? (data as any).baskets : [];
  return { ...data, baskets };
}

/** Map Metrix-respons til appens Hole[] (sorterer og klemmer par til [2..6]) */
export function mapMetrixToHoles(m: MetrixCourse): Hole[] {
  return m.baskets
    .slice()
    .sort((a, b) => Number(a.Number) - Number(b.Number))
    .map((b, i) => ({
      number: i + 1,
      par: Math.max(2, Math.min(6, Number(b.Par) || 3)),
    }));
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
