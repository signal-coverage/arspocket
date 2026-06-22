"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  ComposedChart,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AnnualReport } from "@/app/actions/transactions";

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const fmt = (n: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);

const fmtFull = (n: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(n);

type Props = {
  data: AnnualReport;
};

export const AnnualSummary = ({ data }: Props) => {
  const chartData = data.months.map((m) => ({
    month: MONTH_LABELS[m.month - 1],
    income: m.income,
    expenses: m.expenses,
    net: m.net,
  }));

  const bestMonth = data.months.reduce((best, m) =>
    m.net > best.net ? m : best,
    data.months[0],
  );
  const worstMonth = data.months.reduce((worst, m) =>
    m.net < worst.net ? m : worst,
    data.months[0],
  );

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Total Income
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold text-emerald-600">
              {fmtFull(data.totalIncome)}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Total Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold text-red-600">
              {fmtFull(data.totalExpenses)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Net
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p
              className={`text-xl font-bold ${data.totalNet >= 0 ? "text-emerald-600" : "text-red-600"}`}
            >
              {fmtFull(data.totalNet)}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-400">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Best Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-semibold">
              {MONTH_LABELS[bestMonth.month - 1]}
            </p>
            <p className="text-xs text-emerald-600">
              {fmtFull(bestMonth.net)}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-400">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Worst Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-semibold">
              {MONTH_LABELS[worstMonth.month - 1]}
            </p>
            <p className="text-xs text-red-600">
              {fmtFull(worstMonth.net)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Bar + Line chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Monthly Breakdown — {data.year}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tickFormatter={fmt}
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                width={64}
              />
              <Tooltip
                formatter={(value, name) => [
                  typeof value === "number" ? fmtFull(value) : String(value ?? ""),
                  typeof name === "string"
                    ? name.charAt(0).toUpperCase() + name.slice(1)
                    : String(name ?? ""),
                ]}
                contentStyle={{
                  fontSize: 12,
                  borderRadius: "8px",
                  border: "1px solid hsl(var(--border))",
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: 12, paddingTop: "8px" }}
              />
              <Bar dataKey="income" name="Income" fill="#10b981" radius={[3, 3, 0, 0]} />
              <Bar dataKey="expenses" name="Expenses" fill="#ef4444" radius={[3, 3, 0, 0]} />
              <Line
                type="monotone"
                dataKey="net"
                name="Net"
                stroke="#6366f1"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
