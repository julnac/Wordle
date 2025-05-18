// const RankingService = require('../../repository/models/playerStats');
const User = require('../../repository/pgsql/models/user');
const CacheService = require('./cacheService');
const redisClient = require('../app');
const MongoRepository = require('../../repository/mongo/mongoRepository');

class RankingService {
  constructor() {
    this.cacheService = new CacheService(redisClient);
    this.mongoRepository = new MongoRepository();
  }

  async getRankings() {
    const cachedRankings = await this.cacheService.get('rankings');
    if (cachedRankings) {
      return cachedRankings;
    }

    const rankings = await User.find().sort({ score: -1 }).limit(10);
    await this.cacheService.set('rankings', rankings);
    return rankings;
  }

  async updateRanking(userId, score) {
    const playerStats = await PlayerStats.findOne({ userId });
    if (playerStats) {
      playerStats.score = score;
      await playerStats.save();
    } else {
      await RankingService.create({ userId, score });
    }

    await this.cacheService.del('rankings');
  }
}

module.exports = RankingService;