import mongoose, { Document, Model } from 'mongoose';

export interface PlayerStats extends Document {
  playerId: string;
  gamesPlayed: number;
  gamesWon: number;
  winRate: number;
  lastPlayed: Date;
}

const playerStatsSchema = new mongoose.Schema<PlayerStats>({
  playerId: { type: String, required: true, unique: true },
  gamesPlayed: { type: Number, default: 0 },
  gamesWon: { type: Number, default: 0 },
  winRate: { type: Number, default: 0 },
  lastPlayed: { type: Date, default: Date.now }
});

export const PlayerStatsModel: Model<PlayerStats> = mongoose.model<PlayerStats>('PlayerStats', playerStatsSchema);