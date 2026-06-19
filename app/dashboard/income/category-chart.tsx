"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useTranslations } from "next-intl";
import { formatCurrency, formatCompactCurrency } from "@/lib/format";

type CategoryData = {
  category: string;
  total: number;
};

type Props = {
  data: CategoryData[];
  totalIncome: number;
};

const COLORS = [
  "#6366f1",
  "#10b981",
  "#f59e0b",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
];

export const CategoryChart = ({ data, totalIncome }: Props) => {
  const t = useTranslations("income");
  const tCommon = useTranslations("common");

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-sm text-muted-foreground">
        {t("noIncome")}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="text-xs text-muted-foreground">
        {tCommon("total")}:{" "}
        <span className="text-sm font-semibold text-foreground">
          {formatCurrency(totalIncome)}
        </span>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: 4, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis
            dataKey="category"
            tick={{ fontSize: 10 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tickFormatter={formatCompactCurrency}
            tick={{ fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            width={60}
          />
          <Tooltip
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={(value: any) =>
              typeof value === "number"
                ? formatCurrency(value as number)
                : String(value ?? "")
            }
            contentStyle={{
              fontSize: 12,
              borderRadius: "8px",
              border: "1px solid hsl(var(--border))",
            }}
          />
          <Bar dataKey="total" radius={[4, 4, 0, 0]}>
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
