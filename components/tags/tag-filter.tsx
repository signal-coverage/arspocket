"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { getTransactions } from "@/app/actions/transactions";

type Transaction = Awaited<ReturnType<typeof getTransactions>>[number];

interface Tag {
  id: string;
  name: string;
  color: string | null;
}

interface TagFilterProps {
  tags: Tag[];
  transactions: Transaction[];
  children: (filtered: Transaction[]) => React.ReactNode;
}

export const TagFilter = ({ tags, transactions, children }: TagFilterProps) => {
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

  if (tags.length === 0) {
    return <>{children(transactions)}</>;
  }

  const toggleTag = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId],
    );
  };

  const clearAll = () => setSelectedTagIds([]);

  const filtered =
    selectedTagIds.length === 0
      ? transactions
      : transactions.filter((tx) =>
          tx.tags.some((tt) => selectedTagIds.includes(tt.tagId)),
        );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-1.5">
        {tags.map((tag) => {
          const isSelected = selectedTagIds.includes(tag.id);
          return (
            <button
              key={tag.id}
              onClick={() => toggleTag(tag.id)}
              aria-pressed={isSelected}
              aria-label={`Filter by tag: ${tag.name}`}
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 rounded-full"
            >
              <Badge
                variant={isSelected ? "default" : "outline"}
                style={
                  tag.color && isSelected
                    ? { backgroundColor: tag.color, borderColor: tag.color }
                    : tag.color
                      ? { borderColor: tag.color, color: tag.color }
                      : undefined
                }
              >
                {tag.name}
              </Badge>
            </button>
          );
        })}
        {selectedTagIds.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="h-5 px-1.5 text-xs gap-1 text-muted-foreground"
            aria-label="Clear tag filter"
          >
            <X className="size-3" />
            Clear
          </Button>
        )}
      </div>
      {children(filtered)}
    </div>
  );
};
