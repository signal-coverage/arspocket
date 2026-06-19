"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

const PERIODS = [
  { value: "this-week", label: "This Week" },
  { value: "this-month", label: "This Month" },
  { value: "last-month", label: "Last Month" },
  { value: "this-year", label: "This Year" },
  { value: "all", label: "All Time" },
] as const;

export type IncomePeriod = (typeof PERIODS)[number]["value"];

export const PeriodTabs = ({ currentPeriod }: { currentPeriod: IncomePeriod }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

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
