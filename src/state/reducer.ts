import type { AppState, Player, Hole, RoundState } from "../types/models";
import { rid } from "../lib/id";

export type Action =
  | { type: "NEW_ROUND"; payload: { courseName?: string; players: string[]; holes: number; defaultPar?: number } }
  | { type: "LOG_THROW"; payload: { playerId: string; note?: string } }
  | { type: "NEXT_HOLE" }
  | { type: "UNDO" } // placeholder – implementeres senere
  | { type: "LOAD_SAVED"; payload: AppState }
  | { type: "END_ROUND" };

export function initialState(): AppState {
  return {
    currentRound: undefined,
    settings: { haptics: true, confirmDialogs: true, bigButtons: true },
    version: 1,
  };
}

function buildHoles(n: number, par: number): Hole[] {
  return Array.from({ length: n }, (_, i) => ({ number: i + 1, par }));
}

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "LOAD_SAVED":
      return action.payload;

    case "NEW_ROUND": {
      const players: Player[] = action.payload.players.map(name => ({ id: rid("p"), name: name.trim() })).filter(p => p.name.length);
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
      };
      return { ...state, currentRound: round };
    }

    case "LOG_THROW": {
      if (!state.currentRound) return state;
      const r = state.currentRound;
      const ev = {
        id: rid("t"),
        playerId: action.payload.playerId,
        hole: r.currentHole,
        note: action.payload.note,
        timestamp: Date.now(),
      };
      return { ...state, currentRound: { ...r, throwLog: [...r.throwLog, ev], updatedAt: Date.now() } };
    }

    case "NEXT_HOLE": {
      if (!state.currentRound) return state;
      const r = state.currentRound;
      const next = Math.min(r.currentHole + 1, r.holes.length);
      return { ...state, currentRound: { ...r, currentHole: next, updatedAt: Date.now() } };
    }

    case "END_ROUND":
      return { ...state, currentRound: undefined };

    default:
      return state;
  }
}
