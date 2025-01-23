export type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

export type Position = {
  x: number;
  y: number;
};

export type Tetromino = {
  type: TetrominoType;
  shape: boolean[][];
  position: Position;
};

export type GameState = {
  board: (TetrominoType | null)[][];
  currentPiece: Tetromino | null;
  nextPiece: Tetromino | null;
  score: number;
  level: number;
  isGameOver: boolean;
  isPaused: boolean;
};

export type GameAction = 
  | { type: 'MOVE_LEFT' }
  | { type: 'MOVE_RIGHT' }
  | { type: 'ROTATE' }
  | { type: 'MOVE_DOWN' }
  | { type: 'HARD_DROP' }
  | { type: 'PAUSE' }
  | { type: 'RESET' };