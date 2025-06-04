import React from 'react';
import { Board as BoardType, Position } from '../types/game';
import Cell from './Cell';

interface BoardProps {
  board: BoardType;
  onCellClick: (position: Position) => void;
  onCellRightClick: (position: Position) => void;
}

const Board: React.FC<BoardProps> = ({ board, onCellClick, onCellRightClick }) => {
  // Calculate the appropriate width based on the number of columns
  const cols = board[0]?.length || 0;
  const boardWidthClass = cols <= 9 
    ? 'max-w-xs' 
    : cols <= 16 
      ? 'max-w-lg' 
      : 'max-w-4xl';

  return (
    <div className={`mx-auto ${boardWidthClass} overflow-auto p-2`}>
      <div className="grid gap-px bg-gray-300 p-1 rounded-md shadow-lg">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((cell, colIndex) => (
              <Cell
                key={`${rowIndex}-${colIndex}`}
                cell={cell}
                onClick={() => onCellClick({ row: rowIndex, col: colIndex })}
                onContextMenu={(e) => {
                  e.preventDefault();
                  onCellRightClick({ row: rowIndex, col: colIndex });
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Board;
