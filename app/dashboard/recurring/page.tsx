import type { Metadata } from "next";
import { Repeat2 } from "lucide-react";
import { getTransactions } from "@/app/actions/transactions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RecurringList } from "@/components/recurring/recurring-list";

export const metadata: Metadata = { title: "Recurring — ARSPocket" };

const RecurringPage = async () => {
  const transactions = await getTransactions(undefined, { isRecurring: true });

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-xl font-semibold">Recurring Transactions</h1>
        <p className="text-sm text-muted-foreground">
          Manage your recurring income and expense templates.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Repeat2 className="size-4" />
            Active Recurring
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RecurringList transactions={transactions} />
        </CardContent>
      </Card>
    </div>
  );
};

export default RecurringPage;
