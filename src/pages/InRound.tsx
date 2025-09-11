import type { RoundState } from "../types/models";

type Props = {
  round: RoundState;
  onLogThrow: (playerId:string)=>void;
  onNextHole: ()=>void;
  onEnd: ()=>void;
  onUndo: ()=>void;
};

export default function InRound({ round, onLogThrow, onNextHole, onEnd, onUndo }: Props) {
  return (
    <div>
      <h2>{round.courseName ?? "Runde"} – Hull {round.currentHole}/{round.holes.length}</h2>

      <div className="grid">
        {round.players.map(p=>(
          <button key={p.id} className="big"
                  onClick={()=>onLogThrow(p.id)}>Kast: {p.name}</button>
        ))}
      </div>

      <div className="row">
        <button onClick={onNextHole}>Neste hull</button>
        <button onClick={onUndo}>Angre</button>
        <button onClick={onEnd}>Avslutt runde</button>
      </div>

      <h3>Logg</h3>
      <ul>
        {round.throwLog.slice().reverse().map(ev=>(
          <li key={ev.id}>Hull {ev.hole} – {round.players.find(p=>p.id===ev.playerId)?.name}</li>
        ))}
      </ul>
    </div>
  );
}
