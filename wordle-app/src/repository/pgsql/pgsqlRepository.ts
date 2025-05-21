import { PrismaClient, User } from './prisma/generated/prisma';

const prisma = new PrismaClient();

export class PgsqlRepository {

  async getTopUsers(limit: number = 10): Promise<User[]> {
    return prisma.user.findMany(
        {
          orderBy: [
            {
              score: 'desc',
            },
            {}
          ],
          take: limit
        }
    );
  }

  async updateUserScore(userId: number, score: number): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { score },
    });
  }

  async getUserById(userId: number): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id: userId },
    });
  }
}
