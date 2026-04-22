"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";

const LABELS = {
  ko: {
    title: "피드백",
    subtitle: "Corea Hoy를 더 좋게 만들어 주세요. 어떤 의견이든 환영합니다.",
    categoryLabel: "카테고리",
    categories: [
      { value: "ui", label: "UI / 디자인" },
      { value: "content", label: "콘텐츠" },
      { value: "feature", label: "기능 제안" },
      { value: "bug", label: "오류 신고" },
      { value: "other", label: "기타" },
    ],
    feedbackLabel: "의견을 적어주세요",
    placeholder: "어떤 점이 개선되었으면 하나요? 자유롭게 작성해 주세요.",
    submit: "제출하기",
    successTitle: "감사합니다!",
    successDesc: "소중한 의견을 남겨주셨어요. 더 나은 서비스를 위해 반영하겠습니다.",
    another: "다른 의견 보내기",
    notice: "현재 데모 버전입니다. 실제 서비스에서는 제출된 피드백이 저장됩니다.",
  },
  es: {
    title: "Feedback",
    subtitle: "Ayúdanos a mejorar Corea Hoy. Toda opinión es bienvenida.",
    categoryLabel: "Categoría",
    categories: [
      { value: "ui", label: "UI / Diseño" },
      { value: "content", label: "Contenido" },
      { value: "feature", label: "Sugerencia de función" },
      { value: "bug", label: "Reportar error" },
      { value: "other", label: "Otro" },
    ],
    feedbackLabel: "Tu opinión",
    placeholder: "¿Qué te gustaría que mejoráramos? Escribe libremente.",
    submit: "Enviar",
    successTitle: "¡Gracias!",
    successDesc: "Hemos recibido tu opinión. La tendremos en cuenta para mejorar el servicio.",
    another: "Enviar otra opinión",
    notice: "Esta es la versión demo. En el servicio real, el feedback enviado se guardará.",
  },
};

export default function FeedbackPage() {
  const { language } = useLanguage();
  const L = LABELS[language];

  const [category, setCategory] = useState("");
  const [body, setBody] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    setSubmitted(true);
  }

  function reset() {
    setCategory("");
    setBody("");
    setSubmitted(false);
  }

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "3rem 1rem" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: "800", marginBottom: "0.5rem" }}>
        {L.title}
      </h1>
      <p style={{ color: "#666", fontSize: "1rem", marginBottom: "2.5rem", lineHeight: 1.6 }}>
        {L.subtitle}
      </p>

      {submitted ? (
        <div style={{ textAlign: "center", padding: "4rem 2rem", border: "1px solid #eee", borderRadius: "16px" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎉</div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "800", marginBottom: "0.75rem" }}>{L.successTitle}</h2>
          <p style={{ color: "#666", fontSize: "1rem", lineHeight: 1.6, marginBottom: "2rem" }}>{L.successDesc}</p>
          <button onClick={reset} style={{
            padding: "0.75rem 2rem",
            borderRadius: "12px",
            border: "1px solid #eee",
            background: "#fff",
            fontWeight: "700",
            fontSize: "0.95rem",
            cursor: "pointer",
          }}>
            {L.another}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Category */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontWeight: "700", fontSize: "0.9rem" }}>{L.categoryLabel}</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {L.categories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  style={{
                    padding: "0.5rem 1.1rem",
                    borderRadius: "20px",
                    border: "1px solid #eee",
                    background: category === cat.value ? "#000" : "#fff",
                    color: category === cat.value ? "#fff" : "#555",
                    fontWeight: "600",
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Text area */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontWeight: "700", fontSize: "0.9rem" }}>{L.feedbackLabel}</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={L.placeholder}
              required
              rows={7}
              style={{
                padding: "1rem",
                borderRadius: "12px",
                border: "1px solid #eee",
                fontSize: "0.95rem",
                lineHeight: 1.7,
                resize: "vertical",
                outline: "none",
                fontFamily: "inherit",
                backgroundColor: "#fafafa",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#000")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#eee")}
            />
          </div>

          <button
            type="submit"
            style={{
              padding: "0.9rem",
              borderRadius: "12px",
              border: "none",
              background: "#000",
              color: "#fff",
              fontWeight: "700",
              fontSize: "1rem",
              cursor: "pointer",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            {L.submit}
          </button>

          {/* Demo notice */}
          <p style={{ fontSize: "0.8rem", color: "#bbb", textAlign: "center", margin: 0 }}>
            ⓘ {L.notice}
          </p>
        </form>
      )}
    </div>
  );
}
