"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useLanguageStore } from "@/lib/stores/languageStore";

const LABS_DATA = [
  {
    ko: {
      title: "AI 문화 이미지 생성기",
      desc: "기사 내용을 분석하여 한국의 전통미와 현대적 감각이 섞인 고해상도 커버 이미지를 생성합니다.",
    },
    es: {
      title: "Generador de Imágenes Culturales AI",
      desc: "Analiza el contenido del artículo para generar imágenes de portada de alta resolución que mezclan la belleza tradicional coreana con un toque moderno.",
    },
    gradient: "from-indigo-500 to-purple-600",
    tag: "Generative AI",
    icon: "🎨",
  },
  {
    ko: {
      title: "실시간 유행어 사전",
      desc: "한국의 최신 신조어를 중남미 현지 유행어와 1:1 매칭해주는 AI 엔진 테스트 버전입니다.",
    },
    es: {
      title: "Diccionario de Modismos en Tiempo Real",
      desc: "Una versión de prueba de un motor de IA que empareja 1:1 los neologismos coreanos más recientes con los modismos locales de América Latina.",
    },
    gradient: "from-blue-500 to-teal-400",
    tag: "NLP",
    icon: "📖",
  },
  {
    ko: {
      title: "댓글 감정 리포트",
      desc: "다국어 댓글의 뉘앙스를 분석하여 게시글에 대한 사회적 온도와 반응을 시각화합니다.",
    },
    es: {
      title: "Reporte de Sentimientos de Comentarios",
      desc: "Analiza los matices de los comentarios multilingües para visualizar la temperatura social y las reacciones a las publicaciones.",
    },
    gradient: "from-amber-400 to-red-500",
    tag: "Analytics",
    icon: "📊",
  },
  {
    ko: {
      title: "K-Voice 오디오북",
      desc: "생성된 텍스트를 가장 자연스러운 한국인 성우의 목소리로 변환해주는 음성 합성 실험실입니다.",
    },
    es: {
      title: "Audiolibro K-Voice",
      desc: "Laboratorio de síntesis de voz que convierte el texto generado en la voz más natural de un actor de voz coreano.",
    },
    gradient: "from-emerald-400 to-blue-500",
    tag: "Speech",
    icon: "🎙️",
  },
];

export default function LabsPage() {
  const t = useTranslations("labs");
  const router = useRouter();
  const { language } = useLanguageStore();
  const isKo = language === "ko";

  return (
    <div className="py-8 sm:py-10 md:py-16">
      {/* Hero */}
      <div className="text-center mb-10 sm:mb-14 animate-fade-in-down">
        <span className="inline-block bg-gray-100 text-black text-xs font-black tracking-widest px-4 sm:px-5 py-2 rounded-full mb-4 sm:mb-5">
          {t("badge")}
        </span>
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-black mb-3 sm:mb-4 tracking-tight">
          {t("title")}
        </h1>
        <p className="text-gray-500 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed px-4">
          {t("subtitle")}
        </p>
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-12 sm:mb-20">
        {LABS_DATA.map((project, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-100 shadow-sm"
          >
            {/* Gradient banner */}
            <div
              className={`h-36 sm:h-48 bg-gradient-to-br ${project.gradient} flex items-center justify-center relative`}
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/25 backdrop-blur rounded-xl sm:rounded-2xl flex items-center justify-center text-3xl sm:text-4xl border border-white/30">
                {project.icon}
              </div>
              <span className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-black/15 text-white text-xs font-black px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full backdrop-blur">
                {project.tag}
              </span>
              {/* Coming Soon badge */}
              <span className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 bg-white/20 backdrop-blur-sm text-white text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full border border-white/30">
                {isKo ? "출시 예정" : "Próximamente"}
              </span>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6">
              <h3 className="text-base sm:text-xl font-black mb-2 sm:mb-3 leading-snug">
                {isKo ? project.ko.title : project.es.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                {isKo ? project.ko.desc : project.es.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="bg-black text-white rounded-2xl sm:rounded-3xl md:rounded-[40px] p-6 sm:p-8 md:p-14 text-center relative overflow-hidden">
        <div className="absolute -top-1/2 -right-10 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black mb-2 sm:mb-3">
            {t("ctaTitle")}
          </h2>
          <p className="text-gray-400 text-sm md:text-base mb-6 sm:mb-8 max-w-lg mx-auto">
            {t("ctaDesc")}
          </p>
          <button
            onClick={() => router.push("/feedback?category=feature")}
            className="px-6 sm:px-8 py-3 sm:py-3.5 bg-white text-black rounded-xl sm:rounded-2xl font-black text-sm hover:bg-gray-100 transition-colors cursor-pointer active:scale-95"
          >
            {t("ctaBtn")}
          </button>
        </div>
      </div>
    </div>
  );
}
