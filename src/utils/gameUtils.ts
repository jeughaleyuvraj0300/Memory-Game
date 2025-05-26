import { Card, Difficulty, GameState } from '../types/game';

export const CARDS_PER_DIFFICULTY: Record<Difficulty, number> = {
  easy: 12, // 6 pairs
  medium: 20, // 10 pairs
  hard: 30, // 15 pairs
};

export const CARD_VALUES = [
  '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍒', 
  '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🥑', '🥦', '🥕', '🌽',
  '🌶️', '🫑', '🥔', '🍄', '🧀', '🥨', '🥐', '🥖', '🥞', '🍦'
];

export const getCardsByDifficulty = (difficulty: Difficulty): Card[] => {
  const cardCount = CARDS_PER_DIFFICULTY[difficulty];
  const pairsCount = cardCount / 2;
  
  // Select a subset of card values based on difficulty
  const selectedValues = CARD_VALUES.slice(0, pairsCount);
  
  // Create pairs of cards
  const pairs = selectedValues.flatMap((value) => [
    { id: Math.random(), value, isFlipped: false, isMatched: false },
    { id: Math.random(), value, isFlipped: false, isMatched: false },
  ]);
  
  // Shuffle the cards
  return shuffleCards(pairs);
};

export const shuffleCards = (cards: Card[]): Card[] => {
  const shuffled = [...cards];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const getInitialGameState = (): GameState => {
  // Try to load best scores from localStorage
  let bestScores: Record<Difficulty, number | null>;
  try {
    const savedScores = localStorage.getItem('memoryGameBestScores');
    bestScores = savedScores ? JSON.parse(savedScores) : {
      easy: null,
      medium: null,
      hard: null
    };
  } catch (e) {
    bestScores = {
      easy: null,
      medium: null,
      hard: null
    };
  }
  
  return {
    cards: [],
    moves: 0,
    matchedPairs: 0,
    isPlaying: false,
    difficulty: 'easy',
    startTime: null,
    endTime: null,
    flippedCards: [],
    bestScores
  };
};

export const formatTime = (milliseconds: number): string => {
  if (!milliseconds) return '00:00';
  
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};