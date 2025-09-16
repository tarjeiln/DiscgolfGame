import { useState } from "react";
import FormField from "@components/form/FormField";
import { metrixGetCourse, mapMetrixToHoles, extractMetrixId } from "@lib/metrix";
import type { Card } from '@models/models';

type Props = {
  onCreate: (courseName: string, players: string[], holes: number, holesPreset?: number[], deckInclude?: Card['category'][]) => void;
  onBack: () => void;
};

export default function NewRound({ onCreate, onBack }: Props) {
  // Grunnfelter
  const [courseName, setCourseName] = useState("Lokal bane");
  const [players, setPlayers] = useState<string[]>([""]); // start med én spiller
  const [holes, setHoles] = useState(18);

  // Metrix (kun URL/ID)
  const [mxCode, setMxCode] = useState("");
  const [isBusy, setIsBusy] = useState(false);
  const [holesPreset, setHolesPreset] = useState<number[] | undefined>(undefined);
  const [directId, setDirectId] = useState("");
  const [directErr, setDirectErr] = useState<string | undefined>();

  const ALL_CATEGORIES: Card['category'][] = ['ThrowStyle','Scoring','Challenge','DiscLimit','Other'];
  const [categories, setCategories] = useState<Card['category'][]>([...ALL_CATEGORIES]);
  const toggleCat = (cat: Card['category']) => setCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);

  async function fetchByDirectId() {
    setDirectErr(undefined);
    const id = extractMetrixId(directId);
    if (!id) { setDirectErr("Fant ingen id i teksten."); return; }
    if (!mxCode) { setDirectErr("Fyll inn Metrix-kode først."); return; }

    setIsBusy(true);
    try {
      const m = await metrixGetCourse(id, mxCode);
      const hs = mapMetrixToHoles(m);
      const rawName = (m as any)?.course?.Fullname ?? courseName;
      const cleanName = rawName.replace(/\s*→.*/, "").trim();
      setCourseName(cleanName);
      setHolesPreset(hs.map(h => h.par));
    } catch (e:any) {
      setDirectErr(String(e?.message ?? e));
    } finally {
      setIsBusy(false);
    }
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


    function clearPreset() {
        setHolesPreset(undefined);
  }

  // --- start runde ---
    function startRound() {
        const names = players.map(s => s.trim()).filter(Boolean);
        if (names.length === 0) names.push("Spiller 1");

        // send bare deckInclude hvis du faktisk har filtrert (ellers undefined)
        const deckInclude =
        categories.length === ALL_CATEGORIES.length ? undefined : categories;

        onCreate(
        courseName.trim(),
        names,
        holes,
        holesPreset,
        deckInclude
        );
    }


  return (
    <main className="container">
      <div className="bg" />
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
        <section className="formSection">
            <label className="formSectionLabel" htmlFor="player-0">Spillere</label>

            <div style={{ display: "grid", gap: 6 }}>
                {players.map((name, index) => (
                <div key={index} className="row fieldRow" style={{ gap: 8 }}>
                    <FormField
                    id={`player-${index}`}
                    label="" // tom for å fjerne "Spiller 1" pr. felt
                    value={name}
                    onChange={v => updatePlayer(index, v)}
                    placeholder={`Spiller ${index + 1}`}
                    />
                    {players.length > 1 && (
                    <button type="button" className="btn-inline" onClick={() => removePlayer(index)}>
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
        </section>

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
            {/* Kort-kategorier (valgfritt filter) */}
            <section className="panel">
            <h3 style={{ marginTop: 0 }}>Kort-kategorier</h3>
            <div className="chips">
                {ALL_CATEGORIES.map(cat => {
                const on = categories.includes(cat);
                return (
                    <button
                    key={cat}
                    type="button"
                    className="chip"
                    aria-pressed={on}
                    onClick={() => toggleCat(cat)}
                    title={on ? 'Klikk for å deaktivere' : 'Klikk for å aktivere'}
                    style={on ? { outline: '2px solid var(--primary)' } : undefined}
                    >
                    <span className="chipText">{cat}</span>
                    <span className="chipSub">{on ? 'på' : 'av'}</span>
                    </button>
                );
                })}
            </div>
            <div style={{ marginTop: 8 }}>
                <button
                type="button"
                className="btn-secondary"
                onClick={() => setCategories([...ALL_CATEGORIES])}
                >
                Velg alle
                </button>
                &nbsp;
                <button
                type="button"
                className="btn-secondary"
                onClick={() => setCategories([])}
                >
                Fjern alle
                </button>
            </div>
            </section>


        {/* Hent par fra Disc Golf Metrix */}
        <section className="panel">
          <h3 style={{ marginTop: 0,marginBottom: 12}}>Hent par fra Disc Golf Metrix</h3>

          {/* Kun kode + URL/ID */}
          <div className="row" style={{ gap: 10, alignItems: "center" }}>
            <input
              className="inputBase" /* bruker global/form-stil */
              placeholder="Metrix-kode (integration code)"
              value={mxCode}
              onChange={e => setMxCode(e.target.value)}
              autoComplete="off"
            />
          </div>
          <div className="row" style={{ gap: 8, alignItems: "center", marginTop: 8 }}>
            <input
              className="inputBase" /* bruker global/form-stil */
              placeholder="Lim inn Metrix-URL (f.eks. .../course/12345)"
              value={directId}
              onChange={e => setDirectId(e.target.value)}
              style={{ flex: 1, minWidth: 0 }}
            />
            <button type="button" onClick={fetchByDirectId} disabled={isBusy}>Hent fra URL/ID</button>
          </div>
          {directErr && <p style={{ color: "var(--danger)" }}>{directErr}</p>}
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
            Tips: “Integration code” finner du i Metrix-profilen din.
          </small>
        </section>

        {/* Handlinger */}
        <div className="row">
          <button type="button" onClick={startRound} disabled={isBusy}> Start </button>
          <button type="button" onClick={onBack}>Tilbake</button>
        </div>
      </div>
    </main>
  );
}
