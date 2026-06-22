import type { Metadata } from "next";
import { CalendarClock } from "lucide-react";
import { getBillsForMonth, lazyResetOverdueBills } from "@/app/actions/bills";
import { getCategories } from "@/app/actions/categories";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BillsCalendar } from "@/components/bills/bills-calendar";
import { BillsPageClient } from "./bills-page-client";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = { title: "Bills — ARSPocket" };

export const BillsPage = async () => {
  const t = await getTranslations("bills");

  await lazyResetOverdueBills();

  const [bills, userCategories] = await Promise.all([
    getBillsForMonth(),
    getCategories("outcome"),
  ]);

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">{t("pageSubtitle")}</p>
        </div>
        <BillsPageClient userCategories={userCategories} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CalendarClock className="size-4" />
            {t("monthlyCalendar")}
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
