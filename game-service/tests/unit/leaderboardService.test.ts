import LeaderboardService from '../../src/api/services/leaderboardService';
import CacheService from '../../src/api/services/cacheService';
jest.mock('axios');
import axios from 'axios';
jest.mock('../../src/api/services/cacheService');

const mockCache = {
    zAdd: jest.fn(),
    zRangeWithScores: jest.fn(),
    zRem: jest.fn(),
};

describe('LeaderboardService', () => {
    let service: LeaderboardService;

    beforeEach(() => {
        service = new LeaderboardService(mockCache as any);
        jest.clearAllMocks();
    });

    describe('addScore', () => {
        it('dodaje wynik, gdy gra zakończona', async () => {
            const game = {
                id: 'game1',
                userId: 'user1',
                language: 'pl',
                level: 'easy',
                status: 'completed',
                endTime: 2000,
                startTime: 1000,
            };
            await service.addScore(game as any);
            expect(mockCache.zAdd).toHaveBeenCalled();
        });

        it('nie dodaje wyniku, gdy gra nie jest zakończona', async () => {
            const game = {
                id: 'game2',
                userId: 'user2',
                language: 'pl',
                level: 'easy',
                status: 'ongoing',
                endTime: 2000,
                startTime: 1000,
            };
            await service.addScore(game as any);
            expect(mockCache.zAdd).not.toHaveBeenCalled();
        });
    });

    describe('getTopScores', () => {
        it('zwraca sformatowane wyniki', async () => {
            mockCache.zRangeWithScores.mockResolvedValue([
                { value: 'user1', score: 65 },
                { value: 'user2', score: 120 }
            ]);
            jest.spyOn(service, 'checkUserExists').mockResolvedValue(true);

            const result = await service.getTopScores('pl', 'easy', 2);
            expect(result).toEqual([
                { member: 'user1', score: '01:05' },
                { member: 'user2', score: '02:00' }
            ]);
        });

        it('usuwa nieistniejących użytkowników z rankingu', async () => {
            mockCache.zRangeWithScores.mockResolvedValue([
                { value: 'user1', score: 60 }
            ]);
            jest.spyOn(service, 'checkUserExists').mockResolvedValue(false);

            await service.getTopScores('pl', 'easy', 1);
            expect(mockCache.zRem).toHaveBeenCalledWith(expect.any(String), 'user1');
        });

        it('zwraca pustą tablicę przy błędzie', async () => {
            mockCache.zRangeWithScores.mockRejectedValue(new Error('Redis error'));
            const result = await service.getTopScores('pl', 'easy', 1);
            expect(result).toEqual([]);
        });
    });

    describe('checkUserExists', () => {
        it('zwraca true, gdy użytkownik istnieje', async () => {
            (axios.get as jest.Mock).mockResolvedValue({ data: {} });

            const result = await service.checkUserExists('user1');
            expect(result).toBe(true);
        });

        it('zwraca false, gdy użytkownik nie istnieje', async () => {
            jest.mock('axios');
            const axios = require('axios');
            axios.get = jest.fn().mockRejectedValue(new Error('404'));

            const result = await service.checkUserExists('userX');
            expect(result).toBe(false);
        });
    });
});