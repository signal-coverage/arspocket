import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getBookmarks, getCollections } from "@/app/actions/library";
import { BookmarkGrid } from "@/components/library/bookmark-grid";

export const metadata: Metadata = { title: "Favorites — ARSPocket" };

export const LibraryFavoritesPage = async () => {
  const t = await getTranslations("library");
  const [bookmarks, collections] = await Promise.all([
    getBookmarks("favorites"),
    getCollections(),
  ]);

  return (
    <div className="flex flex-1 flex-col gap-4 p-6">
      <div>
        <h1 className="text-xl font-semibold">{t("favorites")}</h1>
        <p className="text-sm text-muted-foreground">
          {t("favoritesSubtitle")}
        </p>
      </div>
      <BookmarkGrid
        bookmarks={bookmarks}
        collections={collections}
        emptyMessage={t("noFavoritesPage")}
      />
    </div>
  );
};

export default LibraryFavoritesPage;
