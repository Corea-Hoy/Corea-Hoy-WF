"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useUserStore } from "@/lib/stores/userStore";
import { useLanguageStore } from "@/lib/stores/languageStore";

export default function LoginPage() {
  const router = useRouter();
  const t = useTranslations("login");
  const { login } = useUserStore();
  const { language } = useLanguageStore();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const isKo = mounted ? language === "ko" : true;
  const [loading, setLoading] = useState(false);

  function handleGoogleLogin() {
    setLoading(true);
    setTimeout(() => {
      login();
      router.push("/onboarding");
    }, 1200);
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-10">
      <div className="w-full max-w-sm mx-auto bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
        <div className="flex justify-center mb-6">
          <Image src="/logo.png" alt="Corea Hoy" width={120} height={48} style={{ objectFit: "contain" }} priority />
        </div>

        <p className="text-center text-gray-500 text-sm mb-8 leading-relaxed">{t("subtitle")}</p>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 px-5 py-3.5 border border-gray-200 rounded-xl text-sm font-semibold bg-white hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {!loading && (
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          )}
          {loading ? t("connecting") : t("google")}
        </button>

        <p className="mt-5 text-[11px] leading-relaxed text-gray-400 text-center px-2">
          {isKo ? (
            <>계속 진행하면 코레아 호이의 <a href="/privacy" className="underline hover:text-gray-600">이용약관 및 개인정보 처리방침</a>에 동의하는 것으로 간주됩니다.</>
          ) : (
            <>Al continuar, aceptas nuestros <a href="/privacy" className="underline hover:text-gray-600">Términos de servicio y Política de privacidad</a>.</>
          )}
        </p>

        <div className="mt-6 pt-5 border-t border-gray-100 text-center">
          <button
            onClick={() => router.push("/")}
            className="text-sm text-gray-400 underline hover:text-gray-600 transition-colors cursor-pointer bg-transparent border-none"
          >
            {t("browse")}
          </button>
        </div>
      </div>
    </div>
  );
}
