class GameController {
    constructor(gameService, cacheService) {
        this.gameService = gameService;
        this.cacheService = cacheService;
    }

    startGame(req, res) {
        const gameId = this.gameService.createGame(req.body);
        res.status(201).json({ gameId });
    }

    validateGuess(req, res) {
        const { gameId, guess } = req.body;
        const result = this.gameService.checkGuess(gameId, guess);
        res.status(200).json(result);
    }

    getGameStatus(req, res) {
        const { gameId } = req.params;
        const status = this.cacheService.getGameStatus(gameId);
        res.status(200).json(status);
    }
}

module.exports = GameController;