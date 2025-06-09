import { PrismaClient, User } from '@prisma/client';
const prisma = new PrismaClient();

export class UserRepository {

    async create (data: { id: string; email: string; username: string }) {
        const user = await prisma.user.create({data});

        await prisma.profile.create({
            data: {
                userId: user.id,
                img: '',
                bio: '',
            }
        })

        await prisma.stats.create({
            data: {
                userId: user.id,
            }
        });

        return user;
    }

    async findById(id: string) {
        return prisma.user.findUnique({ where: { id } });
    }

    async findAll() {
        return prisma.user.findMany();
    }

    async update(id: string, data: Partial<User>) {
        return prisma.user.update({ where: { id }, data });
    }

    async delete(id: string) {
        return prisma.user.delete({ where: { id } });
    }
}