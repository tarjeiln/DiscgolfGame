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
  onHome?: () => void;
};

export default function InRound({ round, onLogThrow, onRemoveThrow, onPrevHole, onNextHole, onEnd, onHome }: Props) {
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
        {orderedPlayers.map((p, idx) => (
          <PlayerRow
            key={p.id}
            index={idx + 1}
            name={p.name}
            count={strokesOnHole(p.id)}
            total={round.throwLog.filter(ev => ev.playerId === p.id).length}
            onMinus={() => onRemoveThrow(p.id)}
            onPlus={() => onLogThrow(p.id)}
          />
        ))}
      </div>

      <HoleNav
        isFirst={isFirst}
        isLast={isLast}
        onPrev={onPrevHole}
        onNext={onNextHole}
        onEnd={onEnd}
        onHome={onHome}   // valgfri: vises bare hvis du sender inn onHome-prop
        />
    </div>
  );
}
