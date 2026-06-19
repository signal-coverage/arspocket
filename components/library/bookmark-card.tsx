"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { SerializedBookmark } from "@/app/actions/library";
import {
  toggleFavorite,
  archiveBookmark,
  softDeleteBookmark,
  restoreBookmark,
  permanentDeleteBookmark,
} from "@/app/actions/library";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Star,
  Archive,
  Trash2,
  RotateCcw,
  ExternalLink,
  BookMarked,
} from "lucide-react";
import Image from "next/image";

type Props = {
  bookmark: SerializedBookmark;
  variant?: "default" | "trash";
};

export const BookmarkCard = ({ bookmark, variant = "default" }: Props) => {
  const t = useTranslations("library");
  const tCommon = useTranslations("common");
  const [isPending, startTransition] = useTransition();

  const domain = (() => {
    try {
      return new URL(bookmark.url).hostname;
    } catch {
      return bookmark.url;
    }
  })();

  return (
    <div className="flex flex-col gap-3 rounded-lg border p-4 hover:bg-muted/20 transition-colors">
      {/* Header */}
      <div className="flex items-start gap-3">
        {/* Favicon */}
        <div className="size-8 rounded-md bg-muted flex items-center justify-center shrink-0 overflow-hidden">
          {bookmark.favicon ? (
            <img
              src={bookmark.favicon}
              alt={`${domain} favicon`}
              className="size-5 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <BookMarked className="size-4 text-muted-foreground" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium line-clamp-1">{bookmark.title}</p>
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 w-fit"
          >
            {domain}
            <ExternalLink className="size-2.5" />
          </a>
        </div>
      </div>

      {/* Description */}
      {bookmark.description && (
        <p className="text-xs text-muted-foreground line-clamp-2">
          {bookmark.description}
        </p>
      )}

      {/* Tags */}
      {bookmark.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {bookmark.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-xs px-1.5 py-0"
            >
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {/* Collection */}
      {bookmark.collectionName && (
        <p className="text-xs text-muted-foreground">
          📁 {bookmark.collectionName}
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-1 border-t pt-2 mt-1">
        {variant === "trash" ? (
          <>
            <Button
              size="sm"
              variant="ghost"
              className="gap-1 text-xs h-7"
              disabled={isPending}
              onClick={() =>
                startTransition(async () => {
                  await restoreBookmark(bookmark.id);
                })
              }
            >
              <RotateCcw className="size-3" />
              {t("restore")}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="gap-1 text-xs h-7 text-destructive hover:text-destructive"
              disabled={isPending}
              onClick={() =>
                startTransition(async () => {
                  await permanentDeleteBookmark(bookmark.id);
                })
              }
            >
              <Trash2 className="size-3" />
              {t("deletePermanently")}
            </Button>
          </>
        ) : (
          <>
            <Button
              size="icon"
              variant="ghost"
              className={`size-7 ${bookmark.isFavorite ? "text-amber-500" : "text-muted-foreground"}`}
              disabled={isPending}
              onClick={() =>
                startTransition(async () => {
                  await toggleFavorite(bookmark.id);
                })
              }
              title={
                bookmark.isFavorite
                  ? t("removeFromFavorites")
                  : t("addToFavorites")
              }
            >
              <Star
                className={`size-3.5 ${bookmark.isFavorite ? "fill-amber-500" : ""}`}
              />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className={`size-7 ${bookmark.isArchived ? "text-primary" : "text-muted-foreground"}`}
              disabled={isPending}
              onClick={() =>
                startTransition(async () => {
                  await archiveBookmark(bookmark.id);
                })
              }
              title={t("archiveAction")}
            >
              <Archive className="size-3.5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="size-7 text-muted-foreground hover:text-destructive ml-auto"
              disabled={isPending}
              onClick={() =>
                startTransition(async () => {
                  await softDeleteBookmark(bookmark.id);
                })
              }
              title={tCommon("delete")}
            >
              <Trash2 className="size-3.5" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
