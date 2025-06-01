import express, { Router } from 'express';
import GameController from '../controllers/gameController';
import GameService from '../services/gameService';
import CacheService from '../services/cacheService';
import LeaderboardService from "../services/leaderboardService";
import { redisClient } from '../../repository/redis/redis';
// import {authenticateToken} from "../middleware/authMiddleware";

const router: Router = express.Router();

const cacheService = new CacheService(redisClient);
const leaderboardService = new LeaderboardService(cacheService);
const gameService = new GameService(cacheService, leaderboardService);
const gameController = new GameController(gameService, cacheService);

/**
 * @openapi
 * /api/game/start/{userId}:
 *   post:
 *     summary: Rozpocznij nową grę
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               attemptsAllowed:
 *                 type: integer
 *               wordLength:
 *                 type: integer
 *               language:
 *                 type: string
 *               level:
 *                 type: string
 *     responses:
 *       200:
 *         description: Gra została rozpoczęta
 */
router.post('/start/:userId',(req, res) => gameController.startGame(req, res));

/**
 * @openapi
 * /api/game/guess/{gameId}:
 *   post:
 *     summary: Prześlij próbę odgadnięcia słowa
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               guess:
 *                 type: string
 *     responses:
 *       200:
 *         description: Wynik próby
 */
router.post('/guess/:gameId', (req, res) => gameController.validateGuess(req, res));

/**
 * @openapi
 * /api/game/status/{gameId}:
 *   get:
 *     summary: Pobierz status gry
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Status gry
 */
router.get('/status/:gameId', (req, res) => gameController.getGameStatus(req, res));

/**
 * @openapi
 * /api/game/current/{userId}:
 *   get:
 *     summary: Pobierz aktywną gre gracza
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Gra
 */
router.get('/current/:userId', (req, res) => gameController.getCurrentGame(req, res));
export default router;

