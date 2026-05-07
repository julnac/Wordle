"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { toast } from "sonner";
import { deleteWordsByLanguage } from "@/lib/api/dict";

const languages = [
    { label: "Polski", code: "pl" },
    { label: "Angielski", code: "en" },
    { label: "Niemiecki", code: "de" },
    { label: "Hiszpański", code: "es" },
];

export default function DictionaryManager() {
    const [language, setLanguage] = useState<string>("");
    // const [fileContent, setFileContent] = useState<string>("");

    // const handleFileRead = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const file = e.target.files?.[0];
    //     if (!file) return;
    //
    //     const reader = new FileReader();
    //     reader.onload = event => {
    //         const content = event.target?.result as string;
    //         setFileContent(content);
    //     };
    //     reader.readAsText(file);
    // };

    // const handleUploadWords = async () => {
    //     try {
    //         if (!language || !fileContent) return toast.error("Wybierz język i załaduj plik");
    //
    //         const words = fileContent
    //             .split("\n")
    //             .filter(Boolean)
    //             .map(word => ({
    //                 word: word.trim(),
    //                 language,
    //                 difficulty: "medium",
    //                 category: "default",
    //             }));
    //
    //         await uploadWords(words);
    //         toast.success("Słowa zostały przesłane");
    //     } catch (err) {
    //         toast.error("Błąd podczas przesyłania słów");
    //     }
    // };

    // const handleImportDefault = async () => {
    //     try {
    //         if (!language) return toast.error("Wybierz język");
    //         await uploadLanguage(language);
    //         toast.success("Domyślny słownik zaimportowany");
    //     } catch (err) {
    //         toast.error("Błąd podczas importu domyślnego słownika");
    //     }
    // };
    //
    // const handleDelete = async () => {
    //     try {
    //         if (!language) return toast.error("Wybierz język");
    //         await deleteWordsByLanguage(language);
    //         toast.success("Słownik został usunięty");
    //     } catch (err) {
    //         toast.error("Błąd podczas usuwania słownika");
    //     }
    // };

    return (
        <Card className="mt-6">
            <CardHeader>
                <CardTitle>Zarządzanie słownikami</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <Select onValueChange={setLanguage}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Wybierz język" />
                        </SelectTrigger>
                        <SelectContent>
                            {languages.map(lang => (
                                <SelectItem key={lang.code} value={lang.code}>
                                    {lang.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/*<Input type="file" accept=".txt" onChange={handleFileRead} />*/}
                </div>

                <div className="flex gap-2 flex-wrap">
                    {/*<Button onClick={handleUploadWords}>📤 Prześlij własne słowa</Button>*/}
                    {/*<Button onClick={handleImportDefault} variant="outline">📥 Załaduj domyślne słowa</Button>*/}
                    {/*<Button onClick={handleDelete} variant="destructive">🗑 Usuń słownik</Button>*/}
                </div>
            </CardContent>
        </Card>
    );
}
