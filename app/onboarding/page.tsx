"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useLanguage } from "@/lib/LanguageContext";
import { useUser, AVATAR_PRESETS } from "@/lib/UserContext";

const LABELS = {
  ko: {
    welcome: "환영합니다! 👋",
    subtitle: "Corea Hoy에서 사용할 프로필을 설정해주세요.",
    avatarLabel: "프로필 이미지 선택",
    nicknameLabel: "닉네임",
    nicknamePlaceholder: "사용할 닉네임을 입력하세요 (2–20자)",
    nicknameError: "닉네임은 2자 이상 20자 이하로 입력해주세요.",
    confirm: "시작하기",
    skip: "나중에 설정하기",
  },
  es: {
    welcome: "¡Bienvenido/a! 👋",
    subtitle: "Configura tu perfil para usar en Corea Hoy.",
    avatarLabel: "Elige tu imagen de perfil",
    nicknameLabel: "Apodo",
    nicknamePlaceholder: "Escribe tu apodo (2–20 caracteres)",
    nicknameError: "El apodo debe tener entre 2 y 20 caracteres.",
    confirm: "Empezar",
    skip: "Configurar más tarde",
  },
};

export default function OnboardingPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const { isLoggedIn, completeOnboarding } = useUser();
  const L = LABELS[language];

  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_PRESETS[0]);
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoggedIn) router.replace("/login");
  }, [isLoggedIn, router]);

  function handleConfirm() {
    const trimmed = nickname.trim();
    if (trimmed.length < 2 || trimmed.length > 20) {
      setError(L.nicknameError);
      return;
    }
    completeOnboarding(trimmed, selectedAvatar.emoji, selectedAvatar.color);
    router.push("/");
  }

  function handleSkip() {
    completeOnboarding("Anonymous", "🐨", AVATAR_PRESETS[0].color);
    router.push("/");
  }

  return (
    <div style={{ maxWidth: 520, margin: "3rem auto", padding: "2.5rem", borderRadius: "24px", border: "1px solid #f0f0f0", backgroundColor: "#fff" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <Image src="/logo.png" alt="Corea Hoy" width={100} height={40} style={{ objectFit: "contain", marginBottom: "1.5rem" }} />
        <h1 style={{ fontSize: "1.8rem", fontWeight: "800", margin: "0 0 0.5rem" }}>{L.welcome}</h1>
        <p style={{ color: "#666", fontSize: "0.95rem", margin: 0 }}>{L.subtitle}</p>
      </div>

      {/* Avatar preview */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
        <div style={{
          width: 88, height: 88, borderRadius: "50%",
          background: selectedAvatar.color,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "2.8rem",
          boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
          transition: "all 0.2s",
        }}>
          {selectedAvatar.emoji}
        </div>
      </div>

      {/* Avatar grid */}
      <div style={{ marginBottom: "2rem" }}>
        <label style={{ display: "block", fontWeight: "700", fontSize: "0.9rem", marginBottom: "0.75rem" }}>
          {L.avatarLabel}
        </label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "0.5rem" }}>
          {AVATAR_PRESETS.map((preset) => {
            const isSelected = selectedAvatar.emoji === preset.emoji;
            return (
              <button
                key={preset.emoji}
                type="button"
                onClick={() => setSelectedAvatar(preset)}
                style={{
                  width: "100%",
                  aspectRatio: "1",
                  borderRadius: "50%",
                  background: preset.color,
                  border: isSelected ? "3px solid #000" : "3px solid transparent",
                  cursor: "pointer",
                  fontSize: "1.6rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "transform 0.15s, border-color 0.15s",
                  transform: isSelected ? "scale(1.1)" : "scale(1)",
                  boxShadow: isSelected ? "0 2px 8px rgba(0,0,0,0.15)" : "none",
                }}
              >
                {preset.emoji}
              </button>
            );
          })}
        </div>
      </div>

      {/* Nickname input */}
      <div style={{ marginBottom: "1.75rem" }}>
        <label style={{ display: "block", fontWeight: "700", fontSize: "0.9rem", marginBottom: "0.5rem" }}>
          {L.nicknameLabel}
        </label>
        <input
          type="text"
          value={nickname}
          onChange={(e) => { setNickname(e.target.value); setError(""); }}
          placeholder={L.nicknamePlaceholder}
          maxLength={20}
          style={{
            width: "100%",
            padding: "0.85rem 1rem",
            borderRadius: "12px",
            border: error ? "1px solid #ff4d4f" : "1px solid #eee",
            fontSize: "1rem",
            outline: "none",
            boxSizing: "border-box",
            backgroundColor: "#fafafa",
            transition: "border-color 0.2s",
          }}
          onFocus={(e) => !error && (e.currentTarget.style.borderColor = "#000")}
          onBlur={(e) => !error && (e.currentTarget.style.borderColor = "#eee")}
        />
        {error && <p style={{ color: "#ff4d4f", fontSize: "0.85rem", margin: "0.4rem 0 0" }}>{error}</p>}
        <p style={{ color: "#bbb", fontSize: "0.8rem", margin: "0.4rem 0 0", textAlign: "right" }}>
          {nickname.length} / 20
        </p>
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <button
          onClick={handleConfirm}
          style={{
            width: "100%",
            padding: "0.9rem",
            borderRadius: "12px",
            border: "none",
            background: "#000",
            color: "#fff",
            fontWeight: "700",
            fontSize: "1rem",
            cursor: "pointer",
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          {L.confirm}
        </button>
        <button
          onClick={handleSkip}
          style={{
            width: "100%",
            padding: "0.75rem",
            borderRadius: "12px",
            border: "1px solid #eee",
            background: "#fff",
            color: "#888",
            fontWeight: "600",
            fontSize: "0.95rem",
            cursor: "pointer",
          }}
        >
          {L.skip}
        </button>
      </div>
    </div>
  );
}
