import apiClient from "./apiClient";
import { GameData } from "../types/gameData";

export const gameHistoryService = {

    getGameHistory: async (): Promise<GameData> => {
        const response = await apiClient.get<GameData>('/user-service/api/user/gamehistory');
        return response.data;
    }
};

// Pobierz historię gier użytkownika
// export async function getUserGameHistory() {
//     const res = await fetchWithAuth(`/user-service/api/user/gamehistory`, {
//         method: 'GET',
//     });
//     if (!res.ok) throw new Error('Nie udało się pobrać historii gier');
//     return res.json();
// }