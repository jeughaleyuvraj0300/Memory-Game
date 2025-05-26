import React from 'react';
import { Clock, RotateCcw, Trophy, Play } from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { Difficulty } from '../types/game';
import { formatTime } from '../utils/gameUtils';

const GameControls: React.FC = () => {
  const { gameState, startGame, resetGame } = useGame();
  
  const { 
    moves, 
    matchedPairs, 
    isPlaying, 
    difficulty, 
    startTime, 
    endTime,
    cards,
    bestScores
  } = gameState;
  
  const totalPairs = cards.length / 2;
  const isGameComplete = matchedPairs === totalPairs && totalPairs > 0;
  
  // Calculate elapsed time
  const [elapsedTime, setElapsedTime] = React.useState<number>(0);
  
  React.useEffect(() => {
    let interval: number;
    
    if (isPlaying && startTime && !endTime) {
      interval = window.setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 100);
    } else if (startTime && endTime) {
      setElapsedTime(endTime - startTime);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, startTime, endTime]);
  
  const handleDifficultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    startGame(e.target.value as Difficulty);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mb-8">
      <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Game Stats */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center">
            <div className="flex items-center gap-2 text-purple-700">
              <Clock size={20} />
              <span className="font-mono text-lg">{formatTime(elapsedTime)}</span>
            </div>
            
            <div className="flex items-center gap-2 text-purple-700">
              <span className="font-medium">Moves:</span>
              <span className="font-mono text-lg">{moves}</span>
            </div>
            
            <div className="flex items-center gap-2 text-purple-700">
              <span className="font-medium">Pairs:</span>
              <span className="font-mono text-lg">{matchedPairs}/{totalPairs || 0}</span>
            </div>
          </div>
          
          {/* Game Controls */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <select
                value={difficulty}
                onChange={handleDifficultyChange}
                className="appearance-none bg-purple-100 text-purple-800 font-medium rounded-lg px-4 py-2 pr-8 
                          focus:outline-none focus:ring-2 focus:ring-purple-500 border border-purple-200
                          transition-colors duration-200"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-purple-800">
                ▼
              </div>
            </div>
            
            {!isPlaying && matchedPairs === 0 ? (
              <button
                onClick={() => startGame(difficulty)}
                className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-2
                          flex items-center gap-2 transition-colors duration-200 font-medium
                          focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                <Play size={18} />
                <span>Start Game</span>
              </button>
            ) : (
              <button
                onClick={resetGame}
                className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-4 py-2
                          flex items-center gap-2 transition-colors duration-200 font-medium
                          focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                <RotateCcw size={18} />
                <span>Restart</span>
              </button>
            )}
          </div>
        </div>
        
        {/* Best Score */}
        {bestScores[difficulty] !== null && (
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2 text-amber-600">
            <Trophy size={18} />
            <span className="font-medium">Best time:</span>
            <span className="font-mono">{formatTime(bestScores[difficulty] || 0)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameControls;