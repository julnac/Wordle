import WordListRepository from '../../repository/mongo/wordListRepository';
import { IWordList } from '../../repository/mongo/models/wordList';
import fs from 'fs/promises';
import path from 'path';

interface UploadResult {
    successfulUploads: number;
    failedUploads: number;
    errors: { word: string, error: any }[];
}

export default class UploadDictService {

    static async uploadWords(wordsData: IWordList[]): Promise<UploadResult> {
        let successfulUploads = 0;
        let failedUploads = 0;
        const errors: { word: string, error: any }[] = [];

        for (const wordToAdd of wordsData) {
            try {
                if (!wordToAdd.category) {
                    wordToAdd.category = 'none';
                }
                await WordListRepository.addWord(wordToAdd);
                successfulUploads++;
            } catch (error) {
                failedUploads++;
                errors.push({ word: wordToAdd.word, error: error });
                console.error(`Failed to upload word "${wordToAdd.word}":`, error);
            }
        }

        return {
            successfulUploads,
            failedUploads,
            errors,
        };
    }

    static async uploadLanguage(language: string): Promise<UploadResult> {
        try {
            const fileMap: Record<string, string> = {
                pl: path.join(__dirname, '../data/pl_top_categories.txt'),
                en: path.join(__dirname, '../data/en_top_categories.txt'),
                es: path.join(__dirname, '../data/es_top_categories.txt'),
                de: path.join(__dirname, '../data/de_top_categories.txt'),
            };

            const filePath = fileMap[language];
            if (!filePath) {
                throw new Error(`Nieobsługiwany język: ${language}`);
            }

            // Wczytaj plik
            const fileContent = await fs.readFile(filePath, 'utf-8');
            const lines = fileContent.split('\n').filter(Boolean);

            let wordList: IWordList[] = [];
            for (const line of lines) {
                const [word, freqStr, category] = line.split(' ').map(s => s.trim());
                if (word && freqStr) {
                    const frequency = parseInt(freqStr, 10);
                    let difficulty: 'easy' | 'medium' | 'hard';
                    if (frequency >= 1000) difficulty = 'easy';
                    else if (frequency >= 500) difficulty = 'medium';
                    else difficulty = 'hard';

                    wordList.push({
                        word,
                        difficulty,
                        language,
                        category
                    } as IWordList);
                }
            }

            return await UploadDictService.uploadWords(wordList);

        } catch (error) {
            console.error(`Failed to upload language "${language}":`, error);
            throw error;
        }
    }

    static async deleteWordsByLanguage(language: string): Promise<void> {
        try {
            await WordListRepository.deleteWordsByLanguage(language);
            console.log(`Successfully deleted words for language: ${language}`);
        } catch (error) {
            console.error(`Failed to delete words for language "${language}":`, error);
            throw error;
        }
    }

}