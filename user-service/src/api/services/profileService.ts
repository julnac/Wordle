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

    async getAllProfiles() {
        return this.repository.findAll();
    }

    async updateProfile(id: string, data: Partial<Profile>) {
        return this.repository.update(id, data);
    }

    async deleteProfile(id: string) {
        return this.repository.delete(id);
    }
}