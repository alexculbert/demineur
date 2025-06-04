import React from 'react';
import { Cell as CellType } from '../types/game';
import { Flag, Bomb } from 'lucide-react';

interface CellProps {
  cell: CellType;
  onClick: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
}

const getCellColor = (value: CellType['value']): string => {
  switch (value) {
    case 1:
      return 'text-blue-600';
    case 2:
      return 'text-green-600';
    case 3:
      return 'text-red-600';
    case 4:
      return 'text-purple-700';
    case 5:
      return 'text-yellow-700';
    case 6:
      return 'text-teal-600';
    case 7:
      return 'text-black';
    case 8:
      return 'text-gray-600';
    default:
      return '';
  }
};

const Cell: React.FC<CellProps> = ({ cell, onClick, onContextMenu }) => {
  const { value, state } = cell;
  
  const baseClasses = 'w-8 h-8 md:w-9 md:h-9 flex items-center justify-center select-none transition-all duration-200 font-bold border border-gray-300';
  
  let cellClasses = baseClasses;
  let content: React.ReactNode = null;
  
  if (state === 'hidden') {
    cellClasses += ' bg-gray-200 hover:bg-gray-300 active:bg-gray-400 shadow-sm';
  } else if (state === 'flagged') {
    cellClasses += ' bg-gray-200';
    content = <Flag size={16} className="text-red-500" />;
  } else if (state === 'revealed') {
    cellClasses += ' bg-white';
    
    if (value === 'mine') {
      content = <Bomb size={16} className="text-black" />;
      cellClasses += ' bg-red-200';
    } else if (value !== 0) {
      content = <span className={getCellColor(value)}>{value}</span>;
    }
  }
  
  return (
    <button
      className={cellClasses}
      onClick={onClick}
      onContextMenu={onContextMenu}
      disabled={state === 'revealed'}
    >
      {content}
    </button>
  );
};

export default Cell;
