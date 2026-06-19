"use client";

import { useState } from "react";
import { z } from "zod";
import { useTranslations } from "next-intl";

import {
  Button,
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  Input,
} from "@/components/ui";

const savingsSchema = z.object({
  amount: z.coerce.number().positive("mustBePositive"),
  goalName: z.string().min(1, "goalNameRequired"),
  description: z.string().optional(),
  date: z.string().min(1, "dateRequired"),
});

export type SavingsFormValues = z.infer<typeof savingsSchema>;

interface SavingsFormProps {
  onSubmit: (data: SavingsFormValues) => void | Promise<void>;
}

export const SavingsForm = ({ onSubmit }: SavingsFormProps) => {
  const t = useTranslations("savings");
  const tCommon = useTranslations("common");

  const today = new Date().toISOString().split("T")[0];

  const [values, setValues] = useState({
    amount: "",
    goalName: "",
    description: "",
    date: today,
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof SavingsFormValues, string>>
  >({});

  const resolveError = (code: string): string => {
    if (code === "mustBePositive") return tCommon("mustBePositive");
    if (code === "goalNameRequired") return t("goalNameRequired");
    if (code === "dateRequired") return tCommon("dateRequired");
    return code;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = savingsSchema.safeParse(values);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof SavingsFormValues, string>> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof SavingsFormValues;
        if (!fieldErrors[field])
          fieldErrors[field] = resolveError(issue.message);
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    await onSubmit(result.data);
    setValues({ amount: "", goalName: "", description: "", date: today });
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="amount">{tCommon("amount")}</FieldLabel>
          <Input
            id="amount"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={values.amount}
            onChange={(e) =>
              setValues((v) => ({ ...v, amount: e.target.value }))
            }
            aria-invalid={!!errors.amount}
          />
          {errors.amount && <FieldError>{errors.amount}</FieldError>}
        </Field>

        <Field>
          <FieldLabel htmlFor="goalName">{t("goalLabel")}</FieldLabel>
          <Input
            id="goalName"
            type="text"
            placeholder={t("savingFor")}
            value={values.goalName}
            onChange={(e) =>
              setValues((v) => ({ ...v, goalName: e.target.value }))
            }
            aria-invalid={!!errors.goalName}
          />
          {errors.goalName && <FieldError>{errors.goalName}</FieldError>}
        </Field>

        <Field>
          <FieldLabel htmlFor="description">{t("notesOptional")}</FieldLabel>
          <Input
            id="description"
            type="text"
            placeholder={t("additionalDetails")}
            value={values.description}
            onChange={(e) =>
              setValues((v) => ({ ...v, description: e.target.value }))
            }
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="date">{tCommon("date")}</FieldLabel>
          <Input
            id="date"
            type="date"
            value={values.date}
            onChange={(e) => setValues((v) => ({ ...v, date: e.target.value }))}
            aria-invalid={!!errors.date}
          />
          {errors.date && <FieldError>{errors.date}</FieldError>}
        </Field>

        <Button type="submit" className="w-full mt-2">
          {t("addSavingsBtn")}
        </Button>
      </FieldGroup>
    </form>
  );
};
