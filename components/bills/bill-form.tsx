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

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const BillForm = ({ open, onOpenChange }: Props) => {
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
      setError("Please fill in all required fields.");
      return;
    }

    if (dueDay < 1 || dueDay > 31) {
      setError("Due day must be between 1 and 31.");
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
        setError(err instanceof Error ? err.message : "Something went wrong");
      }
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>New Bill</SheetTitle>
          <SheetDescription>
            Add a recurring or one-time bill to your calendar.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Bill Name</Label>
            <Input id="name" name="name" placeholder="Netflix" required />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="amount">Amount</Label>
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
            <Label htmlFor="dueDay">Due Day (1–31)</Label>
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
            <Label>Category</Label>
            <Select name="category">
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
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
            <Label htmlFor="isRecurring">Recurring</Label>
          </div>

          {isRecurring && (
            <div className="flex flex-col gap-1.5">
              <Label>Frequency</Label>
              <Select name="frequency" defaultValue="MONTHLY">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WEEKLY">Weekly</SelectItem>
                  <SelectItem value="BIWEEKLY">Biweekly</SelectItem>
                  <SelectItem value="MONTHLY">Monthly</SelectItem>
                  <SelectItem value="YEARLY">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Input id="notes" name="notes" placeholder="Optional notes" />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" disabled={isPending} className="mt-2">
            {isPending ? "Creating..." : "Create Bill"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
};
