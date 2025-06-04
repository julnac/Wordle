import { PrismaClient, Profile } from '@prisma/client';
const prisma = new PrismaClient();

export class ProfileRepository {
    async create(data: Omit<Profile, 'id'>) {
        return prisma.profile.create({ data });
    }

    async findById(id: string) {
        return prisma.profile.findUnique({ where: { id } });
    }

    async findAll() {
        return prisma.profile.findMany();
    }

    async update(id: string, data: Partial<Profile>) {
        return prisma.profile.update({ where: { id }, data });
    }

    async delete(id: string) {
        return prisma.profile.delete({ where: { id } });
    }
}