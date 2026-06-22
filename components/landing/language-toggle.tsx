"use client";

import { useEffect, useState } from "react";

export const LanguageToggle = () => {
  const [locale, setLocale] = useState("en");

  useEffect(() => {
    const match = document.cookie.match(/NEXT_LOCALE=([^;]+)/);
    setLocale(match?.[1] ?? "en");
  }, []);

  const toggle = () => {
    const next = locale === "en" ? "es" : "en";
    document.cookie = `NEXT_LOCALE=${next}; path=/; max-age=${365 * 24 * 60 * 60}`;
    window.location.reload();
  };

  return (
    <button
      onClick={toggle}
      className="text-sm font-medium text-[#5D6370] hover:text-[#0F1117] dark:hover:text-white transition-colors px-2 py-1 rounded-md hover:bg-[#F0FAF2] border border-transparent hover:border-[#E8F5E9]"
      aria-label="Switch language"
    >
      {locale === "en" ? "ES" : "EN"}
    </button>
  );
};
