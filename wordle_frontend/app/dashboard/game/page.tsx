"use client";

import { useKeycloak } from "@/components/auth/KeycloakProvider";
import GameBoard from "@/components/game/GameBoard";
import { useState, useEffect } from "react";
import { getCurrentGame, guessWord, getGameStatus, startGame } from "@/lib/api/game/game";
import { GameData } from "@/lib/types/gameData";

export default function Game() {
    const { authenticated, profile } = useKeycloak();
    const [gameData, setGameData] = useState<GameData | null>(null);
    const [childValue, setChildValue] = useState<string>("");

    useEffect(() => {
        if (!profile?.id) return;
        getCurrentGame(profile.id)
            .then(data => setGameData(data))
            .catch(() => setGameData(null));
    }, [profile?.id]);

    useEffect(() => {
        if (!gameData) return;
        guessWord(gameData.id, childValue)
            .then(data => setGameData(data))
            .catch(error => {
                console.error("Error submitting guess:", error);
                alert("Błąd podczas wysyłania próby");
            });
    }, [childValue]);

    const handleStartGame = async () => {
        if (!profile?.id) return;
        try {
            const data = await startGame(profile.id, {
                attemptsAllowed: 6,
                wordLength: 5,
                language: "pl",
                level: "medium",
            });
            setGameData(data);
        } catch (e) {
            alert("Błąd podczas rozpoczynania gry");
        }
    };

    const handleChangesInChild = (value: string) => setChildValue(value);

    if (!authenticated) {
        return <div>Musisz być zalogowany, aby zagrać.</div>;
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Wordle Game</h1>
            <p className="mb-4">Witaj, {profile?.username}! Powodzenia w grze.</p>
            <button onClick={handleStartGame}>Start Game</button>
            {gameData && (
                <div className="mt-4">
                    <p>Gra rozpoczęta! ID gry: {gameData.id}</p>
                    <GameBoard gameData={gameData} onChangeInChildAction={handleChangesInChild}/>
                    <pre>{JSON.stringify(gameData, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}