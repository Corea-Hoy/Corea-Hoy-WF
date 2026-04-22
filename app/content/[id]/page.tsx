"use client";

import { useState } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { MOCK_CONTENTS, MOCK_USER } from "@/lib/mock-data";
import { useLanguage } from "@/lib/LanguageContext";

const SHARE_PLATFORMS = [
  {
    key: "x",
    label: "X",
    color: "#000",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
    getUrl: (url: string, title: string) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
  },
  {
    key: "facebook",
    label: "Facebook",
    color: "#1877f2",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    getUrl: (url: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    key: "whatsapp",
    label: "WhatsApp",
    color: "#25d366",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
    getUrl: (url: string, title: string) =>
      `https://wa.me/?text=${encodeURIComponent(title + "\n" + url)}`,
  },
  {
    key: "telegram",
    label: "Telegram",
    color: "#229ed9",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
      </svg>
    ),
    getUrl: (url: string, title: string) =>
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
];

export default function ContentDetailPage() {
  const { language } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const content = MOCK_CONTENTS.find((c) => c.id === id);
  if (!content) return notFound();

  const [liked, setLiked] = useState(MOCK_USER.likedContentIds.includes(id));
  const [likeCount, setLikeCount] = useState(content.likes);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(content.comments);
  const [copied, setCopied] = useState(false);

  function getPageUrl() {
    return typeof window !== "undefined" ? window.location.href : "";
  }

  function handleShare(platform: typeof SHARE_PLATFORMS[number]) {
    const url = getPageUrl();
    const title = isKo ? content!.title : content!.titleEs;
    window.open(platform.getUrl(url, title), "_blank", "noopener,noreferrer,width=600,height=500");
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(getPageUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  const isKo = language === "ko";

  function toggleLike() {
    setLiked((prev) => {
      setLikeCount((c) => (prev ? c - 1 : c + 1));
      return !prev;
    });
  }

  function submitComment(e: React.FormEvent) {
    e.preventDefault();
    if (!commentText.trim()) return;
    setComments((prev) => [
      ...prev,
      {
        id: `cm${Date.now()}`,
        userId: MOCK_USER.id,
        userName: MOCK_USER.name,
        body: commentText,
        createdAt: new Date().toISOString().slice(0, 10),
      },
    ]);
    setCommentText("");
  }

  return (
    <article style={{ maxWidth: "700px", margin: "0 auto", paddingBottom: "4rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <Link href="/" style={{ textDecoration: "none", color: "#666", display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.95rem" }}>
          <span>←</span> {isKo ? "뒤로 가기" : "Volver"}
        </Link>
      </div>

      {/* 헤더 */}
      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", marginBottom: "1rem" }}>
        <span style={{ 
          backgroundColor: "#f0f0f0", 
          padding: "0.2rem 0.6rem", 
          borderRadius: "4px",
          fontSize: "0.8rem",
          fontWeight: "600",
          color: "#555"
        }}>{content.category}</span>
        <span style={{ color: "#999", fontSize: "0.85rem" }}>{content.publishedAt}</span>
      </div>

      <h1 style={{ marginTop: 0, fontSize: "2.2rem", fontWeight: "800", lineHeight: 1.3 }}>
        {isKo ? content.title : content.titleEs}
      </h1>
      <p style={{ color: "#666", fontSize: "1.1rem", fontStyle: "italic", marginBottom: "2rem" }}>
        {isKo ? content.summary : content.summaryEs}
      </p>

      <hr style={{ border: "none", borderTop: "1px solid #eee", margin: "2rem 0" }} />

      {/* 본문 */}
      <section>
        <div style={{ 
          fontFamily: "inherit", 
          whiteSpace: "pre-wrap", 
          lineHeight: 1.8, 
          fontSize: "1.1rem", 
          color: "#333" 
        }}>
          {isKo ? content.body : content.bodyEs}
        </div>
      </section>

      {/* 문화 설명 */}
      <section style={{ 
        border: "none", 
        padding: "1.5rem", 
        margin: "3rem 0", 
        background: "#fdf8ec", 
        borderRadius: "16px",
        borderLeft: "4px solid #f0a500"
      }}>
        <strong style={{ fontSize: "1.1rem", color: "#b57c00", display: "block", marginBottom: "0.5rem" }}>
          📚 {isKo ? "문화 설명" : "Contexto cultural"}
        </strong>
        <p style={{ margin: 0, lineHeight: 1.6, color: "#5c430d" }}>
          {isKo ? content.culturalNote : content.culturalNoteEs}
        </p>
      </section>

      {/* 출처 */}
      <section style={{ marginBottom: "3rem" }}>
        <strong style={{ display: "block", marginBottom: "1rem", fontSize: "1rem" }}>
          {isKo ? "출처" : "Fuentes"}
        </strong>
        <ul style={{ paddingLeft: "1.2rem", color: "#666" }}>
          {content.sources.map((s, i) => (
            <li key={i} style={{ marginBottom: "0.5rem" }}>
              <a href={s.url} target="_blank" rel="noopener noreferrer" style={{ color: "#0070f3" }}>{s.title}</a>
            </li>
          ))}
        </ul>
      </section>

      <hr style={{ border: "none", borderTop: "1px solid #eee", margin: "2rem 0" }} />

      {/* 좋아요 */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", margin: "2rem 0" }}>
        <button
          onClick={toggleLike}
          style={{
            border: "1px solid #ffeded",
            padding: "0.6rem 1.2rem",
            borderRadius: "30px",
            background: liked ? "#ff4d4f" : "#fff5f5",
            color: liked ? "#fff" : "#ff4d4f",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "1rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            transition: "all 0.2s"
          }}
        >
          <span>♥</span> {likeCount}
        </button>
        <span style={{ color: "#888", fontSize: "0.95rem" }}>
          {liked 
            ? (isKo ? "좋아요를 눌렀습니다!" : "¡Te gusta esto!") 
            : (isKo ? "이 글이 도움이 되었나요?" : "¿Te gustó este artículo?")}
        </span>
      </div>

      {/* 공유 */}
      <div style={{ margin: "2rem 0", display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
        <span style={{ fontSize: "0.9rem", fontWeight: "700", color: "#555" }}>
          {isKo ? "공유하기" : "Compartir"}
        </span>

        {SHARE_PLATFORMS.map((platform) => (
          <button
            key={platform.key}
            onClick={() => handleShare(platform)}
            title={platform.label}
            style={{
              width: 38, height: 38,
              borderRadius: "50%",
              border: "none",
              background: platform.color,
              color: "#fff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "opacity 0.2s, transform 0.15s",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.82"; e.currentTarget.style.transform = "scale(1.1)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "scale(1)"; }}
          >
            {platform.icon}
          </button>
        ))}

        <button
          onClick={handleCopyLink}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            padding: "0 1rem",
            height: 38,
            borderRadius: "20px",
            border: "1px solid #eee",
            background: copied ? "#f0fdf4" : "#fff",
            color: copied ? "#16a34a" : "#555",
            cursor: "pointer",
            fontSize: "0.85rem",
            fontWeight: "600",
            transition: "all 0.2s",
            flexShrink: 0,
          }}
        >
          {copied ? (
            <><span>✓</span> {isKo ? "복사됨!" : "¡Copiado!"}</>
          ) : (
            <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> {isKo ? "링크 복사" : "Copiar enlace"}</>
          )}
        </button>
      </div>

      {/* 댓글 */}
      <section style={{ marginTop: "4rem" }}>
        <h3 style={{ fontSize: "1.3rem", fontWeight: "700", marginBottom: "1.5rem" }}>
          💬 {isKo ? "댓글" : "Comentarios"} ({comments.length})
        </h3>
        <form onSubmit={submitComment} style={{ display: "flex", gap: "0.75rem", marginBottom: "2rem" }}>
          <input
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder={isKo ? "댓글을 입력하세요..." : "Escribe un comentario..."}
            style={{ 
              flex: 1, 
              border: "1px solid #eee", 
              padding: "0.8rem 1rem", 
              borderRadius: "12px",
              outline: "none",
              fontSize: "0.95rem"
            }}
          />
          <button type="submit" style={{ 
            backgroundColor: "#000", 
            color: "#fff", 
            padding: "0.8rem 1.5rem", 
            borderRadius: "12px", 
            border: "none",
            cursor: "pointer",
            fontWeight: "600",
            transition: "opacity 0.2s"
          }}>
            {isKo ? "등록" : "Enviar"}
          </button>
        </form>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {comments.map((c) => (
            <div key={c.id} style={{ borderBottom: "1px solid #f9f9f9", paddingBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
                <strong style={{ fontSize: "0.95rem" }}>{c.userName}</strong>
                <span style={{ color: "#ccc", fontSize: "0.8rem" }}>{c.createdAt}</span>
              </div>
              <p style={{ margin: 0, color: "#444", lineHeight: 1.5 }}>{c.body}</p>
            </div>
          ))}
          {comments.length === 0 && (
            <p style={{ color: "#999", textAlign: "center", padding: "2rem 0" }}>
              {isKo ? "첫 번째 댓글을 남겨보세요." : "Aún no hay comentarios."}
            </p>
          )}
        </div>
      </section>
    </article>
  );
}
