import React from 'react';
import { GameProvider } from './contexts/GameContext';
import GameBoard from './components/GameBoard';
import GameControls from './components/GameControls';
import GameHeader from './components/GameHeader';
import GameComplete from './components/GameComplete';

function App() {
  return (
    <GameProvider>
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100 flex flex-col py-4 md:py-8">
        <GameHeader />
        <GameControls />
        <GameBoard />
        <GameComplete />
      </div>
    </GameProvider>
  );
}

export default App;