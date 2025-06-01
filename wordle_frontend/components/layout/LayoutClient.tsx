"use client";

import { KeycloakProvider } from "@/components/auth/KeycloakProvider";
import Navbar from "@/components/layout/Navbar";

export default function LayoutClient({ children }: { children: React.ReactNode }) {
    return (
        <KeycloakProvider>
            <Navbar />
            {children}
        </KeycloakProvider>
    );
}