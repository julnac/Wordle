import GameService from '../../src/api/services/gameService';
import WordListRepository from '../../src/repository/mongo/wordListRepository';
import axios from 'axios';

jest.mock('../../src/repository/mongo/wordListRepository');
jest.mock('axios');

const mockCache = {
    getCache: jest.fn(),
    setCache: jest.fn(),
};
const mockLeaderboard = {
    addScore: jest.fn(),
};

describe('GameService', () => {
    let service: GameService;

    beforeEach(() => {
        service = new GameService(mockCache as any, mockLeaderboard as any);
        jest.clearAllMocks();
        (axios.post as jest.Mock).mockResolvedValue({});
    });

    describe('startGame', () => {
        it('tworzy nową grę gdy użytkownik nie ma aktywnej gry', async () => {
            mockCache.getCache.mockResolvedValueOnce(null);
            (WordListRepository.getRandomWord as jest.Mock).mockResolvedValue('ZAMEK');

            const game = await service.startGame('user1', 6, 5, 'pl', 'easy');

            expect(game).toHaveProperty('id');
            expect(game.userId).toBe('user1');
            expect(game.word).toBe('ZAMEK');
            expect(game.status).toBe('ongoing');
            expect(game.attemptsAllowed).toBe(6);
            expect(game.wordLength).toBe(5);
            expect(mockCache.setCache).toHaveBeenCalledTimes(2);
        });

        it('rzuca błąd gdy użytkownik ma już aktywną grę', async () => {
            mockCache.getCache
                .mockResolvedValueOnce('existing-id')
                .mockResolvedValueOnce({ id: 'existing-id', status: 'ongoing' });

            await expect(
                service.startGame('user1', 6, 5, 'pl', 'easy')
            ).rejects.toThrow('Gracz ma już aktywną grę');
        });

        it('rzuca błąd gdy nie znaleziono słowa', async () => {
            mockCache.getCache.mockResolvedValueOnce(null);
            (WordListRepository.getRandomWord as jest.Mock).mockResolvedValue(null);

            await expect(
                service.startGame('user1', 6, 5, 'pl', 'easy')
            ).rejects.toThrow('No words found for language "pl" and length "5"');
        });
    });

    describe('submitGuess', () => {
        const makeGame = (overrides: Record<string, any> = {}) => ({
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
            ...overrides,
        });

        it('normalizuje guess do wielkich liter', async () => {
            mockCache.getCache.mockResolvedValue(makeGame());

            const result = await service.submitGuess('game1', 'zamek', 'user1');

            expect(result.attempts).toContain('ZAMEK');
        });

        it('zwraca status completed gdy słowo poprawne', async () => {
            mockCache.getCache.mockResolvedValue(makeGame());

            const result = await service.submitGuess('game1', 'ZAMEK', 'user1');

            expect(result.status).toBe('completed');
            expect(mockLeaderboard.addScore).toHaveBeenCalled();
        });

        it('zwraca status failed po wyczerpaniu prób', async () => {
            mockCache.getCache.mockResolvedValue(makeGame({ attemptsAllowed: 1 }));

            const result = await service.submitGuess('game1', 'KARTA', 'user1');

            expect(result.status).toBe('failed');
            expect(mockLeaderboard.addScore).toHaveBeenCalled();
        });

        it('pozostawia status ongoing gdy słowo błędne i są pozostałe próby', async () => {
            mockCache.getCache.mockResolvedValue(makeGame({ attemptsAllowed: 6 }));

            const result = await service.submitGuess('game1', 'KARTA', 'user1');

            expect(result.status).toBe('ongoing');
            expect(mockLeaderboard.addScore).not.toHaveBeenCalled();
        });

        it('rzuca błąd gdy gra nie istnieje', async () => {
            mockCache.getCache.mockResolvedValue(null);

            await expect(
                service.submitGuess('nonexistent', 'ZAMEK', 'user1')
            ).rejects.toThrow('Game not found or session expired');
        });

        it('rzuca błąd gdy guess ma złą długość', async () => {
            mockCache.getCache.mockResolvedValue(makeGame({ wordLength: 5 }));

            await expect(
                service.submitGuess('game1', 'KOT', 'user1')
            ).rejects.toThrow('Guess length must be 5');
        });

        it('rzuca błąd gdy gra jest już zakończona', async () => {
            mockCache.getCache.mockResolvedValue(makeGame({ status: 'completed' }));

            await expect(
                service.submitGuess('game1', 'ZAMEK', 'user1')
            ).rejects.toThrow('Game is already completed or failed');
        });
    });

    describe('walidacja liter (algorytm dwuprzebiegowy)', () => {
        const makeGame = (word: string) => ({
            id: 'game1',
            userId: 'user1',
            word,
            wordLength: word.length,
            attempts: [],
            letters: [],
            attemptsAllowed: 6,
            status: 'ongoing',
            level: 'easy',
            language: 'pl',
            startTime: Date.now(),
        });

        const getLetters = async (target: string, guess: string) => {
            mockCache.getCache.mockResolvedValue(makeGame(target));
            const result = await service.submitGuess('game1', guess, 'user1');
            return result.letters;
        };

        it('wszystkie litery correct gdy słowo idealne', async () => {
            const letters = await getLetters('ZAMEK', 'ZAMEK');
            expect(letters.every(l => l.status === 'correct')).toBe(true);
        });

        it('wszystkie litery absent gdy brak żadnej litery ze słowa', async () => {
            const letters = await getLetters('ABCDE', 'ZZZZZ');
            expect(letters.every(l => l.status === 'absent')).toBe(true);
        });

        it('poprawnie oznacza correct, present i absent', async () => {
            // ZAMEK: Z(0), A(1), M(2), E(3), K(4)
            // KARTA: K(0), A(1), R(2), T(3), A(4)
            // K[0]: K jest w ZAMEK na poz.4 → present
            // A[1]: A jest w ZAMEK na poz.1 → correct
            // R[2]: brak w ZAMEK → absent
            // T[3]: brak w ZAMEK → absent
            // A[4]: A już zużyte przez poz.1 → absent
            const letters = await getLetters('ZAMEK', 'KARTA');
            expect(letters[0]).toMatchObject({ letter: 'K', status: 'present' });
            expect(letters[1]).toMatchObject({ letter: 'A', status: 'correct' });
            expect(letters[2]).toMatchObject({ letter: 'R', status: 'absent' });
            expect(letters[3]).toMatchObject({ letter: 'T', status: 'absent' });
            expect(letters[4]).toMatchObject({ letter: 'A', status: 'absent' });
        });

        it('nie oznacza więcej present niż liczba wystąpień litery w słowie', async () => {
            // Cel: ABABA  Próba: AAAAA
            // Przebieg 1: poz.0,2,4 → correct (A=A), poz.1,3 → brak (A≠B)
            // tempWord po przebiegu 1: ['','B','','B','']
            // Przebieg 2: poz.1 szuka A w ['','B','','B',''] → nie znalazło → absent
            //             poz.3 tak samo → absent
            const letters = await getLetters('ABABA', 'AAAAA');
            expect(letters[0]).toMatchObject({ letter: 'A', status: 'correct' });
            expect(letters[1]).toMatchObject({ letter: 'A', status: 'absent' });
            expect(letters[2]).toMatchObject({ letter: 'A', status: 'correct' });
            expect(letters[3]).toMatchObject({ letter: 'A', status: 'absent' });
            expect(letters[4]).toMatchObject({ letter: 'A', status: 'correct' });
        });
    });

    describe('getGameStatus', () => {
        it('zwraca null gdy gra nie istnieje', async () => {
            mockCache.getCache.mockResolvedValue(null);
            expect(await service.getGameStatus('nonexistent')).toBeNull();
        });

        it('zwraca grę gdy istnieje', async () => {
            const game = { id: 'game1', status: 'ongoing' };
            mockCache.getCache.mockResolvedValue(game);
            expect(await service.getGameStatus('game1')).toEqual(game);
        });
    });
});
