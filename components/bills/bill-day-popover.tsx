"use client";

import { useTransition } from "react";
import { SerializedBill } from "@/app/actions/bills";
import { markBillAsPaid, unmarkBillAsPaid } from "@/app/actions/bills";
import { formatCurrency } from "@/lib/format";
import { formatDateDisplay } from "@/lib/dates";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle } from "lucide-react";
import { useTranslations } from "next-intl";

type Props = {
  bills: SerializedBill[];
  date: Date;
};

export const BillDayPopover = ({ bills, date }: Props) => {
  const t = useTranslations("bills");

  return (
    <div className="rounded-lg border p-4 flex flex-col gap-3">
      <h3 className="text-sm font-medium">
        {t("billsFor", { date: formatDateDisplay(date, "MMMM d") })}
      </h3>
      <ul className="flex flex-col gap-2">
        {bills.map((bill) => (
          <BillDayItem key={bill.id} bill={bill} />
        ))}
      </ul>
    </div>
  );
};

const BillDayItem = ({ bill }: { bill: SerializedBill }) => {
  const t = useTranslations("bills");
  const [isPending, startTransition] = useTransition();

  const handleTogglePaid = () => {
    startTransition(async () => {
      if (bill.isPaid) {
        await unmarkBillAsPaid(bill.id);
      } else {
        await markBillAsPaid(bill.id);
      }
    });
  };

  return (
    <li className="flex items-center gap-3 rounded-md border p-3">
      <button
        onClick={handleTogglePaid}
        disabled={isPending}
        className="shrink-0 text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
        aria-label={bill.isPaid ? t("markAsUnpaid") : t("markAsPaid")}
      >
        {bill.isPaid ? (
          <CheckCircle2 className="size-5 text-green-500" />
        ) : (
          <Circle className="size-5" />
        )}
      </button>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{bill.name}</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <Badge variant="secondary" className="text-xs">
            {bill.category}
          </Badge>
        </div>
      </div>
      <span className="text-sm font-semibold shrink-0">
        {formatCurrency(bill.amount)}
      </span>
    </li>
  );
};
