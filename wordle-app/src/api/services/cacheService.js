class CacheService {
    constructor(redisClient) {
        this.redisClient = redisClient;
    }

    async setCache(key, value, expiration = 3600) {
        await this.redisClient.setex(key, expiration, JSON.stringify(value));
    }

    async getCache(key) {
        const data = await this.redisClient.get(key);
        return data ? JSON.parse(data) : null;
    }

    async deleteCache(key) {
        await this.redisClient.del(key);
    }
}

module.exports = CacheService;