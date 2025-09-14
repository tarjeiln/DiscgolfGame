import { useState } from "react";
import FormField from "@components/form/FormField";
import { metrixSmartSearch, metrixGetCourse, mapMetrixToHoles, rankCourses, type SortMode, metrixFetchLayoutsForParent, extractMetrixId } from "@lib/metrix";
import type { MetrixCourseListItem } from "@lib/metrix";

type Props = {
  onCreate: (courseName: string, players: string[], holes: number, holesPreset?: number[]) => void;
  onBack: () => void;
};

export default function NewRound({ onCreate, onBack }: Props) {
  // Grunnfelter
  const [courseName, setCourseName] = useState("Lokal bane");
  const [players, setPlayers] = useState<string[]>([""]); // start med én spiller
  const [holes, setHoles] = useState(18);

  // Metrix UI-state
  const [mxCode, setMxCode] = useState("");
  const [country, setCountry] = useState("NO");
  const [query, setQuery] = useState("");
  const [mxResults, setMxResults] = useState<MetrixCourseListItem[]>([]);
  const [isBusy, setIsBusy] = useState(false);
  const [mxError, setMxError] = useState<string | undefined>();
  const [holesPreset, setHolesPreset] = useState<number[] | undefined>(undefined);
  const [sortMode, setSortMode] = useState<SortMode>('relevance');
  const [onlyLayouts, setOnlyLayouts] = useState(false);
  const [expandedParents, setExpandedParents] = useState<Record<string, boolean>>({});
  const [parentLayouts, setParentLayouts]   = useState<Record<string, MetrixCourseListItem[]>>({});
  const [parentBusy, setParentBusy]         = useState<Record<string, boolean>>({});
  const [directId, setDirectId] = useState("");
  const [directErr, setDirectErr] = useState<string | undefined>();


  async function fetchByDirectId() {
  setDirectErr(undefined);
  const id = extractMetrixId(directId);
  if (!id) { setDirectErr("Fant ingen id i teksten."); return; }
  if (!mxCode) { setDirectErr("Fyll inn Metrix-kode først."); return; }

  setIsBusy(true);
  try {
    const m = await metrixGetCourse(id, mxCode);
    const hs = mapMetrixToHoles(m);
    setCourseName((m as any)?.course?.Fullname ?? courseName);
    setHoles(hs.length);
    setHolesPreset(hs.map(h => h.par));
  } catch (e:any) {
    setDirectErr(String(e?.message ?? e));
  } finally {
    setIsBusy(false);
  }
}


  async function toggleParentLayouts(parent: MetrixCourseListItem) {
  const id = parent.ID;
  const isOpen = !!expandedParents[id];
  if (isOpen) {
    setExpandedParents(prev => ({ ...prev, [id]: false }));
    return;
  }
  // åpne – hent hvis vi ikke har cachet
  if (!parentLayouts[id]) {
    setParentBusy(prev => ({ ...prev, [id]: true }));
    try {
      const layouts = await metrixFetchLayoutsForParent(country, parent);
      setParentLayouts(prev => ({ ...prev, [id]: layouts }));
    } finally {
      setParentBusy(prev => ({ ...prev, [id]: false }));
    }
  }
  setExpandedParents(prev => ({ ...prev, [id]: true }));
}


  // --- spillere (dynamisk) ---
  const updatePlayer = (i: number, name: string) =>
    setPlayers(prev => {
      const next = [...prev];
      next[i] = name;
      return next;
    });

  const addPlayer = () => setPlayers(prev => [...prev, ""]);
  const removePlayer = (i: number) => setPlayers(prev => prev.filter((_, idx) => idx !== i));

  // --- Metrix ---
  async function doSearch() {
    setMxError(undefined);
    setIsBusy(true);
    try {
      const raw = await metrixSmartSearch(country, query);
      const ranked = rankCourses(raw, query, sortMode, onlyLayouts);
      setMxResults(ranked);
    } catch (e: any) {
      setMxResults([]);
      setMxError(String(e?.message ?? e));
    } finally {
      setIsBusy(false);
    }
  }

  async function pickCourse(id: string, fullname: string) {
    setMxError(undefined);
    if (!mxCode) {
      alert("Fyll inn Metrix-kode (integration code) først.");
      return;
    }
    setIsBusy(true);
    try {
      const m = await metrixGetCourse(id, mxCode);
      const hs = mapMetrixToHoles(m);
      const preset = hs.map(h => h.par);
      setCourseName(fullname);
      setHoles(hs.length);
      setHolesPreset(preset);
    } catch (e: any) {
      setMxError(String(e?.message ?? e));
    } finally {
      setIsBusy(false);
    }
  }

  function clearPreset() {
    setHolesPreset(undefined);
  }

  // --- start runde ---
  function startRound() {
    const names = players.map(s => s.trim()).filter(Boolean);
    if (names.length === 0) names.push("Spiller 1");
    onCreate(courseName.trim(), names, holes, holesPreset);
  }

  return (
    <main className="container">
      <div className="stack">
        <h2>Ny runde</h2>

        {/* Bane */}
        <FormField
          id="course"
          label="Bane"
          value={courseName}
          onChange={setCourseName}
          placeholder="F.eks. Ditt lokale anlegg"
        />

        {/* Spillere (dynamisk liste) */}
        <fieldset style={{ border: 0, margin: 0, padding: 0 }}>
          <legend>Spillere</legend>

          <div style={{ display: "grid", gap: 8 }}>
            {players.map((name, index) => (
              <div key={index} className="row" style={{ gap: 8, alignItems: "flex-end" }}>
                <FormField
                  id={`player-${index}`}
                  label={`Spiller ${index + 1}`}
                  value={name}
                  onChange={v => updatePlayer(index, v)}
                  placeholder={`Spiller ${index + 1}`}
                />
                {players.length > 1 && (
                  <button type="button" onClick={() => removePlayer(index)}>
                    Fjern
                  </button>
                )}
              </div>
            ))}
          </div>

          <div style={{ marginTop: 8 }}>
            <button type="button" onClick={addPlayer}>
              Legg til spiller
            </button>
          </div>
        </fieldset>

        {/* Antall hull */}
        <FormField
          id="holes"
          label="Antall hull"
          type="number"
          value={holes}
          onChange={v => {
            const n = parseInt(v, 10);
            const safe = Number.isNaN(n) ? 1 : Math.max(1, Math.min(27, n));
            setHoles(safe);
          }}
          min={1}
          max={27}
          inputMode="numeric"
          hint="1–27 hull"
        />

        {/* Hent par fra Disc Golf Metrix */}
        <section className="panel">
          <h3 style={{ marginTop: 0 }}>Hent par fra Disc Golf Metrix</h3>

          <div className="row" style={{ gap: 8, alignItems: "center" }}>
            <input
              placeholder="Metrix-kode (integration code)"
              value={mxCode}
              onChange={e => setMxCode(e.target.value)}
            />
            <input
              placeholder="Land (f.eks. NO)"
              value={country}
              onChange={e => setCountry(e.target.value.toUpperCase())}
              style={{ maxWidth: 120 }}
            />
            <input
              placeholder="Søk (banenavn)"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <button type="button" onClick={doSearch} disabled={isBusy}>
              {isBusy ? "Søker…" : "Søk"}
            </button>
          </div>
          
          <div className="row" style={{ gap: 8, alignItems: "center", marginTop: 8 }}>
            <input
              placeholder="Lim inn Metrix-URL eller id (f.eks. .../course/12345)"
              value={directId}
              onChange={e => setDirectId(e.target.value)}
              style={{ flex: 1 }}
            />
            <button type="button" onClick={fetchByDirectId} disabled={isBusy}>Hent fra URL/ID</button>
          </div>
          {directErr && <p style={{ color: "var(--danger)" }}>{directErr}</p>}

          <div className="row" style={{ gap: 8, alignItems: "center", marginTop: 8 }}>
            <label>
              Sortér:&nbsp;
              <select
                value={sortMode}
                onChange={(e) => {
                  const next = e.target.value as SortMode;
                  setSortMode(next);
                  // re-rank eksisterende liste uten nytt API-kall
                  setMxResults((prev) => rankCourses(prev, query, next, onlyLayouts));
                }}
              >
                <option value="relevance">Relevans</option>
                <option value="newest">Nyeste</option>
              </select>
            </label>

            <label style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <input
                type="checkbox"
                checked={onlyLayouts}
                onChange={(e) => {
                  const flag = e.target.checked;
                  setOnlyLayouts(flag);
                  // re-rank eksisterende liste uten nytt API-kall
                  setMxResults((prev) => rankCourses(prev, query, sortMode, flag));
                }}
              />
              Bare layouts
            </label>
          </div>

          {mxError && <p style={{ color: "var(--danger)" }}>Feil: {mxError}</p>}

          {!isBusy && (
            mxResults.length ? (
              <>
                <p style={{ marginTop: 8 }}>Fant {mxResults.length} treff</p>

                <div className="scroll">
                  {/* a) Bare layouts = samme “chips grid” som før */}
                  {onlyLayouts ? (
                    <div className="chips">
                      {mxResults.map(r => (
                        <button
                          key={r.ID}
                          type="button"
                          className="chip"
                          title={r.Fullname}
                          onClick={() => pickCourse(r.ID, r.Fullname)}
                        >
                          <span className="chipText">{r.Fullname}</span>
                          <span className="chipSub">id {r.ID}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    /* b) Blanding: parent-rader (Type 1) som kan ekspanderes + direkte layouts (Type 2) */
                    <div className="stack">
                      {mxResults.map(r => {
                        if (r.Type === "2") {
                          // direkte layout -> en chip alene
                          return (
                            <div key={r.ID} className="chips">
                              <button
                                type="button"
                                className="chip"
                                title={r.Fullname}
                                onClick={() => pickCourse(r.ID, r.Fullname)}
                              >
                                <span className="chipText">{r.Fullname}</span>
                                <span className="chipSub">layout · id {r.ID}</span>
                              </button>
                            </div>
                          );
                        }

                        // parent -> tittel + knapp for å ekspandere layouts
                        const open = !!expandedParents[r.ID];
                        const busy = !!parentBusy[r.ID];
                        const layouts = parentLayouts[r.ID] ?? [];

                        return (
                          <div key={`p-${r.ID}`} style={{ padding: "6px 0" }}>
                            <div className="row" style={{ alignItems: "center", gap: 8 }}>
                              <h4 style={{ margin: 0 }}>{r.Fullname}</h4>
                              <button
                                type="button"
                                className="btn-secondary"
                                onClick={() => toggleParentLayouts(r)}
                                disabled={busy}
                              >
                                {busy ? "Henter…" : (open ? "Skjul layouts" : "Vis layouts")}
                              </button>
                            </div>

                            {open && (
                              layouts.length ? (
                                <div className="chips" style={{ marginTop: 8 }}>
                                  {layouts.map(l => (
                                    <button
                                      key={l.ID}
                                      type="button"
                                      className="chip"
                                      title={l.Fullname}
                                      onClick={() => pickCourse(l.ID, l.Fullname)}
                                    >
                                      <span className="chipText">{l.Fullname}</span>
                                      <span className="chipSub">layout · id {l.ID}</span>
                                    </button>
                                  ))}
                                </div>
                              ) : (
                                <p style={{ marginTop: 8, color: "var(--muted)" }}>
                                  Ingen layouts funnet for denne banen.
                                </p>
                              )
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <p style={{ marginTop: 8, color: "var(--muted)" }}>
                Ingen treff ennå – prøv søk.
              </p>
            )
          )}

          {holesPreset && (
            <div className="row" style={{ marginTop: 8, gap: 8, alignItems: "center" }}>
              <p style={{ margin: 0 }}>
                Valgt: <strong>{courseName}</strong> — {holesPreset.length} hull.
                &nbsp;Par: [{holesPreset.join(", ")}]
              </p>
              <button type="button" className="btn-secondary" onClick={clearPreset}>
                Fjern valgt bane
              </button>
            </div>
          )}

          <small>
            Tips: “Integration code” finner du i Metrix-profilen din. I dev anbefales proxy: <code>/metrix/api.php</code>.
          </small>
        </section>

        {/* Handlinger */}
        <div className="row">
          <button type="button" onClick={startRound}>Start</button>
          <button type="button" onClick={onBack}>Tilbake</button>
        </div>
      </div>
    </main>
  );
}
