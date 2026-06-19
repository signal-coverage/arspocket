import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getBookmarks, getCollections } from "@/app/actions/library";
import { BookmarkGrid } from "@/components/library/bookmark-grid";
import { TrashEmptyButton } from "./trash-empty-button";

export const metadata: Metadata = { title: "Trash — ARSPocket" };

export const LibraryTrashPage = async () => {
  const t = await getTranslations("library");
  const [bookmarks, collections] = await Promise.all([
    getBookmarks("trash"),
    getCollections(),
  ]);

  return (
    <div className="flex flex-1 flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">{t("trash")}</h1>
          <p className="text-sm text-muted-foreground">{t("trashSubtitle")}</p>
        </div>
        {bookmarks.length > 0 && <TrashEmptyButton />}
      </div>
      <BookmarkGrid
        bookmarks={bookmarks}
        collections={collections}
        emptyMessage={t("noTrashedPage")}
        variant="trash"
      />
    </div>
  );
};

export default LibraryTrashPage;
