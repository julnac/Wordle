const RankingService = require('../services/rankingService');

class RankingController {
  constructor() {
    this.rankingService = new RankingService();
  }

  async getRankings(req, res) {
    try {
      const rankings = await this.rankingService.getRankings();
      res.status(200).json(rankings);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving rankings', error });
    }
  }

  async updateRanking(req, res) {
    const { userId, score } = req.body;
    try {
      const updatedRanking = await this.rankingService.updateRanking(userId, score);
      res.status(200).json(updatedRanking);
    } catch (error) {
      res.status(500).json({ message: 'Error updating ranking', error });
    }
  }
}

module.exports = RankingController;