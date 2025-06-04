import { fetchWithAuth } from '@/lib/api/fetchWithAuth';

// Pobierz statystyki użytkownika
export async function getUserStats(userId: string) {
    const res = await fetchWithAuth(`/user-service/api/user/${userId}/stats`, {
        method: 'GET',
    });
    if (!res.ok) throw new Error('Nie udało się pobrać statystyk');
    return res.json();
}