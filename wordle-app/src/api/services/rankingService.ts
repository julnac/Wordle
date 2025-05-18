// Plik: wordle-app/src/api/services/rankingService.ts
import { User } from "../../repository/pgsql/models/user";
import { CacheService } from "./cacheService";
import { redisClient } from "../app";
import { MongoRepository } from "../../repository/mongo/mongoRepository";
import type { PlayerStats } from "../../repository/mongo/models/playerStats";

export class RankingService {
  private cacheService: CacheService;
  private mongoRepository: MongoRepository;

  constructor() {
    this.cacheService = new CacheService(redisClient);
    this.mongoRepository = new MongoRepository();
  }

  async getRankings(): Promise<any[]> {
    const cachedRankings = await this.cacheService.get("rankings");
    if (cachedRankings) {
      return cachedRankings;
    }
    const rankings = await User.find().sort({ score: -1 }).limit(10);
    await this.cacheService.set("rankings", rankings);
    return rankings;
  }

  async updateRanking(userId: string, score: number): Promise<void> {
    const playerStats = await this.mongoRepository.getPlayerStats(userId);
    if (playerStats) {
      await this.mongoRepository.updatePlayerStats(userId, { score });
    } else {
      await this.mongoRepository.createPlayerStats({ userId, score } as PlayerStats);
    }
    await this.cacheService.del("rankings");
  }
}