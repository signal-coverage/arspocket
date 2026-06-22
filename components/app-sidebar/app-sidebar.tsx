"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  LayoutDashboard,
  MoveUpRight,
  MoveDownLeft,
  PiggyBank,
  Settings,
  HelpCircle,
  ChevronDown,
  Target,
  TrendingUp,
  CalendarDays,
  BarChart3,
  PieChart,
  CalendarClock,
  GanttChartSquare,
  Flame,
  ListChecks,
  Receipt,
  BookMarked,
  MapPin,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { NavUser } from "./components";
import { SettingsModal } from "@/components/settings/settings-modal";

const navItems = [
  {
    titleKey: "nav.overview",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
];

const movementItems = [
  {
    titleKey: "nav.income",
    icon: MoveUpRight,
    href: "/dashboard/income",
  },
  {
    titleKey: "nav.expenses",
    icon: MoveDownLeft,
    href: "/dashboard/outcome",
  },
  {
    titleKey: "nav.savings",
    icon: PiggyBank,
    href: "/dashboard/savings",
  },
  {
    titleKey: "nav.calendar",
    icon: CalendarDays,
    href: "/dashboard/calendar",
  },
];

const planningItems = [
  {
    titleKey: "nav.goalsTimeline",
    icon: GanttChartSquare,
    href: "/dashboard/goals",
  },
  {
    titleKey: "nav.budget",
    icon: PieChart,
    href: "/dashboard/budget",
  },
  {
    titleKey: "nav.bills",
    icon: CalendarClock,
    href: "/dashboard/bills",
  },
  {
    titleKey: "nav.netWorth",
    icon: TrendingUp,
    href: "/dashboard/net-worth",
  },
];

const habitsAndTasksItems = [
  {
    titleKey: "nav.habits",
    icon: Flame,
    href: "/dashboard/habits",
  },
  {
    titleKey: "nav.todos",
    icon: ListChecks,
    href: "/dashboard/tasks",
  },
];

const vaultItems = [
  {
    titleKey: "nav.receipts",
    icon: Receipt,
    href: "/dashboard/receipts",
  },
  {
    titleKey: "nav.library",
    icon: BookMarked,
    href: "/dashboard/library",
  },
];

const exploreItems = [
  {
    titleKey: "nav.spendingMap",
    icon: MapPin,
    href: "/dashboard/map",
  },
];

const reportItems = [
  {
    titleKey: "nav.reports",
    icon: BarChart3,
    href: "/dashboard/reports",
  },
];

export const AppSidebar = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  const pathname = usePathname();
  const t = useTranslations();
  const [movementsOpen, setMovementsOpen] = React.useState(true);
  const [planningOpen, setPlanningOpen] = React.useState(true);
  const [habitsOpen, setHabitsOpen] = React.useState(true);
  const [vaultOpen, setVaultOpen] = React.useState(true);
  const [exploreOpen, setExploreOpen] = React.useState(true);
  const [reportsOpen, setReportsOpen] = React.useState(true);
  const [settingsOpen, setSettingsOpen] = React.useState(false);

  return (
    <Sidebar collapsible="offcanvas" className="lg:border-r-0!" {...props}>
      <SidebarHeader className="p-4 lg:p-5 pb-0">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="ARSPocket"
            width={28}
            height={28}
            className="rounded-md"
          />
          <span className="font-semibold text-base">ARSPocket</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 lg:px-4 pt-4">
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.titleKey}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    className="h-9"
                  >
                    <Link href={item.href}>
                      <item.icon className="size-4" />
                      <span className="text-sm">{t(item.titleKey as any)}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Collapsible open={movementsOpen} onOpenChange={setMovementsOpen}>
          <SidebarGroup className="p-0 mt-2">
            <SidebarGroupLabel className="flex items-center justify-between px-0 text-[11px] font-semibold tracking-wider text-muted-foreground">
              <CollapsibleTrigger asChild>
                <div className="flex items-center gap-1.5 cursor-pointer">
                  <ChevronDown
                    className={`size-3.5 transition-transform ${movementsOpen ? "" : "-rotate-90"}`}
                  />
                  {t("nav.movements")}
                </div>
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu className="mt-2">
                  {movementItems.map((item) => (
                    <SidebarMenuItem key={item.titleKey}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === item.href}
                        className="h-9"
                      >
                        <Link href={item.href}>
                          <item.icon className="size-4 text-muted-foreground" />
                          <span className="flex-1 text-sm text-muted-foreground">
                            {t(item.titleKey as any)}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        <Collapsible open={planningOpen} onOpenChange={setPlanningOpen}>
          <SidebarGroup className="p-0 mt-2">
            <SidebarGroupLabel className="flex items-center justify-between px-0 text-[11px] font-semibold tracking-wider text-muted-foreground">
              <CollapsibleTrigger asChild>
                <div className="flex items-center gap-1.5 cursor-pointer">
                  <ChevronDown
                    className={`size-3.5 transition-transform ${planningOpen ? "" : "-rotate-90"}`}
                  />
                  {t("nav.planning")}
                </div>
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu className="mt-2">
                  {planningItems.map((item) => (
                    <SidebarMenuItem key={item.titleKey}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === item.href}
                        className="h-9"
                      >
                        <Link href={item.href}>
                          <item.icon className="size-4 text-muted-foreground" />
                          <span className="flex-1 text-sm text-muted-foreground">
                            {t(item.titleKey as any)}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        <Collapsible open={habitsOpen} onOpenChange={setHabitsOpen}>
          <SidebarGroup className="p-0 mt-2">
            <SidebarGroupLabel className="flex items-center justify-between px-0 text-[11px] font-semibold tracking-wider text-muted-foreground">
              <CollapsibleTrigger asChild>
                <div className="flex items-center gap-1.5 cursor-pointer">
                  <ChevronDown
                    className={`size-3.5 transition-transform ${habitsOpen ? "" : "-rotate-90"}`}
                  />
                  {t("nav.habitsAndTasks")}
                </div>
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu className="mt-2">
                  {habitsAndTasksItems.map((item) => (
                    <SidebarMenuItem key={item.titleKey}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === item.href}
                        className="h-9"
                      >
                        <Link href={item.href}>
                          <item.icon className="size-4 text-muted-foreground" />
                          <span className="flex-1 text-sm text-muted-foreground">
                            {t(item.titleKey as any)}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        <Collapsible open={vaultOpen} onOpenChange={setVaultOpen}>
          <SidebarGroup className="p-0 mt-2">
            <SidebarGroupLabel className="flex items-center justify-between px-0 text-[11px] font-semibold tracking-wider text-muted-foreground">
              <CollapsibleTrigger asChild>
                <div className="flex items-center gap-1.5 cursor-pointer">
                  <ChevronDown
                    className={`size-3.5 transition-transform ${vaultOpen ? "" : "-rotate-90"}`}
                  />
                  {t("nav.vault")}
                </div>
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu className="mt-2">
                  {vaultItems.map((item) => (
                    <SidebarMenuItem key={item.titleKey}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname.startsWith(item.href)}
                        className="h-9"
                      >
                        <Link href={item.href}>
                          <item.icon className="size-4 text-muted-foreground" />
                          <span className="flex-1 text-sm text-muted-foreground">
                            {t(item.titleKey as any)}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        <Collapsible open={exploreOpen} onOpenChange={setExploreOpen}>
          <SidebarGroup className="p-0 mt-2">
            <SidebarGroupLabel className="flex items-center justify-between px-0 text-[11px] font-semibold tracking-wider text-muted-foreground">
              <CollapsibleTrigger asChild>
                <div className="flex items-center gap-1.5 cursor-pointer">
                  <ChevronDown
                    className={`size-3.5 transition-transform ${exploreOpen ? "" : "-rotate-90"}`}
                  />
                  {t("nav.explore")}
                </div>
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu className="mt-2">
                  {exploreItems.map((item) => (
                    <SidebarMenuItem key={item.titleKey}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === item.href}
                        className="h-9"
                      >
                        <Link href={item.href}>
                          <item.icon className="size-4 text-muted-foreground" />
                          <span className="flex-1 text-sm text-muted-foreground">
                            {t(item.titleKey as any)}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        <Collapsible open={reportsOpen} onOpenChange={setReportsOpen}>
          <SidebarGroup className="p-0 mt-2">
            <SidebarGroupLabel className="flex items-center justify-between px-0 text-[11px] font-semibold tracking-wider text-muted-foreground">
              <CollapsibleTrigger asChild>
                <div className="flex items-center gap-1.5 cursor-pointer">
                  <ChevronDown
                    className={`size-3.5 transition-transform ${reportsOpen ? "" : "-rotate-90"}`}
                  />
                  {t("nav.insights")}
                </div>
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu className="mt-2">
                  {reportItems.map((item) => (
                    <SidebarMenuItem key={item.titleKey}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === item.href}
                        className="h-9"
                      >
                        <Link href={item.href}>
                          <item.icon className="size-4 text-muted-foreground" />
                          <span className="flex-1 text-sm text-muted-foreground">
                            {t(item.titleKey as any)}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>

      <SidebarFooter className="px-3 lg:px-4 pb-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="h-9">
              <Link href="#">
                <HelpCircle className="size-4" />
                <span className="text-sm">{t("nav.help")}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="h-9"
              onClick={() => setSettingsOpen(true)}
            >
              <Settings className="size-4" />
              <span className="text-sm">{t("nav.settings")}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <NavUser />
      </SidebarFooter>

      <SettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />
    </Sidebar>
  );
};
