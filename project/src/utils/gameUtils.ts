import { Board, Cell, CellValue, GameConfig, GameState, Position } from '../types/game';

// Create an empty board with all cells hidden
export const createEmptyBoard = (rows: number, cols: number): Board => {
  return Array(rows)
    .fill(null)
    .map(() =>
      Array(cols)
        .fill(null)
        .map(() => ({
          value: 0,
          state: 'hidden'
        }))
    );
};

// Place mines randomly on the board, avoiding the first clicked position
export const placeMines = (
  board: Board,
  { rows, cols, mines }: GameConfig,
  firstClickPos: Position
): Board => {
  const newBoard = JSON.parse(JSON.stringify(board)) as Board;
  let minesPlaced = 0;

  while (minesPlaced < mines) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);

    // Don't place mine at first click position or where a mine already exists
    if (
      (row === firstClickPos.row && col === firstClickPos.col) ||
      newBoard[row][col].value === 'mine'
    ) {
      continue;
    }

    newBoard[row][col].value = 'mine';
    minesPlaced++;
  }

  // Calculate numbers for cells adjacent to mines
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (newBoard[row][col].value === 'mine') {
        continue;
      }

      const adjacentMines = getAdjacentPositions(row, col, rows, cols)
        .filter(({ row: r, col: c }) => newBoard[r][c].value === 'mine')
        .length;

      newBoard[row][col].value = adjacentMines as CellValue;
    }
  }

  return newBoard;
};

// Get adjacent positions for a cell
export const getAdjacentPositions = (
  row: number,
  col: number,
  maxRows: number,
  maxCols: number
): Position[] => {
  const positions: Position[] = [];

  for (let r = Math.max(0, row - 1); r <= Math.min(maxRows - 1, row + 1); r++) {
    for (let c = Math.max(0, col - 1); c <= Math.min(maxCols - 1, col + 1); c++) {
      if (r !== row || c !== col) {
        positions.push({ row: r, col: c });
      }
    }
  }

  return positions;
};

// Reveal a cell and handle cascade for empty cells
export const revealCell = (
  board: Board,
  row: number,
  col: number
): Board => {
  if (
    row < 0 ||
    row >= board.length ||
    col < 0 ||
    col >= board[0].length ||
    board[row][col].state !== 'hidden'
  ) {
    return board;
  }

  const newBoard = JSON.parse(JSON.stringify(board)) as Board;
  newBoard[row][col].state = 'revealed';

  // If cell is empty (0), reveal adjacent cells recursively
  if (newBoard[row][col].value === 0) {
    getAdjacentPositions(row, col, board.length, board[0].length).forEach(({ row: r, col: c }) => {
      if (newBoard[r][c].state === 'hidden') {
        revealCell(newBoard, r, c);
      }
    });
  }

  return newBoard;
};

// Toggle flag on a cell
export const toggleFlag = (board: Board, row: number, col: number): Board => {
  if (
    row < 0 ||
    row >= board.length ||
    col < 0 ||
    col >= board[0].length ||
    board[row][col].state === 'revealed'
  ) {
    return board;
  }

  const newBoard = JSON.parse(JSON.stringify(board)) as Board;
  newBoard[row][col].state =
    newBoard[row][col].state === 'flagged' ? 'hidden' : 'flagged';

  return newBoard;
};

// Check if the game is won
export const checkWin = (board: Board): boolean => {
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[0].length; col++) {
      const cell = board[row][col];
      
      // If any non-mine cell is not revealed, the game is not won
      if (cell.value !== 'mine' && cell.state !== 'revealed') {
        return false;
      }
    }
  }
  
  return true;
};

// Reveal all mines when game is lost
export const revealAllMines = (board: Board): Board => {
  const newBoard = JSON.parse(JSON.stringify(board)) as Board;
  
  for (let row = 0; row < newBoard.length; row++) {
    for (let col = 0; col < newBoard[0].length; col++) {
      if (newBoard[row][col].value === 'mine') {
        newBoard[row][col].state = 'revealed';
      }
    }
  }
  
  return newBoard;
};

// Get the game configuration based on difficulty
export const getGameConfig = (difficulty: GameState['difficulty']): GameConfig => {
  switch (difficulty) {
    case 'beginner':
      return { rows: 9, cols: 9, mines: 10 };
    case 'intermediate':
      return { rows: 16, cols: 16, mines: 40 };
    case 'expert':
      return { rows: 16, cols: 30, mines: 99 };
    case 'custom':
    default:
      return { rows: 9, cols: 9, mines: 10 }; // Default to beginner
  }
};

// Initialize a new game state
export const initializeGame = (difficulty: GameState['difficulty']): GameState => {
  const config = getGameConfig(difficulty);
  const emptyBoard = createEmptyBoard(config.rows, config.cols);
  
  return {
    board: emptyBoard,
    config,
    status: 'new',
    minesLeft: config.mines,
    time: 0,
    difficulty,
    firstClick: true
  };
};
