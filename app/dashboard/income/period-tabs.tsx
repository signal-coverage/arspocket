"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

const PERIOD_VALUES = [
  "this-week",
  "this-month",
  "last-month",
  "this-year",
  "all",
] as const;

export type IncomePeriod = (typeof PERIOD_VALUES)[number];

export const PeriodTabs = ({
  currentPeriod,
}: {
  currentPeriod: IncomePeriod;
}) => {
  const t = useTranslations("common");
  const router = useRouter();
  const searchParams = useSearchParams();

  const PERIODS: { value: IncomePeriod; label: string }[] = [
    { value: "this-week", label: t("thisWeek") },
    { value: "this-month", label: t("thisMonth") },
    { value: "last-month", label: t("lastMonth") },
    { value: "this-year", label: t("thisYear") },
    { value: "all", label: t("allTime") },
  ];

  const handleChange = (period: IncomePeriod) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("period", period);
    router.push(`/dashboard/income?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-1">
      {PERIODS.map((p) => (
        <Button
          key={p.value}
          size="sm"
          variant={currentPeriod === p.value ? "default" : "ghost"}
          className="h-7 text-xs"
          onClick={() => handleChange(p.value)}
        >
          {p.label}
        </Button>
      ))}
    </div>
  );
};
