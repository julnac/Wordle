import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import express, { Application } from 'express';
import { errorHandler } from './middleware/errorHandler';
import userRoutes from './routes/userRoutes';
import authFromProxy from './middleware/authFromProxy';
import { seed } from '../seed';

import swaggerJsdoc from 'swagger-jsdoc';

const app: Application = express();
const PORT: number = Number(process.env.PORT) || 5001;

app.use(express.json());
app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://localhost:5000',
        'http://localhost:5001',
        'http://localhost:5002',
        'http://gateway:5000',
        'http://frontend:3000',
        'http://user-service:5001',
        'http://game-service:5002',
    ],
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
            title: 'Wordle User Service API',
            version: '1.0.0',
        },
        servers: [
            { url: 'http://localhost:5000/user-service', description: 'Via gateway' },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            }
        },
        security: [{ bearerAuth: [] }],
    },
    apis: ['./dist/api/routes/*.js'],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.get('/openapi.json', (_req, res) => { res.json(swaggerSpec); });
app.get('/api-docs', (_req, res) => {
    res.send(`<!doctype html>
<html>
  <head>
    <title>Wordle User Service API</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body>
    <script id="api-reference" data-url="/openapi.json"></script>
    <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
  </body>
</html>`);
});

// Error handling middleware
app.use(errorHandler);

async function startServer() {
    try {
        await seed();
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to initialize databases or start server:', error);
    }
}

startServer();