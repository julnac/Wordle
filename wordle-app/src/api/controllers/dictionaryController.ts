import { Request, Response } from 'express';
import UploadDictService from '../services/uploadDictService';
import { IWordList } from '../../repository/mongo/models/wordList';

export default class DictionaryController {
    async uploadWords(req: Request, res: Response): Promise<void> {
        try {
            const wordsData = req.body as IWordList[]; // Zakładamy, że body to tablica IWordList
            if (!Array.isArray(wordsData) || wordsData.length === 0) {
                res.status(400).json({ message: 'Oczekiwano tablicy obiektów słów w ciele żądania.' });
                return;
            }
            // Podstawowa walidacja każdego obiektu słowa
            for (const wordObj of wordsData) {
                if (!wordObj.word || typeof wordObj.word !== 'string' || !wordObj.language || typeof wordObj.language !== 'string') {
                    res.status(400).json({ message: 'Każdy obiekt słowa musi zawierać pola "word" (string) i "language" (string).' });
                    return;
                }
            }

            const result = await UploadDictService.uploadWords(wordsData);
            res.status(201).json(result);
        } catch (error) {
            console.error("Błąd podczas przesyłania słów:", error);
            res.status(500).json({ message: "Błąd podczas przesyłania słów", error: (error as Error).message });
        }
    }

    async deleteWordsByLanguage(req: Request, res: Response): Promise<void> {
        try {
            const { language } = req.params;
            if (!language) {
                res.status(400).json({ message: "Parametr 'language' w ścieżce jest wymagany." });
                return;
            }

            await UploadDictService.deleteWordsByLanguage(language);
            res.status(200).json({ message: `Słowa dla języka '${language}' zostały pomyślnie usunięte.` });
        } catch (error) {
            console.error(`Błąd podczas usuwania słów dla języka ${req.params.language}:`, error);
            res.status(500).json({ message: "Błąd podczas usuwania słów", error: (error as Error).message });
        }
    }
}