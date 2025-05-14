const redis = require('redis');

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

const connectRedis = () => {
  redisClient.connect()
    .then(() => {
      console.log('Connected to Redis');
    })
    .catch((err) => {
      console.error('Failed to connect to Redis:', err);
    });
};

module.exports = {
  redisClient,
  connectRedis,
};