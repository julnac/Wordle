import { RedisClientType} from "redis";

class CacheService {
    private redisClient: RedisClientType;

    constructor(redisClient: RedisClientType) {
        this.redisClient = redisClient;
    }

    async setCache(key: string, value: unknown, expiration: number = 3600): Promise<void> {
        await this.redisClient.setEx(key, expiration, JSON.stringify(value));
    }

    async getCache<T = unknown>(key: string): Promise<T | null> {
        const data: string | Buffer | null = await this.redisClient.get(key);
        // const data = await this.redisClient.get(key);
        if (data === null) {
            return null;
        }
        const jsonData = typeof data === 'string'
            ? data
            : Buffer.isBuffer(data)
                ? (data as Buffer).toString()
                : null;

        if (!jsonData) {
            throw new Error('Invalid cache data format');
        }
        return JSON.parse(jsonData) as T;
    }

    async deleteCache(key: string): Promise<void> {
        await this.redisClient.del(key);
    }

    async zAdd(key: string, score: number, member: string): Promise<void> {
        await this.redisClient.zAdd(key, [{ score, value: member }]);
    }

    async zAddLT(key: string, score: number, member: string): Promise<void> {
        await this.redisClient.zAdd(key, [{ score, value: member }], { LT: true });
    }

    async zRem(key: string, member: string): Promise<void> {
        await this.redisClient.zRem(key, member);
    }

    async zRangeWithScores(key: string, start: number, stop: number): Promise<Array<{ value: string, score: number }>> {
        return this.redisClient.zRangeWithScores(key, start, stop);
    }
}

export default CacheService;
