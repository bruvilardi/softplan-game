export interface Tile {
  id: number;
  currentPos: number; // Index in the 1D array (0 to 8)
  correctPos: number; // Index in the 1D array where it belongs
}

export interface Score {
  id: string;
  name: string;
  time: number; // in seconds
  moves: number;
  date: string;
}

export enum GameState {
  IDLE,
  PLAYING,
  WON,
}

export interface GridSize {
  rows: number;
  cols: number;
}
