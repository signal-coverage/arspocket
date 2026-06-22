"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { BudgetForm } from "@/components/budget/budget-form";
import { BudgetAlerts } from "@/components/budget/budget-alerts";
import { useTranslations } from "next-intl";
import type { BudgetWithSpend } from "@/app/actions/budgets";

interface BudgetPageClientProps {
  budgets: BudgetWithSpend[];
  userCategories?: Array<{ name: string }>;
}

export const BudgetPageClient = ({ budgets, userCategories }: BudgetPageClientProps) => {
  const t = useTranslations("budget");
  const [open, setOpen] = useState(false);

  return (
    <>
      <BudgetAlerts budgets={budgets} />
      <Button onClick={() => setOpen(true)} size="sm" className="gap-1.5">
        <Plus className="size-4" />
        {t("addBudget")}
      </Button>
      <BudgetForm open={open} onOpenChange={setOpen} userCategories={userCategories} />
    </>
  );
};
