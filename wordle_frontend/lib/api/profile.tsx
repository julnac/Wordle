import { fetchWithAuth } from '@/lib/api/fetchWithAuth';

// Pobierz profil użytkownika
export async function getUserProfile(userId: string) {
    const res = await fetchWithAuth(`/user-service/api/user/${userId}/profile`, {
        method: 'GET',
    });
    if (!res.ok) throw new Error('Nie udało się pobrać profilu użytkownika');
    return res.json();
}

// Aktualizuj profil użytkownika
export async function updateUserProfile(userId: string, profile: any) {
    const res = await fetchWithAuth(`/user-service/api/user/${userId}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
    });
    if (!res.ok) throw new Error('Nie udało się zaktualizować profilu');
    return res.json();
}