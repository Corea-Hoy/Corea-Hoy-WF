"use client";

import { useEffect, useRef, useCallback, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useLanguageStore } from "@/lib/stores/languageStore";
import { MOCK_CONTENTS, type Category } from "@/lib/mock-data";
import ContentCard from "@/components/ContentCard";
import KoreaCarousel from "@/components/KoreaCarousel";
import { useState } from "react";

const CATEGORIES_KO = ["전체", "K-POP", "드라마", "뉴스", "문화", "스포츠", "음식"] as const;
const CATEGORIES_ES = ["Todos", "K-POP", "Drama", "Noticias", "Cultura", "Deportes", "Comida"];

const PAGE_SIZE = 20;

// ── Inner component that reads searchParams ─────────────────────────────────
function MainPageInner() {
  const t = useTranslations("home");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language } = useLanguageStore();
  const isKo = language === "ko";

  const [sortOrder, setSortOrder] = useState<"latest" | "popular" | "trending">("latest");
  const newsletterRef = useRef<HTMLDivElement>(null);

  const searchQuery = searchParams.get("q") ?? "";

  // 1. Hot Issues for Top Highlights (Always fixed by date for stability)
  const trendItems = [...MOCK_CONTENTS]
    .filter(c => (isKo ? c.title : c.titleEs).toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 4);
  const trendIds = new Set(trendItems.map(item => item.id));

  // 2. Sorting & Filtering for the Main Feed (Responsive to Filter)
  const filtered = MOCK_CONTENTS.filter((c) => {
    const matchesSearch =
      (isKo ? c.title : c.titleEs).toLowerCase().includes(searchQuery.toLowerCase()) ||
      (isKo ? c.summary : c.summaryEs).toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortOrder === "popular") return b.likes - a.likes;
    if (sortOrder === "trending") return (b.likes * 1.5) - (a.likes * 1.5); // Simulated
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });

  // 3. Grouping by Category
  const categories: Category[] = ["K-POP", "드라마", "뉴스", "문화", "스포츠", "음식"];
  
  const scrollToNewsletter = () => {
    newsletterRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleCategoryViewMore = (cat: string) => {
    const params = new URLSearchParams();
    params.set("category", cat);
    router.push(`/?${params.toString()}#newsletter`);
  };

  // If a specific category is selected via URL
  const activeCategory = searchParams.get("category") as Category | null;

  const isMainLanding = !activeCategory && !searchQuery;

  return (
    <div className="pb-20">
      {/* ── Hero Section (Only shown on main landing) ── */}
      {isMainLanding && (
        <>
          <section className="relative overflow-hidden mt-6 rounded-3xl mx-4 md:mx-6" style={{ height: "540px" }}>
            <KoreaCarousel isKo={isKo} fullHeight />
            
            {/* Hot Issue Overlay */}
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4"
              style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 100%)" }}>
              
              <div className="animate-bounce mb-6">
                <span className="px-4 py-1.5 rounded-full bg-red-600 text-white text-[10px] font-black uppercase tracking-widest shadow-lg">
                  🔥 Hot Issue
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6 drop-shadow-2xl max-w-4xl" style={{ letterSpacing: "-0.03em" }}>
                {isKo ? "지금 가장 뜨거운 한국의 이야기" : "Lo más candente de Corea ahora"}
              </h1>

              <p className="text-base md:text-lg text-white/90 mb-10 leading-relaxed max-w-2xl drop-shadow-md font-medium">
                {isKo 
                  ? "트렌드부터 깊이 있는 문화 분석까지, Corea Hoy가 선별한 프리미엄 콘텐츠를 만나보세요."
                  : "Desde tendencias hasta análisis culturales profundos, descubre el contenido premium seleccionado por Corea Hoy."}
              </p>

              <button
                onClick={scrollToNewsletter}
                className="group flex items-center gap-3 px-10 py-4 rounded-full bg-white text-black text-base font-black hover:bg-gray-100 transition-all shadow-2xl hover:-translate-y-1 cursor-pointer"
              >
                {isKo ? "뉴스레터 보기" : "Ver Newsletter"}
                <span className="transition-transform group-hover:translate-y-1">↓</span>
              </button>
            </div>
          </section>
        </>
      )}

      <div ref={newsletterRef} id="newsletter" className="max-w-screen-xl mx-auto px-6 pt-4 md:pt-8 scroll-mt-24">
        {/* ── Sort & Filter Header ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-black mb-2">
              {activeCategory ? activeCategory : (isKo ? "오늘의 소식" : "Noticias de Hoy")}
            </h2>
          </div>
        </div>

        {/* ── Content Sections ── */}
        {activeCategory ? (
          // Single Category View
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sorted
              .filter(c => c.category === activeCategory)
              .map(content => (
                <ContentCard key={content.id} content={content} isKo={isKo} />
              ))}
          </div>
        ) : (
          // Home View (Trend Hub)
          <div className="flex flex-col gap-4 md:gap-6">
            
            {/* Section 1: Latest Trends (Global) */}
            <section className="group">


              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {trendItems.map(content => (
                  <ContentCard key={content.id} content={content} isKo={isKo} />
                ))}
              </div>
            </section>

            {/* Middle Filter Section (Aligned with Trends) */}
            <div className="flex flex-col items-start text-left mb-12">
              <h3 className="text-3xl md:text-4xl font-black text-black mb-6">
                {t("newsletterTitle")}
              </h3>
              <div className="flex items-center gap-2 bg-gray-100 p-1.5 rounded-2xl w-fit border border-gray-200">
                {[
                  { id: "latest", label: isKo ? "최신순" : "Reciente" },
                  { id: "popular", label: isKo ? "좋아요순" : "Popular" },
                  { id: "trending", label: isKo ? "조회순" : "Tendencia" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setSortOrder(opt.id as any);
                    }}
                    className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      sortOrder === opt.id 
                        ? "bg-black text-white shadow-md" 
                        : "text-gray-400 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Section 2+: Grouped Categories */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-24">
              {categories.map(cat => {
                const catItems = sorted
                  .filter(c => c.category === cat && !trendIds.has(c.id)) 
                  .slice(0, 2); // Show top 2 per category on home (excluding trends)
                if (catItems.length === 0) return null;

                return (
                  <section key={cat} className="group">
                    <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-black text-black tracking-tight">{cat}</h3>
                      </div>
                      <button
                        onClick={() => handleCategoryViewMore(cat)}
                        className="text-xs font-black text-gray-400 hover:text-black transition-all cursor-pointer flex items-center gap-1"
                      >
                        {isKo ? "더보기" : "Ver más"}
                        <span className="text-sm">→</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      {catItems.map(content => (
                        <ContentCard key={content.id} content={content} isKo={isKo} />
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
        )}

        {sorted.length === 0 && (
          <div className="py-40 text-center">
            <span className="text-6xl mb-6 block">🔍</span>
            <p className="text-xl font-bold text-gray-300">
              {t("noResults")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MainPage() {
  return (
    <Suspense fallback={null}>
      <MainPageInner />
    </Suspense>
  );
}
