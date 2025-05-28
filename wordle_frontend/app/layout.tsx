import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";
// import { KeycloakProvider} from "@/app/components/KeycloakProvider";

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Wordle App",
  description: "Play Wordle and improve your vocabulary!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${lato.variable} antialiased`}>
        {/*<KeycloakProvider>*/}
          {children}
        {/*</KeycloakProvider>*/}
      </body>
    </html>
  );
}
