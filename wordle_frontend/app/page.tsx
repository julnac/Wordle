import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-lato)]">
      <header className="row-start-1">
        <Image
          src="/wordle-logo.svg"
          alt="Wordle App Logo"
          width={60}
          height={60}
          priority
        />
      </header>

      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-center">
        <h1 className="text-4xl font-bold text-center">Welcome to Wordle!</h1>
        <p className="text-lg text-center">
          Play, compete, and improve your vocabulary skills.
        </p>

        <div className="flex flex-col gap-4 w-full max-w-md">
          <Link href="/login" className="w-full">
            <button className="rounded-full bg-pink-500 text-white py-3 px-6 font-medium hover:bg-pink-900">
              Login
            </button>
          </Link>
          <Link href="/signup" className="w-full">
            <button className="rounded-full bg-sky-200 text-pink-800 py-3 px-6 font-medium hover:bg-sky-300">
              Sign Up
            </button>
          </Link>
        </div>
      </main>

      <footer className="row-start-3 flex gap-4 items-center justify-center">
        <a
          className="text-sm hover:underline"
          href="https://github.com/julnac"
          target="_blank"
          rel="noopener noreferrer"
        >
          Github Repository
        </a>
      </footer>
    </div>
  );
}