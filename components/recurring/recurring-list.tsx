"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Repeat2, Pause, Play, Trash2, Inbox } from "lucide-react";
import { toast } from "sonner";
import { updateTransaction, deleteTransaction } from "@/app/actions/transactions";
import type { getTransactions } from "@/app/actions/transactions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { formatCurrency } from "@/lib/format";

type Transaction = Awaited<ReturnType<typeof getTransactions>>[number];

interface RecurringListProps {
  transactions: Transaction[];
}

export const RecurringList = ({ transactions }: RecurringListProps) => {
  const [optimisticStates, setOptimisticStates] = useState<
    Record<string, boolean>
  >({});

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <Inbox className="size-10 text-muted-foreground/50" />
        <div>
          <p className="text-sm font-medium">No recurring transactions</p>
          <p className="text-xs text-muted-foreground mt-1">
            Mark a transaction as recurring to see it here.
          </p>
        </div>
      </div>
    );
  }

  const handleTogglePause = async (tx: Transaction) => {
    const currentlyRecurring =
      optimisticStates[tx.id] !== undefined
        ? optimisticStates[tx.id]
        : tx.isRecurring;
    const nextState = !currentlyRecurring;

    setOptimisticStates((prev) => ({ ...prev, [tx.id]: nextState }));

    try {
      await updateTransaction(tx.id, { isRecurring: nextState });
      toast.success(
        nextState ? "Recurring transaction resumed." : "Recurring transaction paused.",
      );
    } catch {
      setOptimisticStates((prev) => ({ ...prev, [tx.id]: currentlyRecurring }));
      toast.error("Failed to update transaction.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTransaction(id);
      toast.success("Transaction deleted.");
    } catch {
      toast.error("Failed to delete transaction.");
    }
  };

  return (
    <ul className="divide-y">
      {transactions.map((tx) => {
        const isRecurring =
          optimisticStates[tx.id] !== undefined
            ? optimisticStates[tx.id]
            : tx.isRecurring;

        return (
          <li key={tx.id} className="flex items-center gap-3 py-3">
            <div className="flex items-center justify-center rounded-md bg-blue-50 dark:bg-blue-950 p-1.5 shrink-0">
              <Repeat2 className="size-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{tx.description}</p>
              <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                <Badge variant="secondary" className="text-xs">
                  {tx.category}
                </Badge>
                {tx.recurringFrequency && (
                  <Badge variant="outline" className="text-xs">
                    {tx.recurringFrequency}
                  </Badge>
                )}
                {!isRecurring && (
                  <Badge variant="outline" className="text-xs text-muted-foreground">
                    Paused
                  </Badge>
                )}
                <span className="text-xs text-muted-foreground">
                  {format(new Date(tx.date), "MMM d, yyyy")}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-sm font-semibold">
                {formatCurrency(Number(tx.amount))}
              </span>
              <Button
                size="icon"
                variant="ghost"
                className="size-7 text-muted-foreground hover:text-foreground"
                onClick={() => handleTogglePause(tx)}
                aria-label={isRecurring ? "Pause recurring" : "Resume recurring"}
              >
                {isRecurring ? (
                  <Pause className="size-3.5" />
                ) : (
                  <Play className="size-3.5" />
                )}
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-7 text-muted-foreground hover:text-destructive"
                    aria-label="Delete recurring transaction"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete recurring transaction?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete &quot;{tx.description}&quot;. Previously
                      recorded transactions are not affected. This action cannot be
                      undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete(tx.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </li>
        );
      })}
    </ul>
  );
};
