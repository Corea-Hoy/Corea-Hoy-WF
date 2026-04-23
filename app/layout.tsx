import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import IntlProvider from "@/lib/IntlProvider";

export const metadata: Metadata = {
  title: "Corea Hoy",
  description: "Noticias de Corea en español para Latinoamérica",
  icons: { icon: "/logo.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <IntlProvider>
          <div className="flex flex-col min-h-screen">
            <Nav />
            {/* pb-24 on mobile accounts for the fixed bottom tab bar */}
            <main className="flex-1 max-w-screen-xl mx-auto w-full px-4 pb-24 lg:pb-0">
              {children}
            </main>
            {/* Footer: hidden on mobile (covered by bottom tab bar) */}
            <div className="hidden lg:block">
              <Footer />
            </div>
          </div>
        </IntlProvider>
      </body>
    </html>
  );
}
