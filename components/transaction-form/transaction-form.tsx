"use client";

import { useState } from "react";
import { z } from "zod";
import { useTranslations } from "next-intl";

import {
  Button,
  Field,
  FieldError,
  FieldGroup,
  Input,
  FieldLabel,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";

const INCOME_CATEGORIES = [
  "Salary",
  "Freelance",
  "Investment",
  "Gift",
  "Other",
] as const;
const OUTCOME_CATEGORIES = [
  "Food",
  "Transport",
  "Housing",
  "Entertainment",
  "Health",
  "Education",
  "Other",
] as const;

const transactionSchema = z.object({
  amount: z.coerce.number().positive("mustBePositive"),
  description: z.string().min(1, "descriptionRequired"),
  category: z.string().min(1, "categoryRequired"),
  date: z.string().min(1, "dateRequired"),
});

export type TransactionFormValues = z.infer<typeof transactionSchema>;

interface TransactionFormProps {
  type: "income" | "outcome";
  onSubmit: (data: TransactionFormValues) => void | Promise<void>;
}

export const TransactionForm = ({ type, onSubmit }: TransactionFormProps) => {
  const tCommon = useTranslations("common");
  const tForm = useTranslations("transactionForm");

  const categories = type === "income" ? INCOME_CATEGORIES : OUTCOME_CATEGORIES;
  const today = new Date().toISOString().split("T")[0];

  const [values, setValues] = useState({
    amount: "",
    description: "",
    category: "",
    date: today,
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof TransactionFormValues, string>>
  >({});

  const resolveError = (code: string): string => {
    if (code === "mustBePositive") return tCommon("mustBePositive");
    if (code === "descriptionRequired") return tCommon("descriptionRequired");
    if (code === "categoryRequired") return tCommon("categoryRequired");
    if (code === "dateRequired") return tCommon("dateRequired");
    return code;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = transactionSchema.safeParse(values);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof TransactionFormValues, string>> =
        {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof TransactionFormValues;
        if (!fieldErrors[field])
          fieldErrors[field] = resolveError(issue.message);
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    await onSubmit(result.data);
    setValues({ amount: "", description: "", category: "", date: today });
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
            placeholder={tForm("amountPlaceholder")}
            value={values.amount}
            onChange={(e) =>
              setValues((v) => ({ ...v, amount: e.target.value }))
            }
            aria-invalid={!!errors.amount}
          />
          {errors.amount && <FieldError>{errors.amount}</FieldError>}
        </Field>

        <Field>
          <FieldLabel htmlFor="description">
            {tCommon("description")}
          </FieldLabel>
          <Input
            id="description"
            type="text"
            placeholder={tForm("descriptionPlaceholder")}
            value={values.description}
            onChange={(e) =>
              setValues((v) => ({ ...v, description: e.target.value }))
            }
            aria-invalid={!!errors.description}
          />
          {errors.description && <FieldError>{errors.description}</FieldError>}
        </Field>

        <Field>
          <FieldLabel>{tCommon("category")}</FieldLabel>
          <Select
            value={values.category}
            onValueChange={(val) => setValues((v) => ({ ...v, category: val }))}
          >
            <SelectTrigger className="w-full" aria-invalid={!!errors.category}>
              <SelectValue placeholder={tCommon("selectCategory")} />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && <FieldError>{errors.category}</FieldError>}
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
          {type === "income" ? tForm("addIncome") : tForm("addExpense")}
        </Button>
      </FieldGroup>
    </form>
  );
};
