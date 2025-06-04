import { StatsRepository } from '../../repository/pgsql/statsRepository';
import { Stats } from '@prisma/client';
import { RewardService } from './rewardService';

export class StatsService {
    private repository: StatsRepository;
    private rewardService: RewardService;

    constructor() {
        this.repository = new StatsRepository();
        this.rewardService = new RewardService();
    }

    async updateStatsAfterGame(userId: string, won: boolean, tries: number) {
        const stats = await this.repository.findByUserId(userId);
        if (!stats) throw new Error('Stats not found');

        const updatedStats: Partial<Stats> = {
            gamesPlayed: stats.gamesPlayed + 1,
            gamesWon: won ? stats.gamesWon + 1 : stats.gamesWon,
            winRate: ((won ? stats.gamesWon + 1 : stats.gamesWon) / (stats.gamesPlayed + 1)) * 100,
            avgTries: ((stats.avgTries * stats.gamesPlayed + tries) / (stats.gamesPlayed + 1)),
            currentStreak: won ? stats.currentStreak + 1 : 0,
            maxStreak: won
                ? Math.max(stats.maxStreak, stats.currentStreak + 1)
                : stats.maxStreak,
            lastPlayed: new Date(),
        };

        const updated = await this.repository.update(userId, updatedStats);

        // Sprawdź i przyznaj odznaki po aktualizacji statystyk
        await this.rewardService.checkAndGrantBadges(userId, { ...stats, ...updatedStats });

        return updated;
    }

    async createStats(data: Omit<Stats, 'id' | 'lastPlayed'>) {
        return this.repository.create(data);
    }

    async getStatsById(id: string) {
        return this.repository.findById(id);
    }

    async getStatsByUserId(userId: string) {
        return this.repository.findByUserId(userId);
    }

    async getAllStats() {
        return this.repository.findAll();
    }

    async updateStats(userId: string, data: Partial<Stats>) {
        return this.repository.update(userId, data);
    }

    async deleteStats(userId: string) {
        return this.repository.delete(userId);
    }
}