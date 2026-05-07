import apiClient from "./apiClient";
import { Reward } from '../types/reward';

export const RewardsService = {

    getRewards: async (): Promise<Reward[]> => {
        const response = await apiClient.get<Reward[]>('/user-service/api/user/rewards');
        return response.data;
    }
};