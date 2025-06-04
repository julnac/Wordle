import { GameHistoryRepository } from '../../repository/pgsql/gameHistoryRepository';
import { StatsService } from './statsService';
import { GameHistory, Prisma } from '@prisma/client';

export class GameHistoryService {
    private repository: GameHistoryRepository;
    private statsService: StatsService;

    constructor() {
        this.repository = new GameHistoryRepository();
        this.statsService = new StatsService();
    }

    async updateHistoryAfterGame(game: Omit<GameHistory, 'id'>) {
        const data: Prisma.GameHistoryCreateInput = {
            word: game.word,
            wordLength: game.wordLength,
            attempts: game.attempts as Prisma.InputJsonValue,
            attemptsAllowed: game.attemptsAllowed,
            status: game.status,
            level: game.level,
            language: game.language,
            startTime: game.startTime,
            endTime: game.endTime,
            user: { connect: { id: game.userId } }
        };

        // Zapisz grę do historii
        await this.repository.create(data);

        // Zaktualizuj statystyki użytkownika
        const won = game.status === 'completed';
        const tries = (game.attempts as any[]).length;
        await this.statsService.updateStatsAfterGame(game.userId, won, tries);
    }

    async getHistoryByUserId(userId: string) {
        return this.repository.findByUserId(userId);
    }
}