"use client";

import { useState } from "react";
import { BudgetWithSpend } from "@/app/actions/budgets";
import { BudgetCard } from "./budget-card";
import { BudgetForm } from "./budget-form";
import { PieChart } from "lucide-react";
import { useTranslations } from "next-intl";

type Props = {
  budgets: BudgetWithSpend[];
};

export const BudgetList = ({ budgets }: Props) => {
  const t = useTranslations("budget");
  const [editBudget, setEditBudget] = useState<BudgetWithSpend | null>(null);

  if (budgets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center rounded-lg border border-dashed">
        <PieChart className="size-10 text-muted-foreground/40" />
        <div>
          <p className="text-sm font-medium">{t("noBudgetsYet")}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {t("noBudgetsYetDescription")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2">
        {budgets.map((b) => (
          <BudgetCard key={b.id} budget={b} onEdit={setEditBudget} />
        ))}
      </div>

      <BudgetForm
        open={!!editBudget}
        onOpenChange={(open) => !open && setEditBudget(null)}
        editBudget={editBudget}
      />
    </>
  );
};
