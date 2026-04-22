"use client";

import { useState } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { MOCK_CONTENTS, MOCK_USER } from "@/lib/mock-data";
import { useLanguage } from "@/lib/LanguageContext";

export default function ContentDetailPage() {
  const { language } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const content = MOCK_CONTENTS.find((c) => c.id === id);
  if (!content) return notFound();

  const [liked, setLiked] = useState(MOCK_USER.likedContentIds.includes(id));
  const [likeCount, setLikeCount] = useState(content.likes);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(content.comments);

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
