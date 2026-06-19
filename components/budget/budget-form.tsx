"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EXPENSE_CATEGORIES } from "@/lib/categories";
import { createBudget, updateBudget, BudgetWithSpend } from "@/app/actions/budgets";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editBudget?: BudgetWithSpend | null;
};

export const BudgetForm = ({ open, onOpenChange, editBudget }: Props) => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [category, setCategory] = useState(editBudget?.category ?? "");
  const [amount, setAmount] = useState(editBudget?.amount.toString() ?? "");
  const [period, setPeriod] = useState<"WEEKLY" | "MONTHLY" | "YEARLY">(
    (editBudget?.period as "WEEKLY" | "MONTHLY" | "YEARLY") ?? "MONTHLY"
  );
  const [startDate, setStartDate] = useState(
    editBudget?.startDate
      ? new Date(editBudget.startDate).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const amountNum = parseFloat(amount);
    if (!category || isNaN(amountNum) || amountNum <= 0) {
      setError("Please fill in all required fields with valid values.");
      return;
    }

    startTransition(async () => {
      try {
        if (editBudget) {
          await updateBudget(editBudget.id, {
            amount: amountNum,
            startDate,
          });
        } else {
          await createBudget({ category, amount: amountNum, period, startDate });
        }
        onOpenChange(false);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Something went wrong";
        if (message.includes("Unique constraint")) {
          setError(
            "A budget for this category and period already exists. Delete the existing one first."
          );
        } else {
          setError(message);
        }
      }
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{editBudget ? "Edit Budget" : "New Budget"}</SheetTitle>
          <SheetDescription>
            {editBudget
              ? "Update your budget amount or start date."
              : "Set a spending limit for a category and period."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          {!editBudget && (
            <div className="flex flex-col gap-1.5">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {EXPENSE_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="50000"
            />
          </div>

          {!editBudget && (
            <div className="flex flex-col gap-1.5">
              <Label>Period</Label>
              <Select
                value={period}
                onValueChange={(v) =>
                  setPeriod(v as "WEEKLY" | "MONTHLY" | "YEARLY")
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WEEKLY">Weekly</SelectItem>
                  <SelectItem value="MONTHLY">Monthly</SelectItem>
                  <SelectItem value="YEARLY">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <Button type="submit" disabled={isPending} className="mt-2">
            {isPending
              ? "Saving..."
              : editBudget
              ? "Update Budget"
              : "Create Budget"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
};
