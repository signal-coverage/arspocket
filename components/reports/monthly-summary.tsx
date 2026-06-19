import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type ReportData = {
  rawIncome: number;
  rawExpenses: number;
  rawSavings: number;
  byCategory: Record<string, { income: number; expenses: number }>;
  baseCurrency?: string | null;
  normalizedIncome?: number | null;
  normalizedExpenses?: number | null;
  normalizedSavings?: number | null;
  ratesStale?: boolean;
  transactionCount: number;
};

const fmt = (n: number, currency = "ARS") =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(n);

export const MonthlySummary = ({
  data,
}: {
  data: ReportData | null;
}) => {
  if (!data) {
    return (
      <p className="text-sm text-muted-foreground">No report data available.</p>
    );
  }

  const {
    rawIncome,
    rawExpenses,
    rawSavings,
    byCategory,
    baseCurrency,
    normalizedIncome,
    normalizedExpenses,
    normalizedSavings,
    ratesStale,
    transactionCount,
  } = data;

  return (
    <div className="space-y-4">
      {ratesStale && baseCurrency && (
        <div className="rounded-md border border-amber-200 bg-amber-50 dark:bg-amber-950 dark:border-amber-800 px-3 py-2 text-sm text-amber-800 dark:text-amber-200">
          Exchange rates may be outdated — could not reach the rates API.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Income (ARS)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-emerald-600">
              {fmt(rawIncome)}
            </p>
            {baseCurrency && normalizedIncome != null && (
              <p className="text-xs text-muted-foreground mt-1">
                ≈ {fmt(normalizedIncome, baseCurrency)} {baseCurrency}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Expenses (ARS)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">
              {fmt(rawExpenses)}
            </p>
            {baseCurrency && normalizedExpenses != null && (
              <p className="text-xs text-muted-foreground mt-1">
                ≈ {fmt(normalizedExpenses, baseCurrency)} {baseCurrency}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Net (ARS)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p
              className={`text-2xl font-bold ${rawSavings >= 0 ? "text-emerald-600" : "text-red-600"}`}
            >
              {fmt(rawSavings)}
            </p>
            {baseCurrency && normalizedSavings != null && (
              <p className="text-xs text-muted-foreground mt-1">
                ≈ {fmt(normalizedSavings, baseCurrency)} {baseCurrency}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <p className="text-xs text-muted-foreground">
        {transactionCount} transaction{transactionCount !== 1 ? "s" : ""} in
        this period.
      </p>

      {Object.keys(byCategory).length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">By Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y text-sm">
              {Object.entries(byCategory).map(([cat, vals]) => (
                <li key={cat} className="flex items-center justify-between py-2">
                  <Badge variant="secondary">{cat}</Badge>
                  <div className="flex gap-4 text-xs">
                    {vals.income > 0 && (
                      <span className="text-emerald-600">
                        +{fmt(vals.income)}
                      </span>
                    )}
                    {vals.expenses > 0 && (
                      <span className="text-red-600">
                        -{fmt(vals.expenses)}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
