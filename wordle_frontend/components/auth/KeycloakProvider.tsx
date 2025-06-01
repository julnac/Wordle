"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import keycloakInstance from '@/lib/api/auth/keycloak';

interface KeycloakContextProps {
    keycloak: typeof keycloakInstance | null;
    authenticated: boolean;
    profile: any | null;
}

const KeycloakContext = createContext<KeycloakContextProps | undefined>(undefined);

export const useKeycloak = () => {
    const context = useContext(KeycloakContext);
    if (!context) {
        throw new Error('useKeycloak must be used within a KeycloakProvider');
    }
    return context;
};

interface KeycloakProviderProps {
    children: ReactNode;
    onEvent?: (eventType: string, error?: Error) => void;
}

export const KeycloakProvider: React.FC<KeycloakProviderProps> = ({ children, onEvent }) => {
    const [authenticated, setAuthenticated] = useState(false);
    const [profile, setProfile] = useState<any | null>(null);

    useEffect(() => {
        if (typeof window === "undefined" || !keycloakInstance) return;

        if (keycloakInstance.authenticated !== undefined) {
            // Już zainicjalizowany, nie inicjalizuj ponownie
            return;
        }

        if (!keycloakInstance) {
            console.warn("Keycloak instance is not available (likely server-side).");
            return;
        }

        keycloakInstance.onAuthSuccess = () => {
            setAuthenticated(true);
            keycloakInstance?.loadUserProfile()
                .then(setProfile)
                .catch(err => console.error("Failed to load profile", err));
            if (onEvent) onEvent('onAuthSuccess');
        };
        keycloakInstance.onAuthError = (errorData) => {
            setAuthenticated(false);
            setProfile(null);
            if (onEvent) onEvent('onAuthError', new Error(JSON.stringify(errorData)));
        };
        keycloakInstance.onAuthRefreshSuccess = () => {
            if (onEvent) onEvent('onAuthRefreshSuccess');
        };
        keycloakInstance.onAuthRefreshError = () => {
            setAuthenticated(false);
            setProfile(null);
            if (onEvent) onEvent('onAuthRefreshError');
        };
        keycloakInstance.onAuthLogout = () => {
            setAuthenticated(false);
            setProfile(null);
            if (onEvent) onEvent('onAuthLogout');
        };
        keycloakInstance.onTokenExpired = () => {
            keycloakInstance?.updateToken(30)
                .catch(() => {
                    keycloakInstance?.logout();
                });
            if (onEvent) onEvent('onTokenExpired');
        };

        keycloakInstance.init({
            onLoad: 'check-sso',
            silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html'
        })
            .then(auth => {
                setAuthenticated(auth);
                if (auth) {
                    keycloakInstance?.loadUserProfile()
                        .then(setProfile)
                        .catch(err => console.error("Failed to load profile on init", err));
                }
            })
            .catch(() => {
                setAuthenticated(false);
            });

    }, [onEvent]);

    return (
        <KeycloakContext.Provider value={{ keycloak: keycloakInstance, authenticated, profile }}>
            {children}
        </KeycloakContext.Provider>
    );
};