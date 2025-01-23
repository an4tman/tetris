import React, { useState } from 'react';
import { useGameLogic } from '../hooks/useGameLogic';
import { getTetrominoColor } from '../utils/tetrominos';
import { TetrominoType } from '../types/game';
import styles from '../styles/Game.module.css';
import { soundManager } from '../utils/sounds';

const Cell: React.FC<{ type: TetrominoType | null }> = ({ type }) => (
  <div
    className={`${styles.cell} ${type ? styles.filled : ''}`}
    style={{ color: type ? getTetrominoColor(type) : undefined }}
  />
);

const Board: React.FC<{ board: (TetrominoType | null)[][], currentPiece: any }> = ({ board, currentPiece }) => {
  const renderBoard = [...board.map(row => [...row])];

  // Render current piece
  if (currentPiece) {
    const { shape, position, type } = currentPiece;
    shape.forEach((row: boolean[], y: number) => {
      row.forEach((isSet: boolean, x: number) => {
        if (isSet) {
          const boardY = y + position.y;
          const boardX = x + position.x;
          if (boardY >= 0 && boardY < board.length && boardX >= 0 && boardX < board[0].length) {
            renderBoard[boardY][boardX] = type;
          }
        }
      });
    });
  }

  return (
    <div className={styles.gameBoard}>
      {renderBoard.map((row, y) =>
        row.map((cell, x) => (
          <Cell key={`${y}-${x}`} type={cell} />
        ))
      )}
    </div>
  );
};

const NextPiece: React.FC<{ piece: any }> = ({ piece }) => {
  const grid = Array(4).fill(null).map(() => Array(4).fill(null));

  if (piece) {
    piece.shape.forEach((row: boolean[], y: number) => {
      row.forEach((isSet: boolean, x: number) => {
        if (isSet) {
          grid[y][x] = piece.type;
        }
      });
    });
  }

  return (
    <div className={styles.nextPiece}>
      {grid.map((row, y) =>
        row.map((cell, x) => (
          <Cell key={`${y}-${x}`} type={cell} />
        ))
      )}
    </div>
  );
};

const Controls: React.FC = () => (
  <div className={styles.controls}>
    <h3>Controls</h3>
    <ul>
      <li>← → : Move</li>
      <li>↑ : Rotate</li>
      <li>↓ : Soft Drop</li>
      <li>Space : Hard Drop</li>
      <li>P : Pause</li>
      <li>R : Reset</li>
    </ul>
  </div>
);

const GameOver: React.FC<{ score: number; onReset: () => void }> = ({ score, onReset }) => (
  <div className={styles.gameOver}>
    <h2>Game Over</h2>
    <p>Final Score: {score}</p>
    <button className={styles.button} onClick={onReset}>
      Play Again
    </button>
  </div>
);

export const Game: React.FC = () => {
  const { gameState, dispatch } = useGameLogic();
  const { board, score, level, currentPiece, nextPiece, isGameOver, isPaused } = gameState;
  const [isMuted, setIsMuted] = useState(false);

  const handleMuteToggle = () => {
    const newMutedState = soundManager.toggleMute();
    setIsMuted(newMutedState);
  };

  return (
    <div className={styles.gameContainer}>
      <Board board={board} currentPiece={currentPiece} />
      
      <div className={styles.sidePanel}>
        <div className={styles.stats}>
          <div className={styles.score}>Score: {score}</div>
          <div className={styles.level}>Level: {level}</div>
          <button
            className={`${styles.button} ${styles.muteButton}`}
            onClick={(e) => {
              e.preventDefault();
              handleMuteToggle();
            }}
            type="button"
          >
            {isMuted ? '🔇 Unmute' : '🔊 Mute'}
          </button>
        </div>
        
        <div>
          <h3>Next Piece</h3>
          <NextPiece piece={nextPiece} />
        </div>

        <Controls />

        {isPaused && !isGameOver && (
          <div className={styles.button}>PAUSED</div>
        )}
      </div>

      {isGameOver && (
        <GameOver
          score={score}
          onReset={() => dispatch({ type: 'RESET' })}
        />
      )}
    </div>
  );
};