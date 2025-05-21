import express, { Application } from 'express';
import authRoutes from './routes/authRoutes';
import gameRoutes from './routes/gameRoutes';
import rankingRoutes from './routes/rankingRoutes';
import connectMongoDB from '../repository/mongo/mongodb';
import connectRedis from '../repository/redis/redis';

const app: Application = express();
const PORT: number = Number(process.env.PORT) || 3000;

// Middleware to parse JSON
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/ranking', rankingRoutes);

async function startServer() {
  try {
    await connectMongoDB();
    await connectRedis();

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to initialize databases or start server:', error);
    process.exit(1); // Zakończ proces w przypadku błędu
  }
}

startServer();