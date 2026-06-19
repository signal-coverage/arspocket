"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type DayData = {
  income: number;
  expense: number;
  count: number;
};

type Props = {
  transactionsByDay: Record<string, DayData>;
  year: number;
  month: number;
};

const fmt = (n: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(n);

export const TransactionCalendar = ({
  transactionsByDay,
  year,
  month,
}: Props) => {
  const t = useTranslations("calendar");
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState<Date | undefined>();

  const defaultMonth = new Date(year, month - 1, 1);

  const handleMonthChange = (m: Date) => {
    router.push(
      `/dashboard/calendar?year=${m.getFullYear()}&month=${m.getMonth() + 1}`,
    );
  };

  const selectedKey = selectedDay?.toISOString().split("T")[0];
  const selectedData = selectedKey ? transactionsByDay[selectedKey] : null;

  const dayClassNames = (day: Date) => {
    const key = day.toISOString().split("T")[0];
    const data = transactionsByDay[key];
    if (!data) return "";
    const net = data.income - data.expense;
    return net >= 0 ? "has-income" : "has-expense";
  };

  return (
    <div className="space-y-4">
      <style>{`
        .has-income { background-color: rgb(240 253 244); border-radius: 4px; }
        .has-expense { background-color: rgb(254 242 242); border-radius: 4px; }
        .dark .has-income { background-color: rgb(20 83 45 / 0.3); }
        .dark .has-expense { background-color: rgb(127 29 29 / 0.3); }
      `}</style>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <DayPicker
          mode="single"
          selected={selectedDay}
          onSelect={setSelectedDay}
          defaultMonth={defaultMonth}
          onMonthChange={handleMonthChange}
          modifiers={{
            hasData: Object.keys(transactionsByDay).map((k) => new Date(k)),
          }}
          modifiersClassNames={{ hasData: "" }}
          components={{
            DayButton: ({ day, ...props }) => {
              const key = day.date.toISOString().split("T")[0];
              const data = transactionsByDay[key];
              const cn = dayClassNames(day.date);
              return (
                <button {...props} className={`${props.className ?? ""} ${cn}`}>
                  <span>{day.date.getDate()}</span>
                  {data && (
                    <span className="block text-[9px] leading-none mt-0.5 font-medium">
                      {data.count}
                    </span>
                  )}
                </button>
              );
            },
          }}
        />

        {selectedDay && selectedData ? (
          <Card className="flex-1 max-w-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">
                {selectedDay.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("income")}</span>
                <span className="text-emerald-600 font-medium">
                  {fmt(selectedData.income)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("expenses")}</span>
                <span className="text-red-600 font-medium">
                  {fmt(selectedData.expense)}
                </span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-medium">{t("net")}</span>
                <span
                  className={
                    selectedData.income - selectedData.expense >= 0
                      ? "text-emerald-600 font-semibold"
                      : "text-red-600 font-semibold"
                  }
                >
                  {fmt(selectedData.income - selectedData.expense)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {selectedData.count === 1
                  ? t("transactionCount", { count: selectedData.count })
                  : t("transactionsCount", { count: selectedData.count })}
              </p>
            </CardContent>
          </Card>
        ) : selectedDay ? (
          <Card className="flex-1 max-w-sm">
            <CardContent className="py-6 text-center text-sm text-muted-foreground">
              {t("noTransactions")}
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
};
