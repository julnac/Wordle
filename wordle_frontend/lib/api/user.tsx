import { fetchWithAuth } from '@/lib/api/fetchWithAuth';

// Utwórz użytkownika na podstawie danych z Keycloak
export async function createUserFromKeycloak(keycloakId: string, email: string, username: string) {
    const res = await fetchWithAuth(`/user-service/api/user/sync/keycloak`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keycloakId, email, username }),
    });
    if (!res.ok) throw new Error('Nie udało się utworzyć użytkownika');
    return res.json();
}

// Usuń użytkownika na podstawie danych z Keycloak
export async function deleteUserFromKeycloak(keycloakId: string) {
    const res = await fetchWithAuth(`/user-service/api/user/sync/keycloak`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keycloakId }),
    });
    if (!res.ok) throw new Error('Nie udało się usunąć użytkownika');
    return res;
}