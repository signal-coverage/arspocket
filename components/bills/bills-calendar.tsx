"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { DayPicker } from "react-day-picker";
import { es } from "date-fns/locale";
import { SerializedBill } from "@/app/actions/bills";
import { BillDayPopover } from "./bill-day-popover";
import { formatCurrency } from "@/lib/format";

type Props = {
  bills: SerializedBill[];
};

const clampDay = (dueDay: number, year: number, month: number): number => {
  const maxDay = new Date(year, month + 1, 0).getDate();
  return Math.min(dueDay, maxDay);
};

export const BillsCalendar = ({ bills }: Props) => {
  const t = useTranslations("bills");
  const [month, setMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const year = month.getFullYear();
  const monthIndex = month.getMonth();

  // Map bills to their effective day in the current month
  const billsByDay = new Map<number, SerializedBill[]>();
  for (const bill of bills) {
    const effectiveDay = clampDay(bill.dueDay, year, monthIndex);
    const existing = billsByDay.get(effectiveDay) ?? [];
    billsByDay.set(effectiveDay, [...existing, bill]);
  }

  // Build Date objects for modifier matching
  const paidDays: Date[] = [];
  const unpaidDays: Date[] = [];

  for (const [day, dayBills] of billsByDay.entries()) {
    const date = new Date(year, monthIndex, day);
    const hasUnpaid = dayBills.some((b) => !b.isPaid);
    const hasPaid = dayBills.some((b) => b.isPaid);
    if (hasUnpaid) unpaidDays.push(date);
    else if (hasPaid) paidDays.push(date);
  }

  const selectedBills = selectedDay
    ? (billsByDay.get(clampDay(selectedDay.getDate(), year, monthIndex)) ?? [])
    : [];

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1">
        <DayPicker
          mode="single"
          locale={es}
          month={month}
          onMonthChange={setMonth}
          selected={selectedDay ?? undefined}
          onSelect={(d) => setSelectedDay(d ?? null)}
          modifiers={{
            hasPaidBills: paidDays,
            hasUnpaidBills: unpaidDays,
          }}
          modifiersClassNames={{
            hasPaidBills: "rdp-day--paid",
            hasUnpaidBills: "rdp-day--unpaid",
          }}
          components={{
            DayButton: ({ day, modifiers, className, ...props }) => {
              const effectiveDay = clampDay(
                day.date.getDate(),
                year,
                monthIndex,
              );
              const dayBills = billsByDay.get(effectiveDay) ?? [];
              const isCurrentMonth = day.date.getMonth() === monthIndex;

              return (
                <button
                  {...props}
                  className={`${className ?? ""} relative flex flex-col items-center justify-start pt-1 h-9 w-9 text-sm rounded-md hover:bg-muted transition-colors`}
                >
                  <span>{day.date.getDate()}</span>
                  {isCurrentMonth && dayBills.length > 0 && (
                    <div className="flex gap-0.5 mt-0.5">
                      {dayBills.slice(0, 3).map((b) => (
                        <span
                          key={b.id}
                          className={`size-1 rounded-full ${b.isPaid ? "bg-green-400" : "bg-red-400"}`}
                        />
                      ))}
                    </div>
                  )}
                </button>
              );
            },
          }}
        />
      </div>

      <div className="flex-1 flex flex-col gap-4">
        {selectedDay && selectedBills.length > 0 ? (
          <BillDayPopover bills={selectedBills} date={selectedDay} />
        ) : selectedDay ? (
          <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
            {t("noBillsOnDay")}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
            {t("clickDayToView")}
          </div>
        )}

        {/* Upcoming bills list */}
        <div>
          <h3 className="text-sm font-medium mb-3">{t("billsThisMonth")}</h3>
          {bills.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t("noBillsYet")}</p>
          ) : (
            <ul className="divide-y">
              {bills
                .slice()
                .sort((a, b) => a.dueDay - b.dueDay)
                .map((bill) => (
                  <li
                    key={bill.id}
                    className="flex items-center justify-between py-2.5"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{bill.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {t("dueDayCalendar", { day: clampDay(bill.dueDay, year, monthIndex) })} ·{" "}
                        {bill.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {formatCurrency(bill.amount)}
                      </span>
                      {bill.isPaid ? (
                        <span className="text-xs text-green-600 font-medium">
                          {t("paid")}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          {t("unpaid")}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
