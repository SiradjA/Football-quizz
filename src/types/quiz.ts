export interface Question {
  id: string;
  text: string;
  category: Category;
  options: string[];
  correctAnswer: number;
  image?: string;
}

export interface Score {
  nickname: string;
  score: number;
  timestamp: number;
}

export type Category = 'world-cup' | 'players' | 'clubs' | 'records' | 'champions-league';

export interface QuizState {
  currentQuestion: number;
  score: number;
  timeLeft: number;
  answers: number[];
  isComplete: boolean;
}