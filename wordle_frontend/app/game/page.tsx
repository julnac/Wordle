"use client";

import { useAuth } from "@/src/components/auth/AuthProvider";
import GameBoard from "@/src/components/game/GameBoard";
import { useState, useEffect } from "react";
import { getCurrentGame, guessWord, getGameStatus, startGame } from "@/lib/api/game";
import { GameData } from "@/src/types/gameData";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Separator } from "@/src/components/ui/separator";
import { Alert, AlertDescription } from "@/src/components/ui/alert";
import GameSettingsForm from "@/src/components/game/GameSettingsForm";

export default function Game() {
    const { authenticated, profile } = useAuth();
    const [gameData, setGameData] = useState<GameData | null>(null);
    const [childValue, setChildValue] = useState<string>("");
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const [attemptsAllowed, setAttemptsAllowed] = useState(6);
    const [wordLength, setWordLength] = useState(5);
    const [language, setLanguage] = useState("pl");
    const [level, setLevel] = useState("medium");

    useEffect(() => {
        if (!profile?.id) return;
        getCurrentGame()
            .then(data => setGameData(data))
            .catch(() => setGameData(null));
    }, [profile?.id]);

    useEffect(() => {
        if (!gameData || !childValue) return;
        guessWord(gameData.id, childValue)
            .then(data => {
                if (data.status === "completed") {
                    setGameData(data);
                    alert("Gra zakończona sukcesem!");
                    return;
                } else if (data.status === "failed") {
                    setGameData(data);
                    alert("Gra zakończona niepowodzeniem.");
                    return;
                } else {
                    setGameData(data);
                    setErrorMsg(null);
                }
            })
            .catch(error => {
                setErrorMsg(error.message);
            });
    }, [childValue]);

    const handleStartGame = async () => {
        if (!profile?.id) return;
        try {
            const data = await startGame({
                attemptsAllowed,
                wordLength,
                language,
                level,
            });
            setGameData(data);
        } catch (e) {
            alert("Błąd podczas rozpoczynania gry");
        }
    };

    const handleChangesInChild = (value: string) => setChildValue(value);

    if (!authenticated) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Card className="max-w-md w-full">
                    <CardHeader>
                        <CardTitle>Musisz być zalogowany, aby zagrać</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Zaloguj się, aby rozpocząć grę w Wordle.
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">🎯 Wordle Game</CardTitle>
                    <p className="text-muted-foreground text-sm">Witaj, {profile?.username}! Powodzenia!</p>
                </CardHeader>
                <CardContent className="space-y-4">
                    <GameSettingsForm
                        attemptsAllowed={attemptsAllowed}
                        setAttemptsAllowed={setAttemptsAllowed}
                        wordLength={wordLength}
                        setWordLength={setWordLength}
                        language={language}
                        setLanguage={setLanguage}
                        level={level}
                        setLevel={setLevel}
                    />
                    <Button onClick={handleStartGame}>Rozpocznij nową grę</Button>

                    {errorMsg && (
                        <Alert variant="destructive">
                            <AlertDescription>{errorMsg}</AlertDescription>
                        </Alert>
                    )}

                    {gameData && (
                        <div className="space-y-4">
                            <Separator />
                            <div className="text-sm text-muted-foreground">
                                ID gry: <span className="font-mono">{gameData.id}</span>
                            </div>

                            <GameBoard
                                gameData={gameData}
                                onChangeInChildAction={handleChangesInChild}
                            />
                            <pre>{JSON.stringify(gameData, null, 2)}</pre>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}