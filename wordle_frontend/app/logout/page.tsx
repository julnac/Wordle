"use client";

import { useEffect } from "react";
import { useKeycloak } from "@/components/auth/KeycloakProvider";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
    const { keycloak, authenticated } = useKeycloak();
    const router = useRouter();

    useEffect(() => {
        if (keycloak && authenticated) {
            keycloak.logout({ redirectUri: window.location.origin + "/" });
        } else {
            router.replace("/login");
        }
    }, [keycloak, authenticated, router]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <p className="text-lg">Wylogowywanie...</p>
        </div>
    );
}