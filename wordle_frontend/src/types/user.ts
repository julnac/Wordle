import { Profile } from './profile';
import { Stats } from './stats';
import { Reward } from './reward';
import { GameHistory } from './gameData';

export interface User {
  id: string;
  email: string;
  username: string;
  password: string;
  createdAt: Date;

  profile?: Profile | null;
  stats?: Stats | null;
  rewards: Reward[];
  gameHistory: GameHistory[];
}

export interface UserDTO {
  id: string;
  email: string;
  username: string;
  createdAt: Date;
}