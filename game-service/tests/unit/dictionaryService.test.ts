import DictionaryService from '../../src/api/services/dictionaryService';
import WordListRepository from '../../src/repository/mongo/wordListRepository';

jest.mock('../../src/repository/mongo/wordListRepository');

describe('DictionaryService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('uploadWordsFromContent', () => {
        it('poprawnie wgrywa słowa z pliku', async () => {
            (WordListRepository.addWordList as jest.Mock).mockResolvedValue({
                successfulUploads: 2,
                failedUploads: 0,
                errors: [],
            });
            const fileContent = 'kot pl easy\npies pl medium';
            const result = await DictionaryService.uploadWordsFromContent(fileContent);
            expect(result.successfulUploads).toBe(2);
            expect(result.failedUploads).toBe(0);
            expect(WordListRepository.addWordList).toHaveBeenCalled();
        });

        it('ignoruje linie bez wymaganych pól', async () => {
            (WordListRepository.addWordList as jest.Mock).mockResolvedValue({
                successfulUploads: 1,
                failedUploads: 0,
                errors: [],
            });
            const fileContent = 'kot pl\ntylkojedno';
            const result = await DictionaryService.uploadWordsFromContent(fileContent);
            expect(result.successfulUploads).toBe(1);
        });

        it('waliduje język i znaki', async () => {
            (WordListRepository.addWordList as jest.Mock).mockResolvedValue({
                successfulUploads: 0,
                failedUploads: 0,
                errors: [],
            });
            const fileContent = 'kot pl\npies xx\n123 pl';
            const result = await DictionaryService.uploadWordsFromContent(fileContent);
            expect(result.failedUploads).toBe(2);
            expect(result.errors.some(e => e.error.includes('Nieprawidłowy język'))).toBe(true);
            expect(result.errors.some(e => e.error.includes('tylko litery'))).toBe(true);
        });
    });

    describe('uploadWords', () => {
        it('dodaje słowa i obsługuje błędy', async () => {
            (WordListRepository.addWord as jest.Mock)
                .mockResolvedValueOnce(undefined)
                .mockRejectedValueOnce(new Error('Błąd'));
            const words = [
                { word: 'kot', language: 'pl' },
                { word: 'pies', language: 'pl' }
            ];
            const result = await DictionaryService.uploadWords(words as any);
            expect(result.successfulUploads).toBe(1);
            expect(result.failedUploads).toBe(1);
            expect(result.errors.length).toBe(1);
        });
    });

    describe('getWords', () => {
        it('pobiera słowa z repozytorium', async () => {
            (WordListRepository.getWords as jest.Mock).mockResolvedValue([{ word: 'kot', language: 'pl' }]);
            const result = await DictionaryService.getWords({ language: 'pl' });
            expect(result).toEqual([{ word: 'kot', language: 'pl' }]);
        });
    });

    describe('getWordCountsByLanguage', () => {
        it('zwraca liczbę słów wg języka', async () => {
            (WordListRepository.getWordCountsByLanguage as jest.Mock).mockResolvedValue({ pl: 10 });
            const result = await DictionaryService.getWordCountsByLanguage();
            expect(result).toEqual({ pl: 10 });
        });
    });

    describe('getLanguages', () => {
        it('zwraca listę języków', async () => {
            (WordListRepository.getLanguages as jest.Mock).mockResolvedValue(['pl', 'en']);
            const result = await DictionaryService.getLanguages();
            expect(result).toEqual(['pl', 'en']);
        });
    });

    describe('deleteWord', () => {
        it('usuwa słowo jeśli istnieje', async () => {
            (WordListRepository.doesWordExist as jest.Mock).mockResolvedValue(true);
            (WordListRepository.deleteWord as jest.Mock).mockResolvedValue(undefined);
            await DictionaryService.deleteWord('kot', 'pl');
            expect(WordListRepository.deleteWord).toHaveBeenCalledWith('kot', 'pl');
        });

        it('rzuca błąd jeśli słowo nie istnieje', async () => {
            (WordListRepository.doesWordExist as jest.Mock).mockResolvedValue(false);
            await expect(DictionaryService.deleteWord('pies', 'pl')).rejects.toThrow('nie istnieje');
        });
    });

    describe('deleteWordsByLanguage', () => {
        it('usuwa wszystkie słowa dla języka', async () => {
            (WordListRepository.deleteWordsByLanguage as jest.Mock).mockResolvedValue(undefined);
            await DictionaryService.deleteWordsByLanguage('pl');
            expect(WordListRepository.deleteWordsByLanguage).toHaveBeenCalledWith('pl');
        });
    });
});