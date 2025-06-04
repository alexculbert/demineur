import React from 'react';
import { useGame } from './hooks/useGame';
import Board from './components/Board';
import GameControls from './components/GameControls';
import Instructions from './components/Instructions';
import { Bomb } from 'lucide-react';

function App() {
  const { 
    gameState, 
    handleCellClick, 
    handleCellRightClick, 
    resetGame, 
    handleChangeDifficulty 
  } = useGame();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 pt-8 pb-16 px-4">
      <header className="text-center mb-6">
        <div className="flex items-center justify-center mb-2">
          <Bomb className="text-blue-600 mr-2" size={28} />
          <h1 className="text-3xl font-bold text-gray-800">Minesweeper</h1>
        </div>
        <p className="text-gray-600 max-w-md mx-auto">
          The classic game of logic and strategy. Clear the minefield without detonating any mines!
        </p>
      </header>

      <main className="max-w-4xl mx-auto">
        <GameControls
          status={gameState.status}
          minesLeft={gameState.minesLeft}
          time={gameState.time}
          difficulty={gameState.difficulty}
          onNewGame={resetGame}
          onChangeDifficulty={handleChangeDifficulty}
        />

        <Instructions />

        <Board
          board={gameState.board}
          onCellClick={handleCellClick}
          onCellRightClick={handleCellRightClick}
        />
      </main>

      <footer className="text-center mt-8 text-sm text-gray-500">
        <p>Right-click or long-press (on mobile) to flag a cell.</p>
        <p className="mt-2">© {new Date().getFullYear()} Minesweeper</p>
      </footer>
    </div>
  );
}

export default App;
