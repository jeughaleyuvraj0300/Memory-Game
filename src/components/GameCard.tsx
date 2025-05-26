import React from 'react';
import { Card } from '../types/game';

interface GameCardProps {
  card: Card;
  onClick: (card: Card) => void;
}

const GameCard: React.FC<GameCardProps> = ({ card, onClick }) => {
  const handleClick = () => {
    if (!card.isFlipped && !card.isMatched) {
      onClick(card);
    }
  };

  return (
    <div 
      className="relative w-full aspect-[3/4] cursor-pointer perspective-500"
      onClick={handleClick}
    >
      <div 
        className={`
          absolute w-full h-full transform-style-3d transition-transform duration-500
          ${card.isFlipped || card.isMatched ? 'rotate-y-180' : ''}
        `}
      >
        {/* Card Front */}
        <div 
          className="absolute w-full h-full backface-hidden bg-gradient-to-br from-purple-600 to-purple-800 
                    rounded-xl shadow-lg border-2 border-purple-300 flex items-center justify-center"
        >
          <div className="w-1/2 h-1/2 bg-purple-200 rounded-full opacity-20"></div>
          <div className="absolute inset-0 bg-purple-600 opacity-10 rounded-xl 
                        flex items-center justify-center text-white font-bold text-2xl">
            <span className="transform rotate-45">?</span>
          </div>
        </div>
        
        {/* Card Back */}
        <div 
          className={`
            absolute w-full h-full backface-hidden rotate-y-180 rounded-xl shadow-lg
            flex items-center justify-center text-4xl sm:text-5xl
            ${card.isMatched ? 'bg-teal-100 border-2 border-teal-400' : 'bg-white border-2 border-purple-200'}
          `}
        >
          {card.value}
        </div>
      </div>
    </div>
  );
};

export default GameCard;