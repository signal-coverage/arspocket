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
import { getMergedCategories } from "@/lib/categories";
import {
  createBudget,
  updateBudget,
  BudgetWithSpend,
} from "@/app/actions/budgets";
import { useTranslations } from "next-intl";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editBudget?: BudgetWithSpend | null;
  userCategories?: Array<{ name: string }>;
};

export const BudgetForm = ({ open, onOpenChange, editBudget, userCategories = [] }: Props) => {
  const t = useTranslations("budget");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [category, setCategory] = useState(editBudget?.category ?? "");
  const [amount, setAmount] = useState(editBudget?.amount.toString() ?? "");
  const [period, setPeriod] = useState<"WEEKLY" | "MONTHLY" | "YEARLY">(
    (editBudget?.period as "WEEKLY" | "MONTHLY" | "YEARLY") ?? "MONTHLY",
  );
  const [startDate, setStartDate] = useState(
    editBudget?.startDate
      ? new Date(editBudget.startDate).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const amountNum = parseFloat(amount);
    if (!category || isNaN(amountNum) || amountNum <= 0) {
      setError(t("errorRequiredFields"));
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
          await createBudget({
            category,
            amount: amountNum,
            period,
            startDate,
          });
        }
        onOpenChange(false);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : t("errorRequiredFields");
        if (message.includes("Unique constraint")) {
          setError(t("errorDuplicateBudget"));
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
          <SheetTitle>
            {editBudget ? t("editBudget") : t("newBudget")}
          </SheetTitle>
          <SheetDescription>
            {editBudget
              ? t("editBudgetDescription")
              : t("newBudgetDescription")}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          {!editBudget && (
            <div className="flex flex-col gap-1.5">
              <Label>{t("category")}</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder={t("selectCategory")} />
                </SelectTrigger>
                <SelectContent>
                  {getMergedCategories("outcome", userCategories).map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="amount">{t("limit")}</Label>
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
              <Label>{t("period")}</Label>
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
                  <SelectItem value="WEEKLY">{t("weekly")}</SelectItem>
                  <SelectItem value="MONTHLY">{t("monthly")}</SelectItem>
                  <SelectItem value="YEARLY">{t("yearly")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="startDate">{t("startDate")}</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" disabled={isPending} className="mt-2">
            {isPending
              ? t("saving")
              : editBudget
                ? t("updateBudget")
                : t("createBudget")}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
};
