"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart, Trophy, Flame, Calendar, Timer } from "lucide-react";
import { getUserStats } from "@/lib/api/stats";
import { useKeycloak } from "@/components/auth/KeycloakProvider";

type UserStats = {
    playerId: string;
    gamesPlayed: number;
    gamesWon: number;
    winRate: number;
    lastPlayed: string;
    currentStreak: number;
    maxStreak: number;
    averageTries: number;
};

export default function Stats() {
    const { profile, authenticated } = useKeycloak();
    const [stats, setStats] = useState<UserStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!profile?.id) return;
        setLoading(true);
        getUserStats(profile.id)
            .then(data => {
                setStats(data);
                setError(null);
            })
            .catch(() => setError("Nie udało się pobrać statystyk"))
            .finally(() => setLoading(false));
    }, [profile?.id]);

    if (!authenticated) {
        return <div>Musisz być zalogowany, aby zobaczyć statystyki.</div>;
    }
    if (loading) {
        return <div>Ładowanie statystyk...</div>;
    }
    if (error) {
        return <div className="text-red-500">{error}</div>;
    }
    if (!stats) {
        return <div>Brak statystyk do wyświetlenia.</div>;
    }

    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-500" />
                        Games Played
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-3xl font-bold">{stats.gamesPlayed}</CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-green-500" />
                        Games Won
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-3xl font-bold">{stats.gamesWon}</CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BarChart className="w-5 h-5 text-blue-500" />
                        Win Rate
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Progress value={stats.winRate} />
                    <div className="text-right mt-1 text-sm text-muted-foreground">{stats.winRate}%</div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Flame className="w-5 h-5 text-red-500" />
                        Streak
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex justify-between text-lg">
                    <div>
                        <div className="font-semibold">Current</div>
                        <div>{stats.currentStreak}</div>
                    </div>
                    <div>
                        <div className="font-semibold">Max</div>
                        <div>{stats.maxStreak}</div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Timer className="w-5 h-5 text-purple-500" />
                        Avg Tries
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-3xl font-bold">{stats.averageTries?.toFixed(2)}</CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-gray-500" />
                        Last Played
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-lg">
                    {stats.lastPlayed ? new Date(stats.lastPlayed).toLocaleDateString() : "-"}
                </CardContent>
            </Card>
        </div>
    );
}