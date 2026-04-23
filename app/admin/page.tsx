"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useLanguageStore } from "@/lib/stores/languageStore";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { MOCK_CANDIDATE_ARTICLES, type CandidateArticle } from "@/lib/mock-data";

type Step = "select" | "review-ko" | "review-es" | "preview";
type AdminTab = "create" | "list";

type PostStatus = "published" | "draft" | "archived";

interface Post {
  id: string;
  title: string;
  status: PostStatus;
  draftStep?: Step;
  author: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  views: number;
  likes: number;
  langStatus: {
    ko: "done" | "pending";
    es: "done" | "pending";
  };
}

const MOCK_POSTS: Post[] = [
  {
    id: "p1",
    title: "뉴진스, 빌보드 핫 100 진입 '글로벌 신드롬'",
    status: "published",
    author: "관리자",
    category: "K-POP",
    createdAt: "2026-04-20",
    updatedAt: "2026-04-21",
    views: 12500,
    likes: 3400,
    langStatus: { ko: "done", es: "done" },
  },
  {
    id: "p2",
    title: "한국의 독특한 배달 문화, 어디까지 왔나",
    status: "draft",
    draftStep: "review-es",
    author: "에디터A",
    category: "CULTURE",
    createdAt: "2026-04-22",
    updatedAt: "2026-04-23",
    views: 0,
    likes: 0,
    langStatus: { ko: "done", es: "pending" },
  },
  {
    id: "p3",
    title: "서울, 가장 혁신적인 스마트 시티로 선정",
    status: "draft",
    draftStep: "review-ko",
    author: "에디터B",
    category: "TECH",
    createdAt: "2026-04-23",
    updatedAt: "2026-04-23",
    views: 0,
    likes: 0,
    langStatus: { ko: "pending", es: "pending" },
  },
  {
    id: "p4",
    title: "전통주 막걸리, 세계화 가능성 엿보다",
    status: "published",
    author: "관리자",
    category: "FOOD",
    createdAt: "2026-04-18",
    updatedAt: "2026-04-18",
    views: 8900,
    likes: 1200,
    langStatus: { ko: "done", es: "done" },
  },
  {
    id: "p5",
    title: "다음 주 개최되는 K-뷰티 박람회 프리뷰",
    status: "draft",
    draftStep: "select",
    author: "관리자",
    category: "BEAUTY",
    createdAt: "2026-04-23",
    updatedAt: "2026-04-23",
    views: 0,
    likes: 0,
    langStatus: { ko: "pending", es: "pending" },
  }
];

interface Paragraph {
  id: string;
  text: string;
  originalText: string;
  isDirty: boolean;
}

// ── 문자 단위 diff: 삽입·삭제·동일 세 가지 타입으로 반환 ──
type DiffSegment = { text: string; type: "same" | "insert" | "delete" };

function charDiff(original: string, modified: string): DiffSegment[] {
  const m = original.length;
  const n = modified.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = original[i - 1] === modified[j - 1]
        ? dp[i - 1][j - 1] + 1
        : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  const ops: { type: "same" | "insert" | "delete"; ch: string }[] = [];
  let i = m, j = n;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && original[i - 1] === modified[j - 1]) {
      ops.unshift({ type: "same", ch: modified[j - 1] }); i--; j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      ops.unshift({ type: "insert", ch: modified[j - 1] }); j--;
    } else {
      ops.unshift({ type: "delete", ch: original[i - 1] }); i--;
    }
  }
  // 연속된 같은 타입끼리 병합
  const result: DiffSegment[] = [];
  for (const op of ops) {
    if (result.length > 0 && result[result.length - 1].type === op.type) {
      result[result.length - 1].text += op.ch;
    } else {
      result.push({ text: op.ch, type: op.type });
    }
  }
  return result;
}

function renderParagraphDiff(p: Paragraph): React.ReactNode {
  if (!p.isDirty) return p.text;
  const segments = charDiff(p.originalText, p.text);
  return segments.map((seg, idx) => {
    if (seg.type === "insert") {
      return (
        <span key={idx} className="bg-blue-100 border-b-2 border-blue-400 rounded-sm">
          {seg.text}
        </span>
      );
    }
    if (seg.type === "delete") {
      return (
        <span key={idx} className="line-through text-red-400 opacity-70">
          {seg.text}
        </span>
      );
    }
    return <span key={idx}>{seg.text}</span>;
  });
}

const TRANSLATION_TARGETS = [
  { code: "es", ko: "스페인어", es: "Español", flag: "🇪🇸" },
] as const;

type TargetLang = (typeof TRANSLATION_TARGETS)[number]["code"];

const SHARE_ICONS = {
  x: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  facebook: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
  whatsapp: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  ),
};

