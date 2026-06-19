import type { Metadata } from "next";
import { Suspense } from "react";
import { format } from "date-fns";
import { Inbox, MoveDownLeft, Trash2 } from "lucide-react";
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
import { OutcomeFormWrapper } from "./outcome-form-wrapper";

export const metadata: Metadata = { title: "Expenses — ARSPocket" };

export const OutcomePage = async ({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string }>;
}) => {
  const t = await getTranslations("outcome");
  const tCommon = await getTranslations("common");

  const { search, category } = await searchParams;
  const transactions = await getTransactions("outcome", { search, category });

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="grid lg:grid-cols-2 gap-6 items-start">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>{t("addExpense")}</CardTitle>
            <CardDescription>{t("addExpenseDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <OutcomeFormWrapper />
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader className="pb-3">
            <CardTitle className="text-base mb-3">
              {t("recentExpenses")}
            </CardTitle>
            <Suspense fallback={null}>
              <TransactionFilters
                categories={[
                  "Food",
                  "Transport",
                  "Housing",
                  "Entertainment",
                  "Health",
                  "Education",
                  "Other",
                ]}
              />
            </Suspense>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 && (search || category) ? (
              <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
                <p className="text-sm text-muted-foreground">
                  {tCommon("noResults")}
                </p>
              </div>
            ) : transactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
                <Inbox className="size-10 text-muted-foreground/50" />
                <div>
                  <p className="text-sm font-medium">{t("noExpensesPeriod")}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t("expenseEntriesAppear")}
                  </p>
                </div>
              </div>
            ) : (
              <ul className="divide-y">
                {transactions.map((tx) => (
                  <li key={tx.id} className="flex items-center gap-3 py-3">
                    <div className="flex items-center justify-center rounded-md bg-red-50 dark:bg-red-950 p-1.5 shrink-0">
                      <MoveDownLeft className="size-4 text-red-600 dark:text-red-400" />
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
                      <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                        -$
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
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OutcomePage;
