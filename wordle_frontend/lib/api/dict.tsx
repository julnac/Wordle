import { fetchWithAuth } from '@/lib/api/fetchWithAuth';

// Wgrywanie pliku .txt z listą słów
export async function uploadWordsFromFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetchWithAuth('/game-service/api/dictionary/upload-file', {
        method: 'POST',
        body: formData,
    });
    if (!res.ok) throw new Error('Błąd podczas uploadu pliku');
    return res.json();
}

// Wgrywanie tablicy słów (JSON)
export async function uploadWords(words: Array<{ word: string; difficulty?: string; language: string; category?: string }>) {
    const res = await fetchWithAuth('/game-service/api/dictionary/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(words),
    });
    if (!res.ok) throw new Error('Błąd podczas przesyłania słów');
    return res.json();
}

// Usuwanie słów dla danego języka
export async function deleteWordsByLanguage(language: string) {
    const res = await fetchWithAuth(`/game-service/api/dictionary/language/${language}`, {
        method: 'DELETE',
    });
    if (!res.ok) throw new Error('Błąd podczas usuwania słów');
    return res.json();
}

// Pobieranie listy słów (opcjonalnie z filtrowaniem)
export async function getWords(params?: { language?: string; difficulty?: string; category?: string; sortField?: string; sortOrder?: string }) {
    const query = new URLSearchParams();
    if (params?.language) query.append('language', params.language);
    if (params?.difficulty) query.append('difficulty', params.difficulty);
    if (params?.category) query.append('category', params.category);
    if (params?.sortField) query.append('sortField', params.sortField);
    if (params?.sortOrder) query.append('sortOrder', params.sortOrder);

    const res = await fetchWithAuth(`/game-service/api/dictionary/words?${query.toString()}`, {
        method: 'GET',
    });
    if (!res.ok) throw new Error('Błąd podczas pobierania słów');
    return res.json();
}

// Usuwanie pojedynczego słowa
export async function deleteWord(word: string, language: string) {
    const res = await fetchWithAuth('/game-service/api/dictionary/word', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word, language }),
    });
    if (!res.ok) throw new Error('Błąd podczas usuwania słowa');
    return res.json();
}

// Pobieranie dostępnych języków
export async function getLanguages() {
    const res = await fetchWithAuth('/game-service/api/dictionary/languages', {
        method: 'GET',
    });
    if (!res.ok) throw new Error('Błąd podczas pobierania języków');
    return res.json();
}

// Pobieranie liczby słów wg języka
export async function getWordCountsByLanguage() {
    const res = await fetchWithAuth('/game-service/api/dictionary/word-counts', {
        method: 'GET',
    });
    if (!res.ok) throw new Error('Błąd podczas pobierania liczby słów');
    return res.json();
}