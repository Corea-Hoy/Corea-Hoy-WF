"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useLanguageStore } from "@/lib/stores/languageStore";
import { MOCK_CONTENTS, type Category } from "@/lib/mock-data";
import ContentCard from "@/components/ContentCard";

const CATEGORIES: (Category | "전체")[] = ["전체", "K-POP", "드라마", "뉴스", "문화", "스포츠", "음식"];
const CATEGORIES_ES: string[] = ["Todos", "K-POP", "Drama", "Noticias", "Cultura", "Deportes", "Comida"];

const PAGE_SIZE = 10;

export default function MainPage() {
  const t = useTranslations("home");
  const { language } = useLanguageStore();
  const isKo = language === "ko";

  const [activeCategory, setActiveCategory] = useState<Category | "전체">("전체");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const observerTarget = useRef<HTMLDivElement>(null);

  const filtered = MOCK_CONTENTS.filter((c) => {
    const matchesCategory = activeCategory === "전체" || c.category === activeCategory;
    const matchesSearch =
      (isKo ? c.title : c.titleEs).toLowerCase().includes(searchQuery.toLowerCase()) ||
      (isKo ? c.summary : c.summaryEs).toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  // Reset visible count when filter/search changes
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [activeCategory, searchQuery]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setVisibleCount((prev) => prev + PAGE_SIZE);
        }
      },
      { threshold: 0.1 }
    );
    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [hasMore]);

  const trending = [...MOCK_CONTENTS].sort((a, b) => b.likes - a.likes).slice(0, 3);

  return (
    <div className="py-6 md:py-10">
      {/* ── Desktop: two-column layout ── */}
      <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-10">

        {/* ── Main column ── */}
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-black mb-6">{t("title")}</h1>

          {/* Search */}
          <div className="relative mb-5">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">🔍</span>
            <input
              type="text"
              placeholder={t("search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-black transition-colors"
            />
          </div>

          {/* Category chips — mobile only (desktop uses sidebar) */}
          <div className="flex gap-2 flex-wrap mb-7 lg:hidden">
            {CATEGORIES.map((cat, i) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full border text-sm font-semibold transition-all cursor-pointer ${
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {visible.length === 0 && (
              <p className="col-span-full text-center text-gray-400 py-20 text-sm">
                {t("noResults")}
              </p>
            )}
            {visible.map((content) => (
              <ContentCard key={content.id} content={content} isKo={isKo} />
            ))}
          </div>

          {/* Infinite scroll sentinel */}
          {hasMore && <div ref={observerTarget} className="h-10 w-full" />}
        </div>

        {/* ── Sidebar — desktop only ── */}
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

          </div>
        </aside>
      </div>
    </div>
  );
}
