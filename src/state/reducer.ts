import type { AppState, Player, Hole, RoundState, ID, HoleCards, SavedRound } from '@models/models';
import { rid } from '@lib/id';
import { buildDeck } from '@lib/cards';
import type { Card } from '@models/models';

export type Action =
  | { type: "NEW_ROUND"; payload: { courseName?: string; players: string[]; holes: number; defaultPar?: number;  holesPreset?: number[]; deckInclude?: Card['category'][]; modChance?: number} }
  | { type: "LOG_THROW"; payload: { playerId: string; note?: string } }
  | { type: "REMOVE_THROW"; payload: { playerId: string } }
  | { type: "NEXT_HOLE" }
  | { type: "PREV_HOLE" }
  | { type: "LOAD_SAVED"; payload: AppState }
  | { type: "END_ROUND" }
  | { type: "DELETE_SAVED_ROUND"; payload: { roundId: ID }}
  | { type: "PICK_CARD"; payload: { hole: number; playerId: ID; cardId: ID } }; // NY


export function initialState(): AppState {
  return {
    currentRound: undefined,
    settings: { haptics: true, confirmDialogs: true, bigButtons: true },
    version: 1,
    savedRounds: [],
  };
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


function totalStrokesUntilHole(r: RoundState, playerId: ID, holeExclusive: number): number {
  // summer kast for hull < holeExclusive
  return r.throwLog.reduce((acc, ev) =>
    (ev.playerId === playerId && ev.hole < holeExclusive) ? acc + 1 : acc, 0);
}

function makePickOrder(r: RoundState, hole: number): ID[] {
  // “dårligst så langt” = flest kast til nå. Tie-break: teeOrder-rekkefølge.
  const base = r.teeOrder ?? r.players.map(p => p.id);
  const scores = r.players.map(p => ({
    id: p.id,
    strokes: totalStrokesUntilHole(r, p.id, hole),
    teeIdx: base.indexOf(p.id)
  }));
  return scores
    .sort((a, b) => (b.strokes - a.strokes) || (a.teeIdx - b.teeIdx))
    .map(x => x.id);
}

// forenklet trekking: pop fra deck; hvis tomt -> resett fra discard (shuffle) 
function draw(r: RoundState, n: number): { drawn: ID[]; deck: ID[]; discard: ID[] } {
  let deck = (r.deck ?? []).slice();
  let discard = (r.discard ?? []).slice();
  const drawn: ID[] = [];

  for (let i = 0; i < n; i++) {
    if (deck.length === 0) {
      // resirkuler
      deck = discard.slice();
      discard = [];
    }
    if (deck.length === 0) break; // ingen kort igjen (ekstremtilfelle)
    drawn.push(deck.shift()!);
  }
  return { drawn, deck, discard };
}

function prepareHole(r: RoundState, hole: number): RoundState {
  const hc = r.holeCards ?? {};
  if (hc[hole]) return r; // allerede klart

  // Hull 1: ett felles kort
  if (hole === 1) {
    const { drawn, deck, discard } = draw(r, 1);
    const shared = drawn[0];
    const picks = Object.fromEntries(r.players.map(p => [p.id, shared]));
    const pickOrder = r.players.map(p => p.id); // ubetydelig for hull 1
    let next: RoundState = {
      ...r,
      deck, discard,
      holeCards: {
        ...hc,
        [hole]: {
          hole,
          sharedCardId: shared,
          options: [shared],
          pickOrder,
          picks,
          finalized: true
        }
      }
    };
    next = maybeAttachHoleMod(next, hole);
    return next;
  }

  // Hull 2+: legg ut like mange kort som spillere
  const count = r.players.length;
  const { drawn, deck, discard } = draw(r, count);
  const pickOrder = makePickOrder(r, hole);
  let next: RoundState = {
    ...r,
    deck, discard,
    holeCards: {
      ...hc,
      [hole]: {
        hole,
        options: drawn,
        pickOrder,
        picks: {},
        finalized: false
      }
    }
  };
  next = maybeAttachHoleMod(next, hole);
  return next;
}

function maybeAttachHoleMod(r: RoundState, hole: number): RoundState {

  const hasMods = (r.modDeck?.length ?? 0) + (r.modDiscard?.length ?? 0) > 0;
  if (!hasMods) return r;
    const holeMods = r.holeMods ?? {};
  if (holeMods[hole]?.length) return r;
  const chance = r.modChance ?? 0.3;
  if (Math.random() >= chance) return r;
  const { drawn, deck } = drawFrom(r.modDeck, r.modDiscard, 1);
  const cardId = drawn[0];
  if (!cardId) return r;
  const prevDiscard = r.modDiscard ?? [];
  return {
    ...r,
    modDeck: deck,
    // legg brukte mod-kort i discard slik at drawFrom kan resirkulere senere
    modDiscard: [...prevDiscard, cardId],
    holeMods: { ...holeMods, [hole]: [cardId] }
  };
}

function drawFrom(deck: ID[] = [], discard: ID[] = [], n: number) {
  let d = deck.slice();
  let di = discard.slice();
  const out: ID[] = [];
  for (let i = 0; i < n; i++) {
    if (d.length === 0) { d = di.slice(); di = []; }
    if (d.length === 0) break;
    out.push(d.shift()!);
  }
  return { drawn: out, deck: d, discard: di };
}


export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "LOAD_SAVED":
      return action.payload;

    case "NEW_ROUND": {
        const players: Player[] = action.payload.players
            .map(name => ({ id: rid("p"), name: name.trim() }))
            .filter(p => p.name.length);
        const holes = action.payload.holesPreset?.length ? action.payload.holesPreset.map((par, i) => ({ number: i + 1, par })) 
        : buildHoles(action.payload.holes, action.payload.defaultPar ?? 3);
        const required = 1 + Math.max(0, holes.length - 1) * players.length;
        const buffer   = Math.ceil(required * 0.10); // ~10% buffer
        const minSize  = required + buffer;
        const { cards, deck, modDeck } = buildDeck({
            include: action.payload.deckInclude, // kan være undefined = alle kategorier
            minSize
        });
        let round: RoundState = {
          id: rid("round"),
          courseName: action.payload.courseName?.trim() || undefined,
          players,
          holes,
          currentHole: 1,
          throwLog: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
          teeOrder: players.map(p => p.id),
          cards,
          deck,
          discard: [],
          holeCards: {},
          holeMods: {},
          modDeck,
          modDiscard: [],
          modChance: action.payload.modChance ?? 0.2,
        };
        round = prepareHole(round, 1);
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
      const r0 = state.currentRound;
      const nextHole = Math.min(r0.currentHole + 1, r0.holes.length);
      let r1: RoundState = { ...r0, currentHole: nextHole, updatedAt: Date.now() };
      r1 = prepareHole(r1, nextHole);
      return { ...(pushHistory(state, prev)), currentRound: r1 };
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

    case "PICK_CARD": {
      if (!state.currentRound) return state;
      const r = state.currentRound;
      const hcAll = r.holeCards ?? {};
      const hc = hcAll[action.payload.hole];
      if (!hc || hc.finalized || action.payload.hole === 1) return state; // hull 1 er allerede satt likt

      // Sjekk at kortet finnes i options og ikke er tatt
      const options = hc.options ?? [];
      if (!options.includes(action.payload.cardId)) return state;
      const alreadyPicked = Object.values(hc.picks).includes(action.payload.cardId);
      if (alreadyPicked) return state;

      const picks = { ...hc.picks, [action.payload.playerId]: action.payload.cardId };

      // Finalize når alle har plukket
      const finalized = Object.keys(picks).length >= r.players.length;
      const discard = finalized ? [...(r.discard ?? []), ...options] : (r.discard ?? []);

      const newHoleCards: HoleCards = {
        ...hc,
        picks,
        finalized
      };

      const updated: RoundState = {
        ...r,
        holeCards: { ...hcAll, [action.payload.hole]: newHoleCards },
        discard,
        updatedAt: Date.now()
      };
      return { ...(pushHistory(state, r)), currentRound: updated };
    }

    case "DELETE_SAVED_ROUND": {
      const list = (state.savedRounds ?? []).filter(r => r.id !== action.payload.roundId);
      return { ...state, savedRounds: list };
    }

    case "END_ROUND": {
      if (!state.currentRound) return state;
      const finished: SavedRound = { ...state.currentRound, endedAt: Date.now() };
      const list = [finished, ...(state.savedRounds ?? [])];
      // valgfritt: begrens antall
      const clipped = list.slice(0, 50);
      return { ...state, currentRound: undefined, savedRounds: clipped };
    }
  }
}
