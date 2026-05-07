import WordListRepository from './repository/mongo/wordListRepository';
import { WordListDTO } from './repository/mongo/models/wordList';

const PL_WORDS: WordListDTO[] = [
    // 5 liter - easy
    { word: 'ZAMEK', language: 'pl', difficulty: 'easy' },
    { word: 'WIATR', language: 'pl', difficulty: 'easy' },
    { word: 'KOLOR', language: 'pl', difficulty: 'easy' },
    { word: 'KWIAT', language: 'pl', difficulty: 'easy' },
    { word: 'MORZE', language: 'pl', difficulty: 'easy' },
    { word: 'STARY', language: 'pl', difficulty: 'easy' },
    { word: 'LAMPA', language: 'pl', difficulty: 'easy' },
    { word: 'NUMER', language: 'pl', difficulty: 'easy' },
    { word: 'OKIEN', language: 'pl', difficulty: 'easy' },
    { word: 'PUSTA', language: 'pl', difficulty: 'easy' },
    // 5 liter - medium
    { word: 'GRZYB', language: 'pl', difficulty: 'medium' },
    { word: 'RZEKA', language: 'pl', difficulty: 'medium' },
    { word: 'ZEGAR', language: 'pl', difficulty: 'medium' },
    { word: 'BURAK', language: 'pl', difficulty: 'medium' },
    { word: 'KALKA', language: 'pl', difficulty: 'medium' },
    { word: 'NORMA', language: 'pl', difficulty: 'medium' },
    { word: 'PRAWA', language: 'pl', difficulty: 'medium' },
    { word: 'SKAŁA', language: 'pl', difficulty: 'medium' },
    { word: 'TRAWA', language: 'pl', difficulty: 'medium' },
    { word: 'WOLNY', language: 'pl', difficulty: 'medium' },
    // 5 liter - hard
    { word: 'ŻURAW', language: 'pl', difficulty: 'hard' },
    { word: 'ŚWIAT', language: 'pl', difficulty: 'hard' },
    { word: 'KRZYŻ', language: 'pl', difficulty: 'hard' },
    { word: 'MŁODY', language: 'pl', difficulty: 'hard' },
    { word: 'ZBIÓR', language: 'pl', difficulty: 'hard' },
    // 6 liter - easy
    { word: 'KWIATY', language: 'pl', difficulty: 'easy' },
    { word: 'KOLORY', language: 'pl', difficulty: 'easy' },
    { word: 'STRONY', language: 'pl', difficulty: 'easy' },
    // 6 liter - medium
    { word: 'GRZYBY', language: 'pl', difficulty: 'medium' },
    { word: 'PIASEK', language: 'pl', difficulty: 'medium' },
    { word: 'DESZCZ', language: 'pl', difficulty: 'medium' },
    { word: 'NOCLEG', language: 'pl', difficulty: 'medium' },
    // 6 liter - hard
    { word: 'SKRZAT', language: 'pl', difficulty: 'hard' },
    // 7 liter - easy
    { word: 'ZAMKOWY', language: 'pl', difficulty: 'easy' },
    { word: 'KOLORÓW', language: 'pl', difficulty: 'easy' },
    // 7 liter - medium
    { word: 'MORSKIE', language: 'pl', difficulty: 'medium' },
    { word: 'GRZYBÓW', language: 'pl', difficulty: 'medium' },
];

const EN_WORDS: WordListDTO[] = [
    // 5 liter - easy
    { word: 'APPLE', language: 'en', difficulty: 'easy' },
    { word: 'HOUSE', language: 'en', difficulty: 'easy' },
    { word: 'WATER', language: 'en', difficulty: 'easy' },
    { word: 'LIGHT', language: 'en', difficulty: 'easy' },
    { word: 'STONE', language: 'en', difficulty: 'easy' },
    { word: 'BREAD', language: 'en', difficulty: 'easy' },
    { word: 'CHAIR', language: 'en', difficulty: 'easy' },
    { word: 'CLOCK', language: 'en', difficulty: 'easy' },
    { word: 'PAPER', language: 'en', difficulty: 'easy' },
    { word: 'TABLE', language: 'en', difficulty: 'easy' },
    // 5 liter - medium
    { word: 'BRAVE', language: 'en', difficulty: 'medium' },
    { word: 'CRISP', language: 'en', difficulty: 'medium' },
    { word: 'FLAME', language: 'en', difficulty: 'medium' },
    { word: 'GLOOM', language: 'en', difficulty: 'medium' },
    { word: 'TRAIL', language: 'en', difficulty: 'medium' },
    { word: 'FROST', language: 'en', difficulty: 'medium' },
    { word: 'PLUMB', language: 'en', difficulty: 'medium' },
    { word: 'SWAMP', language: 'en', difficulty: 'medium' },
    { word: 'TRUCE', language: 'en', difficulty: 'medium' },
    { word: 'BLAZE', language: 'en', difficulty: 'medium' },
    // 5 liter - hard
    { word: 'QUERY', language: 'en', difficulty: 'hard' },
    { word: 'LYMPH', language: 'en', difficulty: 'hard' },
    { word: 'TRYST', language: 'en', difficulty: 'hard' },
    { word: 'GLYPH', language: 'en', difficulty: 'hard' },
    { word: 'NYMPH', language: 'en', difficulty: 'hard' },
    // 6 liter - easy
    { word: 'CASTLE', language: 'en', difficulty: 'easy' },
    { word: 'BRIDGE', language: 'en', difficulty: 'easy' },
    { word: 'FLOWER', language: 'en', difficulty: 'easy' },
    { word: 'GARDEN', language: 'en', difficulty: 'easy' },
    // 6 liter - medium
    { word: 'QUARTZ', language: 'en', difficulty: 'medium' },
    { word: 'PLAGUE', language: 'en', difficulty: 'medium' },
    { word: 'SQUINT', language: 'en', difficulty: 'medium' },
    { word: 'FRIGHT', language: 'en', difficulty: 'medium' },
    // 6 liter - hard
    { word: 'CRYPTS', language: 'en', difficulty: 'hard' },
    { word: 'NYMPHS', language: 'en', difficulty: 'hard' },
    // 7 liter - easy
    { word: 'SUNRISE', language: 'en', difficulty: 'easy' },
    { word: 'FLOWERS', language: 'en', difficulty: 'easy' },
    // 7 liter - medium
    { word: 'BRAVELY', language: 'en', difficulty: 'medium' },
    { word: 'MYSTERY', language: 'en', difficulty: 'medium' },
];

export async function seedDictionary(): Promise<void> {
    const plResult = await WordListRepository.addWordList(PL_WORDS);
    const enResult = await WordListRepository.addWordList(EN_WORDS);

    const total = plResult.successfulUploads + enResult.successfulUploads;
    if (total > 0) {
        console.log(`[SEED] Dodano ${total} słów do słownika (pl: ${plResult.successfulUploads}, en: ${enResult.successfulUploads})`);
    } else {
        console.log('[SEED] Słownik już zawiera dane, pomijam seed.');
    }
}
