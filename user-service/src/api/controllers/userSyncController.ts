import { UserRepository } from '../../repository/pgsql/userRepository';
import {NextFunction, Request, Response} from 'express';

interface User {
    email: string
    username: string
    id: string
    createdAt: Date
}

const repository = new UserRepository();
export const createUserFromKeycloak = async (req: Request, res: Response, next: NextFunction) => {
    const { keycloakId, email, username } = req.body;
    try {
        const users: User[] = await repository.findAll();
        const existing = users.find(u => u.id === keycloakId);
        if (existing) {
            res.status(200).json(existing);
            return;
        }
        const user = await repository.create({ id:keycloakId, email, username });
        res.status(201).json(user);
    } catch (e) {
        next(e);
    }
};

export const deleteUserFromKeycloak = async (req: Request, res: Response, next: NextFunction) => {
    const { keycloakId } = req.body;
    try {
        const users: User[] = await repository.findAll();
        const found = users.find(u => u.id === keycloakId);
        if (!found) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        await repository.delete(found.id);
        res.status(204).send();
    } catch (e) {
        next(e);
    }
};

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await repository.findAll();
        res.status(200).json(users);
    } catch (e) {
        next(e);
    }
}

export const checkUserExists = async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    try {
        console.log('Checking user existence for ID:', userId);
        const user = await repository.findById(userId);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.status(200).json(user);
    } catch (e) {
        next(e);
    }
}