import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/LanguageContext";
import { ThemeProvider } from "@/lib/ThemeContext";
import Navigation from "@/components/Navigation";
import MobileNav from "@/components/MobileNav";
import FloatingHelpButton from "@/components/FloatingHelpButton";
import { ToastProvider } from "@/components/ToastNotification";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "No Más Multas - Traffic Ticket Appeal App",
  description: "Easily appeal traffic tickets and parking violations",
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
      <body className={`${inter.className} min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white transition-colors duration-200`}>
        <LanguageProvider>
          <ThemeProvider>
            <ToastProvider>
              <Navigation />
              <main className="pt-16">
                {children}
              </main>
              <FloatingHelpButton />
              <MobileNav />
            </ToastProvider>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
