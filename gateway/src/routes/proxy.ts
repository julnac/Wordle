import express from 'express';
import proxy from 'express-http-proxy';
const router = express.Router();

const userServiceUrl = process.env.USER_SERVICE_URL || 'http://localhost:5001';
const gameServiceUrl = process.env.GAME_SERVICE_URL || 'http://localhost:5002';

router.use('/user', proxy(userServiceUrl));

router.use('/game', proxy(gameServiceUrl));

router.use('/dictionary', proxy(gameServiceUrl));

router.use('/leaderboard', proxy(gameServiceUrl));

export default router;
