import { fetchWithAuth } from '@/lib/fetchWithAuth';

export async function startGame(userId: string, options: {
    attemptsAllowed: number;
    wordLength: number;
    language: string;
    level: string;
}) {
    const res = await fetchWithAuth(`/game/start/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(options),
    });

    if (!res.ok) {
        throw new Error("Nie udało się rozpocząć gry");
    }
    return res.json();
}

export async function guessWord(gameId: string, guess: string) {
    const res = await fetchWithAuth(`/game/guess/${gameId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guess }),
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Nie udało się wysłać próby");
    }
    return res.json();
}

export async function getGameStatus(gameId: string) {
    const res = await fetchWithAuth(`/game/status/${gameId}`, {
        method: "GET",
    });

    if (!res.ok) {
        throw new Error("Nie udało się pobrać statusu gry");
    }
    return res.json();
}

export async function getCurrentGame(userId: string) {
    const res = await fetchWithAuth(`/game/current/${userId}`, {
        method: "GET",
    });

    if (!res.ok) {
        throw new Error("Nie udało się pobrać bieżącej gry");
    }
    return res.json();
}
