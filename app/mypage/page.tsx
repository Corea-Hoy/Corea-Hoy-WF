"use client";

import { useState } from "react";
import Link from "next/link";
import { MOCK_USER, MOCK_CONTENTS } from "@/lib/mock-data";
import { useLanguage } from "@/lib/LanguageContext";

export default function MyPage() {
  const { language } = useLanguage();
  const [name, setName] = useState(MOCK_USER.name);
  const [editing, setEditing] = useState(false);
  const [tempName, setTempName] = useState(name);

  const isKo = language === "ko";
  const likedContents = MOCK_CONTENTS.filter((c) => MOCK_USER.likedContentIds.includes(c.id));

  function saveEdit() {
    setName(tempName);
    setEditing(false);
  }

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", paddingBottom: "4rem" }}>
      <h1 style={{ fontSize: "2.2rem", fontWeight: "800", marginBottom: "2rem" }}>
        {isKo ? "마이페이지" : "Mi perfil"}
      </h1>

      {/* 사용자 정보 */}
      <section style={{ 
        border: "1px solid #eee", 
        padding: "2rem", 
        borderRadius: "24px", 
        marginBottom: "3rem",
        backgroundColor: "#fff",
        boxShadow: "0 4px 20px rgba(0,0,0,0.02)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "2rem" }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #333 0%, #000 100%)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2rem",
              fontWeight: "700"
            }}
          >
            {name.charAt(0)}
          </div>
          <div style={{ flex: 1 }}>
            {editing ? (
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <input
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  style={{ border: "1px solid #eee", padding: "0.6rem 1rem", borderRadius: "12px", outline: "none", fontSize: "1rem" }}
                />
                <button onClick={saveEdit} style={{ backgroundColor: "#000", color: "#fff", padding: "0.6rem 1.2rem", borderRadius: "12px", border: "none", cursor: "pointer", fontWeight: "600" }}>
                  {isKo ? "저장" : "Guardar"}
                </button>
                <button onClick={() => setEditing(false)} style={{ backgroundColor: "#f5f5f5", color: "#666", padding: "0.6rem 1.2rem", borderRadius: "12px", border: "none", cursor: "pointer" }}>
                  {isKo ? "취소" : "Cancelar"}
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <strong style={{ fontSize: "1.4rem", fontWeight: "700" }}>{name}</strong>
                <button 
                  onClick={() => { setTempName(name); setEditing(true); }} 
                  style={{ 
                    border: "1px solid #eee", 
                    padding: "0.3rem 0.8rem", 
                    fontSize: "0.85rem", 
                    cursor: "pointer", 
                    borderRadius: "8px",
                    backgroundColor: "#fff",
                    color: "#888"
                  }}
                >
                  {isKo ? "수정" : "Editar"}
                </button>
              </div>
            )}
            <div style={{ color: "#999", fontSize: "0.95rem", marginTop: "0.25rem" }}>{MOCK_USER.email}</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "2.5rem" }}>
          <div>
            <div style={{ fontSize: "1.5rem", fontWeight: "800", color: "#000" }}>{likedContents.length}</div>
            <div style={{ color: "#999", fontSize: "0.9rem", fontWeight: "500" }}>
              {isKo ? "좋아요" : "Me gusta"}
            </div>
          </div>
          <div>
            <div style={{ fontSize: "1.5rem", fontWeight: "800", color: "#000" }}>2</div>
            <div style={{ color: "#999", fontSize: "0.9rem", fontWeight: "500" }}>
              {isKo ? "내 댓글" : "Comentarios"}
            </div>
          </div>
        </div>
      </section>

      {/* 좋아요한 콘텐츠 */}
      <section style={{ marginBottom: "3rem" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "1.5rem" }}>
          ♥ {isKo ? "좋아요한 콘텐츠" : "Artículos guardados"}
        </h2>
        {likedContents.length === 0 ? (
          <p style={{ color: "#bbb", textAlign: "center", padding: "3rem 0", border: "1px dashed #eee", borderRadius: "16px" }}>
            {isKo ? "아직 좋아요한 콘텐츠가 없습니다." : "Aún no tienes artículos guardados."}
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {likedContents.map((c) => (
              <Link key={c.id} href={`/content/${c.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                <div style={{ 
                  border: "1px solid #eee", 
                  padding: "1.25rem", 
                  borderRadius: "16px",
                  backgroundColor: "#fff",
                  transition: "transform 0.2s"
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "translateX(8px)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "translateX(0)")}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <span style={{ fontSize: "0.75rem", backgroundColor: "#f0f0f0", padding: "0.2rem 0.6rem", borderRadius: "4px", fontWeight: "600" }}>{c.category}</span>
                    <span style={{ fontSize: "0.8rem", color: "#bbb" }}>{c.publishedAt}</span>
                  </div>
                  <p style={{ margin: "0.5rem 0 0", fontWeight: "700", fontSize: "1.1rem" }}>
                    {isKo ? c.title : c.titleEs}
                  </p>
                  <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem", color: "#999", fontStyle: "italic" }}>
                    {isKo ? c.titleEs : c.title}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* 내 댓글 */}
      <section style={{ marginBottom: "4rem" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "1.5rem" }}>
          💬 {isKo ? "내 댓글" : "Mis comentarios"}
        </h2>
        {(() => {
          const myComments = MOCK_CONTENTS.flatMap((c) =>
            c.comments
              .filter((cm) => cm.userId === MOCK_USER.id)
              .map((cm) => ({ ...cm, contentTitle: isKo ? c.title : c.titleEs, contentId: c.id }))
          );
          return myComments.length === 0 ? (
            <p style={{ color: "#bbb", textAlign: "center", padding: "3rem 0", border: "1px dashed #eee", borderRadius: "16px" }}>
              {isKo ? "작성한 댓글이 없습니다." : "Aún no has escrito ningún comentario."}
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {myComments.map((cm) => (
                <div key={cm.id} style={{ border: "1px solid #eee", padding: "1.25rem", borderRadius: "16px", backgroundColor: "#fff" }}>
                  <Link href={`/content/${cm.contentId}`} style={{ fontSize: "0.9rem", color: "#0070f3", fontWeight: "600", textDecoration: "none" }}>
                    {cm.contentTitle}
                  </Link>
                  <p style={{ margin: "0.75rem 0", fontSize: "1rem", color: "#444" }}>{cm.body}</p>
                  <span style={{ fontSize: "0.8rem", color: "#bbb" }}>{cm.createdAt}</span>
                </div>
              ))}
            </div>
          );
        })()}
      </section>

      {/* 로그아웃 버튼 */}
      <section style={{ textAlign: "center", borderTop: "1px solid #f0f0f0", paddingTop: "3rem" }}>
        <Link href="/login" style={{ textDecoration: "none" }}>
          <button style={{ 
            border: "1px solid #ffeded", 
            color: "#ff4d4f", 
            padding: "0.8rem 2rem", 
            borderRadius: "12px", 
            cursor: "pointer", 
            background: "#fff5f5",
            fontWeight: "600",
            fontSize: "1rem",
            transition: "all 0.2s"
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#ffeded")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#fff5f5")}
          >
            {isKo ? "로그아웃" : "Cerrar sesión"}
          </button>
        </Link>
      </section>
    </div>
  );
}
