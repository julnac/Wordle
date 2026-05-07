import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from './authFromProxy';

const requireRole = (role: string) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const authReq = req as AuthRequest;
        if (!authReq.user || !Array.isArray(authReq.user.roles)) {
            res.status(403).json({ message: 'Brak informacji o rolach użytkownika' });
            return;
        }

        if (!authReq.user.roles.includes(role)) {
            res.status(403).json({ message: `Wymagana rola: ${role}` });
            return;
        }

        next();
    };
};

export default requireRole;
