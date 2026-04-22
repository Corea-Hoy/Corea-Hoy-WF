"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import { useUser, AVATAR_PRESETS } from "@/lib/UserContext";
import { MOCK_CONTENTS } from "@/lib/mock-data";

const LABELS = {
  ko: {
    title: "마이페이지",
    email: "이메일",
    editProfile: "프로필 수정",
    avatarLabel: "프로필 이미지",
    nicknameLabel: "닉네임",
    nicknamePlaceholder: "닉네임 입력 (2–20자)",
    nicknameError: "닉네임은 2자 이상 20자 이하로 입력해주세요.",
    save: "저장",
    cancel: "취소",
    likes: "좋아요",
    comments: "내 댓글",
    likedTitle: "좋아요한 콘텐츠",
    commentTitle: "내 댓글",
    emptyLike: "아직 좋아요한 콘텐츠가 없습니다.",
    emptyComment: "작성한 댓글이 없습니다.",
    logout: "로그아웃",
    deleteAccount: "회원 탈퇴",
    deleteConfirmTitle: "정말 탈퇴하시겠습니까?",
    deleteConfirmDesc: "탈퇴하면 모든 데이터가 삭제되며 복구할 수 없습니다.",
    deleteConfirm: "탈퇴하기",
    deleteCancel: "취소",
  },
  es: {
    title: "Mi perfil",
    email: "Correo",
    editProfile: "Editar perfil",
    avatarLabel: "Imagen de perfil",
    nicknameLabel: "Apodo",
    nicknamePlaceholder: "Escribe tu apodo (2–20 caracteres)",
    nicknameError: "El apodo debe tener entre 2 y 20 caracteres.",
    save: "Guardar",
    cancel: "Cancelar",
    likes: "Me gusta",
    comments: "Comentarios",
    likedTitle: "Artículos guardados",
    commentTitle: "Mis comentarios",
    emptyLike: "Aún no tienes artículos guardados.",
    emptyComment: "Aún no has escrito ningún comentario.",
    logout: "Cerrar sesión",
    deleteAccount: "Eliminar cuenta",
    deleteConfirmTitle: "¿Seguro que quieres eliminar tu cuenta?",
    deleteConfirmDesc: "Se eliminarán todos tus datos y no podrás recuperarlos.",
    deleteConfirm: "Eliminar",
    deleteCancel: "Cancelar",
  },
};

function Avatar({ emoji, color, size = 72 }: { emoji: string; color: string; size?: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: color, display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.44, flexShrink: 0,
      boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
    }}>
      {emoji}
    </div>
  );
}

