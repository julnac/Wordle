import { fetchWithAuth } from '@/lib/api/fetchWithAuth';

export async function getLeaderboard(params?: { language?: string; difficulty?: string; count?: number }) {
    const query = new URLSearchParams();
    if (params?.language) query.append('language', params.language);
    if (params?.difficulty) query.append('difficulty', params.difficulty);
    if (params?.count) query.append('count', params.count.toString());

    const res = await fetchWithAuth(`/game-service/api/leaderboard/?${query.toString()}`, {
        method: "GET",
    });

    if (!res.ok) {
        throw new Error("Nie udało się pobrać rankingu");
    }
    return res.json();
}