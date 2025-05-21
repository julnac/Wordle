import express, { Router } from 'express';
import GameController from '../controllers/gameController';

const router: Router = express.Router();
const gameController = new GameController();

// Route to start a new game
// Oczekuje teraz np. { "attemptsAllowed": 6, "wordLength": 5, "language": "pl", "level": "medium" } w req.body
router.post('/start', gameController.startGame);

// Route to submit a guess
// Oczekuje np. { "guess": "slowo" } w req.body
router.post('/guess', gameController.validateGuess);

// Route to get game status (bez zmian, jeśli gameId identyfikuje grę)
router.get('/status/:gameId', gameController.getGameStatus);

export default router;

