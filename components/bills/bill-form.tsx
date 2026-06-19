"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
import { createBill } from "@/app/actions/bills";
import { useTranslations } from "next-intl";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const BillForm = ({ open, onOpenChange }: Props) => {
  const t = useTranslations("bills");
  const tc = useTranslations("common");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [isRecurring, setIsRecurring] = useState(true);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const amount = parseFloat(formData.get("amount") as string);
    const dueDay = parseInt(formData.get("dueDay") as string, 10);
    const category = formData.get("category") as string;
    const frequency = (formData.get("frequency") as string) || "MONTHLY";
    const notes = formData.get("notes") as string;

    if (!name || isNaN(amount) || amount <= 0 || !dueDay || !category) {
      setError(t("errorRequiredFields"));
      return;
    }

    if (dueDay < 1 || dueDay > 31) {
      setError(t("errorDueDay"));
      return;
    }

    startTransition(async () => {
      try {
        await createBill({
          name,
          amount,
          dueDay,
          category,
          isRecurring,
          frequency,
          notes: notes || undefined,
        });
        onOpenChange(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : t("errorSomethingWrong"));
      }
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{t("newBill")}</SheetTitle>
          <SheetDescription>{t("newBillDescription")}</SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">{t("billName")}</Label>
            <Input id="name" name="name" placeholder="Netflix" required />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="amount">{tc("amount")}</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="2500"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="dueDay">{t("dueDay")}</Label>
            <Input
              id="dueDay"
              name="dueDay"
              type="number"
              min="1"
              max="31"
              placeholder="15"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>{tc("category")}</Label>
            <Select name="category">
              <SelectTrigger>
                <SelectValue placeholder={t("selectCategory")} />
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

          <div className="flex items-center gap-2">
            <Checkbox
              id="isRecurring"
              checked={isRecurring}
              onCheckedChange={(v) => setIsRecurring(Boolean(v))}
            />
            <Label htmlFor="isRecurring">{t("recurring")}</Label>
          </div>

          {isRecurring && (
            <div className="flex flex-col gap-1.5">
              <Label>{t("frequency")}</Label>
              <Select name="frequency" defaultValue="MONTHLY">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WEEKLY">{t("weekly")}</SelectItem>
                  <SelectItem value="BIWEEKLY">{t("biweekly")}</SelectItem>
                  <SelectItem value="MONTHLY">{t("monthly")}</SelectItem>
                  <SelectItem value="YEARLY">{t("yearly")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="notes">{t("notesOptional")}</Label>
            <Input
              id="notes"
              name="notes"
              placeholder={t("optionalNotesPlaceholder")}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" disabled={isPending} className="mt-2">
            {isPending ? t("creating") : t("createBill")}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
};
