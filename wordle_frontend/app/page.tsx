import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold tracking-tight">
            Wordle
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <p className="text-center text-muted-foreground">
            Zagraj w klasyczną grę Wordle online.<br />
            Zaloguj się, aby śledzić swoje wyniki i rywalizować z innymi!
          </p>
          <div className="flex flex-col gap-2">
            <Link href="/login">
              <Button className="w-full">Zaloguj się</Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" className="w-full">Załóż konto</Button>
            </Link>
          </div>
          <div className="text-center text-xs text-muted-foreground mt-4">
            <Link href="/about" className="underline">
              Dowiedz się więcej o grze
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
