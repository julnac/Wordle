import express, { Router } from 'express';
import GameController from '../controllers/gameController';

const router: Router = express.Router();
const gameController = new GameController();

// Route to start a new game
router.post('/start', gameController.startGame);

// Route to submit a guess
router.post('/guess', gameController.validateGuess);

// Route to get game status
router.get('/status/:gameId', gameController.getGameStatus);

export default router;
