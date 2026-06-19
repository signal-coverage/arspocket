"use client";

import { toast } from "sonner";
import { useTranslations } from "next-intl";

import { createSavingsGoal } from "@/app/actions/savings";
import { SavingsForm, type SavingsFormValues } from "@/components/savings-form";

interface SavingsFormWrapperProps {
  onSuccess?: () => void;
}

export const SavingsFormWrapper = ({ onSuccess }: SavingsFormWrapperProps) => {
  const t = useTranslations("savings");

  const handleSubmit = async (data: SavingsFormValues) => {
    await createSavingsGoal(data);
    toast.success(t("goalCreated"));
    onSuccess?.();
  };

  return <SavingsForm onSubmit={handleSubmit} />;
};
