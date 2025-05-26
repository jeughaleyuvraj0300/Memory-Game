import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Card, Difficulty, GameContextType, GameState } from '../types/game';
import { getCardsByDifficulty, getInitialGameState } from '../utils/gameUtils';

type GameAction =
  | { type: 'START_GAME'; difficulty: Difficulty }
  | { type: 'FLIP_CARD'; card: Card }
  | { type: 'CHECK_MATCH' }
  | { type: 'RESET_FLIPPED_CARDS' }
  | { type: 'RESET_GAME' }
  | { type: 'UPDATE_BEST_SCORE' };

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...state,
        cards: getCardsByDifficulty(action.difficulty),
        moves: 0,
        matchedPairs: 0,
        isPlaying: true,
        difficulty: action.difficulty,
        startTime: Date.now(),
        endTime: null,
        flippedCards: []
      };
    
    case 'FLIP_CARD': {
      // Don't allow flipping if already matched or if two cards are already flipped
      if (
        action.card.isMatched || 
        state.flippedCards.length >= 2 ||
        state.flippedCards.some(card => card.id === action.card.id)
      ) {
        return state;
      }

      // Update the card's flipped state
      const updatedCards = state.cards.map(card => 
        card.id === action.card.id 
          ? { ...card, isFlipped: true } 
          : card
      );

      // Add the card to flippedCards
      const flippedCards = [...state.flippedCards, action.card];

      return {
        ...state,
        cards: updatedCards,
        flippedCards,
        moves: flippedCards.length === 2 ? state.moves + 1 : state.moves
      };
    }

    case 'CHECK_MATCH': {
      if (state.flippedCards.length !== 2) return state;
      
      const [firstCard, secondCard] = state.flippedCards;
      const isMatch = firstCard.value === secondCard.value;
      
      const updatedCards = state.cards.map(card => {
        if (card.id === firstCard.id || card.id === secondCard.id) {
          return { ...card, isMatched: isMatch, isFlipped: isMatch };
        }
        return card;
      });
      
      const matchedPairs = isMatch ? state.matchedPairs + 1 : state.matchedPairs;
      const totalPairs = state.cards.length / 2;
      
      // Check if all pairs are matched
      const isGameComplete = matchedPairs === totalPairs;
      const endTime = isGameComplete ? Date.now() : state.endTime;
      
      return {
        ...state,
        cards: updatedCards,
        matchedPairs,
        endTime,
        flippedCards: []
      };
    }
    
    case 'RESET_FLIPPED_CARDS': {
      const updatedCards = state.cards.map(card => {
        if (state.flippedCards.some(fc => fc.id === card.id) && !card.isMatched) {
          return { ...card, isFlipped: false };
        }
        return card;
      });
      
      return {
        ...state,
        cards: updatedCards,
        flippedCards: []
      };
    }
    
    case 'RESET_GAME':
      return {
        ...getInitialGameState(),
        bestScores: state.bestScores
      };
      
    case 'UPDATE_BEST_SCORE': {
      if (!state.endTime || !state.startTime) return state;
      
      const currentTime = state.endTime - state.startTime;
      const currentBest = state.bestScores[state.difficulty];
      
      // Update best score if this is the first score or better than the previous best
      if (currentBest === null || currentTime < currentBest) {
        const updatedBestScores = {
          ...state.bestScores,
          [state.difficulty]: currentTime
        };
        
        // Save to localStorage
        localStorage.setItem('memoryGameBestScores', JSON.stringify(updatedBestScores));
        
        return {
          ...state,
          bestScores: updatedBestScores
        };
      }
      
      return state;
    }
    
    default:
      return state;
  }
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, dispatch] = useReducer(gameReducer, getInitialGameState());
  
  const startGame = (difficulty: Difficulty) => {
    dispatch({ type: 'START_GAME', difficulty });
  };
  
  const flipCard = (card: Card) => {
    // If the game hasn't started yet, start it with the current difficulty
    if (!gameState.isPlaying) {
      startGame(gameState.difficulty);
    }
    
    dispatch({ type: 'FLIP_CARD', card });
  };
  
  const resetGame = () => {
    dispatch({ type: 'RESET_GAME' });
  };
  
  // Check for matches when two cards are flipped
  useEffect(() => {
    if (gameState.flippedCards.length === 2) {
      // Wait a short time before checking for a match
      const timeoutId = setTimeout(() => {
        dispatch({ type: 'CHECK_MATCH' });
      }, 500);
      
      return () => clearTimeout(timeoutId);
    }
  }, [gameState.flippedCards]);
  
  // Reset unmatched cards after a delay
  useEffect(() => {
    const { flippedCards } = gameState;
    if (flippedCards.length === 2) {
      const [firstCard, secondCard] = flippedCards;
      if (firstCard.value !== secondCard.value) {
        const timeoutId = setTimeout(() => {
          dispatch({ type: 'RESET_FLIPPED_CARDS' });
        }, 1000);
        
        return () => clearTimeout(timeoutId);
      }
    }
  }, [gameState.flippedCards]);
  
  // Update best score when game is complete
  useEffect(() => {
    if (gameState.endTime && gameState.startTime) {
      const totalPairs = gameState.cards.length / 2;
      if (gameState.matchedPairs === totalPairs) {
        dispatch({ type: 'UPDATE_BEST_SCORE' });
      }
    }
  }, [gameState.endTime, gameState.matchedPairs]);
  
  return (
    <GameContext.Provider value={{ gameState, startGame, flipCard, resetGame }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};