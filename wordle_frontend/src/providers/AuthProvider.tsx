"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface AuthUser {
    id: string;
    email: string;
    username: string;
}

interface AuthContextType {
    authenticated: boolean;
    profile: AuthUser | null;
    loading: boolean;
    login: (token: string, user: AuthUser) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    authenticated: false,
    profile: null,
    loading: true,
    login: () => {},
    logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

function decodeJwtPayload(token: string): { exp?: number } | null {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch {
        return null;
    }
}

function isTokenValid(token: string): boolean {
    const payload = decodeJwtPayload(token);
    if (!payload?.exp) return false;
    return payload.exp > Date.now() / 1000;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [authenticated, setAuthenticated] = useState(false);
    const [profile, setProfile] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const login = useCallback((token: string, user: AuthUser) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setAuthenticated(true);
        setProfile(user);
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setAuthenticated(false);
        setProfile(null);
        router.push('/login');
    }, [router]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');

        if (!token || !isTokenValid(token)) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setLoading(false);
            return;
        }

        if (userStr) {
            try {
                setProfile(JSON.parse(userStr));
                setAuthenticated(true);
            } catch {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);

    return (
        <AuthContext.Provider value={{ authenticated, profile, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
