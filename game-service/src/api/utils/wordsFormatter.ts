import https from 'https';
import { IWordList } from '../../repository/mongo/models/wordList';

// https://github.com/hermitdave/FrequencyWords/blob/master/content/2018/pl/pl_50k.txt

// Funkcja do wyciągania nazwy języka z URL-a, np. "pl" z ".../pl/pl_50k.txt"
export function extractLanguageFromUrl(url: string): string | null {
    const match = url.match(/\/([a-z]{2})\//i);
    return match ? match[1] : null;
}

export async function fetchFrequencyMap(url: string): Promise<Map<string, number>> {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                const freqMap = new Map<string, number>();
                const lines = data.split('\n');
                for (const line of lines) {
                    const [word, countStr] = line.trim().split(' ');
                    if (word && countStr) {
                        freqMap.set(word.toLowerCase(), parseInt(countStr));
                    }
                }
                resolve(freqMap);
            });
        }).on('error', reject);
    });
}

export async function prepareFinalWords(url: string): Promise<IWordList[]> {
    const freqMap = await fetchFrequencyMap(url);
    const wordsWithDifficulty = Array.from(freqMap.entries()).map(([word, freq]) => ({ word, freq }));

    // Posortuj wg częstotliwości:
    wordsWithDifficulty.sort((a, b) => b.freq - a.freq);

    // Podziel na przedziały:
    const total = wordsWithDifficulty.length;
    const easyCutoff = Math.floor(total * 0.10);
    const mediumCutoff = Math.floor(total * 0.50);

    return wordsWithDifficulty.map((entry, index): IWordList => {
        let difficulty: 'easy' | 'medium' | 'hard';
        if (index < easyCutoff) difficulty = 'easy';
        else if (index < mediumCutoff) difficulty = 'medium';
        else difficulty = 'hard';

        return {
            word: entry.word,
            difficulty,
            language: extractLanguageFromUrl(url) ?? 'unknown',
            category: 'general',
        } as IWordList;
    });
}

// Możesz teraz wstawić do MongoDB
// await WordList.insertMany(finalWords);