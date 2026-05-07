"use client";

import { useEffect, useState } from "react";
import { Input } from "@/src/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/src/components/ui/card";
import { Label } from "@/src/components/ui/label";
import { LeaderboardService } from "@/src/services/leaderboard";
import { Loader2 } from "lucide-react";
import { LeaderboardItem } from "@/src/types/leaderboard";


const languages = ["pl", "en", "es", "de", "fr"];
const difficulties = ["easy", "medium", "hard"];

export default function LeaderboardPage() {
    const [entries, setEntries] = useState<LeaderboardItem[]>([]);
    const [language, setLanguage] = useState<string | undefined>("pl");
    const [difficulty, setDifficulty] = useState<string | undefined>("medium");
    const [count, setCount] = useState<number>(10);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await LeaderboardService.getLeaderboard({ language, difficulty, count });
            setEntries(data);
        } catch (e) {
            console.error("Failed to fetch leaderboard", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [language, difficulty, count]);

    return (
        <Card className="p-6 max-w-5xl mx-auto mt-8">
            <CardHeader>
                <CardTitle className="text-2xl">🏆 Leaderboard</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <Label>Language</Label>
                        <Select
                            value={language}
                            onValueChange={(val) => setLanguage(val === "all" ? undefined : val)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="All languages" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                {languages.map((lang) => (
                                    <SelectItem key={lang} value={lang}>
                                        {lang.toUpperCase()}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>Difficulty</Label>
                        <Select
                            value={difficulty}
                            onValueChange={(val) => setDifficulty(val === "all" ? undefined : val)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="All difficulties" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                {difficulties.map((d) => (
                                    <SelectItem key={d} value={d}>
                                        {d}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>Max Results</Label>
                        <Input
                            type="number"
                            min={1}
                            max={100}
                            value={count}
                            onChange={(e) => {
                                const val = parseInt(e.target.value);
                                setCount(isNaN(val) ? 1 : val);
                            }}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-10">
                        <Loader2 className="animate-spin h-6 w-6 text-muted-foreground" />
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>#</TableHead>
                                <TableHead>Player</TableHead>
                                <TableHead>Score</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {entries.map((entry, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{entry.member}</TableCell>
                                    <TableCell>{entry.score}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}
