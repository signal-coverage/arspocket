"use client";

import { toast } from "sonner";

import { createTransaction } from "@/app/actions/transactions";
import {
  TransactionForm,
  type TransactionFormValues,
} from "@/components/transaction-form";

interface IncomeFormWrapperProps {
  onSuccess?: () => void;
}

export const IncomeFormWrapper = ({ onSuccess }: IncomeFormWrapperProps) => {
  const handleSubmit = async (data: TransactionFormValues) => {
    await createTransaction({ ...data, type: "income" });
    toast.success("Income added successfully");
    onSuccess?.();
  };

  return <TransactionForm type="income" onSubmit={handleSubmit} />;
};
