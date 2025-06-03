import { fetchWithAuth } from '@/lib/fetchWithAuth';

export async function getUserStats(userId: string) {
    const res = await fetchWithAuth(`/stats/${userId}`, {
        method: "GET",
    });

    if (!res.ok) {
        throw new Error("Nie udało się pobrać statystyk gracza");
    }
    return res.json();
}

export async function updateUserStats(game: any) {
    const res = await fetchWithAuth(`/stats`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ game }),
    });

    if (!res.ok) {
        throw new Error("Nie udało się zaktualizować statystyk gracza");
    }
    return res.json();
}