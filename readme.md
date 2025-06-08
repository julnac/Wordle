
# Wordle App

Aplikacja webowa inspirowana grą Wordle, umożliwiająca użytkownikom zgadywanie słów, rywalizację w rankingach oraz rejestrację i logowanie. Projekt wykorzystuje TypeScript, Next.js (frontend), Express (backend), Prisma ORM oraz bazy danych PostgreSQL, Redis i MongoDB.

## Funkcjonalności

- Rejestracja i logowanie użytkowników z wykorzystaniem JWT oraz OAuth2
- Obsługa profili użytkowników i personalizacji preferencji gry
- Rozgrywka Wordle z walidacją liter, pozycją i zasadami
- Generowanie i zarządzanie słownikami (języki, kategorie, trudność)
- Statystyki graczy i analiza trendów (raporty, średnia prób, serie zwycięstw)
- System nagród

## Stos technologiczny

- **Frontend:** Next.js, TypeScript, Shadcn UI
- **Backend:** Express.js (Node.js), TypeScript
- **Bazy danych:**
    - PostgreSQL – użytkownicy, wyniki, rankingi
    - MongoDB – słowniki i zasoby językowe
    - Redis – cache gry, rankingów i stanów gry w czasie rzeczywistym
- **ORM/ODM:** Prisma (PostgreSQL), Mongoose (MongoDB)
- **Autoryzacja:** JWT, OAuth2, 2FA
- **Testy:** Jest
- **Inne:** WebSockets, bcrypt, express-validator, Helmet

## Uruchomienie projektu

1. **Klonowanie repozytorium**
   ```
   git clone <adres_repozytorium>
   cd Wordle
   ```

2. **Instalacja zależności**
   ```
   npm install
   ```

3. **Konfiguracja baz danych**
   - Skonfiguruj połączenie do PostgreSQL, Redis i MongoDB w plikach `.env` oraz `prisma/schema.prisma`.

4. **Migracje Prisma**
   ```
   npx prisma migrate dev
   ```

5. **Uruchomienie mikroserwisów i proxy**
   ```
   cd (user-service || game-service || gateway)
   npm run dev
   ```

6. **Uruchomienie frontendu**
   ```
   cd wordle_frontend
   npm install
   npm run dev
   ```

## Struktura katalogów

- `/user-service` – mikroserwis (Express)
- `/game-service` – mikroserwis (Express)
- `/gateway` – proxy (Express)
- `wordle_frontend` – frontend (Next.js)

## Przykładowy widok

Przed zalogowaniem użytkownik widzi prostą stronę powitalną z przyciskiem logowania/rejestracji oraz krótkim opisem gry.

## Wymagania
Projekt stworzony w ramach zajęć z informatyki praktycznej.

