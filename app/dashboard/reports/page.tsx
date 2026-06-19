import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import {
  getDateRangeReport,
  getMonthlyReport,
} from "@/app/actions/transactions";
import { MonthlySummary } from "@/components/reports/monthly-summary";
import { DateRangePicker } from "@/components/reports/date-range-picker";
import { CurrencySelector } from "@/components/reports/currency-selector";

export const metadata: Metadata = { title: "Reports — ARSPocket" };

export const ReportsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{
    from?: string;
    to?: string;
    baseCurrency?: string;
  }>;
}) => {
  const t = await getTranslations("reports");
  const { from, to, baseCurrency } = await searchParams;

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const report =
    from && to
      ? await getDateRangeReport(
          new Date(from),
          new Date(to),
          baseCurrency || undefined,
        )
      : await getMonthlyReport(year, month, baseCurrency || undefined);

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">
            {from && to
              ? `${new Date(from).toLocaleDateString()} – ${new Date(to).toLocaleDateString()}`
              : `${new Date(year, month - 1).toLocaleString("default", { month: "long", year: "numeric" })}`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Suspense fallback={null}>
            <DateRangePicker />
          </Suspense>
          <Suspense fallback={null}>
            <CurrencySelector />
          </Suspense>
        </div>
      </div>

      <MonthlySummary data={report} />
    </div>
  );
};

export default ReportsPage;
