import WordListRepository from '../../repository/mongo/wordListRepository';

export interface Game {
  word: string;
  wordLength: number;
  attempts: string[];
  attemptsAllowed: number;
  status: 'ongoing' | 'completed';
  level?: 'easy' | 'medium' | 'hard';
  language: string;
}

interface LetterValidation {
  letter: string;
  status: 'correct' | 'present' | 'absent';
}

interface GuessResult {
  isCorrect: boolean;
  attemptsLeft: number;
  letters: LetterValidation[];
}

class GameService {
  private currentGame: Game | null;

  constructor() {
    this.currentGame = null;
  }

  getCurrentGame(): Game | null {
    return this.currentGame;
  }

  async startGame(attemptsAllowed: number = 6, wordLength: number = 5, language: string, level?: 'easy' | 'medium' | 'hard'): Promise<Game> {
    const word = await this.getRandomWord(wordLength, language, level);
    this.currentGame = {
      word,
      wordLength,
      attempts: [],
      attemptsAllowed,
      status: 'ongoing',
      level,
      language
    };
    return this.currentGame;
  }

  async getRandomWord(wordLength: number, language: string, level?: 'easy' | 'medium' | 'hard'): Promise<string> {
    const word = await WordListRepository.getRandomWord(wordLength, language, level);
    if (word === null) {
      throw new Error(`No words found for language "${language}" and length "${wordLength}"`);
    } else {
      return word;
    }
  }

  async submitGuess(guess: string): Promise<GuessResult> {
    if (!this.currentGame) {
      throw new Error('No game in progress');
    }
    if (!await WordListRepository.doesWordExist(guess, this.currentGame.language)) {
      throw new Error('No such word in the dictionary');
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
      letters: this.validateLetters(guess)
    };
  }

  validateLetters(guess: string): LetterValidation[] {
    if (!this.currentGame) {
      throw new Error('No game in progress');
    }
    const letters: LetterValidation[] = [];
    const wordArray = this.currentGame.word.split('');

    for (let i = 0; i < guess.length; i++) {
      if (wordArray[i] === guess[i]) {
        letters.push({ letter: guess[i], status: 'correct' });
      } else if (wordArray.includes(guess[i])) {
        letters.push({ letter: guess[i], status: 'present' });
      } else {
        letters.push({ letter: guess[i], status: 'absent' });
      }
    }

    return letters;
  }

  getAttemptsLeft(): number {
    if (!this.currentGame) {
      throw new Error('No game in progress');
    }
    const maxAttempts = this.currentGame.attemptsAllowed;
    return maxAttempts - this.currentGame.attempts.length;
  }

  resetGame(): void {
    this.currentGame = null;
  }
}

export default GameService;
