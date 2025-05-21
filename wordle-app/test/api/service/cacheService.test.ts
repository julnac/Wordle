import { jest } from '@jest/globals';
import CacheService from '../../../src/api/services/cacheService';

// Definicja typu dla mockowanego klienta Redis
interface MockRedisClient {
    setex: jest.Mock<(key: string, expiration: number, value: string) => Promise<void>>;
    get: jest.Mock<(key: string) => Promise<string | null>>;
    del: jest.Mock<(key: string) => Promise<void>>;
}

describe('CacheService', () => {
    let cacheService: CacheService;
    let mockRedisClient: MockRedisClient;

    beforeEach(() => {
        mockRedisClient = {
            setex: jest.fn<(key: string, expiration: number, value: string) => Promise<void>>(),
            get: jest.fn<(key: string) => Promise<string | null>>(),
            del: jest.fn<(key: string) => Promise<void>>(),
        };
        // Inicjalizacja mocków, aby zwracały rozwiązane obietnice domyślnie
        mockRedisClient.setex.mockResolvedValue(undefined);
        mockRedisClient.get.mockResolvedValue(null);
        mockRedisClient.del.mockResolvedValue(undefined);

        cacheService = new CacheService(mockRedisClient as any); // Użycie 'as any' jest tutaj akceptowalne, jeśli typ RedisClient w CacheService jest złożony
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('setCache', () => {
        it('should call redisClient.setex with the correct parameters and default expiration', async () => {
            const key = 'testKey';
            const value = { data: 'testData' };
            const defaultExpiration = 3600;

            await cacheService.setCache(key, value);

            expect(mockRedisClient.setex).toHaveBeenCalledTimes(1);
            expect(mockRedisClient.setex).toHaveBeenCalledWith(key, defaultExpiration, JSON.stringify(value));
        });

        it('should call redisClient.setex with the correct parameters and custom expiration', async () => {
            const key = 'testKey';
            const value = { data: 'testData' };
            const customExpiration = 60;

            await cacheService.setCache(key, value, customExpiration);

            expect(mockRedisClient.setex).toHaveBeenCalledTimes(1);
            expect(mockRedisClient.setex).toHaveBeenCalledWith(key, customExpiration, JSON.stringify(value));
        });
    });

    describe('getCache', () => {
        it('should call redisClient.get and return parsed data if key exists', async () => {
            const key = 'testKey';
            const storedValue = { data: 'testData' };
            mockRedisClient.get.mockResolvedValue(JSON.stringify(storedValue));

            const result = await cacheService.getCache<{ data: string }>(key);

            expect(mockRedisClient.get).toHaveBeenCalledTimes(1);
            expect(mockRedisClient.get).toHaveBeenCalledWith(key);
            expect(result).toEqual(storedValue);
        });

        it('should call redisClient.get and return null if key does not exist', async () => {
            const key = 'nonExistentKey';
            mockRedisClient.get.mockResolvedValue(null); // Już ustawione w beforeEach, ale dla jasności można powtórzyć

            const result = await cacheService.getCache(key);

            expect(mockRedisClient.get).toHaveBeenCalledTimes(1);
            expect(mockRedisClient.get).toHaveBeenCalledWith(key);
            expect(result).toBeNull();
        });

        it('should throw if data is not valid JSON', async () => {
            const key = 'invalidJsonKey';
            mockRedisClient.get.mockResolvedValue("not a json string");

            await expect(cacheService.getCache(key)).rejects.toThrow(SyntaxError);
        });
    });

    describe('deleteCache', () => {
        it('should call redisClient.del with the correct key', async () => {
            const key = 'testKeyToDelete';

            await cacheService.deleteCache(key);

            expect(mockRedisClient.del).toHaveBeenCalledTimes(1);
            expect(mockRedisClient.del).toHaveBeenCalledWith(key);
        });
    });
});