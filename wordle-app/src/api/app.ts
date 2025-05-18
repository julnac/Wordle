import express, { Application } from 'express';
import mongoose from 'mongoose';
import { Pool } from 'pg';
import { RedisClientType } from 'redis';
import authRoutes from './routes/authRoutes';
import gameRoutes from './routes/gameRoutes';
import rankingRoutes from './routes/rankingRoutes';
import mongodbConfig from '../mongo/mongodb';
import postgresqlConfig from '../pgsql/postgresql';
import redisConfig from '../redis/redis';

// ...existing code...

const app: Application = express();
const PORT: number = Number(process.env.PORT) || 3000;

// Middleware to parse JSON
app.use(express.json());

// Database connections
mongodbConfig();
const pgPool: Pool = postgresqlConfig();
const redisClient: RedisClientType = redisConfig();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/ranking', rankingRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default redisClient;
