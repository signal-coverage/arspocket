"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createBookmark } from "@/app/actions/library";
import { SerializedCollection } from "@/app/actions/library";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collections: SerializedCollection[];
};

export const BookmarkForm = ({ open, onOpenChange, collections }: Props) => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const fd = new FormData(e.currentTarget);
    const url = (fd.get("url") as string).trim();
    const title = (fd.get("title") as string).trim();
    const description = (fd.get("description") as string).trim();
    const collectionId = fd.get("collection") as string;
    const tagsRaw = (fd.get("tags") as string).trim();
    const tags = tagsRaw
      ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean).slice(0, 10)
      : [];

    if (!url || !title) {
      setError("URL and title are required.");
      return;
    }

    try {
      new URL(url);
    } catch {
      setError("Please enter a valid URL (e.g. https://example.com).");
      return;
    }

    startTransition(async () => {
      try {
        await createBookmark({
          url,
          title,
          description: description || undefined,
          collectionId: collectionId || undefined,
          tags,
        });
        onOpenChange(false);
        (e.target as HTMLFormElement).reset();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create bookmark");
      }
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>New Bookmark</SheetTitle>
          <SheetDescription>Save a resource to your library.</SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="bm-url">URL *</Label>
            <Input
              id="bm-url"
              name="url"
              type="url"
              placeholder="https://example.com/article"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="bm-title">Title *</Label>
            <Input
              id="bm-title"
              name="title"
              placeholder="Great Article"
              maxLength={200}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="bm-desc">Description</Label>
            <Input
              id="bm-desc"
              name="description"
              placeholder="Brief description"
            />
          </div>

          {collections.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <Label>Collection</Label>
              <Select name="collection">
                <SelectTrigger>
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  {collections.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="bm-tags">Tags (comma-separated, max 10)</Label>
            <Input
              id="bm-tags"
              name="tags"
              placeholder="investing, tax, resources"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" disabled={isPending} className="mt-2">
            {isPending ? "Saving..." : "Save Bookmark"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
};
