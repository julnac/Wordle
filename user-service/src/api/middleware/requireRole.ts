import { Request, Response, NextFunction } from 'express';

const requireRole = (role: string) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user || !Array.isArray(req.user.roles)) {
            res.status(403).json({ message: 'Brak informacji o rolach użytkownika' });
            return;
        }

        if (!req.user.roles.includes(role)) {
            res.status(403).json({ message: `Wymagana rola: ${role}` });
            return;
        }

        next();
    };
};

export default requireRole;
