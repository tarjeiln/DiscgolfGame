import type { AppState, Player, Hole, RoundState } from "../types/models";
import { rid } from "../lib/id";

export type Action =
  | { type: "NEW_ROUND"; payload: { courseName?: string; players: string[]; holes: number; defaultPar?: number } }
  | { type: "LOG_THROW"; payload: { playerId: string; note?: string } }
  | { type: "REMOVE_THROW"; payload: { playerId: string } }
  | { type: "NEXT_HOLE" }
  | { type: "PREV_HOLE" }
  | { type: "LOAD_SAVED"; payload: AppState }
  | { type: "END_ROUND" };


export function initialState(): AppState {
  return {
    currentRound: undefined,
    settings: { haptics: true, confirmDialogs: true, bigButtons: true },
    version: 1,
  };
}

function stableBy<T>(arr: T[], key: (x: T)=>number, tieBreak: (a:T,b:T)=>number) {
  return arr
    .map((v, i) => ({ v, k: key(v), i }))
    .sort((a, b) => a.k - b.k || tieBreak(a.v, b.v) || a.i - b.i)
    .map(x => x.v);
}


function buildHoles(n: number, par: number): Hole[] {
  return Array.from({ length: n }, (_, i) => ({ number: i + 1, par }));
}

function pushHistory(state: AppState, prev: RoundState): AppState {
  const hist = state.history ?? [];
  const nextHist = [...hist, prev];
  if (nextHist.length > 10) nextHist.shift();
  return { ...state, history: nextHist };
}

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "LOAD_SAVED":
      return action.payload;

    case "NEW_ROUND": {
        const players: Player[] = action.payload.players
            .map(name => ({ id: rid("p"), name: name.trim() }))
            .filter(p => p.name.length);
        const holes = buildHoles(action.payload.holes, action.payload.defaultPar ?? 3);
        const round: RoundState = {
            id: rid("round"),
            courseName: action.payload.courseName?.trim() || undefined,
            players,
            holes,
            currentHole: 1,
            throwLog: [],
            createdAt: Date.now(),
            updatedAt: Date.now(),
            teeOrder: players.map(p => p.id), // her
        };
        return { ...state, currentRound: round };
    }


    case "LOG_THROW": {
        if (!state.currentRound) return state;
        const prev = state.currentRound;
        const r = state.currentRound;
        const ev = {
            id: rid("t"),
            playerId: action.payload.playerId,
            hole: r.currentHole,
            note: action.payload.note,
            timestamp: Date.now(),
        };
        const updated: RoundState = { ...r, throwLog: [...r.throwLog, ev], updatedAt: Date.now() };
        return { ...(pushHistory(state, prev)), currentRound: updated };
    }

    case "NEXT_HOLE": {
        if (!state.currentRound) return state;
        const prev = state.currentRound;
        const r = state.currentRound;
        const next = Math.min(r.currentHole + 1, r.holes.length);
        const updated: RoundState = { ...r, currentHole: next, updatedAt: Date.now() };
        return { ...(pushHistory(state, prev)), currentRound: updated };
    }

    case "PREV_HOLE": {
        if (!state.currentRound) return state;
        const r = state.currentRound;
        const prevHole = Math.max(r.currentHole - 1, 1);
        const updated: RoundState = { ...r, currentHole: prevHole, updatedAt: Date.now() };
        return { ...(pushHistory(state, r)), currentRound: updated };
    }

    case "REMOVE_THROW": {
        if (!state.currentRound) return state;
        const r = state.currentRound;
        const hole = r.currentHole;

        // finn siste kast på dette hullet for denne spilleren
        let removeIndex = -1;
        for (let i = r.throwLog.length - 1; i >= 0; i--) {
            const ev = r.throwLog[i];
            if (ev.hole === hole && ev.playerId === action.payload.playerId) {
            removeIndex = i;
            break;
            }
        }
        if (removeIndex === -1) return state; // ingenting å fjerne

        const prev = r;
        const newLog = r.throwLog.slice();
        newLog.splice(removeIndex, 1);

        const updated: RoundState = { ...r, throwLog: newLog, updatedAt: Date.now() };
        return { ...(pushHistory(state, prev)), currentRound: updated };
    }



    case "END_ROUND":
      return { ...state, currentRound: undefined };

    default:
      return state;
  }
}
