import { LetterValidation } from './letterValidation';
import { User } from './user';

export type GameData = {
    id: string;
    userId: string;
    word: string;
    wordLength: number;
    attempts: string[];
    letters: LetterValidation[];
    attemptsAllowed: number;
    status: string;
    level: string;
    language: string;
    startTime: number;
    endTime?: number;
};

export interface GameHistory {
  id: string;
  word: string;
  wordLength: number;
  attempts: unknown; // Prisma Json → najlepiej zawęzić później
  attemptsAllowed: number;
  status: string;
  level?: string | null;
  language: string;
  startTime: Date;
  endTime?: Date | null;

  userId: string;
  user?: User;
}

export interface StartGameRequest {
  attemptsAllowed: number;
  wordLength: number;
  language: string;
  level: string;
}
