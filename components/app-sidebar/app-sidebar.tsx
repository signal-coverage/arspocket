"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Leaf,
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

const navItems = [
  {
    title: "Overview",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
];

const movementItems = [
  {
    title: "Income",
    icon: MoveUpRight,
    href: "/dashboard/income",
  },
  {
    title: "Expenses",
    icon: MoveDownLeft,
    href: "/dashboard/outcome",
  },
  {
    title: "Savings",
    icon: PiggyBank,
    href: "/dashboard/savings",
  },
  {
    title: "Calendar",
    icon: CalendarDays,
    href: "/dashboard/calendar",
  },
];

const planningItems = [
  {
    title: "Goals Timeline",
    icon: GanttChartSquare,
    href: "/dashboard/goals",
  },
  {
    title: "Budget",
    icon: PieChart,
    href: "/dashboard/budget",
  },
  {
    title: "Bills",
    icon: CalendarClock,
    href: "/dashboard/bills",
  },
  {
    title: "Net Worth",
    icon: TrendingUp,
    href: "/dashboard/net-worth",
  },
];

const habitsAndTasksItems = [
  {
    title: "Habits",
    icon: Flame,
    href: "/dashboard/habits",
  },
  {
    title: "To-Dos",
    icon: ListChecks,
    href: "/dashboard/tasks",
  },
];

const vaultItems = [
  {
    title: "Receipts",
    icon: Receipt,
    href: "/dashboard/receipts",
  },
  {
    title: "Resource Library",
    icon: BookMarked,
    href: "/dashboard/library",
  },
];

const exploreItems = [
  {
    title: "Spending Map",
    icon: MapPin,
    href: "/dashboard/map",
  },
];

const reportItems = [
  {
    title: "Reports",
    icon: BarChart3,
    href: "/dashboard/reports",
  },
];

export const AppSidebar = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  const pathname = usePathname();
  const [movementsOpen, setMovementsOpen] = React.useState(true);
  const [planningOpen, setPlanningOpen] = React.useState(true);
  const [habitsOpen, setHabitsOpen] = React.useState(true);
  const [vaultOpen, setVaultOpen] = React.useState(true);
  const [exploreOpen, setExploreOpen] = React.useState(true);
  const [reportsOpen, setReportsOpen] = React.useState(true);

  return (
    <Sidebar collapsible="offcanvas" className="lg:border-r-0!" {...props}>
      <SidebarHeader className="p-4 lg:p-5 pb-0">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Leaf className="size-4" />
          </div>
          <span className="font-semibold text-base">ARSPocket</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 lg:px-4 pt-4">
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    className="h-9"
                  >
                    <Link href={item.href}>
                      <item.icon className="size-4" />
                      <span className="text-sm">{item.title}</span>
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
                  MOVEMENTS
                </div>
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu className="mt-2">
                  {movementItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === item.href}
                        className="h-9"
                      >
                        <Link href={item.href}>
                          <item.icon className="size-4 text-muted-foreground" />
                          <span className="flex-1 text-sm text-muted-foreground">
                            {item.title}
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
                  PLANNING
                </div>
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu className="mt-2">
                  {planningItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === item.href}
                        className="h-9"
                      >
                        <Link href={item.href}>
                          <item.icon className="size-4 text-muted-foreground" />
                          <span className="flex-1 text-sm text-muted-foreground">
                            {item.title}
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
                  HABITS &amp; TASKS
                </div>
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu className="mt-2">
                  {habitsAndTasksItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === item.href}
                        className="h-9"
                      >
                        <Link href={item.href}>
                          <item.icon className="size-4 text-muted-foreground" />
                          <span className="flex-1 text-sm text-muted-foreground">
                            {item.title}
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
                  VAULT
                </div>
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu className="mt-2">
                  {vaultItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname.startsWith(item.href)}
                        className="h-9"
                      >
                        <Link href={item.href}>
                          <item.icon className="size-4 text-muted-foreground" />
                          <span className="flex-1 text-sm text-muted-foreground">
                            {item.title}
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
                  EXPLORE
                </div>
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu className="mt-2">
                  {exploreItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === item.href}
                        className="h-9"
                      >
                        <Link href={item.href}>
                          <item.icon className="size-4 text-muted-foreground" />
                          <span className="flex-1 text-sm text-muted-foreground">
                            {item.title}
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
                  INSIGHTS
                </div>
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu className="mt-2">
                  {reportItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === item.href}
                        className="h-9"
                      >
                        <Link href={item.href}>
                          <item.icon className="size-4 text-muted-foreground" />
                          <span className="flex-1 text-sm text-muted-foreground">
                            {item.title}
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
                <span className="text-sm">Help</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="h-9">
              <Link href="#">
                <Settings className="size-4" />
                <span className="text-sm">Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
};
