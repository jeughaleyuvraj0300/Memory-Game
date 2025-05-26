import React from 'react';
import { Brain, Sparkles } from 'lucide-react';

const GameHeader: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 mb-4">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="flex items-center gap-3 mb-2">
          <Brain className="text-purple-600" size={32} />
          <h1 className="text-3xl md:text-4xl font-bold text-purple-800">
            Memory Match
          </h1>
          <Sparkles className="text-amber-500" size={28} />
        </div>
        
        <p className="text-gray-600 max-w-lg">
          Test your memory by matching pairs of cards. Flip cards, find matches, and complete the game in the fewest moves possible!
        </p>
      </div>
    </div>
  );
};

export default GameHeader;