import { PrismaClient, Stats } from '@prisma/client';
const prisma = new PrismaClient();

export class StatsRepository {
    async create(data: Omit<Stats, 'id' | 'lastPlayed'>) {
        return prisma.stats.create({ data });
    }

    async findById(id: string) {
        return prisma.stats.findUnique({ where: { id } });
    }

    async findByUserId(userId: string) {
        return prisma.stats.findUnique({ where: { userId } });
    }

    async findAll() {
        return prisma.stats.findMany();
    }

    async update(userId: string, data: Partial<Stats>) {
        return prisma.stats.update({ where: { userId }, data });
    }

    async delete(userId: string) {
        return prisma.stats.delete({ where: { userId } });
    }
}