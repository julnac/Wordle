import {Game} from "./Game";
import {LetterValidation} from "./LetterValidation";

export interface GuessResult {
    gameId: string;
    isCorrect: boolean;
    isGameOver: boolean;
    attemptsLeft: number;
    letters: LetterValidation[];
    gameState: Game | null;
}