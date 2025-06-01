import keycloakInstance from '@/lib/api/auth/keycloak';

export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
    if (!keycloakInstance || !keycloakInstance.authenticated) {
        console.warn('User not authenticated or Keycloak not initialized. Redirecting to login.');
        // Możesz zdecydować o przekierowaniu lub rzuceniu błędu
        if (keycloakInstance) keycloakInstance.login();
        throw new Error('User not authenticated');
    }

    try {
        // Odśwież token jeśli jest bliski wygaśnięcia (np. 30 sekund)
        // updateToken zwraca promise, który rozwiązuje się, gdy token jest ważny
        await keycloakInstance.updateToken(30);
    } catch (error) {
        console.error('Failed to refresh token or user is not authenticated', error);
        // Możesz tutaj przekierować do logowania: keycloakInstance.login();
        // lub rzucić błąd dalej
        keycloakInstance.login(); // Wymuś ponowne logowanie
        throw new Error('Failed to refresh token');
    }

    const headers = new Headers(options.headers || {});
    if (keycloakInstance.token) {
        headers.set('Authorization', `Bearer ${keycloakInstance.token}`);
    }

    // Zakładamy, że URL jest względny do API backendu
    // Jeśli backend jest na innym porcie/domenie, musisz podać pełny URL
    // np. const backendApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    // const fullUrl = `${backendApiUrl}${url}`;
    const backendApiUrl = 'http://localhost:5000/api';
    const fullUrl = `${backendApiUrl}${url}`;

    return fetch(fullUrl, { ...options, headers });
}

// Przykład użycia w komponencie:
// "use client";
// import { useEffect, useState } from 'react';
// import { fetchWithAuth } from '../lib/fetchWithAuth';
//
// function MyComponent() {
//   const [data, setData] = useState(null);
//   useEffect(() => {
//     fetchWithAuth('/game/new', { method: 'POST' }) // Endpoint na Twoim backendzie
//       .then(res => {
//         if (!res.ok) throw new Error('Network response was not ok');
//         return res.json();
//       })
//       .then(setData)
//       .catch(err => console.error("API call failed:", err));
//   }, []);
//   return <div>{data ? JSON.stringify(data) : 'Loading...'}</div>;
// }