"use client";
import {Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { GameData} from "@/lib/types/gameData";

function classNames(...classes: (string | boolean | undefined)[]) {
    return classes.filter(Boolean).join(" ");
}

export default function GameBoard({gameData, onChangeInChildAction }: { gameData: GameData, onChangeInChildAction: (guess: string) => void; }) {
    const { id, attempts, letters, wordLength, attemptsAllowed } = gameData;
    const [guess, setGuess] = useState("");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toLowerCase();
        if (value.length <= wordLength) {
            setGuess(value);
        }
    };

    const handleSubmit = () => {
        if (guess.length === wordLength) {
            onChangeInChildAction(guess);
            setGuess(""); // wyczyść pole
        } else {
            alert(`Słowo musi mieć ${wordLength} liter.`);
        }
    };

    const rows = Array.from({ length: attemptsAllowed }).map((_, rowIndex) => {
        const attempt = attempts[rowIndex] || "";
        const attemptStatuses =
            rowIndex < attempts.length
                ? letters
                    .slice(rowIndex * wordLength, (rowIndex + 1) * wordLength)
                    .map((l) => l.status)
                : Array(wordLength).fill("");
        const attemptLetters = attempt.padEnd(wordLength).split("");

        return (
            <div key={rowIndex} className="flex gap-1 justify-center mb-1">
                {attemptLetters.map((char, i) => (
                    <div
                        key={i}
                        className={classNames(
                            "w-12 h-12 sm:w-14 sm:h-14 border-2 text-xl font-bold flex items-center justify-center uppercase transition-all duration-300",
                            attemptStatuses[i] === "correct" && "bg-green-600 text-white border-green-600",
                            attemptStatuses[i] === "present" && "bg-yellow-500 text-white border-yellow-500",
                            attemptStatuses[i] === "absent" && "bg-zinc-800 text-white border-zinc-700",
                            attemptStatuses[i] === "" && "bg-transparent border-zinc-600 text-white"
                        )}
                    >
                        {char}
                    </div>
                ))}
            </div>
        );
    });

    return (
        <div className="grid gap-2">
            {rows}
            <div className="flex gap-2 mt-4 items-center justify-center">
                <input
                    type="text"
                    value={guess}
                    onChange={handleInputChange}
                    maxLength={wordLength}
                    className="border px-2 py-1 rounded text-lg uppercase"
                />
                <button
                    onClick={handleSubmit}
                    className="bg-blue-600 text-white px-4 py-1 rounded disabled:opacity-50"
                    disabled={guess.length !== wordLength}
                >
                    Enter
                </button>
            </div>
        </div>
    );
}
