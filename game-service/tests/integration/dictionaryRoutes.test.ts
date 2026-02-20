// import request from 'supertest';
const request = require('supertest');
import app from '../../src/api/app';
import DictionaryService from '../../src/api/services/dictionaryService';

jest.mock('../../src/api/services/dictionaryService');
jest.mock('../../src/api/middleware/requireRole', () => () => (req: any, res: any, next: any) => next());

const adminHeaders = {
    'x-user-id': 'admin',
    'x-roles': 'app-admin'
};

describe('Dictionary routes', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/dictionary/upload-file', () => {
        it('zwraca 201 po poprawnym uploadzie', async () => {
            (DictionaryService.uploadWordsFromContent as jest.Mock).mockResolvedValue({ successfulUploads: 2, failedUploads: 0, errors: [] });
            const res = await request(app)
                .post('/api/dictionary/upload-file')
                .set(adminHeaders)
                .attach('file', Buffer.from('kot pl easy\npies pl medium'), 'words.txt');
            expect(res.status).toBe(201);
            expect(res.body.successfulUploads).toBe(2);
        });

        it('zwraca 400 gdy brak pliku', async () => {
            const res = await request(app)
                .post('/api/dictionary/upload-file')
                .set(adminHeaders);
            expect(res.status).toBe(400);
        });
    });

    describe('DELETE /api/dictionary/language/:language', () => {
        it('usuwa słowa dla języka', async () => {
            (DictionaryService.deleteWordsByLanguage as jest.Mock).mockResolvedValue(undefined);
            const res = await request(app)
                .delete('/api/dictionary/language/pl')
                .set(adminHeaders);
            expect(res.status).toBe(200);
        });

        it('zwraca 400 dla nieprawidłowego języka', async () => {
            const res = await request(app)
                .delete('/api/dictionary/language/xx')
                .set(adminHeaders);
            expect(res.status).toBe(400);
        });
    });

    describe('GET /api/dictionary/words', () => {
        it('zwraca listę słów', async () => {
            (DictionaryService.getWords as jest.Mock).mockResolvedValue([{ word: 'kot', language: 'pl' }]);
            const res = await request(app)
                .get('/api/dictionary/words')
                .set(adminHeaders);
            expect(res.status).toBe(200);
            expect(res.body).toEqual([{ word: 'kot', language: 'pl' }]);
        });
    });

    describe('GET /api/dictionary/export-file', () => {
        it('eksportuje słowa do pliku', async () => {
            (DictionaryService.getWords as jest.Mock).mockResolvedValue([
                { word: 'kot', language: 'pl', difficulty: 'easy', category: undefined }
            ]);
            const res = await request(app)
                .get('/api/dictionary/export-file')
                .set(adminHeaders);
            expect(res.status).toBe(200);
            expect(res.header['content-type']).toContain('text/plain');
            expect(res.text).toContain('kot pl easy');
        });
    });

    describe('DELETE /api/dictionary/word', () => {
        it('usuwa słowo', async () => {
            (DictionaryService.deleteWord as jest.Mock).mockResolvedValue(undefined);
            const res = await request(app)
                .delete('/api/dictionary/word')
                .set(adminHeaders)
                .send({ word: 'kot', language: 'pl' });
            expect(res.status).toBe(200);
        });

        it('zwraca 400 gdy brak danych', async () => {
            const res = await request(app)
                .delete('/api/dictionary/word')
                .set(adminHeaders)
                .send({});
            expect(res.status).toBe(400);
        });

        it('zwraca 404 gdy słowo nie istnieje', async () => {
            (DictionaryService.deleteWord as jest.Mock).mockRejectedValue(new Error('nie istnieje'));
            const res = await request(app)
                .delete('/api/dictionary/word')
                .set(adminHeaders)
                .send({ word: 'pies', language: 'pl' });
            expect(res.status).toBe(404);
        });
    });

    describe('GET /api/dictionary/languages', () => {
        it('zwraca listę języków', async () => {
            (DictionaryService.getLanguages as jest.Mock).mockResolvedValue(['pl', 'en']);
            const res = await request(app)
                .get('/api/dictionary/languages')
                .set(adminHeaders);
            expect(res.status).toBe(200);
            expect(res.body).toEqual(['pl', 'en']);
        });
    });

    describe('GET /api/dictionary/word-counts', () => {
        it('zwraca liczbę słów wg języka', async () => {
            (DictionaryService.getWordCountsByLanguage as jest.Mock).mockResolvedValue({ pl: 10 });
            const res = await request(app)
                .get('/api/dictionary/word-counts')
                .set(adminHeaders);
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ pl: 10 });
        });
    });
});