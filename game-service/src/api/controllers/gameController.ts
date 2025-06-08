import { Request, Response } from "express";
import GameService from "../services/gameService";
import {Game} from "../types/Game";

export default class GameController {
    private gameService: GameService;

    constructor(gameService: any, cacheService: any, lederboardService: any) {
        this.gameService = gameService;
    }

    async startGame(req: Request, res: Response): Promise<void> {
        try {
            const { attemptsAllowed, wordLength, language, level } = req.body;
            const { userId } = req.params as { userId: string };

            if (!userId) {
                res.status(400).json({ message: "Parametr 'userId' w ścieżce jest wymagany." });
                return;
            }

            if (attemptsAllowed && (typeof attemptsAllowed !== 'number' || attemptsAllowed <= 0 || attemptsAllowed > 10)) {
                res.status(400).json({ message: "Parametr 'attemptsAllowed' (dodatnia liczba) jest opcjonalny, ale jeśli podany, musi być między 1 a 10." });
                return;
            }

            if (wordLength && (typeof wordLength !== 'number' || wordLength < 4 || wordLength > 7)) {
                res.status(400).json({message: "Parametr 'wordLength' (dodatnia liczba) jest opcjonalny, ale jeśli podany, musi być między 4 a 7."});
                return;
            }

            if (language && !['pl', 'en', 'es', 'de'].includes(language)) {
                res.status(400).json({ message: "Parametr 'language' musi być jednym z: pl, en, es, de." });
                return;
            }

            if (level && !['easy', 'medium', 'hard'].includes(level)) {
                res.status(400).json({ message: "Parametr 'level' musi być jednym z: easy, medium, hard." });
                return;
            }

            const game: Game = await this.gameService.startGame(userId, attemptsAllowed, wordLength, language, level);
            res.status(201).json(game);

        } catch (error: any) {
            console.error("Błąd podczas rozpoczynania gry:", error);
            if (error.message.startsWith("No words found for language")) {
                res.status(404).json({message: error.message});
            } else if (error.message.startsWith("Are you a user?")) {
                res.status(404).json({message: error.message});
            } else {
                res.status(500).json({ message: "Nie udało się rozpocząć gry", error: error.message });
            }
        }
    }

    async validateGuess(req: Request, res: Response): Promise<void> {
        try {
            const { gameId } = req.params as { gameId: string };
            const { guess } = req.body as { guess: string };

            if (!guess || typeof guess !== 'string') {
                res.status(400).json({ message: "Parametr 'guess' (string) jest wymagany." });
                return;
            }
            if (!gameId) {
                res.status(400).json({ message: "Parametr 'gameId' w ścieżce jest wymagany." });
                return;
            }

            const result: Game = await this.gameService.submitGuess(gameId, guess);
            res.status(200).json(result);
        } catch (error: any) {
            console.error(`Błąd podczas sprawdzania słowa dla gry ${req.params.gameId}:`, error);
            if (error.message === 'Game not found or session expired' || error.message === 'Game is already completed or failed') {
                res.status(404).json({ message: error.message });
            } else if (error.message.includes('not a valid word') || error.message.includes('Guess length must be')) {
                res.status(400).json({ message: error.message });
            }
            else {
                res.status(500).json({ message: "Nie udało się sprawdzić słowa", error: error.message });
            }
        }
    }

    async getGameStatus(req: Request, res: Response): Promise<void> {
        try {
            const { gameId } = req.params as { gameId: string };
            if (!gameId) {
                res.status(400).json({ message: "Parametr 'gameId' w ścieżce jest wymagany." });
                return;
            }

            const status: Game | null = await this.gameService.getGameStatus(gameId);
            if (status) {
                res.status(200).json(status);
            } else {
                res.status(404).json({ message: "Nie znaleziono gry o podanym ID lub sesja wygasła." });
            }
        } catch (error: any) {
            console.error(`Błąd podczas pobierania statusu gry ${req.params.gameId}:`, error);
            res.status(500).json({ message: "Nie udało się pobrać statusu gry", error: error.message });
        }
    }

    async getCurrentGame(req:Request, res:Response): Promise<void>  {
        const userId = req.params.userId;
        try {
            const game = await this.gameService.findOngoingGameByUser(userId);
            if (!game) {
                res.status(404).json({ message: "Brak aktywnej gry" });
            }
            res.status(200).json(game);
        } catch (e) {
            res.status(500).json({ message: "Błąd serwera" });
        }
    }
}