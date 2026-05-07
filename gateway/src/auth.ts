import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-in-production';

export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Missing or invalid Authorization header' });
        return;
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error(`[AUTH ERROR] JWT Verification failed:`, err.message);
            res.status(403).json({ message: 'Access Denied', error: err.message });
            return;
        }

        // Zgodność ze starą strukturą kauth, aby nie zmieniać reszty kodu proxy
        (req as any).kauth = {
            grant: {
                access_token: {
                    content: decoded
                }
            }
        };

        next();
    });
};
