"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  action: (formData: FormData) => void | Promise<void | { error?: string }>;
  defaultValues?: {
    name?: string;
    targetAmount?: string;
    currency?: string;
    deadline?: string;
    description?: string;
  };
  submitLabel?: string;
  onDone?: () => void;
};

export const GoalForm = ({
  action,
  defaultValues,
  submitLabel = "Create Goal",
  onDone,
}: Props) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    setPending(true);
    setError(null);
    const fd = new FormData(formRef.current);
    const result = await action(fd);
    setPending(false);
    if (result && "error" in result && result.error) {
      setError(result.error);
    } else {
      formRef.current.reset();
      onDone?.();
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Goal Name</Label>
        <Input
          id="name"
          name="name"
          defaultValue={defaultValues?.name}
          placeholder="Emergency Fund"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="targetAmount">Target Amount</Label>
          <Input
            id="targetAmount"
            name="targetAmount"
            type="number"
            min="0.01"
            step="0.01"
            defaultValue={defaultValues?.targetAmount}
            placeholder="100000"
            required
          />
        </div>
        <div>
          <Label htmlFor="currency">Currency</Label>
          <Select
            name="currency"
            defaultValue={defaultValues?.currency ?? "ARS"}
          >
            <SelectTrigger id="currency">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ARS">ARS</SelectItem>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="USDC">USDC</SelectItem>
              <SelectItem value="EUR">EUR</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label htmlFor="deadline">Deadline (optional)</Label>
        <Input
          id="deadline"
          name="deadline"
          type="date"
          defaultValue={defaultValues?.deadline}
        />
      </div>
      <div>
        <Label htmlFor="description">Description (optional)</Label>
        <Input
          id="description"
          name="description"
          defaultValue={defaultValues?.description}
          placeholder="Why this goal matters"
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
};
