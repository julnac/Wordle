import RankingServiceClass from '../../../src/api/services/rankingService';

jest.mock('../../../src/repository/pgsql/models/user', () => ({
  find: jest.fn(() => ({
    sort: jest.fn().mockReturnThis(),
    limit: jest.fn().mockResolvedValue([{ userId: '1', score: 100 }]),
  })),
}));

jest.mock('../../../src/repository/mongo/models/playerStats', () => ({
  findOne: jest.fn(),
  create: jest.fn(),
}));

const mockCacheService = {
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
};

jest.mock('../../../src/api/services/cacheService', () => {
  return function () {
    return mockCacheService;
  };
});

describe('RankingService', () => {
  let rankingService: InstanceType<typeof RankingServiceClass>;

  beforeEach(() => {
    jest.clearAllMocks();
    rankingService = new RankingServiceClass();
  });

  it('should return cached rankings if available', async () => {
    mockCacheService.get.mockResolvedValue([{ userId: '1', score: 100 }]);
    const result = await rankingService.getRankings();
    expect(mockCacheService.get).toHaveBeenCalledWith('rankings');
    expect(result).toEqual([{ userId: '1', score: 100 }]);
  });

  it('should fetch, cache, and return rankings if not cached', async () => {
    mockCacheService.get.mockResolvedValue(null);
    const result = await rankingService.getRankings();
    expect(mockCacheService.get).toHaveBeenCalledWith('rankings');
    expect(result).toEqual([{ userId: '1', score: 100 }]);
    expect(mockCacheService.set).toHaveBeenCalledWith('rankings', [{ userId: '1', score: 100 }]);
  });

  it('should update existing player stats and clear cache', async () => {
    const mockPlayer = { score: 50, save: jest.fn() };
    const playerStats = require('../../../src/repository/mongo/models/playerStats');
    playerStats.findOne.mockResolvedValue(mockPlayer);

    await rankingService.updateRanking('1', 200);

    expect(playerStats.findOne).toHaveBeenCalledWith({ userId: '1' });
    expect(mockPlayer.score).toBe(200);
    expect(mockPlayer.save).toHaveBeenCalled();
    expect(mockCacheService.del).toHaveBeenCalledWith('rankings');
  });

  it('should create player stats if not found and clear cache', async () => {
    const playerStats = require('../../../src/repository/mongo/models/playerStats');
    playerStats.findOne.mockResolvedValue(null);

    await rankingService.updateRanking('2', 150);

    expect(playerStats.create).toHaveBeenCalledWith({ userId: '2', score: 150 });
    expect(mockCacheService.del).toHaveBeenCalledWith('rankings');
  });
});
