import { Request, Response } from 'express';
import LeaderboardService from '../services/leaderboardService';

export default class LeaderboardController {
    private leaderboardService: LeaderboardService;

    constructor(leaderboardService: LeaderboardService) {
        this.leaderboardService = leaderboardService;
    }

    async getTopScores(req: Request, res: Response): Promise<void> {
        try {
            const { language, difficulty, count } = req.query as { language?: string; difficulty?: string; count?: string };

            if (language && !['pl', 'en', 'es', 'de'].includes(language)) {
                res.status(400).json({ message: "Parametr 'language' musi być jednym z: pl, en, es, de." });
                return;
            }
            if (difficulty && !['easy', 'medium', 'hard'].includes(difficulty)) {
                res.status(400).json({ message: "Parametr 'difficulty' musi być jednym z: easy, medium, hard." });
                return;
            }
            if (count && (isNaN(Number(count)) || Number(count) <= 0)) {
                res.status(400).json({ message: "Parametr 'count' musi być dodatnią liczbą." });
                return;
            }

            const topScores = await this.leaderboardService.getTopScores(
                language,
                difficulty,
                count ? Number(count) : 10
            );

            res.status(200).json(topScores);
        } catch (error) {
            console.error('Error fetching top scores:', error);
            res.status(500).json({ message: 'Failed to fetch leaderboard.' });
        }
    }

    async addScore(req: Request, res: Response): Promise<void> {
        try {
            const game = req.body;

            if (!game || !game.id || !game.language || !game.level || !game.status || !game.endTime) {
                res.status(400).json({ message: 'Invalid game data.' });
            }

            await this.leaderboardService.addScore(game);
            res.status(200).json({ message: 'Score added successfully.' });
        } catch (error) {
            console.error('Error adding score:', error);
            res.status(500).json({ message: 'Failed to add score.' });
        }
    }
}
