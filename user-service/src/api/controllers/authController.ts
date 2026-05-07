import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-in-production';

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, username, password } = req.body;

        if (!email || !username || !password) {
            res.status(400).json({ message: 'Email, username, and password are required' });
            return;
        }

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { username }
                ]
            }
        });

        if (existingUser) {
            res.status(400).json({ message: 'User with this email or username already exists' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUserId = randomUUID();

        const newUser = await prisma.user.create({
            data: {
                id: newUserId,
                email,
                username,
                password: hashedPassword,
                profile: {
                    create: {
                        img: 'default-profile.png',
                        bio: 'Hello, I am a new player!'
                    }
                },
                stats: {
                    create: {}
                }
            }
        });

        const token = jwt.sign(
            { 
                sub: newUser.id,
                preferred_username: newUser.username,
                email: newUser.email,
                realm_access: { roles: ['user'] }
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({ token, user: { id: newUser.id, email: newUser.email, username: newUser.username } });
    } catch (error: any) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ message: 'Email and password are required' });
            return;
        }

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user || !user.password) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        const token = jwt.sign(
            { 
                sub: user.id,
                preferred_username: user.username,
                email: user.email,
                realm_access: { roles: ['user'] }
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({ token, user: { id: user.id, email: user.email, username: user.username } });
    } catch (error: any) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};
