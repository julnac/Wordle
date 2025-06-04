import { PrismaClient, User } from '@prisma/client';
const prisma = new PrismaClient();

export class UserRepository {
    async create(data: Omit<User, 'id' | 'createdAt'>) {
        return prisma.user.create({ data });
    }

    async findById(id: string) {
        return prisma.user.findUnique({ where: { id } });
    }

    async findByKeycloakId(keycloakId: string) {
        return prisma.user.findUnique({ where: { keycloakId } });
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