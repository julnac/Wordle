import { Request, Response } from 'express';
import DictionaryService from '../services/dictionaryService';
import { IWordList } from '../../repository/mongo/models/wordList';

export default class DictionaryController {

    // Wgrywanie pliku txt
    async uploadWordsFromFile(req: Request, res: Response): Promise<void> {
        try {
            if (!req.file) {
                res.status(400).json({ message: 'Brak pliku w żądaniu.' });
                return;
            }
            const fileContent = req.file.buffer.toString('utf-8');
            const result = await DictionaryService.uploadWordsFromContent(fileContent);
            res.status(201).json(result);
        } catch (error) {
            console.error("Błąd podczas uploadu pliku:", error);
            res.status(500).json({ message: "Błąd podczas uploadu pliku", error: (error as Error).message });
        }
    }

    async deleteWordsByLanguage(req: Request, res: Response): Promise<void> {
        try {
            const { language } = req.params;
            if (!language || !['pl', 'en', 'es', 'de'].includes(language)) {
                res.status(400).json({ message: "Parametr 'language' w ścieżce jest wymagany i musi być jednym z: pl, en, es, de." });
                return;
            }

            await DictionaryService.deleteWordsByLanguage(language);
            res.status(200).json({ message: `Słowa dla języka '${language}' zostały pomyślnie usunięte.` });
        } catch (error) {
            console.error(`Błąd podczas usuwania słów dla języka ${req.params.language}:`, error);
            res.status(500).json({ message: "Błąd podczas usuwania słów", error: (error as Error).message });
        }
    }

    // Pobierz listę słów z opcjonalnym filtrowaniem
    async getWords(req: Request, res: Response): Promise<void> {
        try {
            const { language, difficulty, category, sortField, sortOrder } = req.query;
            const filter: any = {};
            if (language) filter.language = language;
            if (difficulty) filter.difficulty = difficulty;
            if (category) filter.category = category;
            const sort: any = {};
            if (sortField && sortOrder) sort[sortField as string] = sortOrder === 'desc' ? -1 : 1;

            const words = await DictionaryService.getWords(filter, sort);
            res.status(200).json(words);
        } catch (error) {
            res.status(500).json({ message: "Błąd podczas pobierania słów", error: (error as Error).message });
        }
    }

    // Usuń pojedyncze słowo
    async deleteWord(req: Request, res: Response): Promise<void> {
        try {
            const { word, language } = req.body;
            if (!word || !language) {
                res.status(400).json({ message: "Wymagane pola: word, language." });
                return;
            }
            await DictionaryService.deleteWord(word, language);
            res.status(200).json({ message: `Słowo "${word}" w języku "${language}" zostało usunięte.` });
        } catch (error) {
            if ((error as Error).message.includes('nie istnieje')) {
                res.status(404).json({ message: (error as Error).message });
            } else {
                res.status(500).json({ message: "Błąd podczas usuwania słowa", error: (error as Error).message });
            }
        }
    }

    // Pobierz dostępne języki
    async getLanguages(req: Request, res: Response): Promise<void> {
        try {
            const languages = await DictionaryService.getLanguages();
            res.status(200).json(languages);
        } catch (error) {
            res.status(500).json({ message: "Błąd podczas pobierania języków", error: (error as Error).message });
        }
    }

    // Pobierz liczbę słów wg języka
    async getWordCountsByLanguage(req: Request, res: Response): Promise<void> {
        try {
            const counts = await DictionaryService.getWordCountsByLanguage();
            res.status(200).json(counts);
        } catch (error) {
            res.status(500).json({ message: "Błąd podczas pobierania liczby słów", error: (error as Error).message });
        }
    }

}