"use client";

import { useState } from "react";
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
  const [open, setOpen] = useState<ModalType>(null);

  return (
    <>
      <div className="flex items-center gap-2">
        <Button size="lg" variant="outline" onClick={() => setOpen("income")}>
          + Add Income
        </Button>
        <Button size="lg" variant="outline" onClick={() => setOpen("outcome")}>
          + Add Expense
        </Button>
        <Button size="lg" variant="outline" onClick={() => setOpen("savings")}>
          + New Goal
        </Button>
      </div>

      <Dialog
        open={open === "income"}
        onOpenChange={(o) => !o && setOpen(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Income</DialogTitle>
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
            <DialogTitle>Add Expense</DialogTitle>
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
            <DialogTitle>New Savings Goal</DialogTitle>
          </DialogHeader>
          <SavingsFormWrapper onSuccess={() => setOpen(null)} />
        </DialogContent>
      </Dialog>
    </>
  );
};
