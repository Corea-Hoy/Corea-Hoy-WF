import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import IntlProvider from "@/lib/IntlProvider";

export const metadata: Metadata = {
  title: "Corea Hoy",
  description: "Noticias de Corea en español para Latinoamérica",
  icons: { icon: "/logo.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <IntlProvider>
          <Nav />
          {/* pb-24 on mobile accounts for the fixed bottom tab bar */}
          <main className="max-w-screen-xl mx-auto px-4 pb-24 lg:pb-12">
            {children}
          </main>
        </IntlProvider>
      </body>
    </html>
  );
}
