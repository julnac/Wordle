import GameService from '../../src/api/services/gameService';
import WordListRepository from '../../src/repository/mongo/wordListRepository';

jest.mock('../../src/repository/mongo/wordListRepository');

const mockCache = {
    getCache: jest.fn(),
    setCache: jest.fn(),
};
const mockLeaderboard = {
    addScore: jest.fn(),
};

describe('GameService', () => {
    let service: GameService;

    beforeEach(() => {
        service = new GameService(mockCache as any, mockLeaderboard as any);
        jest.clearAllMocks();
    });

    it('powinien utworzyć nową grę', async () => {
        jest.spyOn(service as any, 'checkUserExists').mockResolvedValue(true);
        (WordListRepository.getRandomWord as jest.Mock).mockResolvedValue('słowo');
        // 1. Brak ongoingGame
        mockCache.getCache.mockResolvedValueOnce(null);

        const game = await service.startGame('user1', 6, 5, 'pl', 'easy');
        expect(game).toHaveProperty('id');
        expect(game.userId).toBe('user1');
        expect(game.word).toBe('słowo');
        expect(mockCache.setCache).toHaveBeenCalled();
    });

    it('zwraca błąd, gdy użytkownik nie istnieje', async () => {
        jest.spyOn(service as any, 'checkUserExists').mockResolvedValue(false);

        await expect(
            service.startGame('userX', 6, 5, 'pl', 'easy')
        ).rejects.toThrow('Are you a user? Please register first.');
    });

    it('zwraca błąd, gdy nie znaleziono słowa', async () => {
        jest.spyOn(service as any, 'checkUserExists').mockResolvedValue(true);
        (WordListRepository.getRandomWord as jest.Mock).mockResolvedValue(null);
        mockCache.getCache.mockResolvedValueOnce(null);

        await expect(
            service.startGame('user1', 6, 5, 'pl', 'easy')
        ).rejects.toThrow('No words found for language "pl" and length "5"');
    });

    it('zwraca null, gdy nie ma gry o podanym id', async () => {
        mockCache.getCache.mockResolvedValue(null);
        const result = await service.getGameStatus('gameId125');
        expect(result).toBeNull();
    });
});