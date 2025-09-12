import type { RoundState, Player, ID } from '@models/models';
import styles from './InRound.module.css';
import PlayerRow from '@components/common/PlayerRow';
import HoleNav from '@components/common/HoleNav';


type Props = {
  round: RoundState;
  onLogThrow: (playerId: ID) => void;
  onRemoveThrow: (playerId: ID) => void;
  onPrevHole: () => void;
  onNextHole: () => void;
  onEnd: () => void;
};

export default function InRound({ round, onLogThrow, onRemoveThrow, onPrevHole, onNextHole, onEnd }: Props) {
  const currentHole = round.currentHole;

  const teeIds: ID[] = (round.teeOrder?.length ? round.teeOrder : round.players.map(p => p.id));
  const orderedPlayers: Player[] = teeIds
    .map(id => round.players.find(p => p.id === id) ?? null)
    .filter((p): p is Player => p !== null);

  const strokesOnHole = (playerId: ID) =>
    round.throwLog.filter(ev => ev.playerId === playerId && ev.hole === currentHole).length;

  const isFirst = currentHole === 1;
  const isLast  = currentHole === round.holes.length;

  return (
    <div>
      <h2>{round.courseName ?? "Runde"} – Hull {currentHole}/{round.holes.length}</h2>

      <div className={styles.list}>
        {orderedPlayers.map((p, idx) => {
          const count = strokesOnHole(p.id);
          return (
            <div key={p.id} className={styles.playerRow}>
              <span className={styles.playerName}>#{idx + 1} {p.name}</span>
              <div className={styles.counter}>
                <button className={styles.minus} onClick={() => onRemoveThrow(p.id)} disabled={count === 0}>−</button>
                <span className={styles.count}>{count}</span>
                <button className={styles.plus}  onClick={() => onLogThrow(p.id)}>+</button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="row" style={{ marginTop:12 }}>
        <button onClick={onPrevHole} disabled={isFirst}>Forrige hull</button>
        <button onClick={onNextHole} disabled={isLast}>Neste hull</button>
        {isLast && <button onClick={onEnd}>Ferdig med runden</button>}
      </div>
    </div>
  );
}
