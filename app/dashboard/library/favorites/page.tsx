import type { Metadata } from "next";
import { getBookmarks, getCollections } from "@/app/actions/library";
import { BookmarkGrid } from "@/components/library/bookmark-grid";

export const metadata: Metadata = { title: "Favorites — ARSPocket" };

export const LibraryFavoritesPage = async () => {
  const [bookmarks, collections] = await Promise.all([
    getBookmarks("favorites"),
    getCollections(),
  ]);

  return (
    <div className="flex flex-1 flex-col gap-4 p-6">
      <div>
        <h1 className="text-xl font-semibold">Favorites</h1>
        <p className="text-sm text-muted-foreground">Your starred resources.</p>
      </div>
      <BookmarkGrid
        bookmarks={bookmarks}
        collections={collections}
        emptyMessage="No favorited bookmarks yet."
      />
    </div>
  );
};

export default LibraryFavoritesPage;
