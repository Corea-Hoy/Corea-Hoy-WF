"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useLanguageStore } from "@/lib/stores/languageStore";
import { usePathname } from "next/navigation";
import { MOCK_CANDIDATE_ARTICLES, type CandidateArticle } from "@/lib/mock-data";

type Step = "select" | "review-ko" | "review-es" | "preview";
type AdminTab = "create" | "list";

const TRANSLATION_TARGETS = [
  { code: "es", ko: "스페인어", es: "Español", flag: "🇪🇸" },
] as const;

type TargetLang = typeof TRANSLATION_TARGETS[number]["code"];

export default function AdminPage() {
  const t = useTranslations("admin");
  const { language } = useLanguageStore();
  const pathname = usePathname();
  const isKo = language === "ko";

  const [candidates, setCandidates] = useState<CandidateArticle[]>(MOCK_CANDIDATE_ARTICLES);
  const [urlInput, setUrlInput] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [step, setStep] = useState<Step>("select");

  const [contentKo, setContentKo] = useState("");
  const [translatedContent, setTranslatedContent] = useState("");
  const [targetLang, setTargetLang] = useState<TargetLang | null>(null);
  const [previewLang, setPreviewLang] = useState<"ko" | TargetLang>("ko");

  const [activeTab, setActiveTab] = useState<AdminTab>("create");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");

  const steps: { id: Step; label: string }[] = [
    { id: "select", label: t("step1") },
    { id: "review-ko", label: t("step2") },
    { id: "review-es", label: t("step3") },
    { id: "preview", label: t("step4") },
  ];

  useEffect(() => {
    const saved = localStorage.getItem("coreahoy_draft");
    if (saved && pathname === "/admin" && activeTab === "create") {
      const confirmed = window.confirm(t("confirmDraft"));
      if (confirmed) {
        const data = JSON.parse(saved);
        setSelected(data.selected || []);
        setStep(data.step || "select");
        setContentKo(data.contentKo || "");
        setTranslatedContent(data.translatedContent || "");
      } else {
        localStorage.removeItem("coreahoy_draft");
        resetAll();
      }
    }
  }, [t, pathname, activeTab]);

  useEffect(() => {
    if (step === "review-es" && targetLang) setPreviewLang(targetLang);
  }, [step, targetLang]);

  function resetAll() {
    setSelected([]);
    setStep("select");
    setContentKo("");
    setTranslatedContent("");
    setPreviewLang("ko");
    setTargetLang(null);
    localStorage.removeItem("coreahoy_draft");
  }

  function handleSaveDraft() {
    setSaveStatus("saving");
    localStorage.setItem("coreahoy_draft", JSON.stringify({ selected, step, contentKo, translatedContent, targetLang }));
    setTimeout(() => {
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    }, 500);
  }

  function handlePublish() {
    alert(t("published"));
    resetAll();
  }

  function toggleSelect(id: string) {
    setSelected((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);
  }

  function addUrl() {
    if (!urlInput.trim()) return;
    const newArticle: CandidateArticle = {
      id: `ca${Date.now()}`,
      title: `[URL] ${urlInput.slice(0, 30)}...`,
      source: isKo ? "직접 입력" : "Entrada directa",
      url: urlInput,
      publishedAt: new Date().toISOString().slice(0, 10),
      summary: isKo ? "기사 내용 추출 중..." : "Extrayendo contenido...",
      selected: false,
    };
    setCandidates((prev) => [newArticle, ...prev]);
    setUrlInput("");
  }

  function runAiGeneration() {
    if (selected.length === 0) return;
    setIsGenerating(true);
    setTimeout(() => {
      const titles = candidates.filter(c => selected.includes(c.id)).map(c => c.title).join(", ");
      setContentKo(
        isKo
          ? `[AI 컨텐츠]\n\n'${titles}' 관련 기사를 요약한 결과입니다. 현재 한국 사회에서는 새로운 기술적 변화가 문화 전반에 큰 영향을 미치고 있습니다.\n\n특히 이러한 변화는 젊은 세대의 라이프스타일을 재정의하고 있으며, 사회적 상호작용의 방식을 혁신적으로 바꾸고 있습니다.`
          : `[Contenido IA]\n\nResumen de artículos relacionados con '${titles}'. Los nuevos cambios tecnológicos en la sociedad coreana están teniendo un gran impacto en la cultura.\n\nEstos cambios están redefiniendo el estilo de vida de las generaciones jóvenes.`
      );
      setIsGenerating(false);
      setStep("review-ko");
    }, 1200);
  }

  function runTranslation() {
    if (!contentKo) return;
    setIsTranslating(true);
    setTimeout(() => {
      setTranslatedContent(
        `[Traducción al Español]\n\nAnálisis sobre los cambios recientes en la sociedad coreana, destacando cómo la tecnología está influyendo en la cultura actual.\n\nEste movimiento está redefiniendo el estilo de vida de las generaciones jóvenes y alineándose con las tendencias globales más allá de Corea.`
      );
      setIsTranslating(false);
      setStep("review-es");
    }, 1000);
  }

  const SaveBtn = () => (
    <div className="flex gap-2">
      <button
        onClick={handleSaveDraft}
        className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
          saveStatus === "saved"
            ? "bg-green-500 text-white border-green-500"
            : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
        }`}
      >
        {saveStatus === "saving" ? t("saving") : saveStatus === "saved" ? t("saved") : t("save")}
      </button>
      <button
        onClick={() => { step === "review-ko" ? setContentKo("") : setTranslatedContent(""); }}
        className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-bold text-gray-500 hover:bg-gray-50 cursor-pointer"
      >
        {t("reset")}
      </button>
    </div>
  );

  return (
    <div className="py-6 md:py-10 pb-10">
      {/* Header */}
      <header className="mb-7">
        <h1 className="text-3xl font-black mb-1">{t("title")}</h1>
        <p className="text-sm text-gray-500">{t("subtitle")}</p>
      </header>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-gray-100 mb-8">
        {([{ id: "create" as AdminTab, label: t("tabCreate") }, { id: "list" as AdminTab, label: t("tabList") }]).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 font-extrabold text-base border-b-4 transition-colors cursor-pointer ${
              activeTab === tab.id
                ? "border-black text-black"
                : "border-transparent text-gray-300 hover:text-gray-500"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Create pipeline ── */}
      {activeTab === "create" && (
        <div className={`${step !== "preview" ? "lg:grid lg:grid-cols-[1fr_380px] lg:gap-8" : ""}`}>

          {/* Main column */}
          <div>
            {/* Step pills */}
            <div className="flex gap-2 mb-7 overflow-x-auto pb-1 scrollbar-none">
              {steps.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStep(s.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-colors cursor-pointer border ${
                    step === s.id
                      ? "bg-black text-white border-black"
                      : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Step: Select */}
            {step === "select" && (
              <div className="animate-fade-in">
                <div className="flex gap-2.5 mb-6">
                  <input
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder={t("urlPlaceholder")}
                    className="flex-1 border-2 border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-black transition-colors"
                  />
                  <button
                    onClick={addUrl}
                    className="px-6 bg-black text-white rounded-2xl font-bold text-sm cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0"
                  >
                    {t("add")}
                  </button>
                </div>
                <div className="flex flex-col gap-3">
                  {candidates.map((article) => (
                    <div
                      key={article.id}
                      onClick={() => toggleSelect(article.id)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        selected.includes(article.id) ? "border-black bg-gray-50" : "border-gray-100 bg-white hover:border-gray-300"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1.5 gap-3">
                        <span className="font-bold text-sm leading-snug">{article.title}</span>
                        <input
                          type="checkbox"
                          checked={selected.includes(article.id)}
                          readOnly
                          className="mt-0.5 flex-shrink-0 accent-black"
                        />
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">{article.summary}</p>
                      <div className="flex gap-3 mt-2 text-xs text-gray-400">
                        <span>{article.source}</span>
                        <span>{article.publishedAt}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step: Review KO */}
            {step === "review-ko" && (
              <div className="animate-fade-in">
                <div className="bg-white border-2 border-black rounded-2xl p-5 md:p-6">
                  <div className="flex justify-between items-center mb-4 gap-3">
                    <h3 className="text-lg font-black">{t("koTitle")}</h3>
                    <SaveBtn />
                  </div>
                  <textarea
                    value={contentKo}
                    onChange={(e) => setContentKo(e.target.value)}
                    placeholder={t("koPlaceholder")}
                    className="w-full min-h-[400px] border border-gray-200 rounded-xl p-4 text-sm leading-7 outline-none focus:border-black transition-colors resize-y font-[inherit]"
                  />
                </div>
              </div>
            )}

            {/* Step: Review ES */}
            {step === "review-es" && (
              <div className="animate-fade-in">
                <div className="bg-white border-2 border-black rounded-2xl p-5 md:p-6">
                  <div className="flex justify-between items-center mb-4 gap-3 flex-wrap">
                    <h3 className="text-lg font-black flex items-center gap-2">
                      {t("esTitle")}
                      {targetLang && (
                        <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-lg">
                          {TRANSLATION_TARGETS.find(tt => tt.code === targetLang)?.[isKo ? "ko" : "es"]}
                        </span>
                      )}
                    </h3>
                    <SaveBtn />
                  </div>
                  <textarea
                    value={translatedContent}
                    onChange={(e) => setTranslatedContent(e.target.value)}
                    placeholder={t("esPlaceholder")}
                    className="w-full min-h-[400px] border border-gray-200 rounded-xl p-4 text-sm leading-7 outline-none focus:border-black transition-colors resize-y font-[inherit]"
                  />
                </div>
              </div>
            )}

            {/* Step: Preview */}
            {step === "preview" && (
              <div className="animate-fade-in">
                <div className="bg-white border border-gray-100 rounded-3xl p-5 md:p-10 shadow-sm">
                  <div className="max-w-3xl mx-auto">
                    <div className="flex flex-wrap justify-between items-center gap-3 mb-8">
                      <div className="flex items-center gap-3">
                        <span className="bg-black text-white text-xs font-black px-3 py-1.5 rounded-lg">PREVIEW</span>
                        <div className="flex border border-gray-200 rounded-xl overflow-hidden">
                          <button
                            onClick={() => setPreviewLang("ko")}
                            className={`px-4 py-2 text-xs font-bold border-none cursor-pointer transition-colors ${
                              previewLang === "ko" ? "bg-black text-white" : "bg-white text-gray-400 hover:bg-gray-50"
                            }`}
                          >
                            KR
                          </button>
                          {targetLang && (
                            <button
                              onClick={() => setPreviewLang(targetLang)}
                              className={`px-4 py-2 text-xs font-bold border-none cursor-pointer transition-colors ${
                                previewLang === targetLang ? "bg-black text-white" : "bg-white text-gray-400 hover:bg-gray-50"
                              }`}
                            >
                              {targetLang.toUpperCase()}
                            </button>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => setStep(translatedContent ? "review-es" : "review-ko")}
                        className="text-sm font-semibold border border-gray-200 px-4 py-2 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        {t("backToEdit")}
                      </button>
                    </div>

                    <div className="rounded-2xl overflow-hidden border border-gray-100 min-h-[500px]">
                      {(previewLang === "ko" ? contentKo : translatedContent) ? (
                        <>
                          <div className="relative w-full h-64 md:h-96">
                            <Image
                              src="https://picsum.photos/seed/preview/1200/600"
                              alt="Cover"
                              fill
                              sizes="(max-width: 768px) 100vw, 800px"
                              className="object-cover"
                            />
                          </div>
                          <div className="p-6 md:p-10 bg-white">
                            <div className="text-xs text-gray-400 font-bold mb-3">K-CULTURA · 2026.04.22</div>
                            <h1 className="text-2xl md:text-4xl font-black mb-5 leading-snug">
                              {(previewLang === "ko" ? contentKo : translatedContent).split("\n")[2] || "Untitled"}
                            </h1>
                            <p className="text-base leading-8 text-gray-700 whitespace-pre-wrap">
                              {previewLang === "ko" ? contentKo : translatedContent}
                            </p>
                          </div>
                        </>
                      ) : (
                        <div className="flex justify-center items-center h-80 text-gray-300 font-bold text-sm">
                          {previewLang === "ko" ? t("emptyKo") : t("emptyEs")}
                        </div>
                      )}
                    </div>

                    <div className="mt-8 text-center">
                      <button
                        disabled={!(previewLang === "ko" ? contentKo : translatedContent)}
                        onClick={handlePublish}
                        className="px-10 py-4 bg-green-500 text-white rounded-2xl font-black text-base cursor-pointer hover:bg-green-600 transition-colors shadow-lg shadow-green-200 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        {t("publish")}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Sidebar: Workflow controls ── */}
          {step !== "preview" && (
            <aside className="mt-6 lg:mt-0">
              <div className="lg:sticky lg:top-24 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                <h4 className="text-sm font-black mb-5">{t("workflowTitle")}</h4>

                <div className="flex flex-col gap-3">
                  {/* Step: Select → Generate */}
                  {step === "select" && (
                    <button
                      disabled={isGenerating || selected.length === 0}
                      onClick={runAiGeneration}
                      className="w-full py-3.5 bg-black text-white rounded-xl font-bold text-sm cursor-pointer hover:opacity-80 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      {isGenerating ? t("generating") : t("generateBtn")}
                    </button>
                  )}

                  {/* Step: Review KO → Translate + Regenerate */}
                  {step === "review-ko" && (
                    <>
                      {/* Language selector + translate */}
                      <div>
                        <label className="block text-xs text-gray-400 font-bold mb-2">{t("runTranslation")}</label>
                        <div className="flex gap-2 items-center">
                          {/* Dropdown */}
                          <div className="relative flex-1">
                            <button
                              onClick={() => setIsLangDropdownOpen((v) => !v)}
                              className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border border-gray-200 text-sm font-bold cursor-pointer hover:bg-gray-50 transition-colors"
                            >
                              <span className="flex items-center gap-1.5 text-sm">
                                🌐
                                <span className={targetLang ? "text-black" : "text-gray-400"}>
                                  {targetLang
                                    ? `${TRANSLATION_TARGETS.find(tt => tt.code === targetLang)?.[isKo ? "ko" : "es"]} (${targetLang.toUpperCase()})`
                                    : (isKo ? t("selectLangLabel") : "Seleccionar")}
                                </span>
                              </span>
                              <span className={`text-[10px] text-gray-400 transition-transform ${isLangDropdownOpen ? "rotate-180" : ""}`}>▼</span>
                            </button>
                            {isLangDropdownOpen && (
                              <>
                                <div className="fixed inset-0 z-40" onClick={() => setIsLangDropdownOpen(false)} />
                                <div className="absolute top-full mt-1.5 left-0 right-0 z-50 bg-white border border-gray-100 rounded-2xl shadow-lg p-1.5">
                                  {TRANSLATION_TARGETS.map((lang) => {
                                    const isSel = targetLang === lang.code;
                                    return (
                                      <button
                                        key={lang.code}
                                        onClick={() => { setTargetLang(lang.code); setIsLangDropdownOpen(false); }}
                                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-colors cursor-pointer ${
                                          isSel ? "bg-black text-white font-bold" : "text-gray-600 hover:bg-gray-50 font-medium"
                                        }`}
                                      >
                                        <span className="flex items-center gap-2">
                                          <span>{lang.flag}</span>
                                          <span>{isKo ? lang.ko : lang.es}</span>
                                          <span className={`text-xs ${isSel ? "text-white/60" : "text-gray-300"}`}>{lang.code.toUpperCase()}</span>
                                        </span>
                                        {isSel && <span className="text-xs">✓</span>}
                                      </button>
                                    );
                                  })}
                                </div>
                              </>
                            )}
                          </div>
                          {/* Translate button */}
                          <button
                            onClick={runTranslation}
                            disabled={!contentKo || isTranslating || !targetLang}
                            className="flex-shrink-0 px-3 py-2.5 bg-black text-white rounded-xl text-xs font-black cursor-pointer hover:opacity-80 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed whitespace-nowrap"
                          >
                            {isTranslating ? "⌛" : "🌎"} {isKo ? "번역" : "Traducir"}
                          </button>
                        </div>
                      </div>

                      <button
                        disabled={isGenerating}
                        onClick={runAiGeneration}
                        className="w-full py-3 border-2 border-black text-black rounded-xl font-bold text-sm cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        {t("regenerateBtn")}
                      </button>
                    </>
                  )}

                  {/* Step: Review ES → Preview + Retranslate */}
                  {step === "review-es" && (
                    <>
                      <button
                        onClick={() => setStep("preview")}
                        disabled={!translatedContent}
                        className="w-full py-3.5 bg-black text-white rounded-xl font-bold text-sm cursor-pointer hover:opacity-80 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        {t("checkPreview")}
                      </button>
                      <button
                        disabled={isTranslating}
                        onClick={runTranslation}
                        className="w-full py-3 border-2 border-black text-black rounded-xl font-bold text-sm cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        {t("retranslateBtn")}
                      </button>
                    </>
                  )}

                  {/* Cancel */}
                  {step !== "select" && (
                    <button
                      onClick={() => { setStep("select"); resetAll(); }}
                      className="w-full py-3 border border-gray-200 text-gray-400 rounded-xl font-semibold text-sm cursor-pointer hover:bg-gray-50 transition-colors mt-2"
                    >
                      {t("cancel")}
                    </button>
                  )}
                </div>
              </div>
            </aside>
          )}
        </div>
      )}

      {/* ── List tab ── */}
      {activeTab === "list" && (
        <div className="py-16 text-center bg-white border border-gray-100 rounded-2xl">
          <p className="text-sm text-gray-400">{t("listLoading")}</p>
        </div>
      )}
    </div>
  );
}
