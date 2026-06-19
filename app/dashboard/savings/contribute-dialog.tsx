"use client";

import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { toast } from "sonner";

import { contributeSavingsGoal } from "@/app/actions/savings";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Field,
  FieldLabel,
  FieldError,
} from "@/components/ui";

interface ContributeDialogProps {
  goalId: string;
  goalName: string;
  remaining: number;
}

export const ContributeDialog = ({
  goalId,
  goalName,
  remaining,
}: ContributeDialogProps) => {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(amount);
    if (!parsed || parsed <= 0) {
      setError("Enter a valid amount");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await contributeSavingsGoal(goalId, parsed);
      toast.success(`Added $${parsed.toFixed(2)} to "${goalName}"`);
      setAmount("");
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="size-7 shrink-0"
          aria-label="Add funds"
        >
          <PlusIcon className="size-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Add funds to &quot;{goalName}&quot;</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
          <Field>
            <FieldLabel htmlFor="contrib-amount">Amount</FieldLabel>
            <Input
              id="contrib-amount"
              type="number"
              min="0.01"
              step="0.01"
              placeholder={`Up to $${remaining.toFixed(2)} remaining`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              autoFocus
            />
            {error && <FieldError>{error}</FieldError>}
          </Field>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Saving..." : "Add funds"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
