import type { Metadata } from "next";
import { getTransactionsByDay } from "@/app/actions/transactions";
import { TransactionCalendar } from "@/components/transactions/transaction-calendar";

export const metadata: Metadata = { title: "Calendar — ARSPocket" };

export const CalendarPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; month?: string }>;
}) => {
  const params = await searchParams;
  const now = new Date();
  const year = params.year ? parseInt(params.year) : now.getFullYear();
  const month = params.month ? parseInt(params.month) : now.getMonth() + 1;

  const transactionsByDay = await getTransactionsByDay(year, month);

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-xl font-semibold">Calendar</h1>
        <p className="text-sm text-muted-foreground">
          {new Date(year, month - 1).toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>
      <TransactionCalendar
        transactionsByDay={transactionsByDay}
        year={year}
        month={month}
      />
    </div>
  );
};

export default CalendarPage;
