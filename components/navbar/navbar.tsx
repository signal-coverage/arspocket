"use client";

import { usePathname } from "next/navigation";
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

const SEGMENT_LABELS: Record<string, string> = {
  income: "Income",
  outcome: "Expenses",
  savings: "Savings",
};

export const Navbar = () => {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const secondSegment = segments[1];
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
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            ) : (
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
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

      <div className="ml-auto">
        <ThemeToggle />
      </div>
    </header>
  );
};
