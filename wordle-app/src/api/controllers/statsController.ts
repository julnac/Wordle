import { Request, Response } from "express";
import StatsService  from "../services/statsService";

import {Game} from "../types/Game";

export default class StatsController {
  // private statsService: StatsService;

  // constructor() {
  //   this.statsService = new StatsService();
  // }

  async getStats(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params as { userId: string };

      if (!userId) {
        res.status(400).json({ message: "Parametr 'userId' w ścieżce jest wymagany." });
        return;
      }

      const stats = await StatsService.getStats(userId);

      if (!stats) {
          res.status(404).json({ message: "Nie znaleziono statystyk dla podanego użytkownika." });
          return;
      }

      res.status(200).json(stats);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving rankings", error });
    }
  }

  async updateStats(req: Request, res: Response): Promise<void> {
    try {
      const { game } = req.body as { game: Game };

      if (!game) {
        res.status(400).json({ message: "Parametr 'game' (object) jest wymagany." });
        return;
      }

      if (!game.userId) {
        res.status(400).json({ message: "Obiekt 'game' musi zawierać 'userId'."});
        return;
      }

      await StatsService.updateStats(game);

      res.status(200).json({ message: "Statystyki zaktualizowane pomyślnie." });
    } catch (error) {
      console.error("Error updating stats:", error);
      res.status(500).json({ message: "Error updating ranking", error });
    }
  }
}