"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Separator,
  SidebarTrigger,
} from "@/components/ui";
import { ThemeToggle } from "@/components/theme-toggle";

interface NavbarProps {
  actions?: React.ReactNode;
}

export const Navbar = ({ actions }: NavbarProps) => {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const secondSegment = segments[1];

  const SEGMENT_LABELS: Record<string, string> = {
    income: t("income"),
    outcome: t("expenses"),
    savings: t("savings"),
  };

  const secondLabel = secondSegment ? SEGMENT_LABELS[secondSegment] : null;

  return (
    <header className="flex items-center gap-2 px-4 sm:px-6 py-3 border-b bg-card sticky top-0 z-10 w-full shrink-0">
      <SidebarTrigger className="-ml-1" />
      <Separator
        orientation="vertical"
        className="mr-2 data-[orientation=vertical]:h-4"
      />

      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className={secondLabel ? "hidden md:block" : ""}>
            {secondLabel ? (
              <BreadcrumbLink href="/dashboard">
                {t("dashboard")}
              </BreadcrumbLink>
            ) : (
              <BreadcrumbPage>{t("dashboard")}</BreadcrumbPage>
            )}
          </BreadcrumbItem>
          {secondLabel && (
            <>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{secondLabel}</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="ml-auto flex items-center gap-1">
        {actions}
        <ThemeToggle />
      </div>
    </header>
  );
};