|  Źródło / Funkcjonalność            | Kryterium                                                                                   | Szczegóły                                                                                                                                                                                                                                                                                                        | Wartość procentowa (%) | Obliczona liczba punktów | comp |
|-------------------------------------| ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- | ------------------------ |------|
| Funkcjonalny                        | Zarządzanie użytkownikami i autentykacja                                                    | System rejestracji i uwierzytelniania użytkowników z wykorzystaniem JWT/OAuth2, hierarchiczny model uprawnień (gracz, twórca wyzwań, moderator, administrator), obsługa profili użytkowników z preferencjami gry, mechanizmy zabezpieczeń (2FA, blokada konta po nieudanych próbach) oraz API odzyskiwania hasła | 4                      | 1.52                     | ok   |
| Funkcjonalny<br>                    | Mechanika gry podstawowej                                                                   | Generowanie i zarządzanie stanami gry, walidacja zgadywanych słów, przetwarzanie zasad gry (poprawne litery, pozycje), algorytmy sprawdzania poprawności słów względem słownika, mechanizmy podpowiedzi oraz system różnych poziomów trudności z dostosowaniem reguł                                             | 5                      | 1.90                     | ok   |
| Funkcjonalny                        | Zarządzanie słownikami i bazą słów                                                          | Zarządzanie słownikami i listami słów dla różnych języków i kategorii tematycznych, API walidacji słów, mechanizmy **importu/eksportu** słowników, system oceny trudności słów na podstawie częstotliwości występowania oraz algorytmy doboru słów do wyzwań                                                     | 5                      | 1.90                     | ok   |
| Funkcjonalny                        | Tryby gry i personalizacja rozgrywki                                                        | Tworzenie i zarządzanie niestandardowymi trybami gry, definiowanie reguł (liczba prób, długość słów, ograniczenia czasowe), obsługa różnych wariantów **(anagramy, krzyżówki, słowa z kategorii),** konfigurowalne układy plansz oraz elastyczny system punktacji dostosowany do trybu                           | 7                      | 2.66                     | ok   |
| Funkcjonalny                        | System rozgrywek wieloosobowych                                                             | Synchroniczna rozgrywka wieloosobowa z obsługą WebSockets, mechanizmy dopasowywania graczy (matchmaking), asynchroniczne wyzwania między użytkownikami, system pokojów gry z konfigurowalnymi ustawieniami, zarządzanie stanem gry w czasie rzeczywistym oraz obsługa rozłączeń/ponownych połączeń               | 6                      | 2.28                     |      |
| Funkcjonalny                        | System wyzwań i turniejów                                                                   | Tworzenie, zarządzanie i planowanie wyzwań dziennych/tygodniowych, automatyczna dystrybucja wyzwań do użytkowników, system weryfikacji rozwiązań, rankingi specyficzne dla wyzwań oraz mechanizmy nagradzania uczestników wyzwań                                                                                 | 5                      | 1.90                     |      |
| Funkcjonalny                        | Statystyki i analityka                                                                      | Szczegółowe śledzenie statystyk graczy (% wygranych, średnia liczba prób, serie zwycięstw), analiza wzorców rozgrywki, agregacja danych historycznych, **generowanie raportów wydajności oraz trendy poprawy umiejętności w czasie**                                                                             | 4                      | 1.52                     | ok   |
| Funkcjonalny                        | System osiągnięć i nagród                                                                   | System przyznawania osiągnięć i trofeów za różne dokonania, progresywne odznaki za kolejne poziomy umiejętności, codzienne/tygodniowe zadania z nagrodami, specjalne osiągnięcia za serie zwycięstw oraz personalizowane wyzwania oparte na historii gracza                                                      | 4                      | 1.52                     | ok   |
| Funkcjonalny                        | Rankingi i tabele wyników                                                                   | Zaawansowane rankingowanie graczy z systemem **ELO/Glicko-2**, sezonowe tabele liderów, rankingi dla różnych trybów gry i kategorii słów, system ligi z awansami/spadkami oraz mechanizmy zapobiegające nadużyciom w rankingach                                                                                  | 4                      | 1.52                     | ok   |
| Funkcjonalny                        | Powiadomienia i komunikacja                                                                 | System powiadomień o nowych wyzwaniach, zaproszeniach do gry i osiągnięciach, konfigurowalny mechanizm preferencji powiadomień, planowanie powiadomień cyklicznych, alternatywne kanały komunikacji (email, push) oraz grupowanie powiązanych powiadomień                                                        | 3                      | 1.14                     |      |
| Funkcjonalny                        | Udostępnianie i integracje społecznościowe                                                  | Generowanie odnośników do udostępniania wyników w mediach społecznościowych, eksport wizualnych reprezentacji rozgrywek, udostępnianie niestandardowych wyzwań, mechanizmy integracji z popularnymi platformami społecznościowymi oraz śledzenie statystyk udostępnień                                           | 3                      | 1.14                     |      |
| Wymagania techniczne Bazy danych II | Konfiguracja Routingu i Podstawowych Middleware w Express.js                                |                                                                                                                                                                                                                                                                                                                  | 4                      | 1.52                     | ok   |
| Wymagania techniczne Bazy danych II | Implementacja Centralnej Obsługi Błędów w Express.js                                        |                                                                                                                                                                                                                                                                                                                  | 4                      | 1.52                     | ok   |
| Wymagania techniczne Bazy danych II | Definicja Zakresu i Odpowiedzialności Pojedynczego Mikroserwisu                             |                                                                                                                                                                                                                                                                                                                  | 3                      | 1.14                     | ok   |
| Wymagania techniczne Bazy danych II | Definicja Zapytań REST API Między Mikroserwisami                                            |                                                                                                                                                                                                                                                                                                                  | 4                      | 1.52                     | ok   |
| Wymagania techniczne Bazy danych II | Połączenie, ORM i Migracje Relacyjnej Bazy Danych                                           |                                                                                                                                                                                                                                                                                                                  | 4                      | 1.52                     | ok   |
| Wymagania techniczne Bazy danych II | Implementacja Zapytań Relacyjnych (Złączenia / Joins, Transakcje) i Optymalizacja (Indeksy) |                                                                                                                                                                                                                                                                                                                  | 5                      | 1.90                     |      |
| Wymagania techniczne Bazy danych II | Integracja z MongoDB: Modelowanie i Schematy (Mongoose)                                     |                                                                                                                                                                                                                                                                                                                  | 4                      | 1.52                     | ok   |
| Wymagania techniczne Bazy danych II | Zaawansowane Operacje MongoDB (Agregacje, Indeksy, GeoJSON)                                 |                                                                                                                                                                                                                                                                                                                  | 5                      | 1.90                     |      |
| Wymagania techniczne Bazy danych II | Implementacja Uwierzytelniania (np. JWT) i Autoryzacji (np. RBAC)                           |                                                                                                                                                                                                                                                                                                                  | 4                      | 1.52                     |      |
| Wymagania techniczne Bazy danych II | Podstawowe Zabezpieczenia Aplikacji (Helmet, Rate Limit, Bcrypt)                            |                                                                                                                                                                                                                                                                                                                  | 3                      | 1.14                     |      |
| Wymagania techniczne Bazy danych II | Walidacja Danych Wejściowych (np. express-validator, Joi)                                   |                                                                                                                                                                                                                                                                                                                  | 3                      | 1.14                     |      |
| Wymagania techniczne Bazy danych II | Implementacja Testów Jednostkowych i Integracyjnych                                         |                                                                                                                                                                                                                                                                                                                  | 7                      | 2.66                     |      |
| Wymagania dodatkowe Bazy danych II  | Zaawansowane Standardy Jakości Kodu i Statyczna Analiza                                     | Konfiguracja i wymuszanie użycia narzędzi do statycznej analizy kodu (np. ESLint z odpowiednimi pluginami), kontroli złożoności cyklomatycznej oraz spójnego formatowania kodu (np. Prettier).                                                                                                                   | 3                      | 1.14                     |      |
| Wymagania dodatkowe Bazy danych II  | Automatyczne Raportowanie Błędów Aplikacji                                                  | Integracja aplikacji z zewnętrznym systemem do automatycznego zbierania, agregowania i powiadamiania o błędach występujących w aplikacji (np. Sentry, Bugsnag).                                                                                                                                                  | 3                      | 1.14                     |      |
| Wymagania dodatkowe Bazy danych II  | Zaawansowane Techniki Indeksowania Baz Danych                                               | Zastosowanie zaawansowanych technik indeksowania (np. indeksy częściowe, indeksy na wyrażeniach, indeksy dla wyszukiwania pełnotekstowego) w celu optymalizacji specyficznych zapytań.                                                                                                                           | 4                      | 1.52                     |      |
| Wymagania dodatkowe Bazy danych II  | Strategia Tworzenia Kopii Zapasowych (Backup) i Odzyskiwania Bazy Danych                    | Opracowanie, wdrożenie i przetestowanie procedur regularnego tworzenia kopii zapasowych baz danych oraz ich odzyskiwania w przypadku awarii.                                                                                                                                                                     | 4                      | 1.52                     |      |
| Wymagania dodatkowe Bazy danych II  | Optymalizacja i Tuning Puli Połączeń Bazodanowych                                           | Analiza i dostosowanie parametrów puli połączeń do baz danych (np. minimalna/maksymalna liczba połączeń, timeouty) w celu optymalizacji wydajności pod oczekiwanym obciążeniem.                                                                                                                                  | 3                      | 1.14                     |      |
| Wymagania dodatkowe Bazy danych II  | Budowa Potoku CI/CD dla Niezależnego Wdrażania Mikroserwisów                                | Zaprojektowanie i implementacja potoku CI/CD umożliwiającego automatyczne budowanie, testowanie i niezależne wdrażanie poszczególnych mikroserwisów.                                                                                                                                                             | 4                      | 1.52                     | ok   |
| Wymagania dodatkowe Bazy danych II  | Optymalizacja i Zabezpieczanie Obrazów Kontenerów (Docker)                                  | Stworzenie zoptymalizowanych i bezpiecznych obrazów kontenerów Docker dla każdej usługi, minimalizacja rozmiaru i powierzchni ataku.                                                                                                                                                                             | 2                      | 0.76                     |      |


