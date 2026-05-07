import dotenv from 'dotenv';
dotenv.config();

import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import proxy from 'express-http-proxy';
import { requireAuth } from './auth';

const conditionalAuth = (req: Request, res: Response, next: NextFunction) => {
    if (req.originalUrl.includes('/user-service/api/user/auth/')) {
        return next();
    }
    return requireAuth(req, res, next);
};

const app: Application = express();
const PORT: number = Number(process.env.PORT) || 5000;

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

interface AuthenticatedRequest extends Request {
    kauth?: any;
}

app.get('/api/profile', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    const userInfo = req.kauth?.grant?.access_token?.content;
    if (userInfo) {
        res.json({
            username: userInfo.preferred_username,
            email: userInfo.email,
            roles: userInfo.realm_access?.roles,
        });
    } else {
        res.status(401).json({ message: 'User not authenticated' });
    }
});

app.use((req: Request, _res: Response, next: NextFunction) => {
    const auth = req.headers['authorization'];
    if (auth) {
        const tokenPreview = auth.substring(0, 40) + '...';
        console.log(`[AUTH] ${req.method} ${req.path} | token: ${tokenPreview}`);
        try {
            const tokenStr = auth.startsWith('Bearer ') ? auth.split(' ')[1] : auth;
            const payload = JSON.parse(Buffer.from(tokenStr.split('.')[1], 'base64').toString('utf8'));
            console.log(`[AUTH DEBUG] sub: ${payload.sub}, preferred_username: ${payload.preferred_username}`);
        } catch (e) {
            console.log('[AUTH DEBUG] Could not parse token payload');
        }
    } else {
        console.log(`[AUTH] ${req.method} ${req.path} | NO TOKEN`);
    }
    next();
});

app.use('/user-service', conditionalAuth, proxy(process.env.USER_SERVICE_URL || 'http://localhost:5001', {
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
        const userInfo = (srcReq as AuthenticatedRequest).kauth?.grant?.access_token?.content;

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

app.use('/game-service', requireAuth, proxy(process.env.GAME_SERVICE_URL || 'http://localhost:5002', {
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
        const userInfo = (srcReq as AuthenticatedRequest).kauth?.grant?.access_token?.content;

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

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Wordle API',
            version: '1.0.0',
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            }
        },
        security: [{ bearerAuth: [] }]
    },
    apis: ['./src/routes/*.ts'],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(PORT, () => console.log(`Gateway on port ${PORT}`));
