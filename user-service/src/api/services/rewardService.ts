import { RewardRepository } from '../../repository/pgsql/rewardRepository';
import { Reward, Stats} from '@prisma/client';

export enum BadgeType {
    FIRST_WIN = 'FIRST_WIN',
    TEN_GAMES = 'TEN_GAMES',
    PERFECT_GAME = 'PERFECT_GAME',
    // Dodaj kolejne odznaki według potrzeb
}

const BADGE_DEFINITIONS = [
    { type: BadgeType.FIRST_WIN, name: 'Pierwsza wygrana', description: 'Wygraj swoją pierwszą grę.' },
    { type: BadgeType.TEN_GAMES, name: '10 gier', description: 'Zagraj 10 gier.' },
    { type: BadgeType.PERFECT_GAME, name: 'Perfekcyjna gra', description: 'Wygraj bez błędów.' },
];

export class RewardService {
    private repository: RewardRepository;

    constructor() {
        this.repository = new RewardRepository();
    }

    async checkAndGrantBadges(userId: string, stats: Stats) {
        const rewards = [];

        if (stats.gamesWon === 1) {
            rewards.push(await this.createReward({
                name: BADGE_DEFINITIONS[0].name,
                description: BADGE_DEFINITIONS[0].description,
                userId,
            }));
        }
        if (stats.gamesPlayed >= 10) {
            rewards.push(await this.createReward({
                name: BADGE_DEFINITIONS[1].name,
                description: BADGE_DEFINITIONS[1].description,
                userId,
            }));
        }
        // Dodaj kolejne warunki dla innych odznak

        return rewards;
    }

    async createReward(data: Omit<Reward, 'id' | 'earnedAt'>) {
        return this.repository.create(data);
    }

    async getRewardById(id: string) {
        return this.repository.findById(id);
    }

    async getRewardsByUserId(userId: string) {
        return this.repository.findByUserId(userId);
    }

    async getAllRewards() {
        return this.repository.findAll();
    }

    async updateReward(id: string, data: Partial<Reward>) {
        return this.repository.update(id, data);
    }

    async deleteReward(id: string) {
        return this.repository.delete(id);
    }
}