"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useLanguageStore } from "@/lib/stores/languageStore";
import { useUserStore } from "@/lib/stores/userStore";
import { useState, Suspense, useEffect, useRef } from "react";

// ── Category data (mirrored from page.tsx) ──────────────────────────────────
const CATEGORIES_KO = ["전체", "K-POP", "드라마", "뉴스", "문화", "스포츠", "음식"] as const;
const CATEGORIES_ES = ["Todos", "K-POP", "Drama", "Noticias", "Cultura", "Deportes", "Comida"];

// ── Inner component that reads searchParams ─────────────────────────────────
function NavInner() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("nav");
  const { language, setLanguage } = useLanguageStore();
  const { user, isLoggedIn, logout } = useUserStore();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const desktopNavRef = useRef<HTMLElement>(null);
  const mobileHeaderRef = useRef<HTMLElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsCategoryOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsCategoryOpen(false);
    }, 150);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        desktopNavRef.current && !desktopNavRef.current.contains(target) &&
        mobileHeaderRef.current && !mobileHeaderRef.current.contains(target)
      ) {
        setIsCategoryOpen(false);
      }
    }
    if (isCategoryOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isCategoryOpen]);

  const isHome = pathname === "/";
  const isKo = language === "ko";

  const activeCategory = searchParams.get("category") ?? "전체";

  function handleCategoryClick(cat: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (cat === "전체" || cat === "Todos") {
      params.delete("category");
    } else {
      params.set("category", cat);
    }
    router.push(`/?${params.toString()}`, { scroll: false });
  }

  function handleLogout() {
    logout();
    router.push("/");
  }

  const langs = [
    { code: "ko" as const, label: t("langKo") },
    { code: "es" as const, label: t("langEs") },
  ];


  const bottomTabs = [
    { href: "/labs", label: t("labs"), icon: "✨" },
    { href: "/feedback", label: t("feedback"), icon: "💬" },
    { href: "/admin", label: t("admin"), icon: "⚙️" },
    { href: isLoggedIn ? "/mypage" : "/login", label: isLoggedIn ? t("mypage") : t("login"), icon: "👤" },
  ];

  const LangDropdown = ({ align = "right" }: { align?: "right" | "left" }) => (
    <div className="relative">
      <button
        onClick={() => setIsLangOpen(!isLangOpen)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-gray-200 text-sm font-bold hover:bg-gray-50 transition-colors cursor-pointer"
      >
        🌐 {language.toUpperCase()}
        <span className={`text-[10px] text-gray-400 transition-transform duration-200 ${isLangOpen ? "rotate-180" : ""}`}>▼</span>
      </button>

      {isLangOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsLangOpen(false)} />
          <div
            className={`absolute top-full mt-2 z-50 bg-white border border-gray-100 rounded-2xl shadow-xl min-w-[180px] p-2 ${align === "right" ? "right-0" : "left-0"}`}
          >
            <div className="px-3 py-1.5 text-[11px] text-gray-400 font-semibold uppercase tracking-wide">
              {t("selectLang")}
            </div>
            <hr className="my-1 border-gray-100" />
            {langs.map(({ code, label }) => (
              <button
                key={code}
                onClick={() => { setLanguage(code); setIsLangOpen(false); }}
                className={`w-full flex justify-between items-center px-3 py-2.5 rounded-xl text-sm transition-colors cursor-pointer ${
                  language === code ? "bg-black text-white font-bold" : "text-gray-600 hover:bg-gray-50 font-medium"
                }`}
              >
                {label}
                {language === code && <span className="text-xs">✓</span>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );

  return (
    <>
      {/* ─────────────────────────────────────────
          Desktop GNB  (lg and above)
      ───────────────────────────────────────── */}
      <nav ref={desktopNavRef} className="hidden lg:block sticky top-0 z-50 bg-white border-b border-gray-100">
        {/* Top bar */}
        <div className="max-w-screen-xl mx-auto px-6 h-16 flex items-center gap-6">
          <Link href="/" className="flex items-center hover:opacity-70 transition-opacity flex-shrink-0">
            <Image
              src="/logo.png"
              alt="Corea Hoy"
              width={120}
              height={48}
              style={{ objectFit: "contain" }}
              priority
            />
          </Link>

          {/* Page links */}
          <div className="flex items-center gap-5 ml-2">
            <Link
              href="/admin"
              className={`text-sm font-bold transition-colors whitespace-nowrap ${
                pathname === "/admin" ? "text-black" : "text-gray-400 hover:text-black"
              }`}
            >
              ⚙️ {t("admin")}
            </Link>
            <Link
              href="/labs"
              className={`text-sm font-bold transition-colors whitespace-nowrap ${
                pathname === "/labs" ? "text-black" : "text-gray-400 hover:text-black"
              }`}
            >
              ✨ {t("labs")}
            </Link>
            <Link
              href="/"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className={`text-sm font-bold transition-colors whitespace-nowrap ${
                isHome ? "text-black" : "text-gray-400 hover:text-black"
              }`}
            >
              {t("newsletter")}
            </Link>
            <Link
              href="/feedback"
              className={`text-sm font-bold transition-colors whitespace-nowrap ${
                pathname === "/feedback" ? "text-black" : "text-gray-400 hover:text-black"
              }`}
            >
              💬 {t("feedback")}
            </Link>
          </div>

          <span className="flex-1" />

          <LangDropdown />

          {isLoggedIn && user ? (
            <div className="flex items-center gap-3">
              <Link href="/mypage">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-lg border-2 transition-all cursor-pointer ${
                    pathname === "/mypage" ? "border-black" : "border-transparent"
                  }`}
                  style={{ backgroundColor: user.avatarColor }}
                >
                  {user.avatarEmoji}
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
              >
                {t("logout")}
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              {t("login")}
            </Link>
          )}
        </div>

        {/* Category tab bar — home only & toggled */}
        {isHome && isCategoryOpen && (
          <div 
            className="border-t border-gray-100 bg-white absolute w-full left-0 shadow-sm"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="max-w-screen-xl mx-auto px-6">
              <div className="flex items-center gap-0 overflow-x-auto scrollbar-hide">
                {CATEGORIES_KO.map((cat, i) => {
                  const label = isKo ? cat : CATEGORIES_ES[i];
                  const isActive = cat === activeCategory || (activeCategory === "전체" && cat === "전체");
                  return (
                    <button
                      key={cat}
                      onClick={() => handleCategoryClick(cat)}
                      className={`relative flex-shrink-0 px-5 py-3 text-sm font-bold transition-colors cursor-pointer whitespace-nowrap ${
                        isActive
                          ? "text-black"
                          : "text-gray-400 hover:text-gray-700"
                      }`}
                    >
                      {label}
                      {isActive && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black rounded-full" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* ─────────────────────────────────────────
          Mobile Top Header  (below lg)
      ───────────────────────────────────────── */}
      <header ref={mobileHeaderRef} className="lg:hidden sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between px-4 h-14">
          <Link href="/" className="hover:opacity-70 transition-opacity">
            <Image
              src="/logo.png"
              alt="Corea Hoy"
              width={96}
              height={38}
              style={{ objectFit: "contain" }}
              priority
            />
          </Link>
          <div className="flex items-center gap-2">
            <LangDropdown align="right" />
            {isLoggedIn && user ? (
              <Link href="/mypage">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-base border-2 cursor-pointer ${
                    pathname === "/mypage" ? "border-black" : "border-transparent"
                  }`}
                  style={{ backgroundColor: user.avatarColor }}
                >
                  {user.avatarEmoji}
                </div>
              </Link>
            ) : (
              <Link
                href="/login"
                className="px-3 py-1.5 text-xs font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                {t("login")}
              </Link>
            )}
          </div>
        </div>

        {/* Mobile category scroll row — home only & toggled */}
        {isHome && isCategoryOpen && (
          <div className="flex items-center gap-2 px-4 pb-3 overflow-x-auto scrollbar-hide">
            {CATEGORIES_KO.map((cat, i) => {
              const label = isKo ? cat : CATEGORIES_ES[i];
              const isActive = cat === activeCategory || (activeCategory === "전체" && cat === "전체");
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className={`flex-shrink-0 px-3.5 py-1.5 rounded-full border text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-black text-white border-black"
                      : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* ─────────────────────────────────────────
          Mobile Bottom Tab Bar  (below lg)
      ───────────────────────────────────────── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100">
        <div className="flex items-center justify-around h-16 pb-safe">
          {bottomTabs.map(({ href, label, icon }) => {
            const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center gap-0.5 flex-1 py-2 min-w-0"
              >
                <span className={`text-xl leading-none transition-opacity ${isActive ? "opacity-100" : "opacity-35"}`}>
                  {icon}
                </span>
                <span className={`text-[9px] font-semibold truncate max-w-full px-1 transition-colors ${isActive ? "text-black" : "text-gray-400"}`}>
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}

// ── Public export wrapped in Suspense (required for useSearchParams) ────────
export default function Nav() {
  return (
    <Suspense fallback={null}>
      <NavInner />
    </Suspense>
  );
}
