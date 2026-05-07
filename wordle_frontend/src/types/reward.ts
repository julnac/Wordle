import { User } from './user';

export interface Reward {
  id: string;
  name: string;
  description?: string | null;
  earnedAt: Date;

  userId: string;
  user?: User;
}