export default function MyPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const { user, isLoggedIn, updateProfile, logout, deleteAccount } = useUser();
  const L = LABELS[language];
  const isKo = language === "ko";

  const [editing, setEditing] = useState(false);
  const [tempNickname, setTempNickname] = useState("");
  const [tempAvatar, setTempAvatar] = useState(AVATAR_PRESETS[0]);
  const [nicknameError, setNicknameError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) router.replace("/login");
  }, [isLoggedIn, router]);

  if (!user) return null;

  const likedContents = MOCK_CONTENTS.filter((c) => user.likedContentIds.includes(c.id));
  const myComments = MOCK_CONTENTS.flatMap((c) =>
    c.comments
      .filter((cm) => cm.userId === "u1")
      .map((cm) => ({ ...cm, contentTitle: isKo ? c.title : c.titleEs, contentId: c.id }))
  );

  function startEdit() {
    setTempNickname(user!.name);
    setTempAvatar(AVATAR_PRESETS.find((p) => p.emoji === user!.avatarEmoji) ?? AVATAR_PRESETS[0]);
    setNicknameError("");
    setEditing(true);
  }

  function handleSave() {
    const trimmed = tempNickname.trim();
    if (trimmed.length < 2 || trimmed.length > 20) {
      setNicknameError(L.nicknameError);
      return;
    }
    updateProfile(trimmed, tempAvatar.emoji, tempAvatar.color);
    setEditing(false);
  }

  function handleLogout() {
    logout();
    router.push("/");
  }

  function handleDeleteAccount() {
    deleteAccount();
    router.push("/");
  }

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", paddingBottom: "5rem" }}>
      <h1 style={{ fontSize: "2.2rem", fontWeight: "800", marginBottom: "2rem" }}>{L.title}</h1>

      {/* Profile card */}
      <section style={{ border: "1px solid #eee", padding: "2rem", borderRadius: "24px", marginBottom: "2rem", backgroundColor: "#fff" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "2rem" }}>
          <Avatar emoji={editing ? tempAvatar.emoji : user.avatarEmoji} color={editing ? tempAvatar.color : user.avatarColor} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "1.4rem", fontWeight: "700" }}>{user.name}</div>
            <div style={{ color: "#999", fontSize: "0.9rem", marginTop: "0.2rem" }}>{user.email}</div>
          </div>
          {!editing && (
            <button onClick={startEdit} style={{
              border: "1px solid #eee", padding: "0.5rem 1rem", fontSize: "0.9rem",
              borderRadius: "10px", backgroundColor: "#fff", color: "#555", cursor: "pointer", fontWeight: "600",
            }}>
              {L.editProfile}
            </button>
          )}
        </div>

        {/* Stats */}
        {!editing && (
          <div style={{ display: "flex", gap: "2.5rem" }}>
            <div>
              <div style={{ fontSize: "1.5rem", fontWeight: "800" }}>{likedContents.length}</div>
              <div style={{ color: "#999", fontSize: "0.85rem" }}>{L.likes}</div>
            </div>
            <div>
              <div style={{ fontSize: "1.5rem", fontWeight: "800" }}>{myComments.length}</div>
              <div style={{ color: "#999", fontSize: "0.85rem" }}>{L.comments}</div>
            </div>
          </div>
        )}

        {/* Edit form */}
        {editing && (
          <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: "1.5rem" }}>
            {/* Avatar picker */}
            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ fontWeight: "700", fontSize: "0.9rem", marginBottom: "0.75rem" }}>{L.avatarLabel}</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "0.5rem" }}>
                {AVATAR_PRESETS.map((preset) => {
                  const isSelected = tempAvatar.emoji === preset.emoji;
                  return (
                    <button
                      key={preset.emoji}
                      type="button"
                      onClick={() => setTempAvatar(preset)}
                      style={{
                        aspectRatio: "1", borderRadius: "50%", background: preset.color,
                        border: isSelected ? "3px solid #000" : "3px solid transparent",
                        cursor: "pointer", fontSize: "1.5rem",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "transform 0.15s", transform: isSelected ? "scale(1.1)" : "scale(1)",
                      }}
                    >
                      {preset.emoji}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Nickname input */}
            <div style={{ marginBottom: "1.25rem" }}>
              <div style={{ fontWeight: "700", fontSize: "0.9rem", marginBottom: "0.5rem" }}>{L.nicknameLabel}</div>
              <input
                type="text"
                value={tempNickname}
                onChange={(e) => { setTempNickname(e.target.value); setNicknameError(""); }}
                placeholder={L.nicknamePlaceholder}
                maxLength={20}
                style={{
                  width: "100%", padding: "0.8rem 1rem", borderRadius: "10px",
                  border: nicknameError ? "1px solid #ff4d4f" : "1px solid #eee",
                  fontSize: "0.95rem", outline: "none", boxSizing: "border-box",
                }}
              />
              {nicknameError && <p style={{ color: "#ff4d4f", fontSize: "0.82rem", margin: "0.3rem 0 0" }}>{nicknameError}</p>}
            </div>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button onClick={handleSave} style={{
                flex: 1, padding: "0.8rem", borderRadius: "10px", border: "none",
                background: "#000", color: "#fff", fontWeight: "700", cursor: "pointer",
              }}>
                {L.save}
              </button>
              <button onClick={() => setEditing(false)} style={{
                flex: 1, padding: "0.8rem", borderRadius: "10px", border: "1px solid #eee",
                background: "#fff", color: "#555", fontWeight: "600", cursor: "pointer",
              }}>
                {L.cancel}
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Liked content */}
      <section style={{ marginBottom: "2.5rem" }}>
        <h2 style={{ fontSize: "1.4rem", fontWeight: "700", marginBottom: "1.25rem" }}>♥ {L.likedTitle}</h2>
        {likedContents.length === 0 ? (
          <p style={{ color: "#bbb", textAlign: "center", padding: "3rem 0", border: "1px dashed #eee", borderRadius: "16px" }}>{L.emptyLike}</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            {likedContents.map((c) => (
              <Link key={c.id} href={`/content/${c.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                <div style={{
                  border: "1px solid #eee", padding: "1.25rem", borderRadius: "14px",
                  backgroundColor: "#fff", transition: "transform 0.2s",
                }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "translateX(6px)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "translateX(0)")}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                    <span style={{ fontSize: "0.75rem", background: "#f0f0f0", padding: "0.2rem 0.6rem", borderRadius: "4px", fontWeight: "600" }}>{c.category}</span>
                    <span style={{ fontSize: "0.8rem", color: "#bbb" }}>{c.publishedAt}</span>
                  </div>
                  <p style={{ margin: "0.4rem 0 0", fontWeight: "700", fontSize: "1rem" }}>{isKo ? c.title : c.titleEs}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Comments */}
      <section style={{ marginBottom: "3.5rem" }}>
        <h2 style={{ fontSize: "1.4rem", fontWeight: "700", marginBottom: "1.25rem" }}>💬 {L.commentTitle}</h2>
        {myComments.length === 0 ? (
          <p style={{ color: "#bbb", textAlign: "center", padding: "3rem 0", border: "1px dashed #eee", borderRadius: "16px" }}>{L.emptyComment}</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            {myComments.map((cm) => (
              <div key={cm.id} style={{ border: "1px solid #eee", padding: "1.25rem", borderRadius: "14px", backgroundColor: "#fff" }}>
                <Link href={`/content/${cm.contentId}`} style={{ fontSize: "0.88rem", color: "#0070f3", fontWeight: "600", textDecoration: "none" }}>
                  {cm.contentTitle}
                </Link>
                <p style={{ margin: "0.6rem 0 0.4rem", fontSize: "0.95rem", color: "#444" }}>{cm.body}</p>
                <span style={{ fontSize: "0.78rem", color: "#bbb" }}>{cm.createdAt}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Actions */}
      <section style={{ borderTop: "1px solid #f0f0f0", paddingTop: "2.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button
          onClick={() => setShowDeleteModal(true)}
          style={{ background: "none", border: "none", color: "#ff4d4f", cursor: "pointer", fontSize: "0.9rem", fontWeight: "600", padding: 0 }}
        >
          {L.deleteAccount}
        </button>
        <button
          onClick={handleLogout}
          style={{
            border: "1px solid #eee", color: "#555", padding: "0.7rem 1.5rem",
            borderRadius: "12px", cursor: "pointer", background: "#fff", fontWeight: "600", fontSize: "0.95rem",
          }}
        >
          {L.logout}
        </button>
      </section>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000, padding: "1rem",
        }}>
          <div style={{ background: "#fff", borderRadius: "20px", padding: "2rem", maxWidth: 380, width: "100%", textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>⚠️</div>
            <h3 style={{ fontWeight: "800", fontSize: "1.2rem", marginBottom: "0.75rem" }}>{L.deleteConfirmTitle}</h3>
            <p style={{ color: "#666", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "1.75rem" }}>{L.deleteConfirmDesc}</p>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button onClick={() => setShowDeleteModal(false)} style={{
                flex: 1, padding: "0.8rem", borderRadius: "12px", border: "1px solid #eee",
                background: "#fff", fontWeight: "600", cursor: "pointer", fontSize: "0.95rem",
              }}>
                {L.deleteCancel}
              </button>
              <button onClick={handleDeleteAccount} style={{
                flex: 1, padding: "0.8rem", borderRadius: "12px", border: "none",
                background: "#ff4d4f", color: "#fff", fontWeight: "700", cursor: "pointer", fontSize: "0.95rem",
              }}>
                {L.deleteConfirm}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
