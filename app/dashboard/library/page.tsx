import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getBookmarks, getCollections } from "@/app/actions/library";
import { BookmarkGrid } from "@/components/library/bookmark-grid";

export const metadata: Metadata = { title: "Library — ARSPocket" };

export const LibraryPage = async () => {
  const t = await getTranslations("library");
  const [bookmarks, collections] = await Promise.all([
    getBookmarks("all"),
    getCollections(),
  ]);

  return (
    <div className="flex flex-1 flex-col gap-4 p-6">
      <div>
        <h1 className="text-xl font-semibold">{t("title")}</h1>
        <p className="text-sm text-muted-foreground">{t("subtitlePage")}</p>
      </div>
      <BookmarkGrid
        bookmarks={bookmarks}
        collections={collections}
        showAddButton
        emptyMessage={t("noBookmarksPage")}
      />
    </div>
  );
};

export default LibraryPage;
