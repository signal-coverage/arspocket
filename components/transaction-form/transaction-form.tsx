"use client";

import { useState } from "react";
import { z } from "zod";

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
  amount: z.coerce.number().positive("Must be greater than zero"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  date: z.string().min(1, "Date is required"),
});

export type TransactionFormValues = z.infer<typeof transactionSchema>;

interface TransactionFormProps {
  type: "income" | "outcome";
  onSubmit: (data: TransactionFormValues) => void | Promise<void>;
}

export const TransactionForm = ({ type, onSubmit }: TransactionFormProps) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = transactionSchema.safeParse(values);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof TransactionFormValues, string>> =
        {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof TransactionFormValues;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
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
          <FieldLabel htmlFor="amount">Amount</FieldLabel>
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
          <FieldLabel htmlFor="description">Description</FieldLabel>
          <Input
            id="description"
            type="text"
            placeholder="What was this for?"
            value={values.description}
            onChange={(e) =>
              setValues((v) => ({ ...v, description: e.target.value }))
            }
            aria-invalid={!!errors.description}
          />
          {errors.description && <FieldError>{errors.description}</FieldError>}
        </Field>

        <Field>
          <FieldLabel>Category</FieldLabel>
          <Select
            value={values.category}
            onValueChange={(val) => setValues((v) => ({ ...v, category: val }))}
          >
            <SelectTrigger className="w-full" aria-invalid={!!errors.category}>
              <SelectValue placeholder="Select a category" />
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
          <FieldLabel htmlFor="date">Date</FieldLabel>
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
          Add {type === "income" ? "Income" : "Expense"}
        </Button>
      </FieldGroup>
    </form>
  );
};
