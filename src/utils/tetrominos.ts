import { TetrominoType, Tetromino, Position } from '../types/game';

const SHAPES: Record<TetrominoType, boolean[][]> = {
  I: [
    [false, false, false, false],
    [true, true, true, true],
    [false, false, false, false],
    [false, false, false, false],
  ],
  O: [
    [true, true],
    [true, true],
  ],
  T: [
    [false, true, false],
    [true, true, true],
    [false, false, false],
  ],
  S: [
    [false, true, true],
    [true, true, false],
    [false, false, false],
  ],
  Z: [
    [true, true, false],
    [false, true, true],
    [false, false, false],
  ],
  J: [
    [true, false, false],
    [true, true, true],
    [false, false, false],
  ],
  L: [
    [false, false, true],
    [true, true, true],
    [false, false, false],
  ],
};

const COLORS: Record<TetrominoType, string> = {
  I: '#00f0f0',
  O: '#f0f000',
  T: '#a000f0',
  S: '#00f000',
  Z: '#f00000',
  J: '#0000f0',
  L: '#f0a000',
};

export const createTetromino = (type: TetrominoType, position: Position): Tetromino => ({
  type,
  shape: SHAPES[type],
  position,
});

export const getRandomTetromino = (position: Position): Tetromino => {
  const types = Object.keys(SHAPES) as TetrominoType[];
  const randomType = types[Math.floor(Math.random() * types.length)];
  return createTetromino(randomType, position);
};

export const getTetrominoColor = (type: TetrominoType): string => COLORS[type];

export const rotateTetromino = (tetromino: Tetromino): boolean[][] => {
  const { shape } = tetromino;
  const newShape = Array(shape.length).fill(null).map(() => 
    Array(shape[0].length).fill(false)
  );

  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      newShape[x][shape.length - 1 - y] = shape[y][x];
    }
  }

  return newShape;
};