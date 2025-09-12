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
  history?: RoundState[]; // legg til
};

