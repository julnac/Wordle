import { fetchWithAuth } from '@/lib/fetchWithAuth';

export async function getLeaderboard(params?: { language?: string; difficulty?: string; count?: number }) {
    const query = new URLSearchParams();
    if (params?.language) query.append('language', params.language);
    if (params?.difficulty) query.append('difficulty', params.difficulty);
    if (params?.count) query.append('count', params.count.toString());

    const res = await fetchWithAuth(`/leaderboard/?${query.toString()}`, {
        method: "GET",
    });

    if (!res.ok) {
        throw new Error("Nie udało się pobrać rankingu");
    }
    return res.json();
}

export async function addScoreToLeaderboard(game: {
    id: string;
    language: string;
    level: string;
    status: string;
    endTime: number;
    startTime?: number;
}) {
    const res = await fetchWithAuth(`/leaderboard/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(game),
    });

    if (!res.ok) {
        throw new Error("Nie udało się dodać wyniku do rankingu");
    }
    return res.json();
}