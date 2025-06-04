import { ProfileRepository } from '../../repository/pgsql/profileRepository';
import { Profile } from '@prisma/client';

export class ProfileService {
    private repository: ProfileRepository;

    constructor() {
        this.repository = new ProfileRepository();
    }

    async createProfile(data: Omit<Profile, 'id'>) {
        return this.repository.create(data);
    }

    async getProfileById(id: string) {
        return this.repository.findById(id);
    }

    async getProfileByUserId(userId: string) {
        return this.repository.findByUserId(userId);
    }

    async getAllProfiles() {
        return this.repository.findAll();
    }

    async updateProfile(userId: string, data: Partial<Profile>) {
        return this.repository.update(userId, data);
    }

    async deleteProfile(userId: string) {
        return this.repository.delete(userId);
    }
}