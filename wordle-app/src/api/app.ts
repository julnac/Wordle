import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import express, { Application, Request, Response, NextFunction } from 'express';
import session from 'express-session';
import { sessionConfig, keycloak } from '../../keycloak-config.js';

import gameRoutes from './routes/gameRoutes';
import statsRoutes from './routes/statsRoutes';
import leaderboardRoutes from './routes/leaderboardRoutes';
import dictionaryRoutes from './routes/dictionaryRoutes';
import connectMongoDB from '../repository/mongo/mongodb';
import connectRedis from '../repository/redis/redis';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';


const app: Application = express();
const PORT: number = Number(process.env.PORT) || 5000;


// Middleware to parse JSON
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5000'],
  credentials: true // jeśli korzystasz z ciasteczek/sesji
}));

// Inicjalizacja sesji (przed middleware Keycloak)
app.use(session(sessionConfig));

// Inicjalizacja middleware Keycloak
// Upewnij się, że logout i admin path są poprawne lub usuń je, jeśli nie są potrzebne
app.use(keycloak.middleware({
  logout: '/logout',
  admin: '/'
}));

// Interfejs dla rozszerzonego obiektu Request
interface AuthenticatedRequest extends Request {
  kauth?: any; // Dodajemy kauth, aby TypeScript nie zgłaszał błędu
}

// Routes
// app.use('/api/auth', authRoutes);
app.use('/api/game', keycloak.protect(), gameRoutes);
app.use('/api/stats', keycloak.protect(), statsRoutes);
app.use('/api/dictionary', keycloak.protect('realm:app-admin'), dictionaryRoutes);
app.use('/api/leaderboard', keycloak.protect(), leaderboardRoutes);

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