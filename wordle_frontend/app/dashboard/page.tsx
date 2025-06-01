"use client";

import { useKeycloak } from "@/components/auth/KeycloakProvider";

export default function Dashboard() {
    const { authenticated, profile } = useKeycloak();

    if (!authenticated) {
        // Możesz przekierować na login lub wyświetlić komunikat
        return <div>Musisz być zalogowany, aby zobaczyć dashboard.</div>;
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <p>Witaj, {profile?.username}!</p>
            {/* Tutaj dodaj zawartość dashboardu */}
        </div>
    );
}