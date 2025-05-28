import dotenv from 'dotenv';
dotenv.config();
import express, { Application } from 'express';
// import authRoutes from './routes/authRoutes';
import gameRoutes from './routes/gameRoutes';
import statsRoutes from './routes/statsRoutes';
import dictionaryRoutes from './routes/dictionaryRoutes';
import connectMongoDB from '../repository/mongo/mongodb';
import connectRedis from '../repository/redis/redis';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const app: Application = express();
const PORT: number = Number(process.env.PORT) || 5000;


// Middleware to parse JSON
app.use(express.json());

// Routes
// app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/dictionary', dictionaryRoutes);

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Wordle API',
      version: '1.0.0',
    },
  },
  apis: ['./src/api/routes/*.ts'],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


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

startServer().catch((err) => {
  console.error('Unhandled error in startServer:', err);
  process.exit(1);
});