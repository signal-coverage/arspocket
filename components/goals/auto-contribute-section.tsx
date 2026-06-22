"use client";

import { useState } from "react";
import { Link2Off, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createTransaction, unlinkGoalTransaction } from "@/app/actions/transactions";

type LinkedTransaction = {
  id: string;
  description: string;
  amount: number;
  recurringFrequency: string | null;
};

type Props = {
  goalId: string;
  linkedTransactions: LinkedTransaction[];
};

export const AutoContributeSection = ({ goalId, linkedTransactions }: Props) => {
  const [pending, setPending] = useState(false);
  const [unlinkingId, setUnlinkingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [frequency, setFrequency] = useState("MONTHLY");

  const handleLink = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const description = fd.get("description") as string;
    const amount = parseFloat(fd.get("amount") as string);
    const today = new Date().toISOString().split("T")[0];

    try {
      await createTransaction({
        type: "outcome",
        amount,
        description,
        category: "Savings",
        date: today,
        isRecurring: true,
        recurringFrequency: frequency,
        linkedGoalId: goalId,
      });
      (e.target as HTMLFormElement).reset();
      setFrequency("MONTHLY");
    } catch {
      setError("Failed to link transaction. Please try again.");
    } finally {
      setPending(false);
    }
  };

  const handleUnlink = async (transactionId: string) => {
    setUnlinkingId(transactionId);
    try {
      await unlinkGoalTransaction(transactionId);
    } finally {
      setUnlinkingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold">Auto-Contribute</h3>
      <p className="text-xs text-muted-foreground">
        Link a recurring transaction to automatically contribute to this goal.
      </p>

      {/* Existing linked transactions */}
      {linkedTransactions.length > 0 && (
        <ul className="divide-y text-sm">
          {linkedTransactions.map((tx) => (
            <li key={tx.id} className="flex items-center justify-between py-2 gap-2">
              <div className="min-w-0">
                <p className="font-medium truncate">{tx.description}</p>
                <p className="text-xs text-muted-foreground">
                  {new Intl.NumberFormat("es-AR", {
                    style: "currency",
                    currency: "ARS",
                    maximumFractionDigits: 0,
                  }).format(tx.amount)}
                  {tx.recurringFrequency ? ` · ${tx.recurringFrequency.toLowerCase()}` : ""}
                </p>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="size-7 text-muted-foreground hover:text-destructive shrink-0"
                disabled={unlinkingId === tx.id}
                onClick={() => handleUnlink(tx.id)}
                title="Unlink transaction"
              >
                <Link2Off className="size-3.5" />
              </Button>
            </li>
          ))}
        </ul>
      )}

      {/* Link new recurring transaction form */}
      <form onSubmit={handleLink} className="space-y-3 rounded-md border p-3">
        <p className="text-xs font-medium text-muted-foreground">
          Link new recurring transaction
        </p>
        <div>
          <Label htmlFor="ac-description" className="text-xs">Label</Label>
          <Input
            id="ac-description"
            name="description"
            placeholder="Monthly savings contribution"
            required
            className="h-8 text-sm"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="ac-amount" className="text-xs">Amount (ARS)</Label>
            <Input
              id="ac-amount"
              name="amount"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="5000"
              required
              className="h-8 text-sm"
            />
          </div>
          <div>
            <Label htmlFor="ac-frequency" className="text-xs">Frequency</Label>
            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger id="ac-frequency" className="h-8 text-sm">
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
        </div>
        {error && <p className="text-xs text-destructive">{error}</p>}
        <Button
          type="submit"
          size="sm"
          disabled={pending}
          className="w-full"
        >
          <Plus className="size-3.5 mr-1" />
          {pending ? "Linking..." : "Link recurring transaction"}
        </Button>
      </form>
    </div>
  );
};
