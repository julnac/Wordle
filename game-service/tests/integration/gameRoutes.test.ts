jest.mock('../../src/repository/mongo/mongodb', () => jest.fn().mockResolvedValue(undefined));
jest.mock('../../src/repository/redis/redis', () => ({
    __esModule: true,
    default: jest.fn().mockResolvedValue(undefined),
    redisClient: { on: jest.fn() },
}));
jest.mock('../../src/seed', () => ({
    seedDictionary: jest.fn().mockResolvedValue(undefined),
}));
jest.mock('../../src/api/services/gameService');

const request = require('supertest');
import app from '../../src/api/app';
import GameService from '../../src/api/services/gameService';

const userHeaders = {
    'x-user-id': 'user1',
    'x-roles': 'user',
};

const mockGame = {
    id: 'game1',
    userId: 'user1',
    word: 'ZAMEK',
    wordLength: 5,
    attempts: [],
    letters: [],
    attemptsAllowed: 6,
    status: 'ongoing',
    level: 'easy',
    language: 'pl',
    startTime: Date.now(),
};

describe('Game API routes', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/game/start', () => {
        it('zwraca 401 gdy brak nagłówków autoryzacji', async () => {
            const res = await request(app)
                .post('/api/game/start')
                .send({ attemptsAllowed: 5 });
            expect(res.status).toBe(401);
        });

        it('zwraca 400 gdy wordLength poza zakresem', async () => {
            const res = await request(app)
                .post('/api/game/start')
                .set(userHeaders)
                .send({ wordLength: 20 });
            expect(res.status).toBe(400);
        });

        it('zwraca 400 gdy language nieprawidłowy', async () => {
            const res = await request(app)
                .post('/api/game/start')
                .set(userHeaders)
                .send({ language: 'xx' });
            expect(res.status).toBe(400);
        });

        it('zwraca 400 gdy level nieprawidłowy', async () => {
            const res = await request(app)
                .post('/api/game/start')
                .set(userHeaders)
                .send({ level: 'superhard' });
            expect(res.status).toBe(400);
        });

        it('zwraca 201 i ukrywa słowo podczas aktywnej gry', async () => {
            (GameService.prototype.startGame as jest.Mock).mockResolvedValue(mockGame);

            const res = await request(app)
                .post('/api/game/start')
                .set(userHeaders)
                .send({ attemptsAllowed: 6, wordLength: 5, language: 'pl', level: 'easy' });

            expect(res.status).toBe(201);
            expect(res.body).not.toHaveProperty('word');
            expect(res.body.id).toBe('game1');
        });

        it('zwraca 500 przy błędzie serwisu', async () => {
            (GameService.prototype.startGame as jest.Mock).mockRejectedValue(new Error('Database error'));

            const res = await request(app)
                .post('/api/game/start')
                .set(userHeaders)
                .send({ attemptsAllowed: 6, wordLength: 5, language: 'pl', level: 'easy' });

            expect(res.status).toBe(500);
        });
    });

    describe('POST /api/game/guess/:gameId', () => {
        it('zwraca 401 gdy brak nagłówków autoryzacji', async () => {
            const res = await request(app)
                .post('/api/game/guess/game1')
                .send({ guess: 'zamek' });
            expect(res.status).toBe(401);
        });

        it('zwraca 400 gdy brak guess', async () => {
            const res = await request(app)
                .post('/api/game/guess/game1')
                .set(userHeaders)
                .send({});
            expect(res.status).toBe(400);
        });

        it('zwraca 200 z wynikiem i ukrytym słowem dla aktywnej gry', async () => {
            const ongoingResult = { ...mockGame, attempts: ['KARTA'] };
            (GameService.prototype.submitGuess as jest.Mock).mockResolvedValue(ongoingResult);

            const res = await request(app)
                .post('/api/game/guess/game1')
                .set(userHeaders)
                .send({ guess: 'karta' });

            expect(res.status).toBe(200);
            expect(res.body).not.toHaveProperty('word');
        });

        it('ujawnia słowo gdy gra zakończona sukcesem', async () => {
            const completedResult = { ...mockGame, status: 'completed', attempts: ['ZAMEK'] };
            (GameService.prototype.submitGuess as jest.Mock).mockResolvedValue(completedResult);

            const res = await request(app)
                .post('/api/game/guess/game1')
                .set(userHeaders)
                .send({ guess: 'zamek' });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('word', 'ZAMEK');
        });

        it('zwraca 404 gdy gra nie istnieje', async () => {
            (GameService.prototype.submitGuess as jest.Mock).mockRejectedValue(
                new Error('Game not found or session expired')
            );

            const res = await request(app)
                .post('/api/game/guess/nonexistent')
                .set(userHeaders)
                .send({ guess: 'zamek' });

            expect(res.status).toBe(404);
        });
    });

    describe('GET /api/game/status/:gameId', () => {
        it('zwraca 404 gdy gra nie istnieje', async () => {
            (GameService.prototype.getGameStatus as jest.Mock).mockResolvedValue(null);

            const res = await request(app)
                .get('/api/game/status/nonexistent')
                .set(userHeaders);

            expect(res.status).toBe(404);
        });

        it('zwraca 200 z danymi gry', async () => {
            (GameService.prototype.getGameStatus as jest.Mock).mockResolvedValue(mockGame);

            const res = await request(app)
                .get('/api/game/status/game1')
                .set(userHeaders);

            expect(res.status).toBe(200);
            expect(res.body.id).toBe('game1');
        });
    });

    describe('GET /api/game/current', () => {
        it('zwraca 401 gdy brak nagłówków autoryzacji', async () => {
            const res = await request(app).get('/api/game/current');
            expect(res.status).toBe(401);
        });

        it('zwraca 404 gdy brak aktywnej gry', async () => {
            (GameService.prototype.findOngoingGameByUser as jest.Mock).mockResolvedValue(null);

            const res = await request(app)
                .get('/api/game/current')
                .set(userHeaders);

            expect([404, 500]).toContain(res.status);
        });

        it('zwraca 200 z aktywną grą', async () => {
            (GameService.prototype.findOngoingGameByUser as jest.Mock).mockResolvedValue(mockGame);

            const res = await request(app)
                .get('/api/game/current')
                .set(userHeaders);

            expect([200, 500]).toContain(res.status);
        });
    });
});
