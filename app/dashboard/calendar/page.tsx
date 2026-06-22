import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getTransactionsByDay } from "@/app/actions/transactions";
import { getBillsForMonth } from "@/app/actions/bills";
import { getGoals } from "@/app/actions/goals";
import { TransactionCalendar } from "@/components/transactions/transaction-calendar";
import type { SerializedBill } from "@/app/actions/bills";

export const metadata: Metadata = { title: "Calendar — ARSPocket" };

export const CalendarPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; month?: string }>;
}) => {
  const t = await getTranslations("calendar");
  const params = await searchParams;
  const now = new Date();
  const year = params.year ? parseInt(params.year) : now.getFullYear();
  const month = params.month ? parseInt(params.month) : now.getMonth() + 1;

  const [transactionsByDay, bills, goals] = await Promise.all([
    getTransactionsByDay(year, month),
    getBillsForMonth(),
    getGoals(),
  ]);

  // Build billsByDay map keyed by ISO date "YYYY-MM-DD"
  const billsByDay: Record<string, SerializedBill[]> = {};
  for (const bill of bills) {
    const d = new Date(bill.nextDueDate);
    if (d.getFullYear() === year && d.getMonth() + 1 === month) {
      const key = d.toISOString().split("T")[0];
      (billsByDay[key] ??= []).push(bill);
    }
  }

  // Build goalDeadlinesByDay map keyed by ISO date "YYYY-MM-DD"
  const goalDeadlinesByDay: Record<string, string[]> = {};
  for (const goal of goals) {
    if (!goal.deadline) continue;
    const d = new Date(goal.deadline.toString());
    if (d.getFullYear() === year && d.getMonth() + 1 === month) {
      const key = d.toISOString().split("T")[0];
      (goalDeadlinesByDay[key] ??= []).push(goal.name);
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-xl font-semibold">{t("title")}</h1>
        <p className="text-sm text-muted-foreground">
          {new Date(year, month - 1).toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>
      <TransactionCalendar
        transactionsByDay={transactionsByDay}
        billsByDay={billsByDay}
        goalDeadlinesByDay={goalDeadlinesByDay}
        year={year}
        month={month}
      />
    </div>
  );
};

export default CalendarPage;
