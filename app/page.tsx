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

// Stats removed as requested

// ── Inner component that reads searchParams ─────────────────────────────────
function MainPageInner() {
  const t = useTranslations("home");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language } = useLanguageStore();
  const isKo = language === "ko";

  // URL-synced category
  const rawCategory = searchParams.get("category") ?? "전체";
  const activeCategory: Category | "전체" = (
    CATEGORIES_KO.includes(rawCategory as Category | "전체") ? rawCategory : "전체"
  ) as Category | "전체";

  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const newsletterRef = useRef<HTMLDivElement>(null);

  // Filter
  const filtered = MOCK_CONTENTS.filter((c) => {
    const matchesCategory = activeCategory === "전체" || c.category === activeCategory;
    const matchesSearch =
      (isKo ? c.title : c.titleEs).toLowerCase().includes(searchQuery.toLowerCase()) ||
      (isKo ? c.summary : c.summaryEs).toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  // Reset visible count when filter changes
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [activeCategory, searchQuery]);

  // Load more handler
  const loadMore = useCallback(() => {
    if (hasMore) setVisibleCount((prev) => prev + PAGE_SIZE);
  }, [hasMore]);

  // Handle #newsletter hash scroll
  useEffect(() => {
    if (window.location.hash === "#newsletter") {
      setTimeout(() => {
        newsletterRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, []);

  const trending = [...MOCK_CONTENTS].sort((a, b) => b.likes - a.likes).slice(0, 3);

  const scrollToNewsletter = () => {
    newsletterRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Category click — update URL
  function handleCategoryClick(cat: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (cat === "전체" || cat === "Todos") {
      params.delete("category");
    } else {
      params.set("category", cat);
    }
    const qs = params.toString();
    router.push(qs ? `/?${qs}` : "/", { scroll: false });
  }

  return (
    <div>
      {/* ── Hero Section (Carousel background + text overlay) ── */}
      <section className="relative mb-10 overflow-hidden" style={{ height: "480px" }}>
        {/* Carousel as background */}
        <KoreaCarousel isKo={isKo} fullHeight />

        {/* Text overlay */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4"
          style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.55) 100%)" }}>

          {/* Mascot */}
          <div className="relative w-20 h-20 mb-4">
            <Image src="/oi_character.webp" alt="Corea Hoy Mascot" fill className="object-contain drop-shadow-lg" priority />
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 border border-white/30 bg-white/15 backdrop-blur-sm">
            <span className="text-sm">🇰🇷</span>
            <span className="text-xs font-bold text-white/90 tracking-wider uppercase">Corea Hoy</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4 drop-shadow-lg" style={{ letterSpacing: "-0.02em" }}>
            {t("heroTitle")}
          </h1>

          {/* Subtitle */}
          <p className="text-sm md:text-base text-white/85 mb-8 leading-relaxed max-w-xl drop-shadow">
            {isKo
              ? "매주 업데이트되는 한국의 최신 트렌드를 스페인어로 만나보세요."
              : "Descubre las últimas tendencias de Corea actualizadas cada semana en español."}
          </p>

          {/* CTA */}
          <button
            onClick={scrollToNewsletter}
            className="px-8 py-3.5 rounded-full bg-white text-gray-900 text-sm font-bold hover:bg-gray-100 transition-all shadow-lg hover:-translate-y-0.5 cursor-pointer"
          >
            {t("heroCta")} ↓
          </button>
        </div>
      </section>

      {/* ── Newsletter Section ── */}
      <div ref={newsletterRef} id="newsletter" className="scroll-mt-20">
        {/* Section header */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
              {isKo ? "최신 업데이트" : "Últimas actualizaciones"}
            </p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-black">
              {t("newsletterTitle")}
              {activeCategory !== "전체" && (
                <span className="ml-3 text-lg font-bold text-gray-400">— {activeCategory}</span>
              )}
            </h2>
          </div>
          {/* Active category badge (desktop sidebar complements this) */}
          {activeCategory !== "전체" && (
            <button
              onClick={() => handleCategoryClick("전체")}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black text-white text-xs font-bold hover:bg-gray-700 transition-colors cursor-pointer"
            >
              {activeCategory} ✕
            </button>
          )}
        </div>

        {/* Main layout (Single column for simplicity) */}
        <div className="max-w-screen-xl mx-auto">
          {/* Main content */}
          <div>
            {/* Search */}
            <div className="relative mb-5">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-sm">
                🔍
              </span>
              <input
                type="text"
                placeholder={t("search")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-gray-400 focus:bg-white transition-all"
              />
            </div>

            {/* Mobile category chips (fallback if header chips aren't visible) */}
            <div className="flex gap-2 flex-wrap mb-7 lg:hidden">
              {CATEGORIES_KO.map((cat, i) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className={`px-3.5 py-1.5 rounded-full border text-xs font-bold transition-all cursor-pointer ${
                    activeCategory === cat
                      ? "bg-black text-white border-black"
                      : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
                  }`}
                >
                  {isKo ? cat : CATEGORIES_ES[i]}
                </button>
              ))}
            </div>

            {/* Article grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {visible.length === 0 && (
                <p className="col-span-full text-center text-gray-400 py-20 text-sm">
                  {t("noResults")}
                </p>
              )}
              {visible.map((content) => (
                <ContentCard key={content.id} content={content} isKo={isKo} />
              ))}
            </div>

            {/* Load More button */}
            {hasMore && (
              <div className="flex justify-center mt-12 mb-20">
                <button
                  onClick={loadMore}
                  className="group relative px-10 py-4 rounded-full bg-white border-2 border-green-600 text-green-700 font-bold text-sm transition-all hover:bg-green-600 hover:text-white active:scale-95 shadow-md hover:shadow-lg cursor-pointer flex items-center gap-2"
                >
                  <span>{isKo ? "더보기" : "Ver más"}</span>
                  <span className="text-xs opacity-60">(+{PAGE_SIZE})</span>
                  <span className="transition-transform group-hover:translate-y-0.5">↓</span>
                </button>
              </div>
            )}
          </div>
        </div>
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
