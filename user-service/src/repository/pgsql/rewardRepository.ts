import { PrismaClient, Reward } from '@prisma/client';
const prisma = new PrismaClient();

export class RewardRepository {
    async create(data: Omit<Reward, 'id' | 'earnedAt'>) {
        return prisma.reward.create({ data });
    }

    async findById(id: string) {
        return prisma.reward.findUnique({ where: { id } });
    }

    async findByUserId(userId: string) {
        return prisma.reward.findMany({ where: { userId } });
    }

    async findAll() {
        return prisma.reward.findMany();
    }

    async update(id: string, data: Partial<Reward>) {
        return prisma.reward.update({ where: { id }, data });
    }

    async delete(id: string) {
        return prisma.reward.delete({ where: { id } });
    }
}