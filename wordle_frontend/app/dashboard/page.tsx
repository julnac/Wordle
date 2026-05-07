"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/src/components/auth/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Trophy, Flame, BarChart, Gamepad2 } from "lucide-react";
import { getUserStats } from "@/lib/api/stats";
import { UserStats } from "@/src/types/UserStats";

export default function Dashboard() {
    const { profile } = useAuth();
    const [stats, setStats] = useState<UserStats | null>(null);

    useEffect(() => {
        getUserStats()
            .then(setStats)
            .catch(() => null);
    }, []);

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Witaj, {profile?.username ?? "Graczu"}!</h1>
                <p className="text-muted-foreground mt-1">Oto Twoje podsumowanie</p>
            </div>

            {stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                                <Gamepad2 className="w-4 h-4" /> Rozegrane
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-3xl font-bold">{stats.gamesPlayed}</CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                                <Trophy className="w-4 h-4 text-yellow-500" /> Wygrane
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-3xl font-bold">{stats.gamesWon}</CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                                <BarChart className="w-4 h-4 text-blue-500" /> Win rate
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-3xl font-bold">{stats.winRate ?? 0}%</CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                                <Flame className="w-4 h-4 text-red-500" /> Seria
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-3xl font-bold">{stats.currentStreak}</CardContent>
                    </Card>
                </div>
            )}

            <div className="flex gap-4">
                <Button asChild size="lg">
                    <Link href="/dashboard/game">Zagraj teraz</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                    <Link href="/dashboard/stats">Statystyki</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                    <Link href="/dashboard/leaderboard">Tabela wyników</Link>
                </Button>
            </div>
        </div>
    );
}
