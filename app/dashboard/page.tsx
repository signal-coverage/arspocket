import { format } from "date-fns";
import {
  Inbox,
  MoveDownLeft,
  MoveUpRight,
  PiggyBank,
  Target,
  Trash2,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { TransactionType } from "@prisma/client";
import { getTranslations } from "next-intl/server";

import { formatCurrency } from "@/lib/format";

import {
  getDashboardStats,
  deleteTransaction,
} from "@/app/actions/transactions";
import { getSavingsGoals } from "@/app/actions/savings";
import { prisma } from "@/lib/db";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Progress,
} from "@/components/ui";
import { MonthlyChart } from "./monthly-chart";
import { QuickActions } from "./quick-actions";
import { TimeGreeting } from "./time-greeting";
import { getCashFlowProjection } from "@/lib/utils/projection";
import { CashFlowChart } from "@/components/dashboard/cash-flow-chart";

const getMonthlyChartData = async (userId: string) => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);

  const transactions = await prisma.transaction.findMany({
    where: { userId, date: { gte: sixMonthsAgo } },
    select: { type: true, amount: true, date: true },
  });

  const months: Record<string, { income: number; expenses: number }> = {};
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const key = d.toLocaleString("default", {
      month: "short",
      year: "2-digit",
    });
    months[key] = { income: 0, expenses: 0 };
  }

  for (const t of transactions) {
    const key = new Date(t.date).toLocaleString("default", {
      month: "short",
      year: "2-digit",
    });
    if (!months[key]) continue;
    if (t.type === TransactionType.INCOME)
      months[key].income += Number(t.amount);
    else months[key].expenses += Number(t.amount);
  }

  return Object.entries(months).map(([month, v]) => ({ month, ...v }));
};

export const DashboardPage = async () => {
  const { userId } = await auth();
  const t = await getTranslations("dashboard");

  const [
    stats,
    savingsGoals,
    recentTransactions,
    chartData,
    projection30,
    projection60,
    projection90,
  ] = await Promise.all([
    getDashboardStats(),
    getSavingsGoals(),
    userId
      ? prisma.transaction.findMany({
          where: { userId },
          orderBy: { date: "desc" },
          take: 5,
          select: {
            id: true,
            type: true,
            amount: true,
            description: true,
            category: true,
            date: true,
          },
        })
      : Promise.resolve([]),
    userId ? getMonthlyChartData(userId) : Promise.resolve([]),
    userId ? getCashFlowProjection(userId, 30) : Promise.resolve([]),
    userId ? getCashFlowProjection(userId, 60) : Promise.resolve([]),
    userId ? getCashFlowProjection(userId, 90) : Promise.resolve([]),
  ]);

  const kpiCards = [
    {
      title: t("balance"),
      value: formatCurrency(stats.balance),
      change: stats.balance >= 0 ? t("positive") : t("negative"),
      isPositive: stats.balance >= 0,
      icon: TrendingUp,
    },
    {
      title: t("monthlyIncome"),
      value: formatCurrency(stats.monthlyIncome),
      change: t("thisMonth"),
      isPositive: true,
      icon: MoveUpRight,
    },
    {
      title: t("monthlyExpenses"),
      value: formatCurrency(stats.monthlyExpenses),
      change: t("thisMonth"),
      isPositive: false,
      icon: MoveDownLeft,
    },
    {
      title: t("savingsGoals"),
      value: `${savingsGoals.length} ${t("activeGoalsLabel")}`,
      change: t("activeGoalsLabel"),
      isPositive: true,
      icon: PiggyBank,
    },
  ];

  return (
    <main className="flex-1 overflow-auto p-4 sm:p-6 space-y-6 bg-background w-full">
      {/* Welcome / Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-[22px] font-semibold">
            <TimeGreeting />
          </h2>
          <p className="text-sm text-muted-foreground">{t("overview")}</p>
        </div>
        <QuickActions />
      </div>

      {/* Stats Cards — all 4 KPIs in one bordered card, template style */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 sm:p-6 rounded-xl border bg-card">
        {kpiCards.map((stat, index) => (
          <div key={stat.title} className="flex items-start">
            <div className="flex-1 space-y-4 lg:space-y-6">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <stat.icon className="size-4.5" />
                <span className="text-xs sm:text-sm font-medium truncate">
                  {stat.title}
                </span>
              </div>
              <p className="text-xl lg:text-[28px] font-semibold leading-tight tracking-tight">
                {stat.value}
              </p>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-medium">
                <span
                  className={
                    stat.isPositive ? "text-emerald-600" : "text-red-600"
                  }
                >
                  {stat.change}
                </span>
              </div>
            </div>
            {index < kpiCards.length - 1 && (
              <div className="hidden lg:block w-px h-full bg-border mx-4 xl:mx-6" />
            )}
          </div>
        ))}
      </div>

      {/* Bottom: Recent Transactions + Savings Goals + Monthly Chart */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Recent Transactions */}
        <Card className="flex flex-col lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              {t("recentTransactions")}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto">
            {recentTransactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
                <Inbox className="size-10 text-muted-foreground/50" />
                <div>
                  <p className="text-sm font-medium">{t("noTransactions")}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t("noTransactionsDescription")}
                  </p>
                </div>
                <Button asChild size="sm" variant="outline">
                  <Link href="/dashboard/income">{t("addTransaction")}</Link>
                </Button>
              </div>
            ) : (
              <ul className="divide-y">
                {recentTransactions.map((tx) => {
                  const isIncome = tx.type === TransactionType.INCOME;
                  return (
                    <li
                      key={tx.id}
                      className="flex items-center gap-3 py-3 first:pt-0"
                    >
                      <div
                        className={`flex items-center justify-center rounded-md p-1.5 shrink-0 ${isIncome ? "bg-green-50 dark:bg-green-950" : "bg-red-50 dark:bg-red-950"}`}
                      >
                        {isIncome ? (
                          <MoveUpRight className="size-4 text-green-600 dark:text-green-400" />
                        ) : (
                          <MoveDownLeft className="size-4 text-red-600 dark:text-red-400" />
                        )}
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
                            {format(new Date(tx.date), "MMM d")}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span
                          className={`text-sm font-semibold ${isIncome ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                        >
                          {isIncome ? "+" : "-"}$
                          {Number(tx.amount).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
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
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Savings Goals */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{t("savingsGoals")}</CardTitle>
              <Button
                asChild
                size="sm"
                variant="ghost"
                className="h-7 text-xs text-muted-foreground"
              >
                <Link href="/dashboard/savings">{t("viewAll")}</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {savingsGoals.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
                <Target className="size-8 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">{t("noGoals")}</p>
                <Button asChild size="sm" variant="outline">
                  <Link href="/dashboard/savings">{t("createGoal")}</Link>
                </Button>
              </div>
            ) : (
              <ul className="flex flex-col gap-4">
                {savingsGoals.slice(0, 3).map((g) => {
                  const current = Number(g.currentAmount);
                  const target = Number(g.targetAmount);
                  const pct =
                    target > 0 ? Math.min((current / target) * 100, 100) : 0;
                  const done = pct >= 100;
                  return (
                    <li key={g.id}>
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-sm font-medium truncate pr-2">
                          {g.goalName}
                        </p>
                        <span
                          className={`text-xs font-semibold shrink-0 ${done ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}`}
                        >
                          {pct.toFixed(0)}%
                        </span>
                      </div>
                      <Progress value={pct} className="h-2" />
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-muted-foreground">
                          {formatCurrency(current)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatCurrency(target)}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Monthly Chart */}
        <MonthlyChart data={chartData} />
      </div>

      {/* Cash Flow Projection */}
      <CashFlowChart
        data30={projection30}
        data60={projection60}
        data90={projection90}
      />
    </main>
  );
};

export default DashboardPage;
