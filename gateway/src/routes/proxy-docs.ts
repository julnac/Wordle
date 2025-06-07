/**
 * @openapi
 * /game-service/api/dictionary/upload-file:
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
 *
 *
 * /game-service/api/dictionary/language/{language}:
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
 *
 * /game-service/api/dictionary/words:
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
 *
 * /game-service/api/dictionary/word:
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
 *
 * /game-service/api/dictionary/languages:
 *   get:
 *     summary: Pobierz dostępne języki
 *     responses:
 *       200:
 *         description: Lista języków
 *
 * /game-service/api/dictionary/word-counts:
 *   get:
 *     summary: Pobierz liczbę słów wg języka
 *     responses:
 *       200:
 *         description: Liczba słów dla każdego języka
 *
 * /game-service/api/game/start/{userId}:
 *   post:
 *     summary: Rozpocznij nową grę
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               attemptsAllowed:
 *                 type: integer
 *               wordLength:
 *                 type: integer
 *               language:
 *                 type: string
 *               level:
 *                 type: string
 *     responses:
 *       200:
 *         description: Gra została rozpoczęta
 *
 * /game-service/api/game/guess/{gameId}:
 *   post:
 *     summary: Prześlij próbę odgadnięcia słowa
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               guess:
 *                 type: string
 *     responses:
 *       200:
 *         description: Wynik próby
 *
 * /game-service/api/game/status/{gameId}:
 *   get:
 *     summary: Pobierz status gry
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Status gry
 *
 * /game-service/api/game/current/{userId}:
 *   get:
 *     summary: Pobierz aktywną gre gracza
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Gra
 *
 * /game-service/api/leaderboard:
 *   get:
 *     summary: Pobierz najlepsze wyniki dla danego języka
 *     parameters:
 *       - in: query
 *         name: language
 *         required: false
 *         schema:
 *           type: string
 *         description: Kod języka (np. 'pl', 'en', 'es', 'de')
 *       - in: query
 *         name: difficulty
 *         required: false
 *         schema:
 *           type: string
 *         description: Poziom trudności (np. 'easy', 'medium', 'hard')
 *       - in: query
 *         name: count
 *         required: false
 *         schema:
 *           type: integer
 *         description: Liczba wyników do pobrania (domyślnie 10)
 *     responses:
 *       200:
 *         description: Lista najlepszych wyników
 *   post:
 *     summary: Dodaj wynik do rankingu
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               language:
 *                 type: string
 *               level:
 *                 type: string
 *               status:
 *                 type: string
 *               endTime:
 *                 type: integer
 *               startTime:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Wynik został dodany
 *       400:
 *         description: Błędne dane gry
 *
 * /user-service/api/user/{userId}/profile:
 *   get:
 *     summary: Pobierz profil użytkownika
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Profil użytkownika
 *       404:
 *         description: Nie znaleziono profilu
 *   put:
 *     summary: Aktualizuj profil użytkownika
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Zaktualizowany profil
 *
 * /user-service/api/user/{userId}/gamehistory:
 *   post:
 *     summary: Zaktualizuj historię gier użytkownika
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       204:
 *         description: Historia zaktualizowana
 *   get:
 *     summary: Pobierz historię gier użytkownika
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Historia gier
 *
 * /user-service/api/user/{userId}/rewards:
 *   get:
 *     summary: Pobierz nagrody użytkownika
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista nagród
 *
 * /user-service/api/user/{userId}/stats:
 *   get:
 *     summary: Pobierz statystyki użytkownika
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Statystyki użytkownika
 *       404:
 *         description: Nie znaleziono statystyk
 *
 * /user-service/api/user/sync/keycloak:
 *   post:
 *     summary: Utwórz użytkownika na podstawie danych z Keycloak
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               keycloakId:
 *                 type: string
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *     responses:
 *       201:
 *         description: Użytkownik utworzony
 *   delete:
 *     summary: Usuń użytkownika na podstawie danych z Keycloak
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               keycloakId:
 *                 type: string
 *     responses:
 *       204:
 *         description: Użytkownik usunięty
 *       404:
 *         description: Nie znaleziono użytkownika
 *   get:
 *     summary: Pobierz użytkowników
 *     responses:
 *       200:
 *         description: Uzytkownicy
 *       404:
 *         description: Nie znaleziono użytkowników
 */