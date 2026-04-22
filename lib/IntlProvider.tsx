"use client";

import { NextIntlClientProvider } from "next-intl";
import { ReactNode, useEffect, useState } from "react";
import { useLanguageStore } from "./stores/languageStore";
import koMessages from "../messages/ko.json";
import esMessages from "../messages/es.json";

export default function IntlProvider({ children }: { children: ReactNode }) {
  const { language } = useLanguageStore();
  // Wait for hydration to avoid SSR/client mismatch with persisted language
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const locale = mounted ? language : "ko";
  const messages = locale === "ko" ? koMessages : esMessages;

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
