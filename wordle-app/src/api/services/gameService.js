// const GameService = require('./cacheService');
const WordList = require('../../repository/mongo/models/wordList');
const PlayerStats = require('../../repository/mongo/models/playerStats');

class GameService {
  constructor() {
    this.currentGame = null;
  }

  startGame() {
    const word = this.getRandomWord();
    this.currentGame = {
      word,
      attempts: [],
      status: 'ongoing',
    };
    return this.currentGame;
  }

  getRandomWord() {
    // Logic to fetch a random word from the MongoDB word list
    return WordList.getRandomWord();
  }

  submitGuess(guess) {
    if (!this.currentGame) {
      throw new Error('No game in progress');
    }

    this.currentGame.attempts.push(guess);
    const result = this.checkGuess(guess);

    if (result.isCorrect) {
      this.currentGame.status = 'completed';
    }

    return result;
  }

  checkGuess(guess) {
    const isCorrect = guess === this.currentGame.word;
    return {
      isCorrect,
      attemptsLeft: this.getAttemptsLeft(),
    };
  }

  getAttemptsLeft() {
    const maxAttempts = 6; // Example max attempts
    return maxAttempts - this.currentGame.attempts.length;
  }

  resetGame() {
    this.currentGame = null;
  }
}

module.exports = GameService;