"use client";

import { useEffect } from "react";
import { useLanguageStore } from "@/lib/stores/languageStore";

// Syncs the <html lang> attribute with the user's selected language.
// Required because layout.tsx is a Server Component and cannot read Zustand state.
export default function LangSetter() {
  const { language } = useLanguageStore();

  useEffect(() => {
    document.documentElement.lang = language === "ko" ? "ko" : "es";
  }, [language]);

  return null;
}
