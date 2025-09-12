import { useState } from "react";
import FormField from "@components/form/FormField";

type Props = {
  onCreate: (courseName: string, players: string[], holes: number) => void;
  onBack: () => void;
};

export default function NewRound({ onCreate, onBack }: Props) {
  const [courseName, setCourseName] = useState("Lokal bane");
  const [players, setPlayers] = useState<string[]>([""]); // start med én spiller
  const [holes, setHoles] = useState(18);

  const updatePlayer = (i: number, name: string) => {
    setPlayers(prev => {
      const next = [...prev];
      next[i] = name;
      return next;
    });
  };

  const addPlayer = () => setPlayers(prev => [...prev, ""]);
  const removePlayer = (i: number) => setPlayers(prev => prev.filter((_, idx) => idx !== i));

  const startRound = () => {
    const names = players.map(s => s.trim()).filter(Boolean);
    if (names.length === 0) names.push("Spiller 1"); // fallback så runden alltid har minst én spiller
    onCreate(courseName.trim(), names, holes);
  };

   return (
    <main className="container">
    <div className = "stack ">
      <h2>Ny runde</h2>

      {/* Bane */}
      <FormField
        id="course"
        label="Bane"
        value={courseName}
        onChange={setCourseName}
        placeholder="F.eks. Lokal bane"
      />

      {/* Spillere (dynamisk liste) */}
      <fieldset style={{ border: 0, margin: 0, padding: 0 }}>
        <legend>Spillere</legend>

        <div style={{ display: "grid", gap: 8 }}>
          {players.map((name, index) => (
            <div key={index} className="row" style={{ gap: 8 }}>
              <FormField
                id={`player-${index}`}
                label={`Spiller ${index + 1}`}
                value={name}
                onChange={(v) => updatePlayer(index, v)}
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
          <button type="button" onClick={addPlayer}>Legg til spiller</button>
        </div>
      </fieldset>

      {/* Antall hull */}
      <FormField
        id="holes"
        label="Antall hull"
        type="number"
        value={holes}
        onChange={(v) => {
          const n = parseInt(v, 10);
          const safe = Number.isNaN(n) ? 1 : Math.max(1, Math.min(27, n));
          setHoles(safe);
        }}
        min={1}
        max={27}
        inputMode="numeric"
        hint="1–27 hull"
      />

      <div className="row">
        <button type="button" onClick={startRound}>Start</button>
        <button type="button" onClick={onBack}>Tilbake</button>
      </div>
    </div>
    </main>
  );
}