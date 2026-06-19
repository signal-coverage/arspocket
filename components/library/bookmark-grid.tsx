"use client";

import { useState } from "react";
import { SerializedBookmark, SerializedCollection } from "@/app/actions/library";
import { BookmarkCard } from "./bookmark-card";
import { BookmarkForm } from "./bookmark-form";
import { Button } from "@/components/ui/button";
import { Plus, BookMarked } from "lucide-react";

type Props = {
  bookmarks: SerializedBookmark[];
  collections: SerializedCollection[];
  emptyMessage?: string;
  variant?: "default" | "trash";
  showAddButton?: boolean;
};

export const BookmarkGrid = ({
  bookmarks,
  collections,
  emptyMessage = "No bookmarks here.",
  variant = "default",
  showAddButton = false,
}: Props) => {
  const [addOpen, setAddOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      {showAddButton && (
        <div className="flex justify-end">
          <Button onClick={() => setAddOpen(true)} size="sm" className="gap-1.5">
            <Plus className="size-4" />
            Add Bookmark
          </Button>
        </div>
      )}

      {bookmarks.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 rounded-lg border border-dashed">
          <BookMarked className="size-10 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">{emptyMessage}</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bookmarks.map((b) => (
            <BookmarkCard key={b.id} bookmark={b} variant={variant} />
          ))}
        </div>
      )}

      {showAddButton && (
        <BookmarkForm
          open={addOpen}
          onOpenChange={setAddOpen}
          collections={collections}
        />
      )}
    </div>
  );
};
