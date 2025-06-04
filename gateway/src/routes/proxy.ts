import express from 'express';
import proxy from 'express-http-proxy';
const router = express.Router();

router.use('/user', proxy('http://localhost:5001'));

router.use('/game', proxy('http://localhost:5002'));

router.use('/dictionary', proxy('http://localhost:5002'));

router.use('/leaderboard', proxy('http://localhost:5002'));

export default router;
