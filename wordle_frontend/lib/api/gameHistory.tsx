import { fetchWithAuth } from '@/lib/api/fetchWithAuth';

// Pobierz historię gier użytkownika
export async function getUserGameHistory() {
    const res = await fetchWithAuth(`/user-service/api/user/gamehistory`, {
        method: 'GET',
    });
    if (!res.ok) throw new Error('Nie udało się pobrać historii gier');
    return res.json();
}