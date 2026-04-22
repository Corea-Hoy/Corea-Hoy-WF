"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useLanguageStore } from "@/lib/stores/languageStore";
import { useUserStore } from "@/lib/stores/userStore";
import { useState } from "react";

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("nav");
  const { language, setLanguage } = useLanguageStore();
  const { user, isLoggedIn, logout } = useUserStore();
  const [isLangOpen, setIsLangOpen] = useState(false);

  function handleLogout() {
    logout();
    router.push("/");
  }

  const langs = [
    { code: "ko" as const, label: t("langKo") },
    { code: "es" as const, label: t("langEs") },
  ];

  const desktopLinks = [
    { href: "/admin", label: t("admin") },
    { href: "/labs", label: `✨ ${t("labs")}` },
    { href: "/feedback", label: `💬 ${t("feedback")}` },
  ];

  const bottomTabs = [
    { href: "/", label: t("home"), icon: "🏠" },
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
      <nav className="hidden lg:block sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
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

          <div className="flex items-center gap-5 ml-2">
            {desktopLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`text-sm font-bold transition-colors whitespace-nowrap ${
                  pathname === href ? "text-black" : "text-gray-400 hover:text-black"
                }`}
              >
                {label}
              </Link>
            ))}
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
      </nav>

      {/* ─────────────────────────────────────────
          Mobile Top Header  (below lg)
      ───────────────────────────────────────── */}
      <header className="lg:hidden sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
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
