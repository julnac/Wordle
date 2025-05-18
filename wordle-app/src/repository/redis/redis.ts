import { createClient, RedisClientType } from 'redis';

const redisClient: RedisClientType = createClient({
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379,
  },
});

redisClient.on('error', (err: Error) => {
  console.error('Redis error:', err);
});

const connectRedis = async (): Promise<void> => {
  try {
    await redisClient.connect();
    console.log('Connected to Redis');
  } catch (err) {
    console.error('Failed to connect to Redis:', err);
  }
};

export { redisClient, connectRedis };
