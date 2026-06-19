// Anomaly detection using IQR / mean+2σ method

type TransactionLike = {
  id: string;
  amount: unknown;
  category: string;
};

export type AnomalyResult = {
  transactionId: string;
  isAnomaly: boolean;
  mean: number;
  stddev: number;
};

/**
 * Detect anomalous transactions per category using mean + 2σ threshold.
 * Requires at least 5 historical samples per category — skips categories with fewer.
 * Window: trailing 90 days of same-category historical transactions.
 *
 * Pure function — no DB calls, no side effects.
 */
export const detectAnomalies = (
  transactions: TransactionLike[],
  historical: TransactionLike[],
): AnomalyResult[] => {
  // Group historical by category
  const byCategory: Record<string, number[]> = {};
  for (const t of historical) {
    if (!byCategory[t.category]) byCategory[t.category] = [];
    byCategory[t.category].push(Number(t.amount));
  }

  return transactions.map((t) => {
    const amounts = byCategory[t.category] ?? [];
    if (amounts.length < 5) {
      return { transactionId: t.id, isAnomaly: false, mean: 0, stddev: 0 };
    }

    const mean = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    const variance =
      amounts.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) /
      amounts.length;
    const stddev = Math.sqrt(variance);

    const amount = Number(t.amount);
    const isAnomaly = stddev > 0 && amount > mean + 2 * stddev;

    return { transactionId: t.id, isAnomaly, mean, stddev };
  });
};
