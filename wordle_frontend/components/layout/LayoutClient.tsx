"use client";

import { KeycloakProvider } from "@/components/auth/KeycloakProvider";
import Navbar from "@/components/layout/Navbar";
import { useEffect, useState } from "react";

export default function LayoutClient({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    if (!mounted) return null;

    return (
        <KeycloakProvider>
            <Navbar />
            {children}
        </KeycloakProvider>
    );
}