function getArticleFullText(article: CandidateArticle): string {
  return `${article.title}\n\n출처: ${article.source} | 발행일: ${article.publishedAt}\n\n${article.summary}\n\n이번 소식은 관련 업계와 사회 전반에 걸쳐 큰 관심을 모으고 있습니다. 전문가들은 이번 발표가 향후 수개월간 주요 화제로 이어질 것으로 전망하고 있습니다.\n\n특히 이번 사안은 기존 트렌드와 달리 새로운 방향성을 제시한다는 점에서 주목받습니다. 한국 사회의 빠른 변화 속도를 감안하면 이러한 흐름은 자연스러운 연장선으로 볼 수 있습니다.\n\n관계자는 "이번 결과가 업계 전반에 긍정적인 영향을 미칠 것"이라며 "앞으로도 지속적인 관심을 기울여 나가겠다"고 밝혔습니다.\n\n전문가들은 이 현상이 단기 트렌드에 그치지 않고 장기적인 문화적 변화로 이어질 가능성이 높다고 분석하고 있습니다.`;
}

function generateKoParagraphs(articles: CandidateArticle[]): Paragraph[] {
  const titleStr = articles.map((a) => a.title).join(", ");
  return [
    {
      id: "p1",
      text: `최근 '${titleStr}'과 관련된 소식이 한국 사회에서 큰 주목을 받고 있습니다. 이번 발표는 단순한 유행을 넘어 한국 문화의 새로운 전환점으로 평가받고 있습니다.`,
      originalText: `최근 '${titleStr}'과 관련된 소식이 한국 사회에서 큰 주목을 받고 있습니다. 이번 발표는 단순한 유행을 넘어 한국 문화의 새로운 전환점으로 평가받고 있습니다.`,
      isDirty: false,
    },
    {
      id: "p2",
      text: `이 현상의 배경에는 한국 고유의 문화적 맥락이 자리잡고 있습니다. 전통과 혁신이 공존하는 한국 사회의 독특한 구조는 외국인이 한국 문화를 이해하는 데 핵심 열쇠입니다.`,
      originalText: `이 현상의 배경에는 한국 고유의 문화적 맥락이 자리잡고 있습니다. 전통과 혁신이 공존하는 한국 사회의 독특한 구조는 외국인이 한국 문화를 이해하는 데 핵심 열쇠입니다.`,
      isDirty: false,
    },
    {
      id: "p3",
      text: `특히 이번 사례는 한국의 '빨리빨리' 문화와 깊이 연결되어 있습니다. 빠른 변화와 적응을 중시하는 한국 사회의 특성이 고스란히 반영된 이 현상은, 한국이 글로벌 트렌드를 선도하는 원동력이기도 합니다.`,
      originalText: `특히 이번 사례는 한국의 '빨리빨리' 문화와 깊이 연결되어 있습니다. 빠른 변화와 적응을 중시하는 한국 사회의 특성이 고스란히 반영된 이 현상은, 한국이 글로벌 트렌드를 선도하는 원동력이기도 합니다.`,
      isDirty: false,
    },
    {
      id: "p4",
      text: `전문가들은 이 흐름이 K-문화 전반으로 확산될 가능성이 높다고 분석합니다. 한국의 소프트파워가 세계적으로 영향력을 키워가는 가운데, 이번 사례는 그 흐름을 가속화하는 촉매가 될 것으로 기대됩니다.`,
      originalText: `전문가들은 이 흐름이 K-문화 전반으로 확산될 가능성이 높다고 분석합니다. 한국의 소프트파워가 세계적으로 영향력을 키워가는 가운데, 이번 사례는 그 흐름을 가속화하는 촉매가 될 것으로 기대됩니다.`,
      isDirty: false,
    },
  ];
}

function generateEsParagraphs(koParagraphs: Paragraph[]): Paragraph[] {
  const translations = [
    `Las recientes noticias relacionadas con este tema están recibiendo una gran atención en la sociedad coreana. Este anuncio está siendo valorado como un nuevo punto de inflexión en la cultura coreana, más allá de una simple tendencia pasajera.`,
    `Detrás de este fenómeno se encuentra el contexto cultural único de Corea. La estructura particular de la sociedad coreana, donde la tradición y la innovación coexisten, es la clave para que los extranjeros comprendan la cultura coreana.`,
    `En particular, este caso está profundamente conectado con la cultura "ppalli-ppalli" (rapidez) de Corea. Este fenómeno refleja las características de la sociedad coreana que valoran el cambio rápido y la adaptación, siendo también la fuerza que lleva a Corea a liderar las tendencias globales.`,
    `Los expertos analizan que es muy probable que esta corriente se expanda a toda la cultura K. Con el poder blando de Corea aumentando su influencia a nivel mundial, se espera que este caso actúe como catalizador para acelerar aún más esa tendencia.`,
  ];
  return koParagraphs.map((p, i) => {
    const text = translations[i] ?? `[Traducción] ${p.text.substring(0, 60)}...`;
    return { id: `pe${i + 1}`, text, originalText: text, isDirty: false };
  });
}

// ── Preview card: mirrors the real content detail page layout ──
function PreviewCard({
  lang,
  title,
  paragraphs,
  label,
  seed,
}: {
  lang: "ko" | "es";
  title: string;
  paragraphs: Paragraph[];
  label: string;
  seed: string;
}) {
  const isKo = lang === "ko";
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [comments, setComments] = useState<{ id: number; text: string; date: string }[]>([]);
  const [commentInput, setCommentInput] = useState("");

  function handleLike() {
    setLiked((prev) => {
      setLikeCount((c) => (prev ? c - 1 : c + 1));
      return !prev;
    });
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(paragraphs.map((p) => p.text).join("\n\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  function handleSubmitComment(e: React.FormEvent) {
    e.preventDefault();
    if (!commentInput.trim()) return;
    setComments((prev) => [
      ...prev,
      { id: Date.now(), text: commentInput, date: new Date().toISOString().slice(0, 10) },
    ]);
    setCommentInput("");
  }

  return (
    <div className="border border-gray-200 rounded-3xl overflow-hidden bg-white shadow-sm flex flex-col">
      <div className="flex items-center gap-2 px-5 pt-4 pb-2 border-b border-gray-50">
        <span className="bg-black text-white text-[10px] font-black px-2 py-1 rounded-md tracking-wide">
          PREVIEW · {label}
        </span>
        <span className="text-xs text-gray-400">K-CULTURA · 2026.04.23</span>
      </div>

      <div className="relative w-full h-44">
        <Image
          src={`https://picsum.photos/seed/${seed}/1200/600`}
          alt="Cover"
          fill
          sizes="(max-width: 1024px) 100vw, 600px"
          className="object-cover"
        />
      </div>

      <div className="px-5 pt-5 pb-3 flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-0.5 rounded">K-POP</span>
          <span className="text-xs text-gray-400">2026-04-23</span>
        </div>
        <h2 className="text-lg font-black leading-snug mb-4">
          {title || (isKo ? "컨텐츠 제목" : "Título del contenido")}
        </h2>
        <div className="flex flex-col gap-4 mb-4">
          {paragraphs.map((p) => (
            <p key={p.id} className="text-sm leading-7 text-gray-700 m-0">
              {p.text}
            </p>
          ))}
        </div>
        <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-2xl px-4 py-3 mb-2">
          <strong className="block text-amber-700 text-xs font-bold mb-1">
            📚 {isKo ? "문화 설명" : "Contexto cultural"}
          </strong>
          <p className="text-xs text-amber-800 leading-relaxed m-0">
            {isKo
              ? "이 컨텐츠와 관련된 한국 문화 배경 설명이 이 곳에 표시됩니다."
              : "Aquí se mostrará el contexto cultural coreano relacionado con este contenido."}
          </p>
        </div>
      </div>

      <div className="px-5 py-3 border-t border-gray-100">
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition-all cursor-pointer border ${
              liked
                ? "bg-red-500 text-white border-red-500"
                : "bg-red-50 text-red-500 border-red-100 hover:bg-red-100"
            }`}
          >
            <span>♥</span> {likeCount}
          </button>
          <span className="text-xs text-gray-400 flex-1">
            {liked
              ? (isKo ? "좋아요를 눌렀습니다!" : "¡Te gusta esto!")
              : (isKo ? "이 글이 도움이 되었나요?" : "¿Te gustó este artículo?")}
          </span>
        </div>
        <div className="flex items-center gap-2 flex-wrap mt-3">
          <span className="text-xs font-bold text-gray-500">{isKo ? "공유하기" : "Compartir"}</span>
          {Object.entries(SHARE_ICONS).map(([key, icon]) => (
            <button
              key={key}
              title={key}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white cursor-pointer hover:opacity-80 hover:scale-110 transition-all flex-shrink-0"
              style={{
                backgroundColor: key === "x" ? "#000" : key === "facebook" ? "#1877f2" : "#25d366",
              }}
            >
              {icon}
            </button>
          ))}
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-3 h-8 rounded-full border text-xs font-semibold transition-all cursor-pointer flex-shrink-0 ${
              copied
                ? "bg-green-50 text-green-600 border-green-200"
                : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
            }`}
          >
            {copied ? (
              <><span>✓</span> {isKo ? "복사됨!" : "¡Copiado!"}</>
            ) : (
              <>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                {isKo ? "링크 복사" : "Copiar link"}
              </>
            )}
          </button>
        </div>
      </div>

      <div className="px-5 py-4 border-t border-gray-100">
        <h4 className="text-sm font-black mb-3">
          💬 {isKo ? "댓글" : "Comentarios"} ({comments.length})
        </h4>
        <form onSubmit={handleSubmitComment} className="flex gap-2 mb-3">
          <input
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder={isKo ? "댓글을 입력하세요..." : "Escribe un comentario..."}
            className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-black transition-colors"
          />
          <button
            type="submit"
            disabled={!commentInput.trim()}
            className="px-4 py-2 bg-black text-white rounded-xl text-xs font-bold cursor-pointer hover:opacity-80 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
          >
            {isKo ? "등록" : "Enviar"}
          </button>
        </form>
        <div className="space-y-2">
          {comments.length === 0 ? (
            <p className="text-center text-gray-300 py-4 text-xs">
              {isKo ? "첫 번째 댓글을 남겨보세요." : "Sé el primero en comentar."}
            </p>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="bg-gray-50 rounded-xl px-3 py-2.5">
                <div className="flex items-center gap-2 mb-1">
                  <strong className="text-xs font-bold">{isKo ? "관리자" : "Admin"}</strong>
                  <span className="text-[10px] text-gray-400">{c.date}</span>
                </div>
                <p className="text-sm text-gray-700 m-0">{c.text}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// ── Save button shared component ──
function SaveBtn({
  status,
  onSave,
  isKo,
}: {
  status: "idle" | "saving" | "saved";
  onSave: () => void;
  isKo: boolean;
}) {
  return (
    <button
      onClick={onSave}
      className={`px-4 py-2.5 rounded-xl text-sm font-bold border-2 cursor-pointer transition-all whitespace-nowrap ${
        status === "saved"
          ? "bg-green-500 text-white border-green-500"
          : "border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700"
      }`}
    >
      {status === "saving"
        ? (isKo ? "저장 중..." : "Guardando...")
        : status === "saved"
        ? (isKo ? "✓ 저장됨" : "✓ Guardado")
        : (isKo ? "임시 저장" : "Guardar borrador")}
    </button>
  );
}

// ── Main page ──
export default function AdminPage() {
  const t = useTranslations("admin");
  const { language } = useLanguageStore();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isKo = language === "ko";

  const [candidates] = useState<CandidateArticle[]>(MOCK_CANDIDATE_ARTICLES);
  const [visibleCount, setVisibleCount] = useState(5);

  // Sync URL query params: tab, step, filter
  const tabParam = searchParams.get("tab") as AdminTab | null;
  const stepParam = searchParams.get("step") as Step | null;
  const filterParam = searchParams.get("filter") ?? "all";
  const VALID_STEPS: Step[] = ["select", "review-ko", "review-es", "preview"];

  const [activeTab, setActiveTab] = useState<AdminTab>(tabParam === "list" ? "list" : "create");
  const [step, setStep] = useState<Step>(stepParam && VALID_STEPS.includes(stepParam) ? stepParam : "select");
  const [selected, setSelected] = useState<string>("");

  // Post List States
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(filterParam);

  function handleTabChange(tab: AdminTab) {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.replace(`${pathname}?${params.toString()}`);
  }

  function handleStepChange(s: Step) {
    setStep(s);
    const params = new URLSearchParams(searchParams.toString());
    params.set("step", s);
    router.replace(`${pathname}?${params.toString()}`);
  }

  function handleFilterChange(f: string) {
    setStatusFilter(f);
    const params = new URLSearchParams(searchParams.toString());
    params.set("filter", f);
    router.replace(`${pathname}?${params.toString()}`);
  }

  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + 3, candidates.length));
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [candidates.length, visibleCount]);

  const [paragraphsKo, setParagraphsKo] = useState<Paragraph[]>([]);
  const [paragraphsEs, setParagraphsEs] = useState<Paragraph[]>([]);
  const [targetLang, setTargetLang] = useState<TargetLang | null>(null);

  // resetAll 직후 auto-save가 실행되지 않도록 막는 플래그
  const isClearingRef = useRef(false);

  // Inline paragraph editing
  const [editingParaId, setEditingParaId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");

  const [isGenerating, setIsGenerating] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isPolishing, setIsPolishing] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");

  const steps: { id: Step; label: string }[] = [
    { id: "select", label: t("step1") },
    { id: "review-ko", label: t("step2") },
    { id: "review-es", label: t("step3") },
    { id: "preview", label: t("step4") },
  ];

  const selectedArticle = candidates.find((c) => c.id === selected);

  // 마운트 시 자동으로 파이프라인 상태 복원 (새로고침일 때만, 일반 탐색은 복원 안 함)
  useEffect(() => {
    const navType = (performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming)?.type;
    if (navType !== "reload") return; // 다른 페이지에서 돌아온 경우 복원 생략

    const saved = localStorage.getItem("coreahoy_draft");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.selected) setSelected(data.selected);
        if (data.paragraphsKo?.length) setParagraphsKo(data.paragraphsKo);
        if (data.paragraphsEs?.length) setParagraphsEs(data.paragraphsEs);
        if (data.targetLang) setTargetLang(data.targetLang);
      } catch {
        localStorage.removeItem("coreahoy_draft");
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 파이프라인 상태가 변경될 때마다 자동 저장 (초기화 중에는 저장하지 않음)
  useEffect(() => {
    if (!isClearingRef.current && (selected || paragraphsKo.length > 0)) {
      localStorage.setItem(
        "coreahoy_draft",
        JSON.stringify({ selected, paragraphsKo, paragraphsEs, targetLang })
      );
    }
  }, [selected, paragraphsKo, paragraphsEs, targetLang]);

  function resetAll() {
    isClearingRef.current = true;
    localStorage.removeItem("coreahoy_draft");
    setSelected("");
    handleStepChange("select");
    setParagraphsKo([]);
    setParagraphsEs([]);
    setTargetLang(null);
    setEditingParaId(null);
    // 다음 렌더 사이클 이후 플래그 해제
    setTimeout(() => { isClearingRef.current = false; }, 200);
  }

  function handleSaveDraft() {
    setSaveStatus("saving");
    localStorage.setItem(
      "coreahoy_draft",
      JSON.stringify({ selected, step, paragraphsKo, paragraphsEs, targetLang })
    );
    setTimeout(() => {
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    }, 500);
  }

  function handlePublish() {
    alert(t("published"));
    resetAll();
  }

  function runAiGeneration() {
    if (!selected || !selectedArticle) return;
    setIsGenerating(true);
    setTimeout(() => {
      setParagraphsKo(generateKoParagraphs([selectedArticle]));
      setParagraphsEs([]);
      setIsGenerating(false);
      handleStepChange("review-ko");
    }, 1400);
  }

  function updateParagraphKo(id: string, text: string) {
    setParagraphsKo((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, text, isDirty: text !== p.originalText } : p
      )
    );
  }

  function startEditPara(p: Paragraph) {
    setEditingParaId(p.id);
    setEditingText(p.text);
  }

  function commitEditPara(id: string) {
    const para = paragraphsKo.find((p) => p.id === id);
    if (para && editingText.trim() !== para.text) {
      updateParagraphKo(id, editingText.trim());
    }
    setEditingParaId(null);
    setEditingText("");
  }

  function runFullPolish() {
    setIsPolishing(true);
    setEditingParaId(null);
    setTimeout(() => {
      // 다듬어진 텍스트가 새 기준이 되므로 originalText도 갱신
      setParagraphsKo((prev) =>
        prev.map((p) => ({ ...p, originalText: p.text, isDirty: false }))
      );
      setIsPolishing(false);
    }, 1500);
  }

  const dirtyCount = paragraphsKo.filter((p) => p.isDirty).length;

  function runTranslation() {
    if (!targetLang || paragraphsKo.length === 0) return;
    setIsTranslating(true);
    setEditingParaId(null);
    setTimeout(() => {
      setParagraphsEs(generateEsParagraphs(paragraphsKo));
      setIsTranslating(false);
      handleStepChange("review-es");
    }, 1200);
  }

  function isStepAccessible(s: Step): boolean {
    if (s === "select") return true;
    if (s === "review-ko") return paragraphsKo.length > 0;
    if (s === "review-es") return paragraphsEs.length > 0;
    if (s === "preview") return paragraphsEs.length > 0;
    return false;
  }

  const articleTitle = selectedArticle?.title ?? "";
  const articleSeed = selectedArticle?.id ?? "preview";

  const filteredPosts = posts.filter(post => {
    if (statusFilter !== "all" && post.status !== statusFilter) return false;
    if (searchQuery && !post.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleDeletePost = (id: string) => {
    if (confirm(isKo ? "정말 삭제하시겠습니까?" : "¿Estás seguro de que quieres eliminar esto?")) {
      setPosts(prev => prev.filter(p => p.id !== id));
    }
  };

  const getStepLabel = (s?: Step) => {
    if (!s) return "";
    switch (s) {
      case "select": return isKo ? "기사 선택" : "Seleccionar";
      case "review-ko": return isKo ? "한국어 검수" : "Revisión KO";
      case "review-es": return isKo ? "번역 검수" : "Revisión ES";
      case "preview": return isKo ? "미리보기" : "Vista Previa";
    }
  };

  return (
    <div className="py-6 md:py-10 pb-10">
      {/* Header */}
      <header className="mb-7">
        <h1 className="text-3xl font-black mb-1">{t("title")}</h1>
      </header>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-gray-100 mb-8">
        {(
          [
            { id: "create" as AdminTab, label: t("tabCreate") },
            { id: "list" as AdminTab, label: t("tabList") },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
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

      {/* ── Pipeline ── */}
      {activeTab === "create" && (
        <div>
          {/* Step pills */}
          <div className="flex gap-2 mb-7 overflow-x-auto pb-1">
            {steps.map((s) => {
              const accessible = isStepAccessible(s.id);
              return (
                <button
                  key={s.id}
                  onClick={() => accessible && handleStepChange(s.id)}
                  disabled={!accessible}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-colors border ${
                    step === s.id
                      ? "bg-black text-white border-black cursor-pointer"
                      : accessible
                      ? "bg-white text-gray-500 border-gray-200 hover:border-gray-400 cursor-pointer"
                      : "bg-white text-gray-200 border-gray-100 cursor-not-allowed"
                  }`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>

          {/* ── 1단계: 기사 선택 ── */}
          {step === "select" && (
            <div className="lg:grid lg:grid-cols-[1fr_360px] lg:gap-8 animate-fade-in">
              <div className="flex flex-col gap-3">
                {candidates.slice(0, visibleCount).map((article) => (
                  <div
                    key={article.id}
                    onClick={() => setSelected(article.id === selected ? "" : article.id)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      selected === article.id
                        ? "border-black bg-gray-50"
                        : "border-gray-100 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1.5 gap-3">
                      <span className="font-bold text-sm leading-snug">{article.title}</span>
                      <div
                        className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                          selected === article.id
                            ? "border-black bg-black"
                            : "border-gray-300"
                        }`}
                      >
                        {selected === article.id && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">{article.summary}</p>
                    <div className="flex gap-3 mt-2 text-xs text-gray-400">
                      <span>{article.source}</span>
                      <span>{article.publishedAt}</span>
                    </div>
                  </div>
                ))}
                
                {visibleCount < candidates.length && (
                  <div ref={observerTarget} className="h-4 w-full" />
                )}
              </div>

              {/* Sidebar */}
              <aside className="mt-6 lg:mt-0">
                <div className="lg:sticky lg:top-24 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                  <h4 className="text-sm font-black mb-5">{t("workflowTitle")}</h4>
                  <button
                    disabled={isGenerating || !selected}
                    onClick={runAiGeneration}
                    className="w-full py-3.5 bg-black text-white rounded-xl font-bold text-sm cursor-pointer hover:opacity-80 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? t("generating") : t("generateBtn")}
                  </button>
                </div>
              </aside>
            </div>
          )}

          {/* ── 2단계: 한국어 컨텐츠 검수 ── */}
          {step === "review-ko" && (
            <div className="animate-fade-in">
              {/* Two-column layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Left: Original article */}
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 overflow-y-auto lg:max-h-[640px]">
                  <h3 className="text-xs font-black text-gray-500 uppercase tracking-wider mb-4">
                    {t("originalArticle")}
                  </h3>
                  {selectedArticle ? (
                    <>
                      <div className="flex gap-2 mb-3 flex-wrap">
                        <span className="text-xs font-bold text-gray-500 bg-gray-200 px-2 py-1 rounded-md">
                          {selectedArticle.source}
                        </span>
                        <span className="text-xs text-gray-400 self-center">{selectedArticle.publishedAt}</span>
                      </div>
                      <h4 className="font-black text-base mb-4 leading-snug">{selectedArticle.title}</h4>
                      <p className="text-sm text-gray-700 leading-7 whitespace-pre-wrap">
                        {getArticleFullText(selectedArticle)}
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-gray-400">
                      {isKo ? "선택된 기사가 없습니다." : "No hay artículo seleccionado."}
                    </p>
                  )}
                </div>

                {/* Right: AI content — unified display, click-to-edit */}
                <div className="bg-white border border-gray-200 rounded-2xl p-5 overflow-y-auto lg:max-h-[640px]">
                  <h3 className="text-xs font-black text-gray-700 uppercase tracking-wider mb-4">
                    {t("koContent")}
                  </h3>
                  <div className="text-sm text-gray-700 leading-8">
                    {paragraphsKo.map((p, i) => (
                      <div key={p.id} className={i < paragraphsKo.length - 1 ? "mb-5" : ""}>
                        {editingParaId === p.id ? (
                          <textarea
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            onBlur={() => commitEditPara(p.id)}
                            onKeyDown={(e) => {
                              if (e.key === "Escape") commitEditPara(p.id);
                            }}
                            autoFocus
                            rows={3}
                            className="w-full outline-none resize-none text-sm leading-8 text-gray-700 bg-blue-50 border-b-2 border-blue-400 rounded-t-sm px-2 py-1 -mx-2 font-[inherit]"
                          />
                        ) : (
                          <p
                            onClick={() => startEditPara(p)}
                            title={isKo ? "클릭하여 편집" : "Clic para editar"}
                            className="cursor-text m-0 rounded-md px-2 py-1 -mx-2 hover:bg-gray-50 transition-colors leading-8"
                          >
                            {renderParagraphDiff(p)}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom action bar */}
              <div className="flex items-center justify-end gap-3 mt-6 pt-5 border-t border-gray-100 flex-wrap">
                <button
                  onClick={() => handleStepChange("select")}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold text-gray-500 border-2 border-gray-200 hover:border-gray-400 hover:text-gray-700 cursor-pointer transition-colors"
                >
                  ← {isKo ? "이전 단계" : "Paso anterior"}
                </button>
                {dirtyCount > 0 && (
                  <button
                    onClick={runFullPolish}
                    disabled={isPolishing}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold text-blue-600 border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {isPolishing ? "⌛ 다듬는 중..." : "🔄 전체 다듬기"}
                  </button>
                )}
                <SaveBtn status={saveStatus} onSave={handleSaveDraft} isKo={isKo} />
                {/* Language dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsLangDropdownOpen((v) => !v)}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-bold cursor-pointer hover:border-gray-400 transition-colors"
                  >
                    <span>🌐</span>
                    <span className={targetLang ? "text-black" : "text-gray-400"}>
                      {targetLang
                        ? TRANSLATION_TARGETS.find((tt) => tt.code === targetLang)?.[isKo ? "ko" : "es"]
                        : t("selectLangLabel")}
                    </span>
                    <span className={`text-[10px] text-gray-400 transition-transform ${isLangDropdownOpen ? "rotate-180" : ""}`}>▼</span>
                  </button>
                  {isLangDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsLangDropdownOpen(false)} />
                      <div className="absolute bottom-full mb-1.5 right-0 z-50 bg-white border border-gray-100 rounded-2xl shadow-lg p-1.5 min-w-[180px]">
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
                              </span>
                              {isSel && <span className="text-xs">✓</span>}
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
                <button
                  onClick={runTranslation}
                  disabled={!targetLang || isTranslating || paragraphsKo.length === 0}
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-black text-white rounded-xl text-sm font-black cursor-pointer hover:opacity-80 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {isTranslating ? "⌛" : "🌎"} {isKo ? "번역하기" : "Traducir"}
                </button>
              </div>
            </div>
          )}

          {/* ── 3단계: 번역 검수 ── */}
          {step === "review-es" && (
            <div className="animate-fade-in">
              {/* Two-column: Korean (readonly) | Translation (readonly) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
                {/* Left: Final Korean */}
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 overflow-y-auto lg:max-h-[640px]">
                  <h3 className="text-xs font-black text-gray-500 uppercase tracking-wider mb-4">
                    {t("finalKo")}
                  </h3>
                  <div className="flex flex-col gap-5 text-sm text-gray-800 leading-8">
                    {paragraphsKo.map((p, i) => (
                      <div key={p.id}>
                        <p className="m-0">{p.text}</p>
                        {i < paragraphsKo.length - 1 && <hr className="mt-5 border-gray-200" />}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Translation */}
                <div className="bg-white border-2 border-black rounded-2xl p-5 overflow-y-auto lg:max-h-[640px]">
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-xs font-black uppercase tracking-wider">
                      {t("translationLabel")}
                    </h3>
                    {targetLang && (
                      <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-lg">
                        {TRANSLATION_TARGETS.find((tt) => tt.code === targetLang)?.[isKo ? "ko" : "es"]}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-5 text-sm text-gray-800 leading-8">
                    {paragraphsEs.map((p, i) => (
                      <div key={p.id}>
                        <p className="m-0">{p.text}</p>
                        {i < paragraphsEs.length - 1 && <hr className="mt-5 border-gray-200" />}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom action bar */}
              <div className="flex items-center justify-end gap-3 pt-5 border-t border-gray-100 flex-wrap">
                <button
                  onClick={() => handleStepChange("review-ko")}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold text-gray-500 border-2 border-gray-200 hover:border-gray-400 hover:text-gray-700 cursor-pointer transition-colors"
                >
                  ← {isKo ? "이전 단계" : "Paso anterior"}
                </button>
                <SaveBtn status={saveStatus} onSave={handleSaveDraft} isKo={isKo} />
                <button
                  onClick={() => handleStepChange("preview")}
                  disabled={paragraphsEs.length === 0}
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-black text-white rounded-xl text-sm font-black cursor-pointer hover:opacity-80 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {isKo ? "미리보기 →" : "Vista previa →"}
                </button>
              </div>
            </div>
          )}

          {/* ── 4단계: 미리보기 및 임시저장 ── */}
          {step === "preview" && (
            <div className="animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
                <PreviewCard
                  lang="ko"
                  title={articleTitle}
                  paragraphs={paragraphsKo}
                  label="KR"
                  seed={articleSeed}
                />
                <PreviewCard
                  lang="es"
                  title={`[ES] ${articleTitle}`}
                  paragraphs={paragraphsEs}
                  label="ES"
                  seed={`${articleSeed}-es`}
                />
              </div>

              {/* Bottom action bar */}
              <div className="flex items-center justify-end gap-3 pt-5 border-t border-gray-100 flex-wrap">
                <button
                  onClick={() => handleStepChange("review-es")}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold text-gray-500 border-2 border-gray-200 hover:border-gray-400 hover:text-gray-700 cursor-pointer transition-colors"
                >
                  ← {isKo ? "이전 단계" : "Paso anterior"}
                </button>
                <SaveBtn status={saveStatus} onSave={handleSaveDraft} isKo={isKo} />
                <button
                  onClick={handlePublish}
                  disabled={paragraphsKo.length === 0}
                  className="px-6 py-2.5 bg-green-500 text-white rounded-xl font-black text-sm cursor-pointer hover:bg-green-600 transition-colors shadow-md shadow-green-200 disabled:opacity-30 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {t("publish")}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── List tab ── */}
      {activeTab === "list" && (
        <div className="animate-fade-in space-y-6">
          {/* Filters & Search */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => handleFilterChange(e.target.value)}
                className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 outline-none focus:border-black cursor-pointer"
              >
                <option value="all">{isKo ? "모든 상태" : "Todos"}</option>
                <option value="published">{isKo ? "발행됨" : "Publicado"}</option>
                <option value="draft">{isKo ? "임시 저장" : "Borrador"}</option>
              </select>
            </div>
            <div className="relative w-full md:w-72">
              <input
                type="text"
                placeholder={isKo ? "제목 검색..." : "Buscar por título..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-black transition-colors"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-5 py-4 text-xs font-black text-gray-500 uppercase tracking-wider">{isKo ? "제목" : "Título"}</th>
                  <th className="px-5 py-4 text-xs font-black text-gray-500 uppercase tracking-wider text-center">{isKo ? "상태" : "Estado"}</th>
                  <th className="px-5 py-4 text-xs font-black text-gray-500 uppercase tracking-wider text-center">{isKo ? "번역" : "Traducción"}</th>
                  <th className="px-5 py-4 text-xs font-black text-gray-500 uppercase tracking-wider">{isKo ? "날짜" : "Fecha"}</th>
                  <th className="px-5 py-4 text-xs font-black text-gray-500 uppercase tracking-wider text-right">{isKo ? "통계" : "Estadísticas"}</th>
                  <th className="px-5 py-4 text-xs font-black text-gray-500 uppercase tracking-wider text-center">{isKo ? "관리" : "Acciones"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPosts.map(post => (
                  <tr key={post.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{post.category}</span>
                        <span className="text-xs text-gray-500">{post.author}</span>
                      </div>
                      <Link href={`/content/${post.id}`} className="font-bold text-sm text-gray-900 hover:underline hover:text-blue-600 transition-colors block">
                        {post.title}
                      </Link>
                    </td>
                    <td className="px-5 py-4 text-center">
                      {post.status === "published" ? (
                        <span className="inline-flex items-center justify-center px-2.5 py-1 text-[11px] font-bold text-green-700 bg-green-100 rounded-full">
                          {isKo ? "발행됨" : "Publicado"}
                        </span>
                      ) : (
                        <div className="flex flex-col items-center gap-1">
                          <span className="inline-flex items-center justify-center px-2.5 py-1 text-[11px] font-bold text-amber-700 bg-amber-100 rounded-full whitespace-nowrap">
                            {isKo ? "임시 저장" : "Borrador"}
                          </span>
                          <span className="text-[10px] text-gray-400 whitespace-nowrap">
                            ( {getStepLabel(post.draftStep)} )
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span title="Korean" className={`text-sm ${post.langStatus.ko === "done" ? "" : "opacity-30 grayscale"}`}>🇰🇷</span>
                        <span title="Spanish" className={`text-sm ${post.langStatus.es === "done" ? "" : "opacity-30 grayscale"}`}>🇪🇸</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-900">{post.updatedAt}</span>
                        <span className="text-[10px] text-gray-400">{isKo ? "수정됨" : "Modificado"}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex flex-col items-end gap-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg> {post.views.toLocaleString()}</span>
                        <span className="flex items-center gap-1"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg> {post.likes.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => router.push(`/content/${post.id}`)}
                          className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors" 
                          title={isKo ? "상세페이지로 이동" : "Ir a la página de detalles"}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button 
                          onClick={() => handleDeletePost(post.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors" 
                          title={isKo ? "삭제" : "Eliminar"}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredPosts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center text-sm text-gray-500">
                      {isKo ? "검색 결과가 없습니다." : "No se encontraron resultados."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
