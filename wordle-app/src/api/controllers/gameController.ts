import { Request, Response } from "express";

export class GameController {
    private gameService: any;
    private cacheService: any;

    constructor(gameService: any, cacheService: any) {
        this.gameService = gameService;
        this.cacheService = cacheService;
    }

    startGame(req: Request, res: Response): void {
        const gameId = this.gameService.createGame(req.body);
        res.status(201).json({ gameId });
    }

    validateGuess(req: Request, res: Response): void {
        const { gameId, guess } = req.body as { gameId: string; guess: string };
        const result = this.gameService.checkGuess(gameId, guess);
        res.status(200).json(result);
    }

    getGameStatus(req: Request, res: Response): void {
        const { gameId } = req.params as { gameId: string };
        const status = this.cacheService.getGameStatus(gameId);
        res.status(200).json(status);
    }
}