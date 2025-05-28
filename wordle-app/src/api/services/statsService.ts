// import { User as Prisma } from "../../repository/pgsql/prisma/generated/prisma";
import { PlayerStatsRepository } from "../../repository/mongo/playerStatsRepository";
import {PlayerStats} from "../../repository/mongo/models/playerStats";
import {Game} from "../types/Game";

export default class StatsService {

  static async getStats(userId: string): Promise<PlayerStats | null> {
    return PlayerStatsRepository.getPlayerStats(userId);
  }

  static async updateStats(game: Game): Promise<void> {
    if (!game.userId) {
      console.error("Game object is missing userId. Cannot update stats.");
      return;
    }
    const playerId = game.userId;
    const existingStats = await PlayerStatsRepository.getPlayerStats(playerId);

    const gamesPlayed = existingStats ? existingStats.gamesPlayed + 1 : 1;
    const gamesWonIncrement = game.status === 'completed' ? 1 : 0;
    const gamesWon = existingStats ? existingStats.gamesWon + gamesWonIncrement : gamesWonIncrement;

    let currentStreak = existingStats ? existingStats.currentStreak : 0;
    if (game.status === 'completed') {
      currentStreak += 1;
    } else {
      currentStreak = 0;
    }

    let maxStreak = existingStats ? existingStats.maxStreak : 0;
    if (currentStreak > maxStreak) {
      maxStreak = currentStreak;
    }

    let averageTries = existingStats ? existingStats.averageTries : 0;
    if (game.status === 'completed') {
      if (gamesWon > 0) {
        averageTries = existingStats && existingStats.gamesWon > 0
            ? ((existingStats.averageTries * existingStats.gamesWon) + game.attempts.length) / gamesWon
            : game.attempts.length;
      }
    }

    const statsData = {
      playerId,
      gamesPlayed,
      gamesWon,
      winRate: gamesPlayed > 0 ? (gamesWon / gamesPlayed) * 100 : 0,
      lastPlayed: new Date(),
      currentStreak,
      maxStreak,
      averageTries,
    };

    if (existingStats) {
      await PlayerStatsRepository.updatePlayerStats(playerId, statsData);
    } else {
      // przenieś tworzenie statystyk do authService
      await PlayerStatsRepository.createPlayerStats(statsData as unknown as PlayerStats);
    }
  }
}