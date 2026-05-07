import { User } from './user';

export interface Stats {
  id: string;
  gamesPlayed: number;
  gamesWon: number;
  winRate: number;
  avgTries: number;
  currentStreak: number;
  maxStreak: number;
  lastPlayed: Date;

  userId: string;
  user?: User;
}