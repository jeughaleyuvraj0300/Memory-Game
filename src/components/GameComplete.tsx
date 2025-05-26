import React, { useEffect, useState } from 'react';
import { Trophy, Clock, RotateCcw } from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { formatTime } from '../utils/gameUtils';

const GameComplete: React.FC = () => {
  const { gameState, resetGame, startGame } = useGame();
  const [showConfetti, setShowConfetti] = useState(false);
  
  const { 
    matchedPairs, 
    cards, 
    startTime, 
    endTime, 
    moves,
    difficulty,
    bestScores
  } = gameState;
  
  const totalPairs = cards.length / 2;
  const isGameComplete = matchedPairs === totalPairs && totalPairs > 0;
  const gameTime = startTime && endTime ? endTime - startTime : 0;
  const isBestScore = bestScores[difficulty] === gameTime;
  
  useEffect(() => {
    if (isGameComplete) {
      setShowConfetti(true);
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [isGameComplete]);
  
  if (!isGameComplete) return null;
  
  const handlePlayAgain = () => {
    resetGame();
    startGame(difficulty);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      {showConfetti && <Confetti />}
      
      <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full transform transition-transform animate-pop-in">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-purple-700 mb-2">Game Complete!</h2>
          <p className="text-gray-600 mb-6">You've matched all the cards!</p>
          
          <div className="flex flex-col gap-4 mb-8">
            <div className="flex items-center justify-between bg-purple-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-purple-700">
                <Clock size={20} />
                <span>Time</span>
              </div>
              <span className="font-mono text-xl font-medium text-purple-800">
                {formatTime(gameTime)}
              </span>
            </div>
            
            <div className="flex items-center justify-between bg-purple-50 rounded-lg p-4">
              <span className="text-purple-700">Moves</span>
              <span className="font-mono text-xl font-medium text-purple-800">{moves}</span>
            </div>
            
            {isBestScore && (
              <div className="flex items-center justify-center gap-2 bg-amber-50 text-amber-700 rounded-lg p-4 mt-2">
                <Trophy size={20} />
                <span className="font-medium">New Best Score!</span>
              </div>
            )}
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={resetGame}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg py-3 font-medium
                       transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              New Game
            </button>
            
            <button
              onClick={handlePlayAgain}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg py-3 font-medium
                       transition-colors duration-200 flex items-center justify-center gap-2
                       focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <RotateCcw size={16} />
              <span>Play Again</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple confetti component
const Confetti: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {[...Array(50)].map((_, i) => {
        const size = Math.random() * 10 + 5;
        const color = [
          'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
          'bg-pink-500', 'bg-purple-500', 'bg-indigo-500', 'bg-teal-500'
        ][Math.floor(Math.random() * 8)];
        
        const left = `${Math.random() * 100}vw`;
        const animationDuration = `${Math.random() * 3 + 2}s`;
        const animationDelay = `${Math.random() * 2}s`;
        
        return (
          <div
            key={i}
            className={`absolute ${color} rounded-full confetti-animation`}
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left,
              top: '-20px',
              animationDuration,
              animationDelay,
            }}
          ></div>
        );
      })}
    </div>
  );
};

export default GameComplete;