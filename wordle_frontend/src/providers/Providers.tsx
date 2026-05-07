"use client";

import { AuthProvider } from "@/src/providers/AuthProvider";

export function Providers({ children }: { children: React.ReactNode }) {
    return <AuthProvider>{children}</AuthProvider>;
}
