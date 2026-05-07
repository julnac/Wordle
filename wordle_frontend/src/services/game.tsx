import apiClient from "./apiClient";
import{ StartGameRequest, GameData } from '../types/gameData';

export const gameService = {

    startGame: async (options: StartGameRequest): Promise<GameData> => {
        const response = await apiClient.post<GameData>('/game-service/api/game/start', options);
        return response.data;
    },

    guessWord: async (gameId: string, guess: string): Promise<GameData> => {
        const response = await apiClient.post<GameData>(`/game-service/api/game/guess/${gameId}`, { guess });
        return response.data;
    },

    getGameStatus: async (gameId: string): Promise<GameData> => {
        const response = await apiClient.get<GameData>(`/game-service/api/game/status/${gameId}`);
        return response.data;
    },

    getCurrentGame: async (): Promise<GameData> => {
        const response = await apiClient.get<GameData>(`/game-service/api/game/current`);
        return response.data;
    },

};