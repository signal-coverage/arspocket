import type { Metadata } from "next";
import { PieChart } from "lucide-react";
import { getBudgetsWithSpend } from "@/app/actions/budgets";
import { formatCurrency } from "@/lib/format";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { BudgetList } from "@/components/budget/budget-list";
import { BudgetPageClient } from "./budget-page-client";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = { title: "Budget — ARSPocket" };

export const BudgetPage = async () => {
  const t = await getTranslations("budget");
  const budgets = await getBudgetsWithSpend();

  const totalBudget = budgets.reduce((acc, b) => acc + b.amount, 0);
  const totalSpent = budgets.reduce((acc, b) => acc + b.spent, 0);
  const totalRemaining = Math.max(0, totalBudget - totalSpent);
  const totalPct =
    totalBudget > 0
      ? Math.min(Math.round((totalSpent / totalBudget) * 100), 100)
      : 0;

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">{t("pageSubtitle")}</p>
        </div>
        <BudgetPageClient />
      </div>

      {/* KPI summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-1">
            <CardDescription className="text-xs">
              {t("totalBudget")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">
              {formatCurrency(totalBudget)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1">
            <CardDescription className="text-xs">
              {t("totalSpent")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">
              {formatCurrency(totalSpent)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1">
            <CardDescription className="text-xs">
              {t("remaining")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-green-600 dark:text-green-400">
              {formatCurrency(totalRemaining)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1">
            <CardDescription className="text-xs">
              {t("percentUsed")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p
              className={`text-lg font-semibold ${
                totalPct >= 90
                  ? "text-red-500"
                  : totalPct >= 75
                    ? "text-amber-500"
                    : "text-foreground"
              }`}
            >
              {totalPct}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Budget list */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <PieChart className="size-4" />
            {t("categoryBudgets")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <BudgetList budgets={budgets} />
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetPage;
