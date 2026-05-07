import { fetchWithAuth } from '@/lib/api/fetchWithAuth';

// Pobierz statystyki użytkownika
export async function getUserStats() {
    const res = await fetchWithAuth(`/user-service/api/user/stats`, {
        method: 'GET',
    });
    if (!res.ok) throw new Error('Nie udało się pobrać statystyk');
    return res.json();
}