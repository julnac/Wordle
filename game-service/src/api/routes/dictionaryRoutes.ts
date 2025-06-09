import express, { Router } from 'express';
import multer from 'multer';
import DictionaryController from '../controllers/dictionaryController';
import requireRole from "../middleware/requireRole";

const router: Router = express.Router();
const dictionaryController = new DictionaryController();
const upload = multer();
// router.use(requireRole('app-admin'));

/**
 * @openapi
 * /api/dictionary/upload-file:
 *   post:
 *     summary: Wgraj plik .txt z listą słów
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Słowa zostały wgrane z pliku
 */
router.post('/upload-file', upload.single('file'), requireRole('app-admin'), (req, res) => dictionaryController.uploadWordsFromFile(req, res));

/**
 * @openapi
 * /api/dictionary/language/{language}:
 *   delete:
 *     summary: Usuń wszystkie słowa dla danego języka
 *     parameters:
 *       - in: path
 *         name: language
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Słowa zostały usunięte
 */
router.delete('/language/:language', requireRole('app-admin'),(req, res) => dictionaryController.deleteWordsByLanguage(req, res));

/**
 * @openapi
 * /api/dictionary/words:
 *   get:
 *     summary: Pobierz listę słów (opcjonalnie z filtrowaniem)
 *     parameters:
 *       - in: query
 *         name: language
 *         required: false
 *         schema:
 *           type: string
 *         description: Kod języka (np. 'pl', 'en')
 *     responses:
 *       200:
 *         description: Lista słów
 */
router.get('/words', requireRole('app-admin'), (req, res) => dictionaryController.getWords(req, res));

/**
 * @openapi
 * /api/dictionary/export-file:
 *   get:
 *     summary: Eksportuj słowa do pliku .txt
 *     parameters:
 *       - in: query
 *         name: language
 *         required: false
 *         schema:
 *           type: string
 *         description: Kod języka (np. 'pl', 'en')
 *     responses:
 *       200:
 *         description: Plik z listą słów został wygenerowany
 */
router.get('/export-file', requireRole('app-admin'), (req, res) => dictionaryController.exportWordsToFile(req, res));

/**
 * @openapi
 * /api/dictionary/word:
 *   delete:
 *     summary: Usuń pojedyncze słowo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               word:
 *                 type: string
 *               language:
 *                 type: string
 *     responses:
 *       200:
 *         description: Słowo zostało usunięte
 */
router.delete('/word', requireRole('app-admin'), (req, res) => dictionaryController.deleteWord(req, res));

/**
 * @openapi
 * /api/dictionary/languages:
 *   get:
 *     summary: Pobierz dostępne języki
 *     responses:
 *       200:
 *         description: Lista języków
 */
router.get('/languages', (req, res) => dictionaryController.getLanguages(req, res));

/**
 * @openapi
 * /api/dictionary/word-counts:
 *   get:
 *     summary: Pobierz liczbę słów wg języka
 *     responses:
 *       200:
 *         description: Liczba słów dla każdego języka
 */
router.get('/word-counts', (req, res) => dictionaryController.getWordCountsByLanguage(req, res));

export default router;