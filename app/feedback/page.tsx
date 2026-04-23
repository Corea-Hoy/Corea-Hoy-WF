"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useLanguageStore } from "@/lib/stores/languageStore";
import { useUserStore } from "@/lib/stores/userStore";

export default function FeedbackPage() {
  const t = useTranslations("feedback");
  const { language } = useLanguageStore();
  const { user, isLoggedIn } = useUserStore();
  const isKo = language === "ko";

  const [category, setCategory] = useState("");
  const [otherCategory, setOtherCategory] = useState("");
  const [email, setEmail] = useState("");
  const [body, setBody] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const categories = [
    { value: "ui", label: isKo ? "디자인 / 사용성" : "Diseño / Usabilidad", icon: "🎨" },
    { value: "content", label: isKo ? "콘텐츠 퀄리티" : "Calidad del contenido", icon: "📝" },
    { value: "translation", label: isKo ? "오역 및 번역 제안" : "Traducción", icon: "🌐" },
    { value: "feature", label: isKo ? "새로운 기능 제안" : "Sugerencia de función", icon: "✨" },
    { value: "bug", label: isKo ? "버그 및 오류" : "Error de sistema", icon: "🐛" },
    { value: "community", label: isKo ? "커뮤니티 관련" : "Comunidad", icon: "👥" },
    { value: "other", label: isKo ? "기타 의견" : "Otros", icon: "💡" },
  ];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!category || !body.trim()) return;

    // 실제 API 호출 시 서버로 보낼 데이터 (유저 정보 몰래 첨부)
    const feedbackPayload = {
      category: category === "other" ? `other: ${otherCategory}` : category,
      body,
      optionalEmail: email || null,
      submittedBy: isLoggedIn && user ? user.name : "Guest (Anonymous)",
      submittedAt: new Date().toISOString(),
    };
    
    console.log("Submitting Feedback:", feedbackPayload); // 테스트용 로그

    setSubmitted(true);
  }

  function reset() {
    setCategory("");
    setOtherCategory("");
    setEmail("");
    setBody("");
    setSubmitted(false);
  }

  function handleCategoryClick(val: string) {
    if (category === val) {
      setCategory(""); // Toggle off
      if (val === "other") setOtherCategory("");
    } else {
      setCategory(val);
    }
  }

  return (
    <div className="py-10 md:py-16 bg-gray-50/50 min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-2xl mx-auto px-4">
        
        {submitted ? (
          <div className="text-center py-20 px-6 border border-gray-100 rounded-3xl bg-white shadow-xl shadow-gray-200/40 animate-fade-in">
            <div className="text-6xl mb-6">🎉</div>
            <h2 className="text-2xl font-black mb-3">{t("successTitle")}</h2>
            <p className="text-base text-gray-500 leading-relaxed mb-8 max-w-sm mx-auto">
              {t("successDesc")}
            </p>
            <button
              onClick={reset}
              className="px-8 py-3.5 bg-black text-white rounded-xl text-sm font-bold hover:scale-105 transition-transform cursor-pointer shadow-lg shadow-black/20"
            >
              {t("another")}
            </button>
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-3xl p-8 md:p-10 shadow-xl shadow-gray-200/40">
            <header className="mb-8 text-center">
              <h1 className="text-3xl font-black mb-3 text-gray-900">{t("title")}</h1>
              <p className="text-sm text-gray-500">{t("subtitle")}</p>
            </header>

            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              
              {/* Category Grid */}
              <section>
                <label className="block text-sm font-bold text-gray-800 mb-4">
                  {isKo ? "어떤 부분에 대한 의견이신가요?" : "¿Sobre qué es tu opinión?"}
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {categories.map((cat) => {
                    const isSelected = category === cat.value;
                    return (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => handleCategoryClick(cat.value)}
                        className={`flex flex-col items-start p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                          isSelected
                            ? "border-black bg-gray-900 text-white shadow-md shadow-gray-900/20 scale-[1.02]"
                            : "border-gray-100 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <span className="text-2xl mb-2">{cat.icon}</span>
                        <span className="text-sm font-bold leading-tight">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Conditional Text Input for 'Other' */}
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${category === "other" ? "max-h-24 opacity-100 mt-4" : "max-h-0 opacity-0"}`}>
                  <input
                    type="text"
                    value={otherCategory}
                    onChange={(e) => setOtherCategory(e.target.value)}
                    placeholder={isKo ? "어떤 카테고리인지 짧게 입력해주세요" : "Escribe brevemente sobre qué trata"}
                    className="w-full px-5 py-3.5 rounded-2xl border-2 border-gray-200 bg-white text-sm font-medium outline-none focus:border-black focus:ring-4 focus:ring-gray-100 transition-all placeholder:text-gray-400"
                    autoFocus={category === "other"}
                  />
                </div>
              </section>

              {/* Email Input (Optional) */}
              <section>
                <label className="block text-sm font-bold text-gray-800 mb-3">
                  {isKo ? "이메일 주소 " : "Correo electrónico "}
                  <span className="text-gray-400 font-normal">{isKo ? "(선택)" : "(Opcional)"}</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={isKo ? "추가 확인이 필요할 때만 연락드립니다" : "Solo te contactaremos si necesitamos más detalles"}
                  className="w-full px-5 py-3.5 rounded-2xl border-2 border-gray-200 bg-gray-50/50 text-sm font-medium outline-none focus:border-black focus:bg-white transition-all placeholder:text-gray-400 hover:border-gray-300"
                />
              </section>

              {/* Textarea Area */}
              <section>
                <label className="block text-sm font-bold text-gray-800 mb-3">
                  {isKo ? "자세한 내용을 들려주세요" : "Cuéntanos más detalles"}
                </label>
                <div className="relative group">
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder={t("placeholder")}
                    required
                    rows={6}
                    className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 bg-gray-50/50 text-sm leading-relaxed resize-y outline-none focus:border-black focus:bg-white transition-all group-hover:border-gray-300"
                  />
                </div>
              </section>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!category || !body.trim()}
                  className="w-full py-4 bg-black text-white rounded-2xl font-black text-base hover:opacity-90 hover:scale-[1.01] transition-all cursor-pointer shadow-lg shadow-black/20 disabled:opacity-40 disabled:scale-100 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  {t("submit")}
                </button>
                <p className="text-xs text-gray-400 text-center mt-4 font-medium">
                  {t("notice")}
                </p>
              </div>

            </form>
          </div>
        )}
      </div>
    </div>
  );
}
