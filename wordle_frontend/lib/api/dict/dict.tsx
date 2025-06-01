// Dodawanie listy słów do słownika
export async function uploadWords(words: Array<{ word: string; difficulty?: string; language: string; category?: string }>) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dictionary/upload`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(words),
        credentials: "include",
    });
    if (!res.ok) throw new Error("Błąd podczas przesyłania słów");
    return res.json();
}

// Usuwanie słów dla danego języka
export async function deleteWordsByLanguage(language: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dictionary/language/${language}`, {
        method: "DELETE",
        credentials: "include",
    });
    if (!res.ok) throw new Error("Błąd podczas usuwania słów");
    return res.json();
}

// Automatyczny import słów z pliku słownikowego dla języka
export async function uploadLanguage(language: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dictionary/upload/language/${language}`, {
        method: "POST",
        credentials: "include",
    });
    if (!res.ok) throw new Error("Błąd podczas importu słów");
    return res.json();
}