// Plik: wordle-app/src/api/controllers/rankingController.ts
import { Request, Response } from "express";
import { RankingService } from "../services/rankingService";

export default class RankingController {
  private rankingService: RankingService;

  constructor() {
    this.rankingService = new RankingService();
  }

  async getRankings(req: Request, res: Response): Promise<void> {
    try {
      const rankings = await this.rankingService.getRankings();
      res.status(200).json(rankings);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving rankings", error });
    }
  }

  async updateRanking(req: Request, res: Response): Promise<void> {
    const { userId, score } = req.body;
    try {
      await this.rankingService.updateRanking(userId, score);
      res.status(200).json({ userId, score });
    } catch (error) {
      res.status(500).json({ message: "Error updating ranking", error });
    }
  }
}