import { PrismaClient, Prisma } from '@prisma/client';
const prisma = new PrismaClient();

export class GameHistoryRepository {
    async create(data: Prisma.GameHistoryCreateInput) {
        return prisma.gameHistory.create({ data });
    }

    async findById(id: string) {
        return prisma.gameHistory.findUnique({ where: { id } });
    }

    async findAll() {
        return prisma.gameHistory.findMany();
    }

    async findByUserId(userId: string) {
        return prisma.gameHistory.findMany({ where: { userId } });
    }

    async update(id: string, data: Prisma.GameHistoryUpdateInput) {
        return prisma.gameHistory.update({ where: { id }, data });
    }

    async delete(id: string) {
        return prisma.gameHistory.delete({ where: { id } });
    }
}