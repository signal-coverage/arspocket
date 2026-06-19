"use client";

import { useTranslations } from "next-intl";

export const TimeGreeting = () => {
  const t = useTranslations("timeGreeting");
  const hours = new Date().getHours();
  const key =
    hours >= 5 && hours <= 11
      ? "morning"
      : hours >= 12 && hours <= 17
        ? "afternoon"
        : "evening";
  return <>{t(key)}</>;
};
