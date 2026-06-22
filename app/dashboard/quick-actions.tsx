"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui";
import { IncomeFormWrapper } from "./income/income-form-wrapper";
import { OutcomeFormWrapper } from "./outcome/outcome-form-wrapper";
import { SavingsFormWrapper } from "./savings/savings-form-wrapper";

type ModalType = "income" | "outcome" | "savings" | null;

export const QuickActions = () => {
  const t = useTranslations("quickActions");
  const [open, setOpen] = useState<ModalType>(null);

  return (
    <>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <Button size="lg" onClick={() => setOpen("income")}>
          {t("addIncome")}
        </Button>
        <Button size="lg" onClick={() => setOpen("outcome")}>
          {t("addExpense")}
        </Button>
        <Button size="lg" onClick={() => setOpen("savings")}>
          {t("newGoal")}
        </Button>
      </div>

      <Dialog
        open={open === "income"}
        onOpenChange={(o) => !o && setOpen(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t("addIncomeTitle")}</DialogTitle>
          </DialogHeader>
          <IncomeFormWrapper onSuccess={() => setOpen(null)} />
        </DialogContent>
      </Dialog>

      <Dialog
        open={open === "outcome"}
        onOpenChange={(o) => !o && setOpen(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t("addExpenseTitle")}</DialogTitle>
          </DialogHeader>
          <OutcomeFormWrapper onSuccess={() => setOpen(null)} />
        </DialogContent>
      </Dialog>

      <Dialog
        open={open === "savings"}
        onOpenChange={(o) => !o && setOpen(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t("newSavingsGoalTitle")}</DialogTitle>
          </DialogHeader>
          <SavingsFormWrapper onSuccess={() => setOpen(null)} />
        </DialogContent>
      </Dialog>
    </>
  );
};
