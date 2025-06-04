import { fetchWithAuth } from '@/lib/api/fetchWithAuth';

// Pobierz nagrody użytkownika
export async function getUserRewards(userId: string) {
    const res = await fetchWithAuth(`/user-service/api/user/${userId}/rewards`, {
        method: 'GET',
    });
    if (!res.ok) throw new Error('Nie udało się pobrać nagród');
    return res.json();
}