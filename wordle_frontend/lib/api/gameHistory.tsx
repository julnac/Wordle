import { fetchWithAuth } from '@/lib/api/fetchWithAuth';

// Zaktualizuj historię gier użytkownika
export async function updateUserGameHistory(userId: string, gameData: any) {
    const res = await fetchWithAuth(`/user-service/api/user/${userId}/gamehistory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gameData),
    });
    if (!res.ok) throw new Error('Nie udało się zaktualizować historii gier');
    return res;
}

// Pobierz historię gier użytkownika
export async function getUserGameHistory(userId: string) {
    const res = await fetchWithAuth(`/user-service/api/user/${userId}/gamehistory`, {
        method: 'GET',
    });
    if (!res.ok) throw new Error('Nie udało się pobrać historii gier');
    return res.json();
}