export type ID = string;

export type Player = {
  id: ID;
  name: string;
};

export type Hole = {
  number: number;   // 1..18
  par: number;      // f.eks. 3
};

export type ThrowEvent = {
  id: ID;
  playerId: ID;
  hole: number;
  note?: string;
  timestamp: number; // Date.now()
};

export type RoundState = {
  id: ID;
  courseName?: string;
  players: Player[];
  holes: Hole[];
  currentHole: number;    // 1-basert
  throwLog: ThrowEvent[];
  createdAt: number;
  updatedAt: number;
  teeOrder?: ID[];        // NY: rekkefølgen spillerne skal slå ut på neste hull
  cards?: Record<ID, Card>;   // alle kort (katalog)
  deck?: ID[];                // resterende kort i bunken (øverst = index 0)
  discard?: ID[];             // brukte kort
  holeCards?: Record<number, HoleCards>; // per-hull tildeling
  holeMods?: Record<number, ID[]>;
  /** Egen “stokk” for group-kort */
  modDeck?: ID[];
  modDiscard?: ID[];
  modChance?: number;
};


export type Settings = {
  haptics: boolean;
  confirmDialogs: boolean;
  bigButtons: boolean;
};

export type AppState = {
  currentRound?: RoundState;
  settings: Settings;
  version: number;
  history?: RoundState[];
  savedRounds?: SavedRound[];
};

export type Card = {
  id: ID;
  title: string;
  description?: string;
  category: 'ThrowStyle' | 'Scoring' | 'Challenge' | 'DiscLimit' | 'Other';
  scope?: 'player'|'group';
};

export type HoleCards = {
  hole: number;
  sharedCardId?: ID;
  options?: ID[];
  pickOrder: ID[];
  picks: Record<ID, ID>;
  finalized: boolean; 
};

// legg til ny type
export type SavedRound = RoundState & {
  endedAt: number;           // når runden ble avsluttet
};
