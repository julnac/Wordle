"use client";

import { useEffect } from "react";
import { useAuth } from "@/src/components/auth/AuthProvider";

export default function LogoutPage() {
    const { logout } = useAuth();

    useEffect(() => {
        logout();
    }, [logout]);

    return (
        <div className="flex h-screen items-center justify-center">
            <p>Wylogowywanie...</p>
        </div>
    );
}
