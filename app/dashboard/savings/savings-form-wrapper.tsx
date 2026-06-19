"use client";

import { toast } from "sonner";

import { createSavingsGoal } from "@/app/actions/savings";
import { SavingsForm, type SavingsFormValues } from "@/components/savings-form";

interface SavingsFormWrapperProps {
  onSuccess?: () => void;
}

export const SavingsFormWrapper = ({ onSuccess }: SavingsFormWrapperProps) => {
  const handleSubmit = async (data: SavingsFormValues) => {
    await createSavingsGoal(data);
    toast.success("Savings goal created");
    onSuccess?.();
  };

  return <SavingsForm onSubmit={handleSubmit} />;
};
