import mongoose, { Document, Model } from 'mongoose';

export interface PlayerStats extends Document {
  playerId: string;
  gamesPlayed: number;
  gamesWon: number;
  winRate: number;
  lastPlayed: Date;
  currentStreak: number;
  maxStreak: number;
  averageTries: number;
}

const playerStatsSchema = new mongoose.Schema<PlayerStats>({
  playerId: { type: String, required: true, unique: true },
  gamesPlayed: { type: Number, default: 0 },
  gamesWon: { type: Number, default: 0 },
  winRate: { type: Number, default: 0 },
  lastPlayed: { type: Date, default: Date.now },
  currentStreak: { type: Number, default: 0 },
  maxStreak: { type: Number, default: 0 },
  averageTries: { type: Number, default: 0 },
});

export const PlayerStatsModel: Model<PlayerStats> = mongoose.model<PlayerStats>('PlayerStats', playerStatsSchema);