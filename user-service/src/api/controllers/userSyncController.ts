import { UserRepository } from '../../repository/pgsql/userRepository';
import {NextFunction, Request, Response} from 'express';

const repository = new UserRepository();

export const createUserFromKeycloak = async (req: Request, res: Response, next: NextFunction) => {
    const { keycloakId, email } = req.body;
    try {
        const existing = (await repository.findAll()).find(u => u.keycloakId === keycloakId);
        if (existing) {
            res.status(200).json(existing);
            return;
        }
        const user = await repository.create({ keycloakId, email });
        res.status(201).json(user);
    } catch (e) {
        next(e);
    }
};

export const deleteUserFromKeycloak = async (req: Request, res: Response, next: NextFunction) => {
    const { keycloakId } = req.body;
    try {
        const user = await repository.findAll();
        const found = user.find(u => u.keycloakId === keycloakId);
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