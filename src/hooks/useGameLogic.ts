import { useReducer, useEffect, useCallback } from 'react';
import { GameState, GameAction, TetrominoType } from '../types/game';
import { getRandomTetromino, rotateTetromino } from '../utils/tetrominos';
import { soundManager } from '../utils/sounds';

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const INITIAL_SPEED = 1000;
const SPEED_INCREASE = 0.8;
const POINTS_PER_LINE = 100;

const createEmptyBoard = () => 
  Array(BOARD_HEIGHT).fill(null).map(() => 
    Array(BOARD_WIDTH).fill(null)
  );

const initialState: GameState = {
  board: createEmptyBoard(),
  currentPiece: getRandomTetromino({ x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 }),
  nextPiece: getRandomTetromino({ x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 }),
  score: 0,
  level: 1,
  isGameOver: false,
  isPaused: false,
};

const checkCollision = (
  board: (TetrominoType | null)[][],
  piece: boolean[][],
  position: { x: number; y: number }
) => {
  for (let y = 0; y < piece.length; y++) {
    for (let x = 0; x < piece[y].length; x++) {
      if (piece[y][x]) {
        const boardX = x + position.x;
        const boardY = y + position.y;

        if (
          boardX < 0 ||
          boardX >= BOARD_WIDTH ||
          boardY >= BOARD_HEIGHT ||
          (boardY >= 0 && board[boardY][boardX] !== null)
        ) {
          return true;
        }
      }
    }
  }
  return false;
};

const gameReducer = (state: GameState, action: GameAction): GameState => {
  if ((state.isGameOver && action.type !== 'RESET') ||
      (state.isPaused && action.type !== 'PAUSE')) {
    return state;
  }

  switch (action.type) {
    case 'MOVE_LEFT': {
      const newPosition = { ...state.currentPiece!.position, x: state.currentPiece!.position.x - 1 };
      if (!checkCollision(state.board, state.currentPiece!.shape, newPosition)) {
        soundManager.move();
        return {
          ...state,
          currentPiece: { ...state.currentPiece!, position: newPosition }
        };
      }
      return state;
    }

    case 'MOVE_RIGHT': {
      const newPosition = { ...state.currentPiece!.position, x: state.currentPiece!.position.x + 1 };
      if (!checkCollision(state.board, state.currentPiece!.shape, newPosition)) {
        soundManager.move();
        return {
          ...state,
          currentPiece: { ...state.currentPiece!, position: newPosition }
        };
      }
      return state;
    }

    case 'ROTATE': {
      const newShape = rotateTetromino(state.currentPiece!);
      if (!checkCollision(state.board, newShape, state.currentPiece!.position)) {
        soundManager.rotate();
        return {
          ...state,
          currentPiece: { ...state.currentPiece!, shape: newShape }
        };
      }
      return state;
    }

    case 'MOVE_DOWN': {
      const newPosition = { ...state.currentPiece!.position, y: state.currentPiece!.position.y + 1 };
      if (!checkCollision(state.board, state.currentPiece!.shape, newPosition)) {
        return {
          ...state,
          currentPiece: { ...state.currentPiece!, position: newPosition }
        };
      }

      // Piece has landed
      const newBoard = mergePieceToBoard(
        state.board,
        state.currentPiece!.shape,
        state.currentPiece!.position,
        state.currentPiece!.type
      );

      const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);
      const newScore = state.score + (linesCleared * POINTS_PER_LINE * state.level);
      const newLevel = Math.floor(newScore / 1000) + 1;

      // Play appropriate sounds
      soundManager.land();
      if (linesCleared > 0) {
        soundManager.line();
      }
      if (newLevel > state.level) {
        soundManager.levelUp();
      }

      // Get next pieces
      const nextCurrentPiece = state.nextPiece;
      const nextNewPiece = getRandomTetromino({ x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 });

      // Check for game over - either current piece can't spawn or next piece would collide
      const isGameOver =
        checkCollision(clearedBoard, nextCurrentPiece!.shape, nextCurrentPiece!.position) ||
        checkCollision(clearedBoard, nextNewPiece.shape, nextNewPiece.position);

      if (isGameOver) {
        soundManager.gameOver();
        return {
          ...state,
          board: clearedBoard,
          currentPiece: null,
          nextPiece: null,
          score: newScore,
          level: newLevel,
          isGameOver: true
        };
      }

      return {
        ...state,
        board: clearedBoard,
        currentPiece: nextCurrentPiece,
        nextPiece: nextNewPiece,
        score: newScore,
        level: newLevel,
        isGameOver: false
      };
    }

    case 'HARD_DROP': {
      let newPosition = { ...state.currentPiece!.position };
      while (!checkCollision(state.board, state.currentPiece!.shape, { ...newPosition, y: newPosition.y + 1 })) {
        newPosition.y++;
      }
      soundManager.hardDrop();
      return gameReducer({ ...state, currentPiece: { ...state.currentPiece!, position: newPosition } }, { type: 'MOVE_DOWN' });
    }

    case 'PAUSE': {
      soundManager.pause();
      return { ...state, isPaused: !state.isPaused };
    }
    case 'RESET': {
      soundManager.pause(); // Use pause sound for reset too
      return {
        board: createEmptyBoard(),
        currentPiece: getRandomTetromino({ x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 }),
        nextPiece: getRandomTetromino({ x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 }),
        score: 0,
        level: 1,
        isGameOver: false,
        isPaused: false
      };
    }

    default:
      return state;
  }
};

const mergePieceToBoard = (
  board: (TetrominoType | null)[][],
  piece: boolean[][],
  position: { x: number; y: number },
  type: TetrominoType
): (TetrominoType | null)[][] => {
  const newBoard = board.map(row => [...row]);

  for (let y = 0; y < piece.length; y++) {
    for (let x = 0; x < piece[y].length; x++) {
      if (piece[y][x]) {
        const boardY = y + position.y;
        if (boardY >= 0) {
          newBoard[boardY][x + position.x] = type;
        }
      }
    }
  }

  return newBoard;
};

const clearLines = (board: (TetrominoType | null)[][]): { newBoard: (TetrominoType | null)[][], linesCleared: number } => {
  const newBoard = board.filter(row => row.some(cell => cell === null));
  const linesCleared = BOARD_HEIGHT - newBoard.length;
  
  while (newBoard.length < BOARD_HEIGHT) {
    newBoard.unshift(Array(BOARD_WIDTH).fill(null));
  }

  return { newBoard, linesCleared };
};

export const useGameLogic = () => {
  const [gameState, dispatch] = useReducer(gameReducer, initialState);

  const moveInterval = useCallback(() => {
    if (!gameState.isPaused && !gameState.isGameOver) {
      dispatch({ type: 'MOVE_DOWN' });
    }
  }, [gameState.isPaused, gameState.isGameOver]);

  useEffect(() => {
    const speed = INITIAL_SPEED * Math.pow(SPEED_INCREASE, gameState.level - 1);
    const intervalId = setInterval(moveInterval, speed);
    return () => clearInterval(intervalId);
  }, [moveInterval, gameState.level]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const keyActions: { [key: string]: GameAction['type'] } = {
        ArrowLeft: 'MOVE_LEFT',
        ArrowRight: 'MOVE_RIGHT',
        ArrowUp: 'ROTATE',
        ArrowDown: 'MOVE_DOWN',
        ' ': 'HARD_DROP',
        p: 'PAUSE',
        r: 'RESET'
      };

      const action = keyActions[event.key];
      if (action) {
        event.preventDefault();
        dispatch({ type: action });
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return {
    gameState,
    dispatch
  };
};