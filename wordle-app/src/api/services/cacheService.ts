interface RedisClient {
    setex(key: string, seconds: number, value: string): Promise<void>;
    get(key: string): Promise<string | null>;
    del(key: string): Promise<void>;
}

class CacheService {
    private redisClient: RedisClient;

    constructor(redisClient: RedisClient) {
        this.redisClient = redisClient;
    }

    async setCache(key: string, value: unknown, expiration: number = 3600): Promise<void> {
        await this.redisClient.setex(key, expiration, JSON.stringify(value));
    }

    async getCache<T = unknown>(key: string): Promise<T | null> {
        const data = await this.redisClient.get(key);
        return data ? JSON.parse(data) as T : null;
    }

    async deleteCache(key: string): Promise<void> {
        await this.redisClient.del(key);
    }
}

export default CacheService;
