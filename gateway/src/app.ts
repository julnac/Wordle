import dotenv from 'dotenv';
dotenv.config();

import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import session from 'express-session';
import { sessionConfig, keycloak } from '../keycloak-config.js';
// import { keycloak, memoryStore } from './keycloak';
import proxyRoutes from './routes/proxy';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import proxy from 'express-http-proxy';


const app: Application = express();
const PORT: number = Number(process.env.PORT) || 5000;

app.use(express.json());
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5000', 'http://localhost:5001', 'http://localhost:5002'],
    credentials: false // jeśli korzystasz z ciasteczek/sesji
}));

// Inicjalizacja sesji (przed middleware Keycloak)
app.use(session(sessionConfig));

// Inicjalizacja Keycloak
app.use(keycloak.middleware());

// Interfejs dla rozszerzonego obiektu Request
interface AuthenticatedRequest extends Request {
    kauth?: any; // Dodajemy kauth, aby TypeScript nie zgłaszał błędu
}

// routes
// app.get('/', (req: Request, res: Response) => res.send('Gateway running'));
app.get('/api/profile', keycloak.protect(), (req: AuthenticatedRequest, res: Response) => {
    if (req.kauth && req.kauth.grant) {
        const userInfo = req.kauth.grant.access_token.content;
        // Tutaj możesz zsynchronizować użytkownika z lokalną bazą danych, jeśli to konieczne
        // np. sprawdzić czy userInfo.sub (ID użytkownika z Keycloak) istnieje w Twojej bazie
        // i jeśli nie, stworzyć go.
        res.json({
            username: userInfo.preferred_username,
            email: userInfo.email,
            roles: userInfo.realm_access?.roles, // Role z realmu
            // clientRoles: userInfo.resource_access?.[keycloakConfig.clientId]?.roles // Role specyficzne dla klienta
        });
    } else {
        res.status(401).json({ message: "User not authenticated or grant not available" });
    }
});

// Protected route
// app.use('/api', proxyRoutes);
// app.use('/api', proxy('http://localhost:5002'));

app.use('/user-service', proxy('http://localhost:5001'));
app.use('/game-service', proxy('http://localhost:5002'));


// Swagger configuration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Wordle API',
            version: '1.0.0',
        },
        components: {
            securitySchemes: {
                openId: {
                    type: 'openIdConnect',
                    openIdConnectUrl: 'http://localhost:8080/realms/wordle-app-realm/.well-known/openid-configuration'
                }
            }
        },
        security: [
            {
                openId: []
            }
        ]
    },
    apis: ['./src/routes/*.ts'],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.listen(PORT, () => console.log(`Gateway on port ${PORT}`));
