import type { RoundState, ID } from '@models/models';

export function strokesOnHole(round: RoundState, playerId: ID, hole: number): number {
  return round.throwLog.filter(ev => ev.playerId === playerId && ev.hole === hole).length;
}

export function totalStrokes(round: RoundState, playerId: ID): number {
  return round.holes.reduce((sum, h) => sum + strokesOnHole(round, playerId, h.number), 0);
}

export function coursePar(round: RoundState): number {
  return round.holes.reduce((sum, h) => sum + h.par, 0);
}

export function toPar(round: RoundState, playerId: ID): number {
  return totalStrokes(round, playerId) - coursePar(round);
}

export function scoreboard(round: RoundState) {
  return round.players
    .map(p => ({
      playerId: p.id,
      name: p.name,
      strokes: totalStrokes(round, p.id),
      toPar: toPar(round, p.id),
    }))
    .sort((a, b) => a.strokes - b.strokes);
}
