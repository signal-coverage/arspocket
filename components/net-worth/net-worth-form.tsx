"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
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
import { createSnapshot } from "@/app/actions/net-worth";

type Item = {
  name: string;
  type: "ASSET" | "LIABILITY";
  amount: string;
  currency: string;
};

const emptyItem = (): Item => ({
  name: "",
  type: "ASSET",
  amount: "",
  currency: "ARS",
});

export const NetWorthForm = ({ onDone }: { onDone?: () => void }) => {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [note, setNote] = useState("");
  const [items, setItems] = useState<Item[]>([emptyItem()]);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const updateItem = (i: number, field: keyof Item, value: string) => {
    setItems((prev) =>
      prev.map((item, idx) => (idx === i ? { ...item, [field]: value } : item))
    );
  };

  const addItem = () => setItems((prev) => [...prev, emptyItem()]);
  const removeItem = (i: number) =>
    setItems((prev) => prev.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsed = items.map((item) => ({
      ...item,
      amount: parseFloat(item.amount),
    }));

    if (parsed.some((i) => isNaN(i.amount) || i.amount <= 0 || !i.name)) {
      setError("All items need a name and a positive amount.");
      return;
    }

    setPending(true);
    const fd = new FormData();
    fd.set("date", date);
    fd.set("note", note);
    fd.set("items", JSON.stringify(parsed));

    const result = await createSnapshot(fd);
    setPending(false);

    if (result && "error" in result) {
      setError(result.error ?? null);
    } else {
      setDate(new Date().toISOString().split("T")[0]);
      setNote("");
      setItems([emptyItem()]);
      onDone?.();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Date</Label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <Label>Note (optional)</Label>
          <Input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Monthly snapshot"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Assets &amp; Liabilities</Label>
        {items.map((item, i) => (
          <div key={i} className="flex gap-2 items-center">
            <Input
              placeholder="Name"
              value={item.name}
              onChange={(e) => updateItem(i, "name", e.target.value)}
              className="flex-1"
              required
            />
            <Select
              value={item.type}
              onValueChange={(v) => updateItem(i, "type", v)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ASSET">Asset</SelectItem>
                <SelectItem value="LIABILITY">Liability</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="0"
              min="0.01"
              step="0.01"
              value={item.amount}
              onChange={(e) => updateItem(i, "amount", e.target.value)}
              className="w-28"
              required
            />
            <Select
              value={item.currency}
              onValueChange={(v) => updateItem(i, "currency", v)}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ARS">ARS</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="USDC">USDC</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
              </SelectContent>
            </Select>
            {items.length > 1 && (
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => removeItem(i)}
                className="text-destructive hover:text-destructive shrink-0"
              >
                <Trash2 className="size-4" />
              </Button>
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addItem}
          className="gap-1"
        >
          <Plus className="size-3.5" /> Add item
        </Button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Saving..." : "Save Snapshot"}
      </Button>
    </form>
  );
};
