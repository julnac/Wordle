const express = require('express');
const mongoose = require('mongoose');
const { Pool } = require('pg');
const redis = require('redis');
const authRoutes = require('./routes/authRoutes');
const gameRoutes = require('./routes/gameRoutes');
const rankingRoutes = require('./routes/rankingRoutes');
const mongodbConfig = require('../mongo/mongodb');
const postgresqlConfig = require('../pgsql/postgresql');
const redisConfig = require('../redis/redis');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Database connections
mongodbConfig();
const pgPool = postgresqlConfig();
const redisClient = redisConfig();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/ranking', rankingRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = redisClient;