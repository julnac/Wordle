import { fetchWithAuth } from '@/lib/api/fetchWithAuth';

// Pobierz profil użytkownika
export async function getUserProfile() {
    const res = await fetchWithAuth(`/user-service/api/user/profile`, {
        method: 'GET',
    });
    if (!res.ok) throw new Error('Nie udało się pobrać profilu użytkownika');
    return res.json();
}

// Aktualizuj profil użytkownika
export async function updateUserProfile(profile: any) {
    const res = await fetchWithAuth(`/user-service/api/user/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
    });
    if (!res.ok) throw new Error('Nie udało się zaktualizować profilu');
    return res.json();
}