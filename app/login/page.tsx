"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/LanguageContext";
import { useUser } from "@/lib/UserContext";

export default function LoginPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const { login } = useUser();
  const [loading, setLoading] = useState(false);
  const isKo = language === "ko";

  function handleGoogleLogin() {
    setLoading(true);
    setTimeout(() => {
      login();
      router.push("/onboarding");
    }, 1200);
  }

  return (
    <div style={{ maxWidth: 400, margin: "6rem auto", textAlign: "center", padding: "2rem", borderRadius: "24px", border: "1px solid #f0f0f0", backgroundColor: "#fff" }}>
      <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem", fontWeight: "800" }}>Corea Hoy</h1>
      <p style={{ color: "#666", marginBottom: "3rem", fontSize: "1.1rem" }}>
        {isKo ? "로그인하고 기사에 댓글을 남겨보세요" : "Inicia sesión para comentar y guardar artículos"}
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{
            padding: "1rem",
            border: "1px solid #eee",
            borderRadius: "12px",
            cursor: loading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.75rem",
            background: "#fff",
            fontSize: "1rem",
            fontWeight: "600",
            transition: "background 0.2s",
            opacity: loading ? 0.7 : 1,
          }}
          onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = "#f9f9f9")}
          onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = "#fff")}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {loading ? (isKo ? "연결 중..." : "Conectando...") : (isKo ? "Google로 로그인" : "Continuar con Google")}
        </button>
      </div>

      <div style={{ marginTop: "2rem", borderTop: "1px solid #f0f0f0", paddingTop: "1.5rem" }}>
        <button
          onClick={() => router.push("/")}
          style={{ background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: "0.95rem", textDecoration: "underline" }}
        >
          {isKo ? "로그인 없이 둘러보기" : "Explorar sin iniciar sesión"}
        </button>
      </div>
    </div>
  );
}
