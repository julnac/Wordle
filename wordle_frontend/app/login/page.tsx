"use client";

import Link from "next/link";
import { useKeycloak } from "@/components/auth/KeycloakProvider";
import { useRouter } from 'next/navigation';
import { useEffect } from "react";
import { createUserFromKeycloak } from "@/lib/api/user";

export default function Login() {
    const { keycloak, authenticated, profile } = useKeycloak();
    const router = useRouter();

    useEffect(() => {
        if (authenticated && keycloak?.authenticated && profile) {
            // update user info
            createUserFromKeycloak(profile.id, profile.email)
                .catch((err) => {
                    // Obsłuż błąd, np. wyświetl w konsoli
                    console.error("Błąd tworzenia użytkownika:", err);
                });
            console.log("User already authenticated, redirecting...");
            router.push('/dashboard');
        }
    }, [authenticated, keycloak, router]);

    const handleLogin = () => {
        if (keycloak && !keycloak.authenticated) {
            // keycloak.login();
            keycloak.login({ redirectUri: window.location.origin + "/dashboard" });
        }
    };

    const handleLogout = () => {
        if (keycloak && keycloak.authenticated) {
            keycloak.logout({ redirectUri: window.location.origin + '/login' }); // Przekieruj na stronę logowania po wylogowaniu
        }
    };

    const handleRegister = () => {
        if (keycloak) {
            keycloak.register();
        }
    }

    if (!keycloak) {
        return <div>Loading Keycloak...</div>; // Lub inny wskaźnik ładowania
    }

    if (authenticated) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-8 sm:p-20">
                <h1 className="text-3xl font-bold mb-4">Welcome, {profile?.username || 'User'}!</h1>
                <p className="mb-2">You are already logged in.</p>
                {profile?.email && <p className="mb-4 text-sm text-gray-600">Email: {profile.email}</p>}
                {keycloak.hasRealmRole('app_admin') && (
                    <p className="text-green-600 font-semibold mb-4">You have admin privileges.</p>
                )}
                <button
                    onClick={handleLogout}
                    className="rounded-full bg-red-500 text-white py-3 px-6 font-medium hover:bg-red-600 mb-4"
                >
                    Logout
                </button>
                <Link href="/" className="text-blue-500 hover:underline">
                    Go to Homepage
                </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 sm:p-20">
            <h1 className="text-4xl font-bold mb-8">Login or Register</h1>
            {/* Usunęliśmy stary formularz, ponieważ Keycloak obsługuje UI logowania */}
            <div className="flex flex-col gap-4 w-full max-w-xs">
                <button
                    onClick={handleLogin}
                    className="rounded-full bg-blue-500 text-white py-3 px-6 font-medium hover:bg-blue-600"
                >
                    Login with Keycloak
                </button>
                <button
                    onClick={handleRegister}
                    className="rounded-full bg-green-500 text-white py-3 px-6 font-medium hover:bg-green-600"
                >
                    Register with Keycloak
                </button>
            </div>
            <p className="mt-6 text-gray-600">
                Proceed to{" "}
                <Link href="/" className="text-blue-500 hover:underline">
                    Homepage
                </Link>
            </p>
        </div>
    );
}