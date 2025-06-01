import { LetterValidation } from './letterValidation';

export type GameData = {
    id: string;
    userId: string;
    word: string;
    wordLength: number;
    attempts: string[];
    letters: LetterValidation[];
    attemptsAllowed: number;
    status: string;
    level: string;
    language: string;
    startTime: number;
    endTime?: number;
};