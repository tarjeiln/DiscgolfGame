import { scoreboard, coursePar } from "../lib/stats";
import type { RoundState } from "../types/models";

type Props = { round: RoundState; onHome: ()=>void; };

export default function Summary({ round, onHome }: Props) {
  const rows = scoreboard(round);
  const par = coursePar(round);

  const copyToClipboard = async () => {
    const lines = [
      `Bane: ${round.courseName ?? "Ukjent"} (Par ${par})`,
      ...rows.map(r => {
        const sign = r.toPar === 0 ? "E" : (r.toPar > 0 ? `+${r.toPar}` : `${r.toPar}`);
        return `${r.name}: ${r.strokes} (${sign})`;
      })
    ];
    const text = lines.join("\n");
    try {
      await navigator.clipboard.writeText(text);
      alert("Kopiert til utklippstavle!");
    } catch {
      alert("Kunne ikke kopiere. Marker teksten under og kopier manuelt.");
    }
  };

  return (
    <div>
      <h2>Oppsummering</h2>
      <p>{round.courseName ?? "Runde"} – {round.holes.length} hull (Par {par})</p>
      <ul>
        {rows.map(r=>{
          const sign = r.toPar === 0 ? "E" : (r.toPar > 0 ? `+${r.toPar}` : `${r.toPar}`);
          return <li key={r.playerId}>{r.name}: {r.strokes} ({sign})</li>;
        })}
      </ul>
      <div className="row">
        <button onClick={copyToClipboard}>Kopier resultat</button>
        <button onClick={onHome}>Til forsida</button>
      </div>
    </div>
  );
}
