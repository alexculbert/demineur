import React from 'react';
import { Difficulty, GameStatus } from '../types/game';
import { Clock, Bomb, RefreshCw } from 'lucide-react';

interface GameControlsProps {
  status: GameStatus;
  minesLeft: number;
  time: number;
  difficulty: Difficulty;
  onNewGame: () => void;
  onChangeDifficulty: (difficulty: Difficulty) => void;
}

const GameControls: React.FC<GameControlsProps> = ({
  status,
  minesLeft,
  time,
  difficulty,
  onNewGame,
  onChangeDifficulty
}) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'won':
        return <span className="text-green-600 font-bold">You won! 🎉</span>;
      case 'lost':
        return <span className="text-red-600 font-bold">You lost! 💥</span>;
      case 'playing':
        return <span className="text-blue-600">Game in progress...</span>;
      default:
        return <span>Click any cell to start</span>;
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mb-4 px-4">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center">
            <Bomb className="text-red-500 mr-2" size={20} />
            <span className="font-mono text-xl font-bold">{minesLeft}</span>
          </div>
          
          <button
            onClick={onNewGame}
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md transition-colors flex items-center"
          >
            <RefreshCw size={20} className="mr-1" />
            <span>New Game</span>
          </button>
          
          <div className="flex items-center">
            <Clock className="text-blue-500 mr-2" size={20} />
            <span className="font-mono text-xl font-bold">{formatTime(time)}</span>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="mb-2 text-center">{getStatusMessage()}</div>
          
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => onChangeDifficulty('beginner')}
              className={`px-3 py-1 rounded-md transition-colors ${
                difficulty === 'beginner'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
              }`}
            >
              Beginner
            </button>
            <button
              onClick={() => onChangeDifficulty('intermediate')}
              className={`px-3 py-1 rounded-md transition-colors ${
                difficulty === 'intermediate'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
              }`}
            >
              Intermediate
            </button>
            <button
              onClick={() => onChangeDifficulty('expert')}
              className={`px-3 py-1 rounded-md transition-colors ${
                difficulty === 'expert'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
              }`}
            >
              Expert
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameControls;
