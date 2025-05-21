import { Request, Response } from "express";
import GameService from "../services/gameService";
import type { Game } from "../services/gameService";
import CacheService from "../services/cacheService";

export default class GameController {
    private gameService: GameService;
    private cacheService: CacheService;

    constructor(gameService: any, cacheService: any) {
        this.gameService = new GameService();
        // this.cacheService = new CacheService();
    }

    async startGame(req: Request, res: Response): Promise<void> {
        try {
            const { attemptsAllowed, wordLength, language, level } = req.body;

            if (!language || typeof wordLength !== 'number') {
                res.status(400).json({ message: "Parametry 'language' (string) oraz 'wordLength' (number) są wymagane." });
                return;
            }

            const game: Game = await this.gameService.startGame(attemptsAllowed, wordLength, language, level);
            res.status(201).json(game);

        } catch (error: any) {
            console.error("Błąd podczas rozpoczynania gry:", error);
            if (error.message.startsWith("No words found for language")) {
                res.status(404).json({ message: error.message });
            } else {
                res.status(500).json({ message: "Nie udało się rozpocząć gry", error: error.message });
            }
        }
    }

    async validateGuess(req: Request, res: Response): Promise<void> {
        try {
            const { guess } = req.body as { guess: string };

            if (!guess || typeof guess !== 'string') {
                res.status(400).json({ message: "Parametr 'guess' (string) jest wymagany." });
                return;
            }

            const result = await this.gameService.submitGuess(guess);
            res.status(200).json(result);
        } catch (error: any) {
            console.error("Błąd podczas sprawdzania słowa:", error);
            if (error.message === 'No game in progress') {
                res.status(400).json({ message: "Żadna gra nie jest w toku." });
            } else if (error.message.includes('No such word in the')) {
                res.status(400).json({ message: error.message });
            } else {
                res.status(500).json({ message: "Nie udało się sprawdzić słowa", error: error.message });
            }
        }
    }

    getGameStatus(req: Request, res: Response): void {
        // const status = this.cacheService.getGameStatus(gameId);
        // const { gameId } = req.params as { gameId: string }; // gameId jest ignorowane dla GameService z jedną sesją
        try {
            const status = this.gameService.getCurrentGame();
            if (status) {
                res.status(200).json(status);
            } else {
                res.status(404).json({ message: "Nie znaleziono aktywnej gry." });
            }
        } catch (error: any) {
            console.error("Błąd podczas pobierania statusu gry:", error);
            res.status(500).json({ message: "Nie udało się pobrać statusu gry", error: error.message });
        }
    }
}