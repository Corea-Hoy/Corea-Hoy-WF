"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/LanguageContext";
import { useState } from "react";

export default function Nav() {
  const pathname = usePathname();
  const { language, setLanguage } = useLanguage();
  const [isLangOpen, setIsLangOpen] = useState(false);

  const LANG_LABELS: Record<typeof language, string> = {
    ko: "한국어 (KR)",
    es: "스페인어 (ES)"
  };

  const UI_LABELS: Record<typeof language, { admin: string; logout: string; select: string; labs: string }> = {
    ko: { admin: "관리자", logout: "로그아웃", select: "언어 선택", labs: "실험실" },
    es: { admin: "Admin", logout: "Salir", select: "Seleccionar idioma", labs: "Labs" }
  };

  const isKo = language === "ko";

  return (
    <nav style={{ borderBottom: "1px solid #eee", padding: "0.75rem 1rem", backgroundColor: "#fff", position: "sticky", top: 0, zIndex: 1000 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", gap: "1.5rem" }}>
        <Link 
          href="/" 
          style={{ 
            fontWeight: "800", 
            fontSize: "1.3rem", 
            textDecoration: "none", 
            color: "#000", 
            display: "flex", 
            alignItems: "center", 
            gap: "0.5rem",
            transition: "opacity 0.2s"
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          Corea Hoy
        </Link>

        {/* Links Section */}
        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center", marginLeft: "1rem" }}>
          <Link href="/admin" style={{ 
            textDecoration: "none", 
            color: pathname === "/admin" ? "#000" : "#999",
            fontSize: "0.95rem",
            fontWeight: "700"
          }}>
            {UI_LABELS[language].admin}
          </Link>
          <Link href="/labs" style={{ 
            textDecoration: "none", 
            color: pathname === "/labs" ? "#000" : "#999",
            fontSize: "0.95rem",
            fontWeight: "700"
          }}>
            ✨ {UI_LABELS[language].labs}
          </Link>
        </div>
        
        <span style={{ flex: 1 }} />
        
        {/* Language Switcher */}
        <div style={{ position: "relative" }}>
          <button 
            onClick={() => setIsLangOpen(!isLangOpen)}
            style={{ 
              background: isLangOpen ? "#f5f5f5" : "none", 
              border: "1px solid #eee", 
              cursor: "pointer", 
              display: "flex", 
              alignItems: "center", 
              gap: "0.5rem",
              fontSize: "0.9rem",
              color: "#000",
              padding: "0.5rem 1rem",
              borderRadius: "20px",
              fontWeight: "700",
              transition: "all 0.2s"
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
              🌐 {LANG_LABELS[language].match(/\(([^)]+)\)/)?.[1] || language.toUpperCase()}
            </span>
            <span style={{ fontSize: "0.7rem", transform: isLangOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>▼</span>
          </button>

          {isLangOpen && (
            <>
              <div 
                style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000 }} 
                onClick={() => setIsLangOpen(false)} 
              />
              <div style={{ 
                position: "absolute", 
                top: "120%", 
                right: 0, 
                backgroundColor: "#fff", 
                border: "1px solid #eee", 
                borderRadius: "12px", 
                boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                minWidth: "180px",
                padding: "0.5rem",
                zIndex: 1001
              }}>
                <div style={{ padding: "0.6rem 0.8rem", fontSize: "0.8rem", color: "#999", fontWeight: "600", textTransform: "uppercase" }}>
                  {UI_LABELS[language].select}
                </div>
                <div style={{ height: "1px", background: "#f0f0f0", margin: "0.4rem 0" }} />
                
                {(Object.keys(LANG_LABELS) as Array<keyof typeof LANG_LABELS>).map((lang) => (
                  <button 
                    key={lang}
                    onClick={() => { setLanguage(lang); setIsLangOpen(false); }}
                    style={{ 
                      width: "100%", 
                      textAlign: "left", 
                      padding: "0.75rem 1rem", 
                      background: language === lang ? "#000" : "none", 
                      color: language === lang ? "#fff" : "#666",
                      border: "none", 
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "0.95rem",
                      fontWeight: language === lang ? "700" : "500",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                  >
                    <span>{LANG_LABELS[lang]}</span>
                    {language === lang && <span>✓</span>}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <Link href="/login" style={{ 
          textDecoration: "none", 
          color: "#666",
          fontSize: "0.95rem",
          padding: "0.5rem 1rem",
          border: "1px solid #eee",
          borderRadius: "12px",
          fontWeight: "600"
        }}>
          {UI_LABELS[language].logout}
        </Link>
      </div>
    </nav>
  );
}
