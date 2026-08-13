import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AUREX | Inteligencia de mercado cripto en tiempo real",
  description: "Dashboard de seguimiento de criptomonedas con datos en tiempo real.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${inter.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-aurex-bg text-aurex-text selection:bg-aurex-gold/30">
        <Providers>
          <div className="flex-1 flex flex-col">
            {children}
          </div>
          <footer className="w-full py-8 mt-12 border-t border-aurex-surface-alt bg-aurex-surface/20 text-center">
            <div className="max-w-7xl mx-auto px-4 flex flex-col gap-1.5">
              <p className="text-aurex-text-muted text-sm md:text-base font-medium">
                © {new Date().getFullYear()} Este producto es parte del portafolio de Javier Sebastian.
              </p>
              <p className="text-aurex-text-muted/60 text-xs md:text-sm">
                This product is part of Javier Sebastian&apos;s portfolio.
              </p>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
