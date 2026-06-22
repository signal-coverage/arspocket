import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";

import {
  getDateRangeReport,
  getMonthlyReport,
  getAnnualReport,
} from "@/app/actions/transactions";
import { MonthlySummary } from "@/components/reports/monthly-summary";
import { AnnualSummary } from "@/components/reports/annual-summary";
import { DateRangePicker } from "@/components/reports/date-range-picker";
import { CurrencySelector } from "@/components/reports/currency-selector";
import { PrintButton } from "@/components/reports/print-button";

export const metadata: Metadata = { title: "Reports — ARSPocket" };

export const ReportsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{
    from?: string;
    to?: string;
    baseCurrency?: string;
    year?: string;
  }>;
}) => {
  const t = await getTranslations("reports");
  const { from, to, baseCurrency, year: yearParam } = await searchParams;

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const isAnnualView = !!yearParam;
  const year = yearParam ? parseInt(yearParam) : currentYear;

  const annualReport = isAnnualView
    ? await getAnnualReport(year, baseCurrency || undefined)
    : null;

  const report =
    !isAnnualView
      ? from && to
        ? await getDateRangeReport(
            new Date(from),
            new Date(to),
            baseCurrency || undefined,
          )
        : await getMonthlyReport(
            currentYear,
            currentMonth,
            baseCurrency || undefined,
          )
      : null;

  const prevYearHref = `?year=${year - 1}${baseCurrency ? `&baseCurrency=${baseCurrency}` : ""}`;
  const nextYearHref = `?year=${year + 1}${baseCurrency ? `&baseCurrency=${baseCurrency}` : ""}`;

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">
            {isAnnualView
              ? String(year)
              : from && to
                ? `${new Date(from).toLocaleDateString()} – ${new Date(to).toLocaleDateString()}`
                : `${new Date(currentYear, currentMonth - 1).toLocaleString("default", { month: "long", year: "numeric" })}`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {isAnnualView ? (
            <>
              <a
                href={prevYearHref}
                className="inline-flex items-center gap-1 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
                aria-label="Previous year"
              >
                <ChevronLeft className="size-4" />
                {year - 1}
              </a>
              <a
                href={nextYearHref}
                className="inline-flex items-center gap-1 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
                aria-label="Next year"
              >
                {year + 1}
                <ChevronRight className="size-4" />
              </a>
            </>
          ) : (
            <>
              <Suspense fallback={null}>
                <DateRangePicker />
              </Suspense>
              <Suspense fallback={null}>
                <CurrencySelector />
              </Suspense>
              <a
                href={`/api/export${from && to ? `?from=${from}&to=${to}` : ""}`}
                className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
              >
                <Download className="size-4" />
                Export CSV
              </a>
              <a
                href={`?year=${currentYear}`}
                className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
              >
                Annual View
              </a>
            </>
          )}
          <PrintButton />
        </div>
      </div>

      {isAnnualView ? (
        <AnnualSummary data={annualReport ?? { year, months: Array.from({ length: 12 }, (_, i) => ({ month: i + 1, income: 0, expenses: 0, net: 0 })), totalIncome: 0, totalExpenses: 0, totalNet: 0 }} />
      ) : (
        <MonthlySummary data={report} />
      )}
    </div>
  );
};

export default ReportsPage;
