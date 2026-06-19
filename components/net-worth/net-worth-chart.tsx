"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import { useTranslations } from "next-intl";

type Snapshot = {
  id: string;
  date: Date;
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
};

const fmt = (n: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    notation: "compact",
    maximumFractionDigits: 0,
  }).format(n);

export const NetWorthChart = ({ snapshots }: { snapshots: Snapshot[] }) => {
  const t = useTranslations("netWorth");

  if (snapshots.length < 2) {
    return (
      <div className="flex items-center justify-center h-48 text-sm text-muted-foreground border rounded-lg">
        {t("addMoreSnapshots")}
      </div>
    );
  }

  const assetsKey = t("assets");
  const liabilitiesKey = t("liabilities");
  const netWorthKey = t("title");

  const data = snapshots.map((s) => ({
    date: format(new Date(s.date), "MMM d"),
    [assetsKey]: s.totalAssets,
    [liabilitiesKey]: s.totalLiabilities,
    [netWorthKey]: s.netWorth,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis dataKey="date" className="text-xs" />
        <YAxis tickFormatter={fmt} className="text-xs" width={80} />
        <Tooltip formatter={(v) => fmt(Number(v))} />
        <Legend />
        <Line
          type="monotone"
          dataKey={assetsKey}
          stroke="#10b981"
          strokeWidth={2}
          dot={{ r: 3 }}
        />
        <Line
          type="monotone"
          dataKey={liabilitiesKey}
          stroke="#ef4444"
          strokeWidth={2}
          dot={{ r: 3 }}
        />
        <Line
          type="monotone"
          dataKey={netWorthKey}
          stroke="#6366f1"
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={{ r: 3 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
