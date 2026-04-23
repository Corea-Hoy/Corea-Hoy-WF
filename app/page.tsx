"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useLanguageStore } from "@/lib/stores/languageStore";
import { MOCK_CONTENTS, type Category } from "@/lib/mock-data";
import ContentCard from "@/components/ContentCard";

const CATEGORIES: (Category | "전체")[] = ["전체", "K-POP", "드라마", "뉴스", "문화", "스포츠", "음식"];
const CATEGORIES_ES: string[] = ["Todos", "K-POP", "Drama", "Noticias", "Cultura", "Deportes", "Comida"];

const PAGE_SIZE = 20;

// Stats defined per language pair; we derive label lazily from the component
const STATS_KO = [
  { label: "독자", value: "12,000+" },
  { label: "에디션", value: "48" },
  { label: "국가", value: "18" },
];
const STATS_ES = [
  { label: "lectores", value: "12,000+" },
  { label: "ediciones", value: "48" },
  { label: "países", value: "18" },
];

export default function MainPage() {
  const t = useTranslations("home");
  const { language } = useLanguageStore();
  const isKo = language === "ko";

  const [activeCategory, setActiveCategory] = useState<Category | "전체">("전체");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const newsletterRef = useRef<HTMLDivElement>(null);

  const filtered = MOCK_CONTENTS.filter((c) => {
    const matchesCategory = activeCategory === "전체" || c.category === activeCategory;
    const matchesSearch =
      (isKo ? c.title : c.titleEs).toLowerCase().includes(searchQuery.toLowerCase()) ||
      (isKo ? c.summary : c.summaryEs).toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [activeCategory, searchQuery]);

  const loadMore = () => setVisibleCount((prev) => prev + PAGE_SIZE);

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

  return (
    <div>
      {/* ── Hero Section ── */}
      <section className="py-12 md:py-16 mb-10 border-b border-gray-100">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 border border-gray-200 bg-gray-50">
            <span className="text-sm">🇰🇷</span>
            <span className="text-xs font-bold text-gray-500 tracking-wider uppercase">Corea Hoy</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl font-extrabold text-black leading-tight mb-4" style={{ letterSpacing: "-0.02em" }}>
            {t("heroTitle")}
          </h1>

          {/* Subtitle */}
          <p className="text-base text-gray-500 mb-8 leading-relaxed max-w-xl">
            {t("heroSubtitle")}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={scrollToNewsletter}
              className="px-5 py-2.5 rounded-xl bg-black text-white text-sm font-bold hover:bg-gray-800 transition-colors cursor-pointer"
            >
              {t("heroCta")} ↓
            </button>
            <Link
              href="/labs"
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-bold hover:border-gray-400 hover:text-black transition-colors"
            >
              ✨ {t("heroCtaSub")}
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 mt-10">
            {(isKo ? STATS_KO : STATS_ES).map(({ label, value }) => (
              <div key={label}>
                <div className="text-2xl font-black text-black">{value}</div>
                <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider mt-0.5">{label}</div>
              </div>
            ))}
          </div>
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
            </h2>
          </div>
        </div>

        {/* Desktop: two-column layout */}
        <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-10">

          {/* Main column */}
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

            {/* Category chips — mobile only */}
            <div className="flex gap-2 flex-wrap mb-7 lg:hidden">
              {CATEGORIES.map((cat, i) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
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

            {/* Article grid — 2cols mobile / 3cols tablet / 4cols desktop */}
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
              <div className="flex justify-center mt-8">
                <button
                  onClick={loadMore}
                  className="px-8 py-3 rounded-xl border-2 border-black text-sm font-bold text-black hover:bg-black hover:text-white transition-all duration-200 cursor-pointer"
                >
                  {isKo ? `더보기 (+${PAGE_SIZE})` : `Ver más (+${PAGE_SIZE})`}
                </button>
              </div>
            )}
          </div>

          {/* Sidebar — desktop only */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-8">

              {/* Category filter */}
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                  {t("categories")}
                </h3>
                <div className="flex flex-col gap-1">
                  {CATEGORIES.map((cat, i) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`text-left px-4 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                        activeCategory === cat
                          ? "bg-black text-white"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {isKo ? cat : CATEGORIES_ES[i]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Trending */}
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                  {t("trending")}
                </h3>
                <div className="flex flex-col gap-3">
                  {trending.map((c, idx) => (
                    <Link
                      key={c.id}
                      href={`/content/${c.id}`}
                      className="group flex gap-3 items-start p-3 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-xl font-black text-gray-200 leading-none flex-shrink-0">
                        {idx + 1}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-black leading-snug line-clamp-2 group-hover:underline">
                          {isKo ? c.title : c.titleEs}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">♥ {c.likes}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Labs promo */}
              <div className="rounded-2xl p-5 text-white overflow-hidden relative"
                style={{ background: "linear-gradient(135deg, #302b63, #24243e)" }}>
                <div className="absolute -top-4 -right-4 text-6xl opacity-20 select-none">✨</div>
                <p className="text-xs font-bold uppercase tracking-widest mb-2 text-white/60">
                  Corea Hoy Labs
                </p>
                <p className="text-sm font-bold leading-snug mb-3">
                  {isKo ? "새로운 AI 기능을 먼저 체험해보세요" : "Prueba las nuevas funciones AI primero"}
                </p>
                <Link
                  href="/labs"
                  className="inline-block text-xs font-bold px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                >
                  {isKo ? "실험실 보기 →" : "Ver Labs →"}
                </Link>
              </div>

            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
