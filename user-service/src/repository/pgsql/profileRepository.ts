import { PrismaClient, Profile } from '@prisma/client';
const prisma = new PrismaClient();

export class ProfileRepository {
    async create(data: Omit<Profile, 'id'>) {
        return prisma.profile.create({ data });
    }

    async findById(id: string) {
        return prisma.profile.findUnique({ where: { id } });
    }

    async findByUserId(userId: string) {
        return prisma.profile.findUnique({ where: { userId } });
    }

    async findAll() {
        return prisma.profile.findMany();
    }

    async update(userId: string, data: Partial<Profile>) {
        return prisma.profile.update({ where: { userId }, data });
    }

    async delete(userId: string) {
        return prisma.profile.delete({ where: { userId } });
    }
}