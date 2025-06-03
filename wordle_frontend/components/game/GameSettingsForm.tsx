"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

type GameSettingsFormProps = {
    attemptsAllowed: number;
    setAttemptsAllowed: (value: number) => void;
    wordLength: number;
    setWordLength: (value: number) => void;
    language: string;
    setLanguage: (value: string) => void;
    level: string;
    setLevel: (value: string) => void;
};

export default function GameSettingsForm({
     attemptsAllowed,
     setAttemptsAllowed,
     wordLength,
     setWordLength,
     language,
     setLanguage,
     level,
     setLevel,
 }: GameSettingsFormProps) {
    const [attemptsError, setAttemptsError] = useState("");
    const [wordLengthError, setWordLengthError] = useState("");

    const validateAttempts = (value: number) => {
        if (value < 1 || value > 10) {
            setAttemptsError("Liczba prób musi być między 1 a 10.");
        } else {
            setAttemptsError("");
            setAttemptsAllowed(value);
        }
    };

    const validateWordLength = (value: number) => {
        if (value < 4 || value > 7) {
            setWordLengthError("Długość słowa musi być między 4 a 7.");
        } else {
            setWordLengthError("");
            setWordLength(value);
        }
    };

    return (
        <div className="flex flex-wrap gap-4 items-end">
            <div className="flex flex-col space-y-1 w-30">
                <Label htmlFor="attempts">Liczba prób</Label>
                <Input
                    id="attempts"
                    type="number"
                    value={attemptsAllowed}
                    onChange={(e) => validateAttempts(Number(e.target.value))}
                />
                {attemptsError && <span className="text-sm text-red-500">{attemptsError}</span>}
            </div>

            <div className="flex flex-col space-y-1 w-30">
                <Label htmlFor="wordLength">Długość słowa</Label>
                <Input
                    id="wordLength"
                    type="number"
                    value={wordLength}
                    onChange={(e) => validateWordLength(Number(e.target.value))}
                />
                {wordLengthError && <span className="text-sm text-red-500">{wordLengthError}</span>}
            </div>

            <div className="flex flex-col space-y-1 w-30">
                <Label>Język</Label>
                <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
                        <SelectValue placeholder="Wybierz język" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="pl">Polski</SelectItem>
                        <SelectItem value="en">Angielski</SelectItem>
                        <SelectItem value="es">Hiszpański</SelectItem>
                        <SelectItem value="de">Niemiecki</SelectItem>
                        <SelectItem value="fr">Francuski</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex flex-col space-y-1 w-30">
                <Label>Poziom</Label>
                <Select value={level} onValueChange={setLevel}>
                    <SelectTrigger>
                        <SelectValue placeholder="Wybierz poziom" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="easy">Łatwy</SelectItem>
                        <SelectItem value="medium">Średni</SelectItem>
                        <SelectItem value="hard">Trudny</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
