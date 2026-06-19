"use client";

import { toast } from "sonner";
import { useTranslations } from "next-intl";

import { createTransaction } from "@/app/actions/transactions";
import {
  TransactionForm,
  type TransactionFormValues,
} from "@/components/transaction-form";

interface OutcomeFormWrapperProps {
  onSuccess?: () => void;
}

export const OutcomeFormWrapper = ({ onSuccess }: OutcomeFormWrapperProps) => {
  const t = useTranslations("outcome");

  const handleSubmit = async (data: TransactionFormValues) => {
    await createTransaction({ ...data, type: "outcome" });
    toast.success(t("addedSuccessfully"));
    onSuccess?.();
  };

  return <TransactionForm type="outcome" onSubmit={handleSubmit} />;
};
