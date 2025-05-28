import {Game} from "../types/Game"; // Import interfejsu Game
import CacheService from "./cacheService";

const LEADERBOARD_PREFIX = 'leaderboard';

export default class LeaderboardService {
    private cacheService: CacheService;

    constructor(cacheService: CacheService) {
        this.cacheService = cacheService;
    }

    // Klucz dla rankingu, np. leaderboard:pl:easy
    private getLeaderboardKey(language: string, difficulty?: string): string {
        return `${LEADERBOARD_PREFIX}:${language}${difficulty ? `:${difficulty}` : ':any'}`;
    }

    async addScore(game: Game): Promise<void> {
        if (game.status !== 'completed' || !game.endTime) return;

        const key = this.getLeaderboardKey(game.language, game.level);
        // Wynik: liczba prób. Mniejsza liczba prób jest lepsza.
        // const attempt = game.attempts.length;
        const time = game.endTime - game.startTime; // Czas gry w milisekundach
        const score = Math.floor(time / 1000);
        // Członek: ID gracza lub unikalny identyfikator gry/gracza
        const member = `${game.id}`; // Można rozważyć użycie ID użytkownika, jeśli jest
        // const member = `${game.userId ?? game.id}`;

        try {
            // Dodaj wynik do rankingu. Jeśli gracz już jest, zaktualizuj jeśli nowy wynik jest lepszy.
            // 'NX' - dodaj tylko jeśli nie istnieje, 'XX' - aktualizuj tylko jeśli istnieje
            // 'LT' - aktualizuj tylko jeśli nowy wynik jest mniejszy (lepszy)
            await this.cacheService.zAdd(key, score, member);
            console.log(`Score added for game ${game.id} to ${key}: ${score}`);
        } catch (error) {
            console.error(`Failed to add score for game ${game.id} to ${key}:`, error);
        }
    }

    async getTopScores(language: string, difficulty?: string, count: number = 10): Promise<Array<{ member: string, score: number }>> {
        const key = this.getLeaderboardKey(language, difficulty);
        try {
            // Pobierz top N wyników (od najniższego do najwyższego)
            const results = await this.cacheService.zRangeWithScores(key, 0, count - 1);
            return results.map(r => ({ member: r.value.toString(), score: Number(r.score) }));
        } catch (error) {
            console.error(`Failed to get top scores from ${key}:`, error);
            return [];
        }
    }
}

