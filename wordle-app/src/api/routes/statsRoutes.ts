import express, { Router } from 'express';
import StatsController from '../controllers/statsController';
// import { authenticateToken } from '../middleware/authMiddleware';

const router: Router = express.Router();
const statsController = new StatsController();

/**
 * @openapi
 * /api/stats/{userId}:
 *   get:
 *     summary: Pobierz statystyki gracza
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Statystyki gracza
 */
router.get('/:userId', statsController.getStats);

/**
 * @openapi
 * /api/stats:
 *   post:
 *     summary: Zaktualizuj statystyki gracza
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               game:
 *                 type: object
 *     responses:
 *       200:
 *         description: Statystyki zaktualizowane
 */
router.post('/', statsController.updateStats);

export default router;
