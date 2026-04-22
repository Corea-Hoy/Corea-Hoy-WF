"use client";

import { useState } from "react";
import Link from "next/link";
import { MOCK_CONTENTS, type Category } from "@/lib/mock-data";
import { useLanguage } from "@/lib/LanguageContext";

const CATEGORIES: (Category | "전체")[] = ["전체", "K-POP", "드라마", "뉴스", "문화", "스포츠", "음식"];
const CATEGORIES_ES: (string)[] = ["Todos", "K-POP", "Drama", "Noticias", "Cultura", "Deportes", "Comida"];

export default function MainPage() {
  const { language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<Category | "전체">("전체");
  const [searchQuery, setSearchQuery] = useState("");

  const isKo = language === "ko";

  const filtered = MOCK_CONTENTS.filter((c) => {
    const matchesCategory = activeCategory === "전체" || c.category === activeCategory;
    const matchesSearch = (isKo ? c.title : c.titleEs).toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (isKo ? c.summary : c.summaryEs).toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1rem" }}>
      {/* Title */}
      <h1 style={{ 
        fontSize: "2.5rem", 
        fontWeight: "800", 
        color: "#000", 
        marginBottom: "1.5rem"
      }}>
        {isKo ? "뉴스레터" : "Ediciones"}
      </h1>

      {/* Search Bar */}
      <div style={{ position: "relative", marginBottom: "2rem" }}>
        <span style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#666" }}>🔍</span>
        <input 
          type="text" 
          placeholder={isKo ? "기사 검색..." : "Pesquisar posts..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ 
            width: "100%", 
            padding: "1rem 1rem 1rem 3rem", 
            borderRadius: "12px", 
            border: "1px solid #eee", 
            backgroundColor: "#f9f9f9",
            fontSize: "1rem",
            outline: "none"
          }}
        />
      </div>

      {/* Category Chips */}
      <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", marginBottom: "3rem" }}>
        {CATEGORIES.map((cat, i) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: "0.5rem 1.25rem",
              borderRadius: "20px",
              border: "1px solid #eee",
              background: activeCategory === cat ? "#000" : "#fff",
              color: activeCategory === cat ? "#fff" : "#666",
              cursor: "pointer",
              fontSize: "0.9rem",
              fontWeight: "600",
              transition: "all 0.2s"
            }}
          >
            {isKo ? cat : CATEGORIES_ES[i]}
          </button>
        ))}
      </div>

      {/* Grid Layout */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", 
        gap: "2rem" 
      }}>
        {filtered.length === 0 && (
          <p style={{ color: "#999", gridColumn: "1 / -1", textAlign: "center", padding: "5rem 0" }}>
            {isKo ? "검색 결과가 없습니다." : "No se encontraron resultados."}
          </p>
        )}
        {filtered.map((content) => (
          <Link
            key={content.id}
            href={`/content/${content.id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div style={{ 
              borderRadius: "16px",
              border: "1px solid #eee",
              overflow: "hidden",
              transition: "transform 0.2s, box-shadow 0.2s",
              cursor: "pointer",
              backgroundColor: "#fff",
              display: "flex",
              flexDirection: "column",
              height: "100%"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
            >
              {/* Card Image */}
              <div style={{ position: "relative", height: "200px", width: "100%" }}>
                <img 
                  src={`https://picsum.photos/seed/${content.id}/600/400`} 
                  alt={content.title} 
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div style={{ 
                  position: "absolute", 
                  top: "1rem", 
                  left: "1rem", 
                  backgroundColor: "#000", 
                  color: "#fff", 
                  padding: "0.25rem 0.6rem", 
                  borderRadius: "6px",
                  fontSize: "0.75rem",
                  fontWeight: "700"
                }}>
                  {content.category}
                </div>
              </div>

              {/* Card Content */}
              <div style={{ 
                padding: "1.5rem", 
                backgroundColor: "#fff",
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem"
              }}>
                <div style={{ fontSize: "0.85rem", color: "#999", fontWeight: "600" }}>
                  {content.publishedAt}
                </div>
                <h2 style={{ margin: 0, fontSize: "1.2rem", fontWeight: "700", lineHeight: 1.3, color: "#000" }}>
                  {isKo ? content.title : content.titleEs}
                </h2>
                <p style={{ margin: "0.25rem 0", fontSize: "0.9rem", color: "#888", fontStyle: "italic" }}>
                  {isKo ? content.summary : content.summaryEs}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
