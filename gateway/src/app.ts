import dotenv from 'dotenv';
dotenv.config();

import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import session from 'express-session';
import { sessionConfig, keycloak } from '../keycloak-config.js';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import proxy from 'express-http-proxy';


const app: Application = express();
const PORT: number = Number(process.env.PORT) || 5000;

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
app.get('/api/profile', (req: AuthenticatedRequest, res: Response) => {
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

// app.use('/user-service', keycloak.protect(), proxy('http://localhost:5001'));
// app.use('/game-service', keycloak.protect(), proxy('http://localhost:5002'));
// Middleware diagnostyczny — loguje nagłówek Authorization
app.use((req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers['authorization'];
    if (auth) {
        const tokenPreview = auth.substring(0, 40) + '...';
        console.log(`[AUTH] ${req.method} ${req.path} | token: ${tokenPreview}`);
    } else {
        console.log(`[AUTH] ${req.method} ${req.path} | NO TOKEN`);
    }
    next();
});

app.use('/user-service', keycloak.protect(), proxy(process.env.USER_SERVICE_URL || 'http://localhost:5001', {
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
        const userInfo = (srcReq as AuthenticatedRequest).kauth?.grant?.access_token?.content;

        // Upewnij się, że headers istnieje i jest typu Record<string, string>
        if (!proxyReqOpts.headers || Array.isArray(proxyReqOpts.headers)) {
            proxyReqOpts.headers = {};
        }
        const headers = proxyReqOpts.headers as Record<string, string>;

        if (userInfo) {
            headers['x-user-id'] = userInfo.sub;
            headers['x-username'] = userInfo.preferred_username;
            headers['x-email'] = userInfo.email;
            headers['x-roles'] = userInfo.realm_access?.roles?.join(',') ?? '';
        }

        return proxyReqOpts;
    }
}));
app.use('/game-service', keycloak.protect(), proxy(process.env.GAME_SERVICE_URL || 'http://localhost:5002', {
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
        const userInfo = (srcReq as AuthenticatedRequest).kauth?.grant?.access_token?.content;

        // Upewnij się, że headers istnieje i jest typu Record<string, string>
        if (!proxyReqOpts.headers || Array.isArray(proxyReqOpts.headers)) {
            proxyReqOpts.headers = {};
        }
        const headers = proxyReqOpts.headers as Record<string, string>;

        if (userInfo) {
            headers['x-user-id'] = userInfo.sub;
            headers['x-username'] = userInfo.preferred_username;
            headers['x-email'] = userInfo.email;
            headers['x-roles'] = userInfo.realm_access?.roles?.join(',') ?? '';
        }

        return proxyReqOpts;
    }
    // userResHeaderDecorator: (headers, userReq, userRes, proxyReq, proxyRes) => {
    //     headers['access-control-allow-origin'] = userReq.headers.origin || 'http://localhost:3000';
    //     headers['access-control-allow-credentials'] = 'true';
    //     // Dodaj inne nagłówki CORS jeśli potrzebujesz
    //     return headers;
    // }
}));

// app.use('/game-service', keycloak.protect(), proxy('http://localhost:5002', {
//     proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
//         const userInfo = (srcReq as AuthenticatedRequest).kauth?.grant?.access_token?.content;
//
//         if (userInfo) {
//             proxyReqOpts.headers['x-user-id'] = userInfo.sub;
//             proxyReqOpts.headers['x-username'] = userInfo.preferred_username;
//             proxyReqOpts.headers['x-email'] = userInfo.email;
//             proxyReqOpts.headers['x-roles'] = userInfo.realm_access?.roles?.join(',') ?? '';
//         }
//
//         return proxyReqOpts;
//     }
// }));

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
                    openIdConnectUrl: 'http://keycloak:8080/realms/wordle-app-realm/.well-known/openid-configuration'
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
