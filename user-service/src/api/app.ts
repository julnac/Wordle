import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import express, { Application } from 'express';
import { errorHandler } from './middleware/errorHandler';
import userRoutes from './routes/userRoutes';
import authFromProxy from './middleware/authFromProxy';

import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const app: Application = express();
const PORT: number = Number(process.env.PORT) || 5001;

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
    credentials: true
}));
app.use(authFromProxy);

// Routes
app.use('/api/user', userRoutes);

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

// Error handling middleware
app.use(errorHandler);

function startServer() {
    try {
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to initialize databases or start server:', error);
    }
}

startServer()