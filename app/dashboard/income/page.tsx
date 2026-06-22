import type { Metadata } from "next";
import { Suspense } from "react";
import { Download } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { getTransactions } from "@/app/actions/transactions";
import { getTags } from "@/app/actions/tags";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { TransactionFilters } from "@/components/transaction-filters";
import { ImportButton } from "@/components/transactions/import-button";
import { AnomalyToggle } from "@/components/transactions/anomaly-toggle";
import { IncomeTaggedList } from "@/components/transactions/income-tagged-list";
import { IncomeFormWrapper } from "./income-form-wrapper";
import { PeriodTabs, IncomePeriod } from "./period-tabs";
import { CategoryChart } from "./category-chart";
import {
  startOfWeekDate,
  endOfWeekDate,
  startOfMonthDate,
  endOfMonthDate,
  startOfYearDate,
  endOfYearDate,
  lastMonthRange,
} from "@/lib/dates";
import { INCOME_CATEGORIES } from "@/lib/categories";
import { getCategories } from "@/app/actions/categories";

export const metadata: Metadata = { title: "Income — ARSPocket" };

const VALID_PERIODS: IncomePeriod[] = [
  "this-week",
  "this-month",
  "last-month",
  "this-year",
  "all",
];

const getPeriodRange = (
  period: IncomePeriod,
): { start: Date; end: Date } | null => {
  const now = new Date();
  switch (period) {
    case "this-week":
      return { start: startOfWeekDate(now), end: endOfWeekDate(now) };
    case "this-month":
      return { start: startOfMonthDate(now), end: endOfMonthDate(now) };
    case "last-month":
      return lastMonthRange(now);
    case "this-year":
      return { start: startOfYearDate(now), end: endOfYearDate(now) };
    case "all":
      return null;
  }
};

export const IncomePage = async ({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    category?: string;
    period?: string;
    anomaly?: string;
  }>;
}) => {
  const t = await getTranslations("income");

  const { search, category, period: periodParam, anomaly } = await searchParams;

  const period: IncomePeriod = VALID_PERIODS.includes(
    periodParam as IncomePeriod,
  )
    ? (periodParam as IncomePeriod)
    : "this-month";

  const dateRange = getPeriodRange(period);
  const isAnomalyFilter = anomaly === "true";

  const [transactions, tags, userCategories] = await Promise.all([
    getTransactions("income", {
      search,
      category,
      ...(isAnomalyFilter ? { isAnomaly: true } : {}),
    }),
    getTags(),
    getCategories("income"),
  ]);

  // Filter by period for display
  const filteredTransactions = dateRange
    ? transactions.filter((t) => {
        const d = new Date(t.date);
        return d >= dateRange.start && d <= dateRange.end;
      })
    : transactions;

  // Compute category aggregation for chart
  const categoryAgg: Record<string, number> = {};
  for (const tx of filteredTransactions) {
    const cat = tx.category;
    categoryAgg[cat] = (categoryAgg[cat] ?? 0) + Number(tx.amount);
  }

  const categoryData = Object.entries(categoryAgg)
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);

  const totalIncome = filteredTransactions.reduce(
    (acc, tx) => acc + Number(tx.amount),
    0,
  );

  const breakdownLabel =
    period === "all"
      ? t("allTimeBreakdown")
      : `${period.replace(/-/g, " ")} breakdown`;

  const exportParams = new URLSearchParams({ type: "income" });
  if (category) exportParams.set("category", category);
  if (search) exportParams.set("search", search);
  if (anomaly === "true") exportParams.set("anomaly", "true");
  if (dateRange) {
    exportParams.set("from", dateRange.start.toISOString());
    exportParams.set("to", dateRange.end.toISOString());
  }
  const exportHref = `/api/export?${exportParams.toString()}`;

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex justify-end gap-2">
        <a
          href={exportHref}
          className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
        >
          <Download className="size-4" />
          Export CSV
        </a>
        <ImportButton />
      </div>

      {/* Period tabs */}
      <Suspense fallback={null}>
        <PeriodTabs currentPeriod={period} />
      </Suspense>

      <div className="grid lg:grid-cols-2 gap-6 items-start">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>{t("addIncome")}</CardTitle>
            <CardDescription>{t("addIncomeDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <IncomeFormWrapper userCategories={userCategories} />
          </CardContent>
        </Card>

        {/* Category breakdown chart */}
        <Card className="w-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{t("incomeByCategory")}</CardTitle>
            <CardDescription className="text-xs">
              {breakdownLabel}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CategoryChart data={categoryData} totalIncome={totalIncome} />
          </CardContent>
        </Card>
      </div>

      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-base mb-3">{t("recentIncome")}</CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            <Suspense fallback={null}>
              <TransactionFilters categories={[...INCOME_CATEGORIES]} />
            </Suspense>
            <Suspense fallback={null}>
              <AnomalyToggle />
            </Suspense>
          </div>
        </CardHeader>
        <CardContent>
          <IncomeTaggedList
            tags={tags}
            transactions={filteredTransactions}
            hasActiveFilters={!!(search || category || isAnomalyFilter)}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default IncomePage;
