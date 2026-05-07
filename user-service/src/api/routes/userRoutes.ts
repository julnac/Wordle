import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { register, login } from '../controllers/authController';

const router = Router();
const userController = new UserController();

router.post('/auth/register', register);
router.post('/auth/login', login);


/**
 * @swagger
 * /api/user/{userId}/profile:
 *   get:
 *     summary: Pobierz profil użytkownika
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Profil użytkownika
 *       404:
 *         description: Nie znaleziono profilu
 */
router.get('/profile', (req, res, next) => userController.getProfile(req, res, next));

/**
 * @swagger
 * /api/user/{userId}/profile:
 *   put:
 *     summary: Aktualizuj profil użytkownika
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
 *     responses:
 *       200:
 *         description: Zaktualizowany profil
 */
router.put('/profile', (req, res, next) => userController.updateProfile(req, res, next));

/**
 * @swagger
 * /api/user/{userId}/gamehistory:
 *   post:
 *     summary: Zaktualizuj historię gier użytkownika
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
 *     responses:
 *       204:
 *         description: Historia zaktualizowana
 */
router.post('/:userId/gamehistory', (req, res, next) => userController.updateGameHistory(req, res, next));

/**
 * @swagger
 * /api/user/{userId}/gamehistory:
 *   get:
 *     summary: Pobierz historię gier użytkownika
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Historia gier
 */
router.get('/gamehistory', (req, res, next) => userController.getGameHistory(req, res, next));

/**
 * @swagger
 * /api/user/{userId}/rewards:
 *   get:
 *     summary: Pobierz nagrody użytkownika
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista nagród
 */
router.get('/rewards', (req, res, next) => userController.getRewards(req, res, next));

/**
 * @swagger
 * /api/user/{userId}/stats:
 *   get:
 *     summary: Pobierz statystyki użytkownika
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Statystyki użytkownika
 *       404:
 *         description: Nie znaleziono statystyk
 */
router.get('/stats', (req, res, next) => userController.getStats(req, res, next));


export default router;