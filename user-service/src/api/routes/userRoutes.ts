import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { createUserFromKeycloak, deleteUserFromKeycloak, getAllUsers } from '../controllers/userSyncController';

const router = Router();
const userController = new UserController();

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
router.get('/:userId/profile', (req, res, next) => userController.getProfile(req, res, next));

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
router.put('/:userId/profile', (req, res, next) => userController.updateProfile(req, res, next));

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
router.get('/:userId/gamehistory', (req, res, next) => userController.getGameHistory(req, res, next));

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
router.get('/:userId/rewards', (req, res, next) => userController.getRewards(req, res, next));

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
router.get('/:userId/stats', (req, res, next) => userController.getStats(req, res, next));

/**
 * @swagger
 * /api/user/sync/keycloak:
 *   post:
 *     summary: Utwórz użytkownika na podstawie danych z Keycloak
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               keycloakId:
 *                 type: string
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *     responses:
 *       201:
 *         description: Użytkownik utworzony
 */
router.post('/sync/keycloak', createUserFromKeycloak);

/**
 * @swagger
 * /api/user/sync/keycloak:
 *   delete:
 *     summary: Usuń użytkownika na podstawie danych z Keycloak
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               keycloakId:
 *                 type: string
 *     responses:
 *       204:
 *         description: Użytkownik usunięty
 *       404:
 *         description: Nie znaleziono użytkownika
 */
router.delete('/sync/keycloak', deleteUserFromKeycloak);

/**
 * @swagger
 * /api/user/sync/keycloak:
 *   get:
 *     summary: Pobierz użytkowników
 *     responses:
 *       200:
 *         description: Uzytkownicy
 *       404:
 *         description: Nie znaleziono użytkowników
 */
router.get('/sync/keycloak', getAllUsers);

export default router;