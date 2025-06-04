import {LetterValidation} from "./LetterValidation";

export interface Game {
    id: string;
    userId?: string;
    word: string;
    wordLength: number;
    attempts: string[];
    letters: LetterValidation[];
    attemptsAllowed: number;
    status: 'ongoing' | 'completed' | 'failed';
    level?: 'easy' | 'medium' | 'hard';
    language: string;
    startTime: number;
    endTime?: number;
}