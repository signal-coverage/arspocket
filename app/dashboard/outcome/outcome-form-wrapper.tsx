"use client";

import { toast } from "sonner";

import { createTransaction } from "@/app/actions/transactions";
import {
  TransactionForm,
  type TransactionFormValues,
} from "@/components/transaction-form";

interface OutcomeFormWrapperProps {
  onSuccess?: () => void;
}

export const OutcomeFormWrapper = ({ onSuccess }: OutcomeFormWrapperProps) => {
  const handleSubmit = async (data: TransactionFormValues) => {
    await createTransaction({ ...data, type: "outcome" });
    toast.success("Expense added successfully");
    onSuccess?.();
  };

  return <TransactionForm type="outcome" onSubmit={handleSubmit} />;
};
