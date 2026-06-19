"use client";

import { toast } from "sonner";
import { useTranslations } from "next-intl";

import { createTransaction } from "@/app/actions/transactions";
import {
  TransactionForm,
  type TransactionFormValues,
} from "@/components/transaction-form";

interface IncomeFormWrapperProps {
  onSuccess?: () => void;
}

export const IncomeFormWrapper = ({ onSuccess }: IncomeFormWrapperProps) => {
  const t = useTranslations("income");

  const handleSubmit = async (data: TransactionFormValues) => {
    await createTransaction({ ...data, type: "income" });
    toast.success(t("addedSuccessfully"));
    onSuccess?.();
  };

  return <TransactionForm type="income" onSubmit={handleSubmit} />;
};
