import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

const SEED_USERS = [
    {
        username: 'admin',
        email: 'admin@wordle.local',
        password: 'Admin1234!',
    },
    {
        username: 'player1',
        email: 'player1@wordle.local',
        password: 'Player1234!',
    },
    {
        username: 'player2',
        email: 'player2@wordle.local',
        password: 'Player1234!',
    },
];

export async function seed(): Promise<void> {
    for (const u of SEED_USERS) {
        const exists = await prisma.user.findUnique({ where: { email: u.email } });
        if (exists) continue;

        const hashed = await bcrypt.hash(u.password, 10);
        await prisma.user.create({
            data: {
                id: randomUUID(),
                email: u.email,
                username: u.username,
                password: hashed,
                profile: {
                    create: {
                        img: 'default-profile.png',
                        bio: 'Hello, I am a new player!',
                    },
                },
                stats: { create: {} },
            },
        });
        console.log(`[SEED] Created user: ${u.username} (${u.email})`);
    }
}
