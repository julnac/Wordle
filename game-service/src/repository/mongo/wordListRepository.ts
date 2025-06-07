import { getDb } from "./mongodb";
import {IWordList, WordListDTO} from "./models/wordList";

const WORDLIST_COLLECTION_NAME = "wordlists";

export default class WordListRepository {

    //gra
    static async getRandomWord(wordLength: number, language: string, level?: 'easy' | 'medium' | 'hard'): Promise<string | null> {
        const query: any = { language: language };
        if (level) query.difficulty = level;
        if (wordLength && wordLength > 0) {
            query.$expr = { $eq: [ { $strLenCP: "$word" }, wordLength ] };
        }

        const randomWords = await getDb().collection<IWordList>(WORDLIST_COLLECTION_NAME).aggregate([
            { $match: query },
            { $sample: { size: 1 } }
        ]).toArray();

        if (randomWords.length > 0) {
            return randomWords[0].word;
        }
        return null;
    }

    //api Pobieranie słów z filtrowaniem i sortowaniem
    static async getWords(
        filter: Partial<Pick<IWordList, 'language' | 'difficulty' | 'category'>> = {},
        sort: Partial<Record<'language' | 'difficulty' | 'category', 1 | -1>> = {}
    ): Promise<IWordList[]> {
        return getDb().collection<IWordList>(WORDLIST_COLLECTION_NAME)
            .find(filter)
            .sort(sort)
            .toArray();
    }

    //api Liczba słów wg języka
    static async getWordCountsByLanguage(): Promise<Record<string, number>> {
        const result = await getDb().collection<IWordList>(WORDLIST_COLLECTION_NAME).aggregate([
            { $group: { _id: "$language", count: { $sum: 1 } } }
        ]).toArray();
        return Object.fromEntries(result.map(r => [r._id, r.count]));
    }

    //api Lista języków
    static async getLanguages(): Promise<string[]> {
        return getDb().collection<IWordList>(WORDLIST_COLLECTION_NAME).distinct('language');
    }

    //api Dodawanie pojedynczego słowa
    static async addWord(wordData: WordListDTO): Promise<IWordList> {
        const exists = await this.doesWordExist(wordData.word, wordData.language);
        if (exists) {
            throw new Error(`Word "${wordData.word}" already exists in language "${wordData.language}".`);
        }
        const result = await getDb().collection<WordListDTO>(WORDLIST_COLLECTION_NAME).insertOne(wordData);
        return { ...wordData, _id: result.insertedId } as IWordList;
    }

    static async addWordList(words: WordListDTO[]): Promise<{
        successfulUploads: number;
        failedUploads: number;
        errors: { word: string, error: any }[];
    }> {
        if (words.length === 0) return { successfulUploads: 0, failedUploads: 0, errors: [] };

        // Pobierz wszystkie istniejące słowa dla danego języka
        const language = words[0].language;
        const existingWords = await getDb().collection<IWordList>(WORDLIST_COLLECTION_NAME)
            .find({ language })
            .project({ word: 1 })
            .toArray();
        const existingSet = new Set(existingWords.map(w => w.word));

        // Przefiltruj duplikaty
        const toInsert = words.filter(w => !existingSet.has(w.word));
        const failedUploads = words.length - toInsert.length;
        const errors = words
            .filter(w => existingSet.has(w.word))
            .map(w => ({ word: w.word, error: `Word "${w.word}" already exists in language "${w.language}".` }));

        // Wstaw hurtowo
        let successfulUploads = 0;
        if (toInsert.length > 0) {
            const result = await getDb().collection<WordListDTO>(WORDLIST_COLLECTION_NAME).insertMany(toInsert);
            successfulUploads = result.insertedCount;
        }

        return { successfulUploads, failedUploads, errors };
    }

    static async doesWordExist(word: string, language: string): Promise<boolean> {
        try {
            const result = await getDb().collection<IWordList>(WORDLIST_COLLECTION_NAME).findOne({ word, language });
            return !!result;
        } catch (error) {
            console.error("Error checking word existence:", error);
            return false;
        }
    }

    //api Usuwanie pojedynczego słowa
    static async deleteWord(word: string, language: string): Promise<void> {
        await getDb().collection<IWordList>(WORDLIST_COLLECTION_NAME).deleteOne({ word, language });
    }

    //api usuwanie wszystkich słów z danego języka
    static async deleteWordsByLanguage(language: string): Promise<void> {
        try {
            await getDb().collection<IWordList>(WORDLIST_COLLECTION_NAME).deleteMany({ language });
            console.log(`Successfully deleted words for language: ${language}`);
        } catch (error) {
            console.error(`Failed to delete words for language "${language}":`, error);
            throw error;
        }
    }
}