"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { BudgetForm } from "@/components/budget/budget-form";
import { useTranslations } from "next-intl";

export const BudgetPageClient = () => {
  const t = useTranslations("budget");
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} size="sm" className="gap-1.5">
        <Plus className="size-4" />
        {t("addBudget")}
      </Button>
      <BudgetForm open={open} onOpenChange={setOpen} />
    </>
  );
};
