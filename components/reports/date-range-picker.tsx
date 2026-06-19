"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import { useTranslations } from "next-intl";
import "react-day-picker/style.css";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export const DateRangePicker = () => {
  const t = useTranslations("reports");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  const fromParam = searchParams.get("from");
  const toParam = searchParams.get("to");

  const [range, setRange] = useState<DateRange | undefined>(
    fromParam && toParam
      ? { from: new Date(fromParam), to: new Date(toParam) }
      : undefined,
  );

  const apply = () => {
    if (!range?.from || !range?.to) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("from", range.from.toISOString().split("T")[0]);
    params.set("to", range.to.toISOString().split("T")[0]);
    router.push(`?${params.toString()}`);
    setOpen(false);
  };

  const clear = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("from");
    params.delete("to");
    setRange(undefined);
    router.push(`?${params.toString()}`);
    setOpen(false);
  };

  const label =
    range?.from && range?.to
      ? `${range.from.toLocaleDateString()} – ${range.to.toLocaleDateString()}`
      : t("pickDateRange");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3" align="start">
        <DayPicker
          mode="range"
          selected={range}
          onSelect={setRange}
          numberOfMonths={2}
        />
        <div className="flex justify-end gap-2 mt-2">
          <Button variant="ghost" size="sm" onClick={clear}>
            {t("clear")}
          </Button>
          <Button
            size="sm"
            onClick={apply}
            disabled={!range?.from || !range?.to}
          >
            {t("apply")}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
