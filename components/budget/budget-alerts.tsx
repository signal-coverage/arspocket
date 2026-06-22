"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import type { BudgetWithSpend } from "@/app/actions/budgets";

interface BudgetAlertsProps {
  budgets: BudgetWithSpend[];
}

export const BudgetAlerts = ({ budgets }: BudgetAlertsProps) => {
  useEffect(() => {
    for (const budget of budgets) {
      if (budget.pct >= 100) {
        toast.error(
          `Budget exceeded: "${budget.category}" is at ${budget.pct}% (${budget.period.toLowerCase()})`,
        );
      } else if (budget.pct >= 80) {
        toast.warning(
          `Budget warning: "${budget.category}" is at ${budget.pct}% (${budget.period.toLowerCase()})`,
        );
      }
    }
  }, [budgets]);

  return null;
};
