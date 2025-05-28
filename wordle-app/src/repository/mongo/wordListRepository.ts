import { getDb } from "./mongodb";
import { IWordList } from "./models/wordList";

const WORDLIST_COLLECTION_NAME = "wordlists";

export default class WordListRepository {

    static async getRandomWord(wordLength: number, language: string, level?: 'easy' | 'medium' | 'hard'): Promise<string | null> {

        const query: any = { language: language };
        if (level) query.difficulty = level;
        if (wordLength) query.$expr = { $eq: [ { $strLenCP: "$word" }, wordLength ] };

        const randomWords = await getDb().collection<IWordList>(WORDLIST_COLLECTION_NAME).aggregate([
            { $match: query },
            { $sample: { size: 1 } }
        ]).toArray();

        if (randomWords.length > 0) {
            return randomWords[0].word;
        }
        return null;
    }

    /**
     * Dodaje nowe słowo do kolekcji.
     * @param wordData Dane słowa do dodania.
     * @returns Obiekt IWordList z dodanym _id.
     */
    static async addWord(wordData: Omit<IWordList, '_id' | 'id'>): Promise<IWordList> {
        const result = await getDb().collection<IWordList>(WORDLIST_COLLECTION_NAME).insertOne(wordData as IWordList);
        return { ...wordData, _id: result.insertedId } as IWordList;
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

    static async deleteWordsByLanguage(language: string): Promise<void> {
        try {
            await getDb().collection<IWordList>(WORDLIST_COLLECTION_NAME).deleteMany({ language });
            console.log(`Successfully deleted words for language: ${language}`);
        } catch (error) {
            console.error(`Failed to delete words for language "${language}":`, error);
            throw error;
        }
    }

    // Tutaj możesz dodać inne metody do zarządzania listą słów, np.:
    // async findWordByText(text: string): Promise<IWordList | null> {
    //   return this.db.collection<IWordList>(WORDLIST_COLLECTION_NAME).findOne({ word: text });
    // }
    //
    // async updateWordDifficulty(wordId: string, newDifficulty: 'easy' | 'medium' | 'hard'): Promise<void> {
    //   await this.db.collection<IWordList>(WORDLIST_COLLECTION_NAME).updateOne(
    //     { _id: new ObjectId(wordId) }, // Pamiętaj o konwersji string ID na ObjectId, jeśli używasz _id
    //     { $set: { difficulty: newDifficulty } }
    //   );
    // }
}