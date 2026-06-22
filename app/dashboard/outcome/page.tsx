import type { Metadata } from "next";
import { Suspense } from "react";
import { Download } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { getTransactions } from "@/app/actions/transactions";
import { getTags } from "@/app/actions/tags";
import { EXPENSE_CATEGORIES } from "@/lib/categories";
import { ImportButton } from "@/components/transactions/import-button";
import { getCategories } from "@/app/actions/categories";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { TransactionFilters } from "@/components/transaction-filters";
import { AnomalyToggle } from "@/components/transactions/anomaly-toggle";
import { OutcomeTaggedList } from "@/components/transactions/outcome-tagged-list";
import { OutcomeFormWrapper } from "./outcome-form-wrapper";

export const metadata: Metadata = { title: "Expenses — ARSPocket" };

export const OutcomePage = async ({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string; anomaly?: string }>;
}) => {
  const t = await getTranslations("outcome");

  const { search, category, anomaly } = await searchParams;
  const isAnomalyFilter = anomaly === "true";

  const [transactions, tags, userCategories] = await Promise.all([
    getTransactions("outcome", {
      search,
      category,
      ...(isAnomalyFilter ? { isAnomaly: true } : {}),
    }),
    getTags(),
    getCategories("outcome"),
  ]);

  const exportParams = new URLSearchParams({ type: "outcome" });
  if (category) exportParams.set("category", category);
  if (search) exportParams.set("search", search);
  if (anomaly === "true") exportParams.set("anomaly", "true");
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
      <div className="grid lg:grid-cols-2 gap-6 items-start">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>{t("addExpense")}</CardTitle>
            <CardDescription>{t("addExpenseDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <OutcomeFormWrapper userCategories={userCategories} />
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader className="pb-3">
            <CardTitle className="text-base mb-3">
              {t("recentExpenses")}
            </CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <Suspense fallback={null}>
                <TransactionFilters categories={[...EXPENSE_CATEGORIES]} />
              </Suspense>
              <Suspense fallback={null}>
                <AnomalyToggle />
              </Suspense>
            </div>
          </CardHeader>
          <CardContent>
            <OutcomeTaggedList
              tags={tags}
              transactions={transactions}
              hasActiveFilters={!!(search || category || isAnomalyFilter)}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OutcomePage;
