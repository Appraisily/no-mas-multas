import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/LanguageContext";
import { ThemeProvider } from "@/lib/ThemeContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "No Más Multas - Challenge Your Traffic Tickets with AI",
  description: "Use AI to analyze your traffic tickets and generate effective appeal letters to challenge unfair fines.",
  keywords: "traffic tickets, parking tickets, appeal, fine challenge, AI assistance, legal help",
  authors: [{ name: "No Más Multas Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-white transition-colors duration-200`}>
        <LanguageProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
