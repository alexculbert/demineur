export type CellValue = 
  | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 
  | 'mine';

export type CellState = 
  | 'hidden'
  | 'revealed'
  | 'flagged';

export interface Cell {
  value: CellValue;
  state: CellState;
}

export type Board = Cell[][];

export type Difficulty = 'beginner' | 'intermediate' | 'expert' | 'custom';

export interface GameConfig {
  rows: number;
  cols: number;
  mines: number;
}

export type GameStatus = 'new' | 'playing' | 'won' | 'lost';

export interface GameState {
  board: Board;
  config: GameConfig;
  status: GameStatus;
  minesLeft: number;
  time: number;
  difficulty: Difficulty;
  firstClick: boolean;
}

export interface Position {
  row: number;
  col: number;
}
