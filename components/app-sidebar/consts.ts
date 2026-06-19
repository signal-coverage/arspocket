import {
  ArrowRightLeft,
  MoveUpRight,
  MoveDownLeft,
  PiggyBank,
  Target,
  TrendingUp,
  CalendarDays,
  BarChart3,
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
          title: "Net Worth",
          icon: TrendingUp,
          url: "/net-worth",
        },
      ],
    },
    {
      title: "Reports",
      url: "/reports",
      icon: BarChart3,
      items: [
        {
          title: "Reports",
          icon: BarChart3,
          url: "/reports",
        },
      ],
    },
  ],
};
