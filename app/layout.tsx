import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import { LanguageProvider } from "@/lib/LanguageContext";

export const metadata: Metadata = {
  title: "Corea Hoy",
  description: "Noticias de Corea en español para Latinoamérica",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <LanguageProvider>
          <Nav />
          <main style={{ maxWidth: 1200, margin: "0 auto", padding: "1rem" }}>
            {children}
          </main>
        </LanguageProvider>
      </body>
    </html>
  );
}
