import express, { Router } from 'express';
import LeaderboardController from '../controllers/leaderboardController';
import LeaderboardService from '../services/leaderboardService';
import CacheService from '../services/cacheService';
import { redisClient } from '../../repository/redis/redis';

const router: Router = express.Router();

const cacheService = new CacheService(redisClient);
const leaderboardService = new LeaderboardService(cacheService);
const leaderboardController = new LeaderboardController(leaderboardService);

/**
 * @openapi
 * /api/leaderboard/:
 *   get:
 *     summary: Pobierz najlepsze wyniki dla danego języka
 *     parameters:
 *       - in: query
 *         name: language
 *         required: false
 *         schema:
 *           type: string
 *         description: Kod języka (np. 'pl', 'en', 'es', 'de')
 *       - in: query
 *         name: difficulty
 *         required: false
 *         schema:
 *           type: string
 *         description: Poziom trudności (np. 'easy', 'medium', 'hard')
 *       - in: query
 *         name: count
 *         required: false
 *         schema:
 *           type: integer
 *         description: Liczba wyników do pobrania (domyślnie 10)
 *     responses:
 *       200:
 *         description: Lista najlepszych wyników
 */
router.get('/', (req, res) => leaderboardController.getTopScores(req, res));

/**
 * @openapi
 * /api/leaderboard/:
 *   post:
 *     summary: Dodaj wynik do rankingu
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               language:
 *                 type: string
 *               level:
 *                 type: string
 *               status:
 *                 type: string
 *               endTime:
 *                 type: integer
 *               startTime:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Wynik został dodany
 *       400:
 *         description: Błędne dane gry
 */
router.post('/', (req, res) => leaderboardController.addScore(req, res));

export default router;