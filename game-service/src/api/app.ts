import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import express, { Application } from 'express';

import gameRoutes from './routes/gameRoutes';
import dictionaryRoutes from './routes/dictionaryRoutes';
import leaderboardRoutes from './routes/leaderboardRoutes';
import connectMongoDB from '../repository/mongo/mongodb';
import connectRedis from '../repository/redis/redis';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import authFromProxy from "./middleware/authFromProxy";


const app: Application = express();
const PORT: number = Number(process.env.PORT) || 5002;


// Middleware to parse JSON
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:3000',
        'http://localhost:5000',
        'http://localhost:5001',
        'http://localhost:5002',
        'http://gateway:5000',
        'http://frontend:3000',
        'http://user-service:5001',
        'http://game-service:5002',
        'http://localhost:8080',
        'http://keycloak:8080'],
    credentials: true // jeśli korzystasz z ciasteczek/sesji
}));
app.use(authFromProxy);


// Interfejs dla rozszerzonego obiektu Request
// interface AuthenticatedRequest extends Request {
//     kauth?: any; // Dodajemy kauth, aby TypeScript nie zgłaszał błędu
// }

// Routes

app.use('/api/game', gameRoutes);
app.use('/api/dictionary', dictionaryRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// Swagger configuration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Wordle API',
            version: '1.0.0',
        },
        components: {
            securitySchemes: {}
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
    }
}

startServer().catch((err) => {
    console.error('Unhandled error in startServer:', err);
});

export default app;