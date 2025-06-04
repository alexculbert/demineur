import { useState, useEffect, useCallback } from 'react';
import {
  GameState,
  Position,
  Difficulty,
  GameStatus
} from '../types/game';
import {
  initializeGame,
  revealCell,
  toggleFlag,
  checkWin,
  revealAllMines,
  placeMines
} from '../utils/gameUtils';

export const useGame = () => {
  const [gameState, setGameState] = useState<GameState>(initializeGame('beginner'));
  const [timerId, setTimerId] = useState<number | null>(null);

  // Reset the game
  const resetGame = useCallback((difficulty: Difficulty = gameState.difficulty) => {
    // Clear the timer if it exists
    if (timerId !== null) {
      window.clearInterval(timerId);
      setTimerId(null);
    }
    
    setGameState(initializeGame(difficulty));
  }, [timerId, gameState.difficulty]);

  // Handle revealing a cell
  const handleCellClick = useCallback((position: Position) => {
    const { board, status, firstClick, config } = gameState;
    
    // Do nothing if the game is over or cell is already revealed/flagged
    if (status === 'won' || status === 'lost') return;
    if (board[position.row][position.col].state !== 'hidden') return;
    
    // Start the timer on first click
    if (status === 'new') {
      const id = window.setInterval(() => {
        setGameState(prev => ({
          ...prev,
          time: prev.time + 1
        }));
      }, 1000);
      setTimerId(id);
    }
    
    let newBoard = board;
    
    // Handle first click - ensure it's safe
    if (firstClick) {
      newBoard = placeMines(board, config, position);
      newBoard = revealCell(newBoard, position.row, position.col);
      
      setGameState(prev => ({
        ...prev,
        board: newBoard,
        status: 'playing',
        firstClick: false
      }));
      return;
    }
    
    // Check if clicked on a mine
    if (board[position.row][position.col].value === 'mine') {
      // Game over - reveal all mines
      newBoard = revealAllMines(board);
      
      // Stop the timer
      if (timerId !== null) {
        window.clearInterval(timerId);
        setTimerId(null);
      }
      
      setGameState(prev => ({
        ...prev,
        board: newBoard,
        status: 'lost'
      }));
      return;
    }
    
    // Reveal the cell
    newBoard = revealCell(board, position.row, position.col);
    
    // Check if the game is won
    const isWon = checkWin(newBoard);
    
    // Update the game state
    setGameState(prev => ({
      ...prev,
      board: newBoard,
      status: isWon ? 'won' : 'playing',
      minesLeft: isWon ? 0 : prev.minesLeft
    }));
    
    // Stop the timer if the game is won
    if (isWon && timerId !== null) {
      window.clearInterval(timerId);
      setTimerId(null);
    }
  }, [gameState, timerId]);

  // Handle flagging a cell
  const handleCellRightClick = useCallback((position: Position) => {
    const { board, status, minesLeft } = gameState;
    
    // Do nothing if the game is over
    if (status === 'won' || status === 'lost') return;
    
    // Toggle the flag
    const cell = board[position.row][position.col];
    if (cell.state === 'revealed') return;
    
    const wasFlagged = cell.state === 'flagged';
    const newBoard = toggleFlag(board, position.row, position.col);
    
    // Update mines count
    const newMinesLeft = wasFlagged ? minesLeft + 1 : minesLeft - 1;
    
    // Update the game state
    setGameState(prev => ({
      ...prev,
      board: newBoard,
      minesLeft: newMinesLeft,
      status: prev.status === 'new' ? 'playing' : prev.status
    }));
    
    // Start the timer if it's the first action
    if (status === 'new' && timerId === null) {
      const id = window.setInterval(() => {
        setGameState(prev => ({
          ...prev,
          time: prev.time + 1
        }));
      }, 1000);
      setTimerId(id);
    }
  }, [gameState, timerId]);

  // Handle changing difficulty
  const handleChangeDifficulty = useCallback((difficulty: Difficulty) => {
    resetGame(difficulty);
  }, [resetGame]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerId !== null) {
        window.clearInterval(timerId);
      }
    };
  }, [timerId]);

  return {
    gameState,
    handleCellClick,
    handleCellRightClick,
    resetGame,
    handleChangeDifficulty
  };
};
