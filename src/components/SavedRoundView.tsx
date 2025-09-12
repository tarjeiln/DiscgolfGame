import { scoreboard, coursePar } from '@lib/stats';
import type { SavedRound } from '@models/models';

type Props = {
  round: SavedRound;
  onBack: () => void;
  onDelete: () => void;
};

export default function SavedRoundView({ round, onBack, onDelete }: Props) {
  const rows = scoreboard(round);
  const par = coursePar(round);
  const when = new Date(round.endedAt ?? round.updatedAt ?? round.createdAt)
    .toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });

  const sign = (n: number) => (n === 0 ? 'E' : n > 0 ? `+${n}` : `${n}`);

  return (
    <main className="container">
      <div className="stack">
        <h2>{round.courseName ?? 'Runde'} – {round.holes.length} hull (Par {par})</h2>
        <p style={{ color: 'var(--muted)' }}>{when}</p>

        <ul>
          {rows.map(r => (
            <li key={r.playerId}>
              {r.name}: {r.strokes} ({sign(r.toPar)})
            </li>
          ))}
        </ul>

        <div className="row" style={{ gap: 8 }}>
          <button type="button" className="btn-secondary" onClick={onBack}>Tilbake</button>
          <button type="button" onClick={onDelete}>Slett runde</button>
        </div>
      </div>
    </main>
  );
}
