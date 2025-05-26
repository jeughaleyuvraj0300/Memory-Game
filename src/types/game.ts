export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Card {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface GameState {
  cards: Card[];
  moves: number;
  matchedPairs: number;
  isPlaying: boolean;
  difficulty: Difficulty;
  startTime: number | null;
  endTime: number | null;
  flippedCards: Card[];
  bestScores: Record<Difficulty, number | null>;
}

export interface GameContextType {
  gameState: GameState;
  startGame: (difficulty: Difficulty) => void;
  flipCard: (card: Card) => void;
  resetGame: () => void;
}