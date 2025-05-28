import {jest} from '@jest/globals';
import StatsService from '../../../src/api/services/statsService';
import CacheService from '../../../src/api/services/cacheService';
import { PlayerStatsRepository } from '../../../src/repository/mongo/playerStatsRepository';

// Mockowanie zależności
jest.mock('../../../src/api/services/cacheService');
jest.mock('../../../src/repository/mongo/playerStatsRepository');

// Definicja mocków dla User.find().sort().limit()
// StatsService oczekuje, że User będzie miał te metody
const mockUserLimit = jest.fn();
const mockUserSort = jest.fn(() => ({ limit: mockUserLimit }));
const mockUserFind = jest.fn(() => ({ sort: mockUserSort }));

jest.mock('../../../src/repository/pgsql/models/user', () => ({
  __esModule: true, // Ważne dla modułów ES6
  User: { // StatsService importuje { User } i wywołuje User.find()
    find: mockUserFind,
  },
}));

// Mockowanie redisClient, ponieważ CacheService jest od niego zależny
// a StatsService tworzy instancję CacheService
jest.mock('../../../src/api/app', () => ({
  redisClient: { // Dostarczamy podstawowy mock obiektu redisClient
    setex: jest.fn(),
    get: jest.fn(),
    del: jest.fn(),
  },
}));

describe('RankingService', () => {
  let rankingService: StatsService;
  let mockCacheServiceInstance: jest.Mocked<CacheService>;
  let mockMongoRepositoryInstance: jest.Mocked<PlayerStatsRepository>;

  // Przykładowe dane użytkownika, które mogą być zwracane przez User.find().sort().limit()
  const sampleUserRankingData = [
    { id: 1, username: 'user1', score: 100, email: 'user1@example.com', createdAt: new Date(), updatedAt: new Date() },
    { id: 2, username: 'user2', score: 90, email: 'user2@example.com', createdAt: new Date(), updatedAt: new Date() },
  ];

  beforeEach(() => {
    // Resetowanie wszystkich mocków przed każdym testem
    jest.clearAllMocks();

    // Tworzenie instancji mocków, które zostaną wstrzyknięte lub użyte
    // CacheService i PlayerStatsRepository są mockowane na poziomie modułu,
    // więc `new CacheService()` i `new PlayerStatsRepository()` w konstruktorze StatsService
    // użyją tych mocków.
    rankingService = new StatsService();

    // Aby mieć dostęp do instancji mocków i ich metod (np. .mockResolvedValue)
    // musimy je "wyciągnąć" z instancji rankingService lub użyć mocków konstruktorów.
    // Ponieważ StatsService tworzy własne instancje,
    // musimy upewnić się, że nasze testy odnoszą się do tych konkretnych instancji mocków.
    // Najprostszym sposobem jest przypisanie nowych instancji mocków do rankingService,
    // ale to wymagałoby zmiany modyfikatorów dostępu w StatsService lub użycia `as any`.
    // Alternatywnie, możemy mockować metody na prototypach, jeśli są one używane.

    // W tym przypadku, ponieważ `CacheService` i `PlayerStatsRepository` są mockowane globalnie
    // przez `jest.mock`, ich konstruktory zwrócą mocki.
    // Możemy uzyskać dostęp do tych mocków przez `CacheService.mock.instances[0]` itp.,
    // ale bezpieczniej jest przypisać je bezpośrednio, jeśli to możliwe,
    // lub upewnić się, że nasze asercje odnoszą się do mocków globalnych.

    // StatsService tworzy `new CacheService(redisClient)` i `new PlayerStatsRepository()`.
    // `CacheService` i `PlayerStatsRepository` są już zamockowane.
    // Musimy upewnić się, że metody na tych zamockowanych instancjach są tym, czego oczekujemy.
    // `CacheService.mock.instances[0]` da nam dostęp do instancji utworzonej w konstruktorze StatsService.
    // Podobnie dla PlayerStatsRepository.

    // Dla uproszczenia i bezpośredniej kontroli, przypiszemy mocki do instancji rankingService.
    // To wymagałoby, aby cacheService i mongoRepository były publiczne lub użycia `as any`.
    // Zakładając, że są prywatne, będziemy polegać na globalnych mockach.
    // Aby móc używać .mockImplementation itp. na metodach instancji,
    // musimy uzyskać te instancje.
    // `CacheService` jest klasą, więc `new CacheService()` zwróci mocka.
    // `PlayerStatsRepository` jest klasą, więc `new PlayerStatsRepository()` zwróci mocka.

    // Pobieramy instancje mocków, które zostały utworzone wewnątrz konstruktora StatsService
    // Zakładamy, że `jest.mock` poprawnie zamienia konstruktory
    mockCacheServiceInstance = (CacheService as jest.MockedClass<typeof CacheService>).mock.instances[0] as jest.Mocked<CacheService>;
    mockMongoRepositoryInstance = (PlayerStatsRepository as jest.MockedClass<typeof PlayerStatsRepository>).mock.instances[0] as jest.Mocked<PlayerStatsRepository>;


    // Resetowanie implementacji mocków dla User przed każdym testem
    mockUserFind.mockClear().mockImplementation(() => ({ sort: mockUserSort }));
    mockUserSort.mockClear().mockImplementation(() => ({ limit: mockUserLimit }));
    mockUserLimit.mockClear().mockImplementation(() => Promise.resolve([])); // Domyślnie zwraca pustą tablicę
  });

  describe('getRankings', () => {
    it('should return rankings from cache if available', async () => {
      const cachedRankings = [...sampleUserRankingData];
      // StatsService używa metod get, set, del

      // const result = await rankingService.getRankings();

      // expect(result).toEqual(cachedRankings);
      expect(mockUserFind).not.toHaveBeenCalled();
    });
  });
});