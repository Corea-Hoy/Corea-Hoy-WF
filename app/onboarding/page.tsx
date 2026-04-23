"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useUserStore, AVATAR_PRESETS } from "@/lib/stores/userStore";
import { useLanguageStore } from "@/lib/stores/languageStore";

export default function OnboardingPage() {
  const router = useRouter();
  const t = useTranslations("onboarding");
  const { isLoggedIn, completeOnboarding } = useUserStore();
  const { language } = useLanguageStore();

  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_PRESETS[0]);
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoggedIn) router.replace("/login");
  }, [isLoggedIn, router]);

  const ADJECTIVES = {
    ko: ["달콤한", "열정적인", "트렌디한", "매운맛", "행복한", "힙한", "친절한"],
    es: ["Dulce", "Apasianado", "Moderno", "Picante", "Feliz", "Genial", "Amable"],
    en: ["Sweet", "Passionate", "Trendy", "Spicy", "Happy", "Cool", "Kind"]
  };

  const NOUNS = {
    ko: ["서울러", "케이팝팬", "달고나", "여행자", "덕후", "친구", "에디터"],
    es: ["Seulense", "KpopFan", "Dalgona", "Viajero", "Fanatico", "Amigo", "Editor"],
    en: ["Seoulite", "KpopFan", "Dalgona", "Traveler", "Geek", "Friend", "Editor"]
  };

  function generateUniqueNickname(lang: string): string {
    const safeLang = ADJECTIVES[lang as keyof typeof ADJECTIVES] ? lang : "en";
    const adjs = ADJECTIVES[safeLang as keyof typeof ADJECTIVES];
    const nouns = NOUNS[safeLang as keyof typeof NOUNS];
    const randomAdj = adjs[Math.floor(Math.random() * adjs.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `${randomAdj}_${randomNoun}_${randomNum}`;
  }

  function handleConfirm() {
    let finalNickname = nickname.trim();
    if (finalNickname.length === 0) {
      finalNickname = generateUniqueNickname(language);
    } else if (finalNickname.length < 2 || finalNickname.length > 20) {
      setError(t("nicknameError"));
      return;
    }
    completeOnboarding(finalNickname, selectedAvatar.emoji, selectedAvatar.color);
    router.push("/");
  }

  function handleSkip() {
    completeOnboarding(generateUniqueNickname(language), selectedAvatar.emoji, selectedAvatar.color);
    router.push("/");
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-10">
      <div className="w-full max-w-md mx-auto bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
        {/* Header */}
        <div className="text-center mb-7">
          <Image
            src="/logo.png"
            alt="Corea Hoy"
            width={100}
            height={40}
            style={{ objectFit: "contain" }}
            className="mx-auto mb-5"
          />
          <h1 className="text-2xl font-extrabold mb-1">{t("welcome")}</h1>
          <p className="text-sm text-gray-500">{t("subtitle")}</p>
        </div>

        {/* Avatar preview */}
        <div className="flex justify-center mb-5">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-md transition-all duration-200"
            style={{ backgroundColor: selectedAvatar.color }}
          >
            {selectedAvatar.emoji}
          </div>
        </div>

        {/* Avatar grid */}
        <div className="mb-6">
          <label className="block text-sm font-bold mb-2">{t("avatarLabel")}</label>
          <div className="grid grid-cols-6 gap-2">
            {AVATAR_PRESETS.map((preset) => {
              const isSelected = selectedAvatar.emoji === preset.emoji;
              return (
                <button
                  key={preset.emoji}
                  type="button"
                  onClick={() => setSelectedAvatar(preset)}
                  className={`aspect-square rounded-full flex items-center justify-center text-2xl transition-all cursor-pointer border-2 ${
                    isSelected
                      ? "border-black scale-110 shadow-md"
                      : "border-transparent hover:scale-105"
                  }`}
                  style={{ backgroundColor: preset.color }}
                >
                  {preset.emoji}
                </button>
              );
            })}
          </div>
        </div>

        {/* Nickname */}
        <div className="mb-6">
          <label className="block text-sm font-bold mb-2">{t("nicknameLabel")}</label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => { setNickname(e.target.value); setError(""); }}
            placeholder={t("nicknamePlaceholder")}
            maxLength={20}
            className={`w-full px-4 py-3 rounded-xl border text-sm bg-gray-50 outline-none transition-colors ${
              error ? "border-red-400 focus:border-red-400" : "border-gray-200 focus:border-black"
            }`}
          />
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          <p className="text-gray-300 text-xs mt-1 text-right">{nickname.length} / 20</p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleConfirm}
            className="w-full py-3 bg-black text-white rounded-xl font-bold text-sm hover:opacity-80 transition-opacity cursor-pointer"
          >
            {t("confirm")}
          </button>
          <button
            onClick={handleSkip}
            className="w-full py-2.5 border border-gray-200 bg-white text-gray-500 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors cursor-pointer"
          >
            {t("skip")}
          </button>
        </div>
      </div>
    </div>
  );
}
