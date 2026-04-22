"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export default function FeedbackPage() {
  const t = useTranslations("feedback");

  const [category, setCategory] = useState("");
  const [body, setBody] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const categories = [
    { value: "ui", label: t("catUi") },
    { value: "content", label: t("catContent") },
    { value: "feature", label: t("catFeature") },
    { value: "bug", label: t("catBug") },
    { value: "other", label: t("catOther") },
  ];

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
    <div className="py-6 md:py-10">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-2">{t("title")}</h1>
        <p className="text-sm text-gray-500 leading-relaxed mb-8">{t("subtitle")}</p>

        {submitted ? (
          <div className="text-center py-16 border border-gray-100 rounded-2xl bg-white">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-xl font-extrabold mb-2">{t("successTitle")}</h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-6 max-w-xs mx-auto">{t("successDesc")}</p>
            <button
              onClick={reset}
              className="px-6 py-2.5 border border-gray-200 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors cursor-pointer"
            >
              {t("another")}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Category */}
            <div>
              <label className="block text-sm font-bold mb-3">{t("categoryLabel")}</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setCategory(cat.value)}
                    className={`px-4 py-2 rounded-full border text-sm font-semibold transition-all cursor-pointer ${
                      category === cat.value
                        ? "bg-black text-white border-black"
                        : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Textarea */}
            <div>
              <label className="block text-sm font-bold mb-2">{t("feedbackLabel")}</label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder={t("placeholder")}
                required
                rows={7}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm leading-7 resize-y outline-none focus:border-black transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-black text-white rounded-xl font-bold text-sm hover:opacity-80 transition-opacity cursor-pointer"
            >
              {t("submit")}
            </button>

            <p className="text-xs text-gray-300 text-center">ⓘ {t("notice")}</p>
          </form>
        )}
      </div>
    </div>
  );
}
