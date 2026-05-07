import apiClient from "./apiClient";
import { Stats } from "../types/stats";

export const userStatsService = {

    getUserStats: async (): Promise<Stats> => {
        const response = await apiClient.get<Stats>('/user-service/api/user/stats');
        return response.data;
    }
};