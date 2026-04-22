"use client";

import { useState, useEffect } from "react";
import { MOCK_CANDIDATE_ARTICLES, type CandidateArticle } from "@/lib/mock-data";
import { useLanguage } from "@/lib/LanguageContext";
import { usePathname } from "next/navigation";

type Step = "select" | "review-ko" | "review-es" | "preview";
type TargetLang = "es";
type AdminTab = "create" | "list";

export default function AdminPage() {
  const { language } = useLanguage();
  const pathname = usePathname();
  const [candidates, setCandidates] = useState<CandidateArticle[]>(MOCK_CANDIDATE_ARTICLES);
  const [urlInput, setUrlInput] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [step, setStep] = useState<Step>("select");
  
  // 데이터 상태
  const [contentKo, setContentKo] = useState("");
  const [translatedContent, setTranslatedContent] = useState("");
  const [targetLang] = useState<TargetLang>("es");
  
  // 미리보기 전용 상태
  const [previewLang, setPreviewLang] = useState<"ko" | TargetLang>("ko");
  
  const [activeTab, setActiveTab] = useState<AdminTab>("create");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");

  const isKo = language === "ko";

  // 언어 코드별 한글 명칭 매핑
  const LANG_LABELS: Record<"ko" | TargetLang, string> = {
    ko: "한국어 (KR)",
    es: "스페인어 (ES)"
  };

  // 초기 진입 시 임시 저장 데이터 확인
  useEffect(() => {
    const saved = localStorage.getItem("coreahoy_draft");
    if (saved && pathname === "/admin" && activeTab === "create") {
      const confirmed = window.confirm("이전에 작업하던 임시 저장된 데이터가 있습니다. 이어서 작업하시겠습니까?");
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
  }, []);

  // 번역 검수 단계 진입 시 미리보기 언어 자동 설정
  useEffect(() => {
    if (step === "review-es") {
      setPreviewLang(targetLang);
    }
  }, [step, targetLang]);

  function resetAll() {
    setSelected([]);
    setStep("select");
    setContentKo("");
    setTranslatedContent("");
    setPreviewLang("ko");
    localStorage.removeItem("coreahoy_draft");
  }

  function handleSaveDraft() {
    setSaveStatus("saving");
    const draftData = {
      selected,
      step,
      contentKo,
      translatedContent,
      targetLang
    };
    localStorage.setItem("coreahoy_draft", JSON.stringify(draftData));
    
    setTimeout(() => {
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    }, 500);
  }

  function handlePublish() {
    alert("컨텐츠가 성공적으로 등록되었습니다.");
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

  async function runAiGeneration() {
    if (selected.length === 0) return;
    setIsGenerating(true);
    setTimeout(() => {
      const selectedTitles = candidates
        .filter(c => selected.includes(c.id))
        .map(c => c.title)
        .join(", ");

      const result = `[AI 컨텐츠]\n\n'${selectedTitles}' 관련 기사를 요약한 결과입니다. 현재 한국 사회에서는 새로운 기술적 변화가 문화 전반에 큰 영향을 미치고 있습니다.\n\n특히 이러한 변화는 젊은 세대의 라이프스타일을 재정의하고 있으며, 사회적 상호작용의 방식을 혁신적으로 바꾸고 있습니다. 이는 한국만의 독특한 현상을 넘어 글로벌 트렌드와도 궤를 같이하고 있습니다.`;
      
      setContentKo(result);
      setIsGenerating(false);
      setStep("review-ko");
    }, 1200);
  }

  async function runTranslation() {
    if (!contentKo) return;
    setIsTranslating(true);
    
    setTimeout(() => {
      const result = `[Traducción al Español]\n\nEste es un análisis sobre los cambios recientes en la sociedad coreana, destacando cómo la tecnología está influyendo en la cultura actual.\n\nEspecíficamente, este movimiento está redefiniendo el estilo de vida de las generaciones jóvenes, transformando radicalmente la forma en que interactuamos socialmente y alineándose con las tendencias globales más allá de Corea.`;
      setTranslatedContent(result);
      setIsTranslating(false);
      setStep("review-es");
    }, 1000);
  }

  const STEP_LABELS: Record<Step, string> = {
    select: "1. 기사 선택",
    "review-ko": "2. 컨텐츠 검수",
    "review-es": "3. 번역 검수",
    preview: "4. 미리보기"
  };

  const TopActions = () => (
    <div style={{ display: "flex", gap: "0.5rem" }}>
      <button 
        onClick={handleSaveDraft}
        style={{ 
          background: saveStatus === "saved" ? "#22c55e" : "#fff", 
          border: "1px solid #eee", 
          padding: "0.5rem 1rem", 
          borderRadius: "8px", 
          cursor: "pointer", 
          fontWeight: "700", 
          fontSize: "0.85rem", 
          color: saveStatus === "saved" ? "#fff" : "#666",
          transition: "all 0.2s"
        }}
      >
        {saveStatus === "saving" ? "저장 중..." : saveStatus === "saved" ? "저장됨" : "임시 저장"}
      </button>
      <button 
        onClick={() => {
          if (step === "review-ko") setContentKo("");
          else setTranslatedContent("");
        }}
        style={{ background: "#fff", border: "1px solid #eee", padding: "0.5rem 1rem", borderRadius: "8px", cursor: "pointer", fontWeight: "700", fontSize: "0.85rem", color: "#666" }}
      >
        초기화
      </button>
    </div>
  );

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", paddingBottom: "4rem" }}>
      <header style={{ marginBottom: "2.5rem" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: "900", marginBottom: "0.5rem" }}>관리자 콘솔</h1>
        <p style={{ color: "#666" }}>컨텐츠 생성 파이프라인</p>
      </header>

      <div style={{ display: "flex", gap: "2.5rem", marginBottom: "2.5rem", borderBottom: "1px solid #eee" }}>
        {([
          { id: "create", label: "파이프라인 실행" },
          { id: "list", label: "게시 목록" }
        ] as const).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "1rem 0",
              border: "none",
              borderBottom: activeTab === tab.id ? "4px solid #000" : "4px solid transparent",
              background: "none",
              cursor: "pointer",
              fontWeight: "800",
              fontSize: "1.1rem",
              color: activeTab === tab.id ? "#000" : "#bbb",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "create" && (
        <div style={{ display: "grid", gridTemplateColumns: step === "preview" ? "1fr" : "1fr 400px", gap: "3rem" }}>
          
          <div style={{ width: "100%" }}>
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2.5rem", overflowX: "auto", paddingBottom: "0.5rem" }}>
              {(Object.keys(STEP_LABELS) as Step[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setStep(s)}
                  style={{
                    padding: "0.6rem 1.2rem",
                    borderRadius: "12px",
                    background: step === s ? "#000" : "#fff",
                    color: step === s ? "#fff" : "#666",
                    border: step === s ? "1px solid #000" : "1px solid #eee",
                    fontWeight: "800",
                    fontSize: "0.85rem",
                    whiteSpace: "nowrap",
                    cursor: "pointer"
                  }}
                >
                  {STEP_LABELS[s]}
                </button>
              ))}
            </div>

            {step === "select" && (
              <div style={{ animation: "fadeIn 0.3s" }}>
                <div style={{ marginBottom: "2rem", display: "flex", gap: "0.75rem" }}>
                  <input value={urlInput} onChange={(e) => setUrlInput(e.target.value)} placeholder="기사 URL을 입력하세요" style={{ flex: 1, border: "2px solid #eee", padding: "1rem", borderRadius: "16px", outline: "none" }} />
                  <button onClick={addUrl} style={{ backgroundColor: "#000", color: "#fff", padding: "0 2rem", borderRadius: "16px", border: "none", cursor: "pointer", fontWeight: "700" }}>추가</button>
                </div>
                <div style={{ display: "grid", gap: "1rem" }}>
                  {candidates.map((article) => (
                    <div key={article.id} onClick={() => toggleSelect(article.id)} style={{ padding: "1.5rem", borderRadius: "20px", border: "2px solid", borderColor: selected.includes(article.id) ? "#000" : "#eee", cursor: "pointer", background: "#fff" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                        <span style={{ fontWeight: "800" }}>{article.title}</span>
                        <input type="checkbox" checked={selected.includes(article.id)} readOnly />
                      </div>
                      <p style={{ margin: 0, color: "#666", fontSize: "0.9rem" }}>{article.summary}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === "review-ko" && (
              <div style={{ animation: "fadeIn 0.3s" }}>
                <div style={{ backgroundColor: "#fff", border: "2px solid #000", borderRadius: "24px", padding: "2rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                    <h3 style={{ margin: 0, fontSize: "1.5rem", fontWeight: "900" }}>2. 컨텐츠 검수</h3>
                    <TopActions />
                  </div>
                  <textarea value={contentKo} onChange={(e) => setContentKo(e.target.value)} placeholder="AI 생성을 시작하거나 직접 입력하세요." style={{ width: "100%", minHeight: "450px", border: "1px solid #eee", borderRadius: "12px", padding: "1.5rem", fontSize: "1.1rem", lineHeight: 1.7, outline: "none", fontFamily: "inherit" }} />
                </div>
              </div>
            )}

            {step === "review-es" && (
              <div style={{ animation: "fadeIn 0.3s" }}>
                <div style={{ backgroundColor: "#fff", border: "2px solid #000", borderRadius: "24px", padding: "2rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                    <h3 style={{ margin: 0, fontSize: "1.5rem", fontWeight: "900" }}>3. 번역 검수</h3>
                    <TopActions />
                  </div>
                  <textarea value={translatedContent} onChange={(e) => setTranslatedContent(e.target.value)} placeholder="번역을 진행하거나 직접 입력하세요." style={{ width: "100%", minHeight: "450px", border: "1px solid #eee", borderRadius: "12px", padding: "1.5rem", fontSize: "1.1rem", lineHeight: 1.7, outline: "none", fontFamily: "inherit" }} />
                </div>
              </div>
            )}

            {step === "preview" && (
              <div style={{ animation: "fadeIn 0.3s" }}>
                <div style={{ backgroundColor: "#fff", border: "1px solid #eee", borderRadius: "32px", padding: "4rem", boxShadow: "0 20px 60px rgba(0,0,0,0.05)" }}>
                  <div style={{ maxWidth: 900, margin: "0 auto" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
                      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                        <span style={{ backgroundColor: "#000", color: "#fff", padding: "0.4rem 1rem", borderRadius: "8px", fontWeight: "800", fontSize: "0.9rem" }}>PREVIEW</span>
                        <div style={{ display: "flex", border: "1px solid #eee", borderRadius: "12px", overflow: "hidden" }}>
                          <button onClick={() => setPreviewLang("ko")} style={{ padding: "0.5rem 1.25rem", border: "none", background: previewLang === "ko" ? "#000" : "#fff", color: previewLang === "ko" ? "#fff" : "#999", fontWeight: "700", cursor: "pointer" }}>KR</button>
                          <button onClick={() => setPreviewLang(targetLang)} style={{ padding: "0.5rem 1.25rem", border: "none", background: previewLang === targetLang ? "#000" : "#fff", color: previewLang === targetLang ? "#fff" : "#999", fontWeight: "700", cursor: "pointer" }}>
                            ES
                          </button>
                        </div>
                      </div>
                      <button onClick={() => setStep(translatedContent ? "review-es" : "review-ko")} style={{ background: "none", border: "1px solid #eee", padding: "0.6rem 1.2rem", borderRadius: "12px", cursor: "pointer", fontWeight: "600" }}>← 편집으로 돌아가기</button>
                    </div>
                    
                    <div style={{ borderRadius: "24px", overflow: "hidden", border: "1px solid #f0f0f0", minHeight: "600px", backgroundColor: "#fafafa" }}>
                      {(previewLang === "ko" ? contentKo : translatedContent) ? (
                        <>
                          <img src="https://picsum.photos/seed/preview/1200/600" alt="Cover" style={{ width: "100%", height: "400px", objectFit: "cover" }} />
                          <div style={{ padding: "3rem", backgroundColor: "#fff" }}>
                            <div style={{ color: "#999", fontWeight: "700", marginBottom: "1rem" }}>K-CULTURA · 2026.04.22</div>
                            <h1 style={{ fontSize: "3rem", fontWeight: "900", marginBottom: "2rem", lineHeight: 1.2 }}>
                              {(previewLang === "ko" ? contentKo : translatedContent).split('\n')[2] || "Untitled"}
                            </h1>
                            <p style={{ fontSize: "1.25rem", lineHeight: 1.8, color: "#333", whiteSpace: "pre-wrap" }}>
                              {previewLang === "ko" ? contentKo : translatedContent}
                            </p>
                          </div>
                        </>
                      ) : (
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "600px", color: "#ccc", fontWeight: "700", fontSize: "1.2rem" }}>
                          {previewLang === "ko" ? "한국어 컨텐츠가 아직 생성되지 않았습니다." : "스페인어 번역이 아직 진행되지 않았습니다."}
                        </div>
                      )}
                    </div>
                    
                    <div style={{ marginTop: "3rem", textAlign: "center" }}>
                      <button 
                        disabled={!(previewLang === "ko" ? contentKo : translatedContent)}
                        onClick={handlePublish} 
                        style={{ backgroundColor: "#22c55e", color: "#fff", padding: "1.5rem 4rem", borderRadius: "20px", border: "none", fontWeight: "900", fontSize: "1.2rem", cursor: "pointer", boxShadow: "0 10px 25px rgba(34, 197, 94, 0.3)", opacity: !(previewLang === "ko" ? contentKo : translatedContent) ? 0.3 : 1 }}
                      >
                        게시하기
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 오른쪽 제어판 */}
          {step !== "preview" && (
            <aside>
              <div style={{ position: "sticky", top: "100px", background: "#fff", border: "1px solid #eee", padding: "2rem", borderRadius: "24px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
                <h4 style={{ margin: "0 0 1.5rem 0", fontSize: "1.1rem", fontWeight: "900" }}>워크플로우 제어</h4>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {step === "review-ko" && (
                    <div style={{ borderBottom: "1px solid #eee", paddingBottom: "1rem" }}>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#666", fontWeight: "700", marginBottom: "0.5rem" }}>번역 실행 (ES)</label>
                      <button 
                        onClick={runTranslation} 
                        disabled={!contentKo || isTranslating}
                        style={{ width: "100%", backgroundColor: "#000", color: "#fff", border: "none", padding: "1.25rem", borderRadius: "16px", fontWeight: "800", cursor: "pointer", opacity: (!contentKo || isTranslating) ? 0.3 : 1 }}
                      >
                        {isTranslating ? "⌛ 번역 중..." : "🌎 스페인어로 번역하기"}
                      </button>
                    </div>
                  )}

                  {step === "review-es" && (
                    <button onClick={() => setStep("preview")} disabled={!translatedContent} style={{ backgroundColor: "#000", color: "#fff", border: "none", padding: "1.25rem", borderRadius: "16px", fontWeight: "800", cursor: "pointer", opacity: !translatedContent ? 0.3 : 1 }}>👁 미리보기 확인</button>
                  )}

                  {step === "select" && (
                    <button disabled={isGenerating} onClick={runAiGeneration} style={{ backgroundColor: "#000", color: "#fff", padding: "1.25rem", borderRadius: "16px", border: "none", fontWeight: "800", cursor: "pointer", opacity: isGenerating ? 0.3 : 1 }}>
                      {isGenerating ? "⌛ 컨텐츠 생성 중..." : "🤖 AI 컨텐츠 생성"}
                    </button>
                  )}

                  {step === "review-ko" && (
                    <button disabled={isGenerating} onClick={runAiGeneration} style={{ backgroundColor: "#fff", color: "#000", border: "2px solid #000", padding: "1.25rem", borderRadius: "16px", fontWeight: "800", cursor: "pointer" }}>🔄 컨텐츠 재생성하기</button>
                  )}

                  {step === "review-es" && (
                    <button disabled={isTranslating} onClick={runTranslation} style={{ backgroundColor: "#fff", color: "#000", border: "2px solid #000", padding: "1.25rem", borderRadius: "16px", fontWeight: "800", cursor: "pointer" }}>🔄 재번역하기</button>
                  )}

                  <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {step !== "select" && (
                      <button onClick={() => { setStep("select"); resetAll(); }} style={{ background: "none", border: "1px solid #eee", color: "#999", padding: "1rem", borderRadius: "12px", fontWeight: "700", cursor: "pointer" }}>취소하기</button>
                    )}
                  </div>
                </div>
              </div>
            </aside>
          )}
        </div>
      )}

      {activeTab === "list" && (
        <div style={{ padding: "3rem", textAlign: "center", backgroundColor: "#fff", border: "1px solid #eee", borderRadius: "32px" }}>
          <p style={{ color: "#999", fontSize: "1.1rem" }}>게시된 컨텐츠 목록을 불러오고 있습니다...</p>
        </div>
      )}
    </div>
  );
}
