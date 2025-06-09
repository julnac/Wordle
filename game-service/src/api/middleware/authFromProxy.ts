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

const authFromProxy = (req: Request, res: Response, next: NextFunction): void => {
    const userId = req.header('x-user-id');
    const rolesHeader = req.header('x-roles');
    // console.log('Nagłówki przychodzące z proxy:', req.headers);

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
