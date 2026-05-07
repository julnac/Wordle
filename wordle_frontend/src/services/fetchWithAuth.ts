export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    if (!token && typeof window !== 'undefined') {
        console.warn('User not authenticated. Redirecting to login.');
        window.location.href = '/login';
        throw new Error('User not authenticated');
    }

    const headers = new Headers(options.headers || {});
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    const backendApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const fullUrl = `${backendApiUrl}${url}`;

    const res = await fetch(fullUrl, { ...options, headers, credentials: "include" });

    // Jeśli token wygasł (np. 401 lub 403 z określonym komunikatem), wyloguj użytkownika
    if (res.status === 401 || res.status === 403) {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
    }

    return res;
}