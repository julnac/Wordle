import WordListRepository from '../../repository/mongo/wordListRepository';
import CacheService from "./cacheService";
import LeaderboardService from "./leaderboardService";
import {v4 as uuidv4} from 'uuid';
import StatsService from './statsService';
import {Game} from "../types/Game";
import {LetterValidation} from "../types/LetterValidation";

const GAME_CACHE_PREFIX = 'game:';
const GAME_CACHE_TTL = 3600;

class GameService {
  // private currentGame: Game | null;
  // constructor() {
  //   this.currentGame = null;
  // }
  private cacheService: CacheService;
  private leaderboardService: LeaderboardService;

  constructor(cacheService: CacheService, leaderboardService: LeaderboardService) {
    this.cacheService = cacheService;
    this.leaderboardService = leaderboardService;
  }
  // getCurrentGame(): Game | null {
  //   return this.currentGame;
  // }

  private async getGameFromCache(gameId: string): Promise<Game | null> {
    return this.cacheService.getCache<Game>(`${GAME_CACHE_PREFIX}${gameId}`);
  }

  private async getCurrentGameForUser(userId: string): Promise<Game | null> {
    // Pobierz ID aktywnej gry z cache, np. user:{userId}:ongoingGame
    const ongoingGameId = await this.cacheService.getCache<string>(`user:${userId}:ongoingGame`);
    if (!ongoingGameId) return null;
    return this.getGameFromCache(ongoingGameId);
  }

  private async saveGameToCache(game: Game): Promise<void> {
    await this.cacheService.setCache(`${GAME_CACHE_PREFIX}${game.id}`, game, GAME_CACHE_TTL);
  }

  async startGame(userId: string, attemptsAllowed: number = 6, wordLength: number = 5, language: string = "pl", level: 'easy' | 'medium' | 'hard' = 'medium'): Promise<Game> {
    const word = await this.getRandomWord(wordLength, language, level);
    const gameId = uuidv4();
    await this.cacheService.setCache(`user:${userId}:ongoingGame`, gameId, GAME_CACHE_TTL);
    const newGame: Game = {
      id: gameId,
      userId,
      word,
      wordLength,
      attempts: [],
      letters: [],
      attemptsAllowed,
      status: 'ongoing',
      level,
      language,
      startTime: Date.now(),
    };
    const existingGameId = await this.cacheService.getCache<string>(`user:${userId}:ongoingGame`);
    if (existingGameId) {
      const existingGame = await this.getGameFromCache(existingGameId);
      if (existingGame && existingGame.status === 'ongoing') {
        throw new Error('Gracz ma już aktywną grę');
      }
    }
    await this.saveGameToCache(newGame);
    return newGame;
  }

  async getRandomWord(wordLength: number, language: string, level?: 'easy' | 'medium' | 'hard'): Promise<string> {
    const word = await WordListRepository.getRandomWord(wordLength, language, level);
    if (word === null) {
      throw new Error(`No words found for language "${language}" and length "${wordLength}"`);
    } else {
      return word;
    }
  }

  async submitGuess(gameId: string, guess: string): Promise<Game> {
    const game = await this.getGameFromCache(gameId);

    if (!game) {
      throw new Error('Game not found or session expired');
    }
    if (game.status !== 'ongoing') {
      throw new Error('Game is already completed or failed');
    }
    if (guess.length !== game.wordLength) {
      throw new Error(`Guess length must be ${game.wordLength}`);
    }
    if (!await WordListRepository.doesWordExist(guess, game.language)) {
      throw new Error('No such word in the dictionary');
    }

    game.attempts.push(guess);
    const validationResult = this.validateGuessInternal(guess, game.word);
    const attemptsLeft = game.attemptsAllowed - game.attempts.length;
    for (let i = 0; i < validationResult.letters.length; i++) {
      game.letters.push(validationResult.letters[i]);
    }

    if (validationResult.isCorrect) {
      game.status = 'completed';
      game.endTime = Date.now();
      // Logika zapisu do statystyk gracza
      await StatsService.updateStats(game);
      // Logika zapisu do rankingu
      await this.leaderboardService.addScore(game);
    } else if (attemptsLeft <= 0) {
      game.status = 'failed';
      game.endTime = Date.now();
      // Logika zapisu do statystyk gracza
      await StatsService.updateStats(game);
      // Logika zapisu do rankingu
      await this.leaderboardService.addScore(game);
    }

    await this.saveGameToCache(game);

    return game;
  }

  private validateGuessInternal(guess: string, targetWord: string): { isCorrect: boolean; letters: LetterValidation[] } {
    const isCorrect = guess === targetWord;
    const letters: LetterValidation[] = [];
    const wordArray = targetWord.split('');
    const guessArray = guess.split('');
    const tempWordArray = [...wordArray]; // Kopia do śledzenia użytych liter

    // Najpierw oznacz poprawne litery na właściwych pozycjach
    for (let i = 0; i < guessArray.length; i++) {
      if (guessArray[i] === wordArray[i]) {
        letters[i] = { letter: guessArray[i], status: 'correct' };
        tempWordArray[i] = ''; // Oznacz jako zużytą
      }
    }

    // Następnie oznacz litery obecne, ale na złych pozycjach
    for (let i = 0; i < guessArray.length; i++) {
      if (letters[i]) continue; // Już oznaczona jako 'correct'

      const charIndexInWord = tempWordArray.indexOf(guessArray[i]);
      if (charIndexInWord !== -1) {
        letters[i] = { letter: guessArray[i], status: 'present' };
        tempWordArray[charIndexInWord] = ''; // Oznacz jako zużytą
      } else {
        letters[i] = { letter: guessArray[i], status: 'absent' };
      }
    }
    return { isCorrect, letters };
  }

  async getGameStatus(gameId: string): Promise<Game | null> {
    return this.getGameFromCache(gameId);
  }

  async findOngoingGameByUser(userId: string) {
    return this.getCurrentGameForUser(userId);
  }

}

export default GameService;
