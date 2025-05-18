const CacheService = require('../../../src/api/services/cacheService');

describe('CacheService', () => {
  let redisClientMock;
  let cacheService;

  beforeEach(() => {
    redisClientMock = {
      setex: jest.fn().mockResolvedValue(undefined),
      get: jest.fn(),
      del: jest.fn().mockResolvedValue(undefined),
    };
    cacheService = new CacheService(redisClientMock);
  });

  it('should set cache with setCache', async () => {
    await cacheService.setCache('testKey', { foo: 'bar' }, 100);
    expect(redisClientMock.setex).toHaveBeenCalledWith(
      'testKey',
      100,
      JSON.stringify({ foo: 'bar' })
    );
  });

  it('should get cache with getCache and parse JSON', async () => {
    redisClientMock.get.mockResolvedValue(JSON.stringify({ foo: 'bar' }));
    const result = await cacheService.getCache('testKey');
    expect(redisClientMock.get).toHaveBeenCalledWith('testKey');
    expect(result).toEqual({ foo: 'bar' });
  });

  it('should return null if getCache returns null', async () => {
    redisClientMock.get.mockResolvedValue(null);
    const result = await cacheService.getCache('missingKey');
    expect(result).toBeNull();
  });

  it('should delete cache with deleteCache', async () => {
    await cacheService.deleteCache('testKey');
    expect(redisClientMock.del).toHaveBeenCalledWith('testKey');
  });
});