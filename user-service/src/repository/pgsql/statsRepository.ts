import { PrismaClient, Stats } from '@prisma/client';
const prisma = new PrismaClient();

export class StatsRepository {
    async create(data: Omit<Stats, 'id' | 'lastPlayed'>) {
        return prisma.stats.create({ data });
    }

    async findById(id: string) {
        return prisma.stats.findUnique({ where: { id } });
    }

    async findAll() {
        return prisma.stats.findMany();
    }

    async update(id: string, data: Partial<Stats>) {
        return prisma.stats.update({ where: { id }, data });
    }

    async delete(id: string) {
        return prisma.stats.delete({ where: { id } });
    }
}