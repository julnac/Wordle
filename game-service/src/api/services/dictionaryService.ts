import WordListRepository from '../../repository/mongo/wordListRepository';
import { IWordList } from '../../repository/mongo/models/wordList';
import {WordListDTO} from "../../repository/mongo/models/wordList";

interface UploadResult {
    successfulUploads: number;
    failedUploads: number;
    errors: { word: string, error: any }[];
}

export default class UploadDictService {

    //api Wgrywanie pliku txt, walidacja i zapis do bazy
    static async uploadWordsFromContent(fileContent: string): Promise<UploadResult> {
        const lines = fileContent.split('\n').filter(Boolean);
        let successfulUploads = 0;
        let failedUploads = 0;
        const errors: { word: string, error: any }[] = [];

        for (const line of lines) {
            try {
                const [word, language, difficulty, category] = line.split(' ').map(s => s.trim());
                if (!word || !language) {
                    throw new Error('Brak wymaganych pól: word, language');
                }
                const wordObj: WordListDTO = {
                    word,
                    language,
                    difficulty: (difficulty as 'easy' | 'medium' | 'hard') || undefined,
                    category: category || undefined,
                };
                await WordListRepository.addWord(wordObj);
                successfulUploads++;
            } catch (error) {
                failedUploads++;
                errors.push({ word: line, error });
            }
        }
        return { successfulUploads, failedUploads, errors };
    }

    static async uploadWords(words: Omit<IWordList, '_id' | 'id'>[]): Promise<{
        successfulUploads: number;
        failedUploads: number;
        errors: { word: string, error: any }[];
    }> {
        let successfulUploads = 0;
        let failedUploads = 0;
        const errors: { word: string, error: any }[] = [];

        for (const wordObj of words) {
            try {
                if (!wordObj.word || !wordObj.language) {
                    throw new Error('Brak wymaganych pól: word, language');
                }
                await WordListRepository.addWord(wordObj);
                successfulUploads++;
            } catch (error) {
                failedUploads++;
                errors.push({ word: wordObj.word, error: (error as Error).message });
            }
        }
        return { successfulUploads, failedUploads, errors };
    }

    //api Pobieranie słów z opcjonalnym filtrowaniem i sortowaniem
    static async getWords(
        filter: Partial<Pick<IWordList, 'language' | 'difficulty' | 'category'>> = {},
        sort: Partial<Record<'language' | 'difficulty' | 'category', 1 | -1>> = {}
    ): Promise<IWordList[]> {
        return WordListRepository.getWords(filter, sort);
    }

    //api Liczba słów wg języka
    static async getWordCountsByLanguage(): Promise<Record<string, number>> {
        return WordListRepository.getWordCountsByLanguage();
    }

    //api Lista języków dostępnych w bazie
    static async getLanguages(): Promise<string[]> {
        return WordListRepository.getLanguages();
    }

    //api Usuwanie pojedynczego słowa
    static async deleteWord(word: string, language: string): Promise<void> {
        await WordListRepository.deleteWord(word, language);
    }

    //api Usuwanie wszystkich słów z danego języka
    static async deleteWordsByLanguage(language: string): Promise<void> {
        await WordListRepository.deleteWordsByLanguage(language);
    }
}