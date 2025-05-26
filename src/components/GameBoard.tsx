import React from 'react';
import { useGame } from '../contexts/GameContext';
import GameCard from './GameCard';
import { Difficulty } from '../types/game';

const GameBoard: React.FC = () => {
  const { gameState, flipCard } = useGame();
  const { cards, difficulty } = gameState;

  // Determine grid columns based on difficulty
  const getGridColumns = (): string => {
    switch (difficulty) {
      case 'easy':
        return 'grid-cols-3 sm:grid-cols-4';
      case 'medium':
        return 'grid-cols-4 sm:grid-cols-5';
      case 'hard':
        return 'grid-cols-5 sm:grid-cols-6';
      default:
        return 'grid-cols-4';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div 
        className={`grid ${getGridColumns()} gap-3 sm:gap-4 md:gap-6`}
      >
        {cards.map(card => (
          <GameCard 
            key={card.id} 
            card={card} 
            onClick={flipCard} 
          />
        ))}
      </div>
    </div>
  );
};

export default GameBoard;