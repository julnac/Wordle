import express, { Router } from 'express';
import DictionaryController from '../controllers/dictionaryController';
// import {authenticateToken} from "../middleware/authMiddleware";

const router: Router = express.Router();
const dictionaryController = new DictionaryController();

// Trasa do przesyłania listy słów
// np. POST /api/dictionary/upload z [{ word: "test", language: "pl", length: 4 }, ...] w body
/**
 * @openapi
 * /api/dictionary/upload:
 *   post:
 *     summary: Prześlij listę słów do słownika
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 word:
 *                   type: string
 *                 language:
 *                   type: string
 *                 length:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Słowa zostały dodane
 */
router.post('/upload', (req, res) => dictionaryController.uploadWords(req, res));

// Trasa do usuwania słów dla danego języka
// np. DELETE /api/dictionary/language/pl
/**
 * @openapi
 * /api/dictionary/language/{language}:
 *   delete:
 *     summary: Usuń słowa dla danego języka
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
router.delete('/language/:language', (req, res) => dictionaryController.deleteWordsByLanguage(req, res));

export default router;