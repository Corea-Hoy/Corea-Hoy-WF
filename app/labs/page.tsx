"use client";

import { useLanguage } from "@/lib/LanguageContext";

export default function LabsPage() {
  const { language } = useLanguage();
  const isKo = language === "ko";

  const LABS_PROJECTS = [
    {
      title: isKo ? "AI 문화 이미지 생성기" : "Generador de Imágenes Culturales AI",
      desc: isKo 
        ? "기사 내용을 분석하여 한국의 전통미와 현대적 감각이 섞인 고해상도 커버 이미지를 생성합니다."
        : "Analiza el contenido del artículo para generar imágenes de portada de alta resolución que mezclan la belleza tradicional coreana con un toque moderno.",
      gradient: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
      tag: "Generative AI"
    },
    {
      title: isKo ? "실시간 유행어 사전" : "Diccionario de Modismos en Tiempo Real",
      desc: isKo
        ? "한국의 최신 신조어를 중남미 현지 유행어와 1:1 매칭해주는 AI 엔진 테스트 버전입니다."
        : "Una versión de prueba de un motor de IA que empareja 1:1 los neologismos coreanos más recientes con los modismos locales de América Latina.",
      gradient: "linear-gradient(135deg, #3b82f6 0%, #2dd4bf 100%)",
      tag: "NLP"
    },
    {
      title: isKo ? "댓글 감정 리포트" : "Reporte de Sentimientos de Comentarios",
      desc: isKo
        ? "다국어 댓글의 뉘앙스를 분석하여 게시글에 대한 사회적 온도와 반응을 시각화합니다."
        : "Analiza los matices de los comentarios multilingües para visualizar la temperatura social y las reacciones a las publicaciones.",
      gradient: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
      tag: "Analytics"
    },
    {
      title: isKo ? "K-Voice 오디오북" : "Audiolibro K-Voice",
      desc: isKo
        ? "생성된 텍스트를 가장 자연스러운 한국인 성우의 목소리로 변환해주는 음성 합성 실험실입니다."
        : "Laboratorio de síntesis de voz que convierte el texto generado en la voz más natural de un actor de voz coreano.",
      gradient: "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
      tag: "Speech"
    }
  ];

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "4rem 2rem" }}>
      <div style={{ textAlign: "center", marginBottom: "5rem", animation: "fadeInDown 0.8s ease-out" }}>
        <span style={{ backgroundColor: "#f0f0f0", padding: "0.5rem 1.5rem", borderRadius: "100px", fontWeight: "800", fontSize: "0.9rem", color: "#000", marginBottom: "1.5rem", display: "inline-block" }}>
          COREA HOY LABS
        </span>
        <h1 style={{ fontSize: "4rem", fontWeight: "900", marginBottom: "1.5rem", letterSpacing: "-0.03em" }}>
          {isKo ? "미래를 미리 만나보세요" : "Conoce el futuro por adelantado"}
        </h1>
        <p style={{ color: "#666", fontSize: "1.25rem", maxWidth: "800px", margin: "0 auto", lineHeight: 1.6 }}>
          {isKo 
            ? "AI 기술을 활용한 Corea Hoy 팀의 실험적인 프로젝트들을 소개합니다. 혁신적인 아이디어가 실제 서비스가 되는 과정을 함께 지켜봐 주세요."
            : "Presentamos los proyectos experimentales del equipo de Corea Hoy utilizando tecnología de IA. Sé testigo del proceso de cómo las ideas innovadoras se convierten en servicios reales."}
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "2.5rem" }}>
        {LABS_PROJECTS.map((project, idx) => (
          <div 
            key={idx} 
            style={{ 
              backgroundColor: "#fff", 
              borderRadius: "40px", 
              overflow: "hidden", 
              boxShadow: "0 20px 60px rgba(0,0,0,0.05)",
              border: "1px solid #f0f0f0",
              transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
              cursor: "pointer",
              position: "relative"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-15px) scale(1.02)";
              e.currentTarget.style.boxShadow = "0 30px 80px rgba(0,0,0,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0) scale(1)";
              e.currentTarget.style.boxShadow = "0 20px 60px rgba(0,0,0,0.05)";
            }}
          >
            <div style={{ height: "240px", background: project.gradient, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
              <div style={{ width: "100px", height: "100px", backgroundColor: "rgba(255,255,255,0.25)", borderRadius: "30px", backdropFilter: "blur(15px)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,0.3)" }}>
                <span style={{ fontSize: "2.5rem" }}>{idx === 0 ? "🎨" : idx === 1 ? "📖" : idx === 2 ? "📊" : "🎙️"}</span>
              </div>
              <span style={{ position: "absolute", top: "24px", right: "24px", backgroundColor: "rgba(0,0,0,0.15)", color: "#fff", padding: "0.4rem 1rem", borderRadius: "20px", fontSize: "0.75rem", fontWeight: "800", backdropFilter: "blur(5px)" }}>{project.tag}</span>
            </div>
            <div style={{ padding: "2.5rem" }}>
              <h3 style={{ margin: "0 0 1.2rem 0", fontSize: "1.5rem", fontWeight: "900" }}>{project.title}</h3>
              <p style={{ margin: 0, color: "#666", fontSize: "1rem", lineHeight: 1.7 }}>{project.desc}</p>
              <div style={{ marginTop: "2rem", display: "flex", justifyContent: "flex-end" }}>
                <div style={{ width: "40px", height: "40px", backgroundColor: "#f8f8f8", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s" }}>
                  <span style={{ fontWeight: "900" }}>→</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "8rem", padding: "4rem", backgroundColor: "#000", borderRadius: "48px", color: "#fff", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "relative", zIndex: 2 }}>
          <h2 style={{ fontSize: "2.5rem", fontWeight: "900", marginBottom: "1rem" }}>
            {isKo ? "여러분의 아이디어를 들려주세요" : "Cuéntanos tus ideas"}
          </h2>
          <p style={{ color: "#aaa", fontSize: "1.1rem", marginBottom: "2.5rem" }}>
            {isKo ? "Corea Hoy Labs에서 만나보고 싶은 기능이 있나요?" : "¿Hay alguna función que te gustaría ver en Corea Hoy Labs?"}
          </p>
          <button style={{ backgroundColor: "#fff", color: "#000", border: "none", padding: "1.2rem 3rem", borderRadius: "20px", fontWeight: "800", fontSize: "1.1rem", cursor: "pointer" }}>
            {isKo ? "아이디어 제안하기" : "Sugerir Idea"}
          </button>
        </div>
        <div style={{ position: "absolute", top: "-50%", right: "-10%", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)", zIndex: 1 }} />
      </div>
    </div>
  );
}
