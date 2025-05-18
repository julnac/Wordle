import WordList from '../../repository/mongo/models/wordList';
import PlayerStats from '../../repository/mongo/models/playerStats';

interface Game {
  word: string;
  attempts: string[];
  status: 'ongoing' | 'completed';
}

interface GuessResult {
  isCorrect: boolean;
  attemptsLeft: number;
}

class GameService {
  private currentGame: Game | null;

  constructor() {
    this.currentGame = null;
  }

  startGame(): Game {
    const word = this.getRandomWord();
    this.currentGame = {
      word,
      attempts: [],
      status: 'ongoing',
    };
    return this.currentGame;
  }

  getRandomWord(): string {
    // Logic to fetch a random word from the MongoDB word list
    return WordList.getRandomWord();
  }

  submitGuess(guess: string): GuessResult {
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

  checkGuess(guess: string): GuessResult {
    if (!this.currentGame) {
      throw new Error('No game in progress');
    }
    const isCorrect = guess === this.currentGame.word;
    return {
      isCorrect,
      attemptsLeft: this.getAttemptsLeft(),
    };
  }

  getAttemptsLeft(): number {
    if (!this.currentGame) {
      throw new Error('No game in progress');
    }
    const maxAttempts = 6; // Example max attempts
    return maxAttempts - this.currentGame.attempts.length;
  }

  resetGame(): void {
    this.currentGame = null;
  }
}

export default GameService;
