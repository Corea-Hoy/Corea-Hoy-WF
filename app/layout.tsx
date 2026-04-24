import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import IntlProvider from "@/lib/IntlProvider";
import ErrorBoundary from "@/components/ErrorBoundary";
import LangSetter from "@/components/LangSetter";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Corea Hoy",
  description: "Noticias de Corea en español para Latinoamérica",
  icons: { icon: "/logo.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <IntlProvider>
          <LangSetter />
          {/* Skip to main content for keyboard users */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:z-[100] focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:bg-black focus:text-white focus:rounded-lg focus:text-sm focus:font-bold"
          >
            메인 콘텐츠로 건너뛰기
          </a>
          <div className="flex flex-col min-h-screen">
            <Nav />
            <ErrorBoundary>
              <main
                id="main-content"
                className="flex-1 max-w-screen-xl mx-auto w-full px-4 pb-20 lg:pb-0"
              >
                {children}
              </main>
            </ErrorBoundary>
            <Footer />
          </div>
        </IntlProvider>
      </body>
    </html>
  );
}
