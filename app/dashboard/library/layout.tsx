import Link from "next/link";
import { BookMarked, Star, Archive, Trash2 } from "lucide-react";
import { getTranslations } from "next-intl/server";

export const LibraryLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const t = await getTranslations("library");

  const NAV_LINKS = [
    { href: "/dashboard/library", label: t("all"), icon: BookMarked },
    { href: "/dashboard/library/favorites", label: t("favorites"), icon: Star },
    { href: "/dashboard/library/archive", label: t("archive"), icon: Archive },
    { href: "/dashboard/library/trash", label: t("trash"), icon: Trash2 },
  ];

  return (
    <div className="flex flex-1 flex-col">
      {/* Sub-nav */}
      <div className="border-b px-6 pt-4">
        <nav className="flex gap-1 pb-0">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground rounded-t-md hover:bg-muted/50 transition-colors"
            >
              <link.icon className="size-3.5" />
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      {children}
    </div>
  );
};

export default LibraryLayout;
