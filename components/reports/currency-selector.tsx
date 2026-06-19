"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CURRENCIES = [
  { value: "ARS", label: "ARS (Argentine Peso)" },
  { value: "USD", label: "USD (US Dollar)" },
  { value: "USDC", label: "USDC (USD Coin)" },
  { value: "EUR", label: "EUR (Euro)" },
];

export const CurrencySelector = () => {
  const t = useTranslations("reports");
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("baseCurrency") ?? "";

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "none") {
      params.set("baseCurrency", value);
    } else {
      params.delete("baseCurrency");
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <Select value={current || "none"} onValueChange={handleChange}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder={t("normalizeToCurrency")} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">{t("noNormalization")}</SelectItem>
        {CURRENCIES.map((c) => (
          <SelectItem key={c.value} value={c.value}>
            {c.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
