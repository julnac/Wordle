import WordListRepository from '../../repository/mongo/wordListRepository';
import { IWordList } from '../../repository/mongo/models/wordList';

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

    static async deleteWordsByLanguage(language: string): Promise<void> {
        try {
            await WordListRepository.deleteWordsByLanguage(language);
            console.log(`Successfully deleted words for language: ${language}`);
        } catch (error) {
            console.error(`Failed to delete words for language "${language}":`, error);
            throw error; // Rethrow the error to be handled by the caller
        }
    }

}