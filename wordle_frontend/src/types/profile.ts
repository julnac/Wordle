import { User } from './user';

export interface Profile {
  id: string;
  img: string;
  bio: string;

  userId: string;
  user?: User;
}

export interface UpdateProfileRequest{
  img: string;
  bio: string;
}