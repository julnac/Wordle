const express = require('express');
const router = express.Router();
const GameController = require('../controllers/gameController');

const gameController = new GameController();

// Route to start a new game
router.post('/start', gameController.startGame);

// Route to submit a guess
router.post('/guess', gameController.validateGuess);

// Route to get game status
router.get('/status/:gameId', gameController.getGameStatus);

module.exports = router;