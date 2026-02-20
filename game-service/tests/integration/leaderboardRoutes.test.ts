// import request from 'supertest';
const request = require('supertest');
import app from '../../src/api/app';
import LeaderboardService from '../../src/api/services/leaderboardService';

jest.mock('../../src/api/services/leaderboardService');

const userHeaders = {
    'x-user-id': 'user1',
    'x-roles': 'user'
};

describe('Leaderboard routes', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/leaderboard', () => {
        it('zwraca 401 gdy brak nagłówków autoryzacji', async () => {
            const res = await request(app).get('/api/leaderboard');
            expect(res.status).toBe(401);
        });

        it('zwraca 400 dla nieprawidłowego języka', async () => {
            const res = await request(app)
                .get('/api/leaderboard?language=xx')
                .set(userHeaders);
            expect(res.status).toBe(400);
        });

        it('zwraca 400 dla nieprawidłowego poziomu', async () => {
            const res = await request(app)
                .get('/api/leaderboard?difficulty=superhard')
                .set(userHeaders);
            expect(res.status).toBe(400);
        });

        it('zwraca 400 dla nieprawidłowego count', async () => {
            const res = await request(app)
                .get('/api/leaderboard?count=-5')
                .set(userHeaders);
            expect(res.status).toBe(400);
        });

        it('zwraca listę wyników', async () => {
            (LeaderboardService.prototype.getTopScores as jest.Mock).mockResolvedValue([
                { member: 'user1', score: '01:05' }
            ]);
            const res = await request(app)
                .get('/api/leaderboard?language=pl&difficulty=easy&count=1')
                .set(userHeaders);
            expect(res.status).toBe(200);
            expect(res.body).toEqual([{ member: 'user1', score: '01:05' }]);
        });

        it('zwraca 500 przy błędzie serwisu', async () => {
            (LeaderboardService.prototype.getTopScores as jest.Mock).mockRejectedValue(new Error('fail'));
            const res = await request(app)
                .get('/api/leaderboard')
                .set(userHeaders);
            expect(res.status).toBe(500);
        });
    });

    describe('POST /api/leaderboard', () => {
        it('zwraca 401 gdy brak nagłówków autoryzacji', async () => {
            const res = await request(app)
                .post('/api/leaderboard')
                .send({});
            expect(res.status).toBe(401);
        });

        it('zwraca 400 gdy dane gry są niepoprawne', async () => {
            const res = await request(app)
                .post('/api/leaderboard')
                .set(userHeaders)
                .send({ id: 'g1' }); // brak wymaganych pól
            expect(res.status).toBe(400);
        });

        it('zwraca 200 po poprawnym dodaniu wyniku', async () => {
            (LeaderboardService.prototype.addScore as jest.Mock).mockResolvedValue(undefined);
            const res = await request(app)
                .post('/api/leaderboard')
                .set(userHeaders)
                .send({
                    id: 'g1',
                    language: 'pl',
                    level: 'easy',
                    status: 'completed',
                    endTime: 2000,
                    startTime: 1000
                });
            expect(res.status).toBe(200);
        });

        it('zwraca 500 przy błędzie serwisu', async () => {
            (LeaderboardService.prototype.addScore as jest.Mock).mockRejectedValue(new Error('fail'));
            const res = await request(app)
                .post('/api/leaderboard')
                .set(userHeaders)
                .send({
                    id: 'g1',
                    language: 'pl',
                    level: 'easy',
                    status: 'completed',
                    endTime: 2000,
                    startTime: 1000
                });
            expect(res.status).toBe(500);
        });
    });
});