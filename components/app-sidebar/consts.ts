import {
  ArrowRightLeft,
  MoveUpRight,
  MoveDownLeft,
  PiggyBank,
  Target,
  TrendingUp,
  CalendarDays,
  BarChart3,
  Receipt,
  Wallet,
  Repeat2,
  BookOpen,
  Map,
  ScanLine,
  CheckSquare,
  Sparkles,
} from "lucide-react";

export const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Movements",
      url: "/movements",
      icon: ArrowRightLeft,
      isActive: true,
      items: [
        {
          title: "Income",
          icon: MoveUpRight,
          url: "/income",
        },
        {
          title: "Expenses",
          icon: MoveDownLeft,
          url: "/outcome",
        },
        {
          title: "Recurring",
          icon: Repeat2,
          url: "/recurring",
        },
        {
          title: "Bills",
          icon: Receipt,
          url: "/bills",
        },
        {
          title: "Savings",
          icon: PiggyBank,
          url: "/savings",
        },
        {
          title: "Calendar",
          icon: CalendarDays,
          url: "/calendar",
        },
      ],
    },
    {
      title: "Planning",
      url: "/goals",
      icon: Target,
      items: [
        {
          title: "Goals",
          icon: Target,
          url: "/goals",
        },
        {
          title: "Budget",
          icon: Wallet,
          url: "/budget",
        },
        {
          title: "Habits",
          icon: Sparkles,
          url: "/habits",
        },
        {
          title: "Tasks",
          icon: CheckSquare,
          url: "/tasks",
        },
        {
          title: "Net Worth",
          icon: TrendingUp,
          url: "/net-worth",
        },
      ],
    },
    {
      title: "Utilities",
      url: "/reports",
      icon: BarChart3,
      items: [
        {
          title: "Reports",
          icon: BarChart3,
          url: "/reports",
        },
        {
          title: "Map",
          icon: Map,
          url: "/map",
        },
        {
          title: "Receipts",
          icon: ScanLine,
          url: "/receipts",
        },
        {
          title: "Library",
          icon: BookOpen,
          url: "/library",
        },
      ],
    },
  ],
};
