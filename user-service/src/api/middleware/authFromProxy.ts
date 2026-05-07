import { Request, Response, NextFunction } from 'express';

export interface UserInfo {
    userId: string;
    roles: string[];
}

// Rozszerzamy Request, aby dodać `user`
declare global {
    namespace Express {
        interface Request {
            user?: UserInfo;
        }
    }
}

const AUTH_PUBLIC_PATHS = ['/api/user/auth/login', '/api/user/auth/register', '/api-docs', '/openapi.json'];

const authFromProxy = (req: Request, res: Response, next: NextFunction): void => {
    if (AUTH_PUBLIC_PATHS.includes(req.path)) {
        return next();
    }

    const userId = req.header('x-user-id');
    const rolesHeader = req.header('x-roles');
    const isInternal = req.header('x-internal-service') === 'true';

    if (isInternal) {
        return next();
    }

    if (!userId || !rolesHeader) {
        res.status(401).json({ message: 'Brak danych uwierzytelniających od proxy' });
        return;
    }

    req.user = {
        userId,
        roles: rolesHeader.split(','),
    };

    next();
};

export default authFromProxy;
