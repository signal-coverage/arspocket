import type { Metadata } from "next";
import { Suspense } from "react";
import { format } from "date-fns";
import { Inbox, MoveDownLeft, Trash2 } from "lucide-react";

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
  const { search, category } = await searchParams;
  const transactions = await getTransactions("outcome", { search, category });

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="grid lg:grid-cols-2 gap-6 items-start">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Add Expense</CardTitle>
            <CardDescription>Record a new expense entry</CardDescription>
          </CardHeader>
          <CardContent>
            <OutcomeFormWrapper />
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader className="pb-3">
            <CardTitle className="text-base mb-3">Recent Expenses</CardTitle>
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
                  No transactions match your filters.
                </p>
              </div>
            ) : transactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
                <Inbox className="size-10 text-muted-foreground/50" />
                <div>
                  <p className="text-sm font-medium">
                    No expenses recorded yet
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Your expense entries will appear here.
                  </p>
                </div>
              </div>
            ) : (
              <ul className="divide-y">
                {transactions.map((t) => (
                  <li key={t.id} className="flex items-center gap-3 py-3">
                    <div className="flex items-center justify-center rounded-md bg-red-50 dark:bg-red-950 p-1.5 shrink-0">
                      <MoveDownLeft className="size-4 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {t.description}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Badge variant="secondary" className="text-xs">
                          {t.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(t.date), "MMM d, yyyy")}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                        -$
                        {Number(t.amount).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                      <form
                        action={async () => {
                          "use server";
                          await deleteTransaction(t.id);
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
