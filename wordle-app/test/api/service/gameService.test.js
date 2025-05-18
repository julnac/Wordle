const GameService = require('../../../src/api/services/gameService');

jest.mock('../../../src/repository/mongo/models/wordList', () => ({
  getRandomWord: jest.fn(() => 'apple'),
}));

describe('GameService', () => {
  let gameService;

  beforeEach(() => {
    gameService = new GameService();
  });

  it('should start a new game with a random word', () => {
    const game = gameService.startGame();
    expect(game.word).toBe('apple');
    expect(game.attempts).toEqual([]);
    expect(game.status).toBe('ongoing');
    expect(gameService.currentGame).toBe(game);
  });

  it('should throw error if submitGuess is called before starting a game', () => {
    expect(() => gameService.submitGuess('apple')).toThrow('No game in progress');
  });

  it('should add guess to attempts and return result', () => {
    gameService.startGame();
    const result = gameService.submitGuess('apple');
    expect(gameService.currentGame.attempts).toContain('apple');
    expect(result.isCorrect).toBe(true);
    expect(result.attemptsLeft).toBe(5);
    expect(gameService.currentGame.status).toBe('completed');
  });

  it('should return isCorrect false for wrong guess and decrease attemptsLeft', () => {
    gameService.startGame();
    const result = gameService.submitGuess('grape');
    expect(result.isCorrect).toBe(false);
    expect(result.attemptsLeft).toBe(5);
    expect(gameService.currentGame.status).toBe('ongoing');
  });

  it('should reset the game', () => {
    gameService.startGame();
    gameService.resetGame();
    expect(gameService.currentGame).toBeNull();
  });

  it('should calculate attempts left correctly', () => {
    gameService.startGame();
    gameService.submitGuess('grape');
    gameService.submitGuess('melon');
    expect(gameService.getAttemptsLeft()).toBe(4);
  });
});