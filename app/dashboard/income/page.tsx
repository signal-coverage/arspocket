import type { Metadata } from "next";
import { Suspense } from "react";
import { format } from "date-fns";
import { Inbox, MoveUpRight, Trash2 } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { deleteTransaction, getTransactions } from "@/app/actions/transactions";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { TransactionFilters } from "@/components/transaction-filters";
import { ImportButton } from "@/components/transactions/import-button";
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
import { formatCurrency } from "@/lib/format";

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
  }>;
}) => {
  const t = await getTranslations("income");
  const tCommon = await getTranslations("common");

  const { search, category, period: periodParam } = await searchParams;

  const period: IncomePeriod = VALID_PERIODS.includes(
    periodParam as IncomePeriod,
  )
    ? (periodParam as IncomePeriod)
    : "this-month";

  const dateRange = getPeriodRange(period);

  const transactions = await getTransactions("income", { search, category });

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

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex justify-end">
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
            <IncomeFormWrapper />
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
          <Suspense fallback={null}>
            <TransactionFilters
              categories={[
                "Salary",
                "Freelance",
                "Investment",
                "Gift",
                "Other",
              ]}
            />
          </Suspense>
        </CardHeader>
        <CardContent>
          {filteredTransactions.length === 0 && (search || category) ? (
            <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
              <p className="text-sm text-muted-foreground">
                {tCommon("noResults")}
              </p>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
              <Inbox className="size-10 text-muted-foreground/50" />
              <div>
                <p className="text-sm font-medium">{t("noIncomePeriod")}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {t("incomeEntriesAppear")}
                </p>
              </div>
            </div>
          ) : (
            <ul className="divide-y">
              {filteredTransactions.map((tx) => (
                <li key={tx.id} className="flex items-center gap-3 py-3">
                  <div className="flex items-center justify-center rounded-md bg-green-50 dark:bg-green-950 p-1.5 shrink-0">
                    <MoveUpRight className="size-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {tx.description}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Badge variant="secondary" className="text-xs">
                        {tx.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(tx.date), "MMM d, yyyy")}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                      {formatCurrency(Number(tx.amount))}
                    </span>
                    <form
                      action={async () => {
                        "use server";
                        await deleteTransaction(tx.id);
                      }}
                    >
                      <Button
                        type="submit"
                        size="icon"
                        variant="ghost"
                        className="size-7 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </form>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default IncomePage;
