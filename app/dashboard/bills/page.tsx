import type { Metadata } from "next";
import { CalendarClock } from "lucide-react";
import { getBillsForMonth, lazyResetOverdueBills } from "@/app/actions/bills";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BillsCalendar } from "@/components/bills/bills-calendar";
import { BillsPageClient } from "./bills-page-client";

export const metadata: Metadata = { title: "Bills — ARSPocket" };

export const BillsPage = async () => {
  // Lazy reset overdue recurring bills before rendering
  await lazyResetOverdueBills();

  const now = new Date();
  const bills = await getBillsForMonth(now.getFullYear(), now.getMonth());

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Bills</h1>
          <p className="text-sm text-muted-foreground">
            Track and pay your recurring bills.
          </p>
        </div>
        <BillsPageClient />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CalendarClock className="size-4" />
            Monthly Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <BillsCalendar bills={bills} />
        </CardContent>
      </Card>
    </div>
  );
};

export default BillsPage;
