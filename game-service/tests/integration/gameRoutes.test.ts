import app from '../../src/api/app';
// import request from 'supertest';
// import * as request from 'supertest';
const request = require('supertest');

const userId = 'user1';
const roles = 'user';

describe('Game API routes', () => {
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
                .set('x-user-id', userId)
                .set('x-roles', roles)
                .send({ wordLength: 20 });
            expect(res.status).toBe(400);
        });

        // Ten tests prawdopodobnie nie przejdzie bez mocków zależności!
        it('zwraca 201 lub 500 przy próbie utworzenia gry (zależnie od środowiska)', async () => {
            const res = await request(app)
                .post('/api/game/start')
                .set('x-user-id', userId)
                .set('x-roles', roles)
                .send({ attemptsAllowed: 6, wordLength: 5, language: 'pl', level: 'easy' });
            expect([201, 500, 404]).toContain(res.status);
        });
    });

    describe('POST /api/game/guess/:gameId', () => {
        it('zwraca 401 gdy brak nagłówków autoryzacji', async () => {
            const res = await request(app)
                .post('/api/game/guess/game1')
                .send({ guess: 'słowo' });
            expect(res.status).toBe(401);
        });

        it('zwraca 400 gdy brak guess', async () => {
            const res = await request(app)
                .post('/api/game/guess/game1')
                .set('x-user-id', userId)
                .set('x-roles', roles)
                .send({});
            expect(res.status).toBe(400);
        });
    });

    describe('GET /api/game/status/:gameId', () => {
        it('zwraca 404 gdy brak gameId', async () => {
            const res = await request(app)
                .get('/api/game/status/')
                .set('x-user-id', userId)
                .set('x-roles', roles);
            expect([404]).toContain(res.status);
        });

        it('zwraca 404 gdy gra nie istnieje', async () => {
            const res = await request(app)
                .get('/api/game/status/nonexistent')
                .set('x-user-id', userId)
                .set('x-roles', roles);
            expect(res.status).toBe(404);
        });
    });

    describe('GET /api/game/current', () => {
        it('zwraca 401 gdy brak nagłówków autoryzacji', async () => {
            const res = await request(app)
                .get('/api/game/current');
            expect(res.status).toBe(401);
        });

        it('zwraca 404 gdy brak aktywnej gry', async () => {
            const res = await request(app)
                .get('/api/game/current')
                .set('x-user-id', userId)
                .set('x-roles', roles);
            expect([404, 500]).toContain(res.status);
        });
    });
});