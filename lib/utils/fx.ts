// FX normalization utility — ARS as pivot currency

let _ratesCache: { data: FXRate[]; fetchedAt: number } | null = null;
const RATES_CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

export const getFXRates = async (): Promise<{
  rates: FXRate[];
  stale: boolean;
}> => {
  const now = Date.now();
  if (_ratesCache && now - _ratesCache.fetchedAt < RATES_CACHE_TTL_MS) {
    return { rates: _ratesCache.data, stale: false };
  }

  try {
    const res = await fetch("https://dolarapi.com/v1/dolares", {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error("dolarapi non-200");
    const raw = (await res.json()) as Array<{
      nombre: string;
      compra: number | null;
      venta: number | null;
      promedio?: number | null;
    }>;

    const rates: FXRate[] = raw.map((r) => {
      const avg =
        r.promedio ??
        (r.compra != null && r.venta != null
          ? (r.compra + r.venta) / 2
          : (r.compra ?? r.venta ?? 0));
      return { name: r.nombre, buy: r.compra, sell: r.venta, avg };
    });
    _ratesCache = { data: rates, fetchedAt: now };
    return { rates, stale: false };
  } catch {
    if (_ratesCache) return { rates: _ratesCache.data, stale: true };
    return { rates: [], stale: true };
  }
};

export type FXRate = {
  name: string;
  buy: number | null;
  sell: number | null;
  avg: number;
};

const CURRENCY_RATE_MAP: Record<string, string[]> = {
  USD: ["USD Blue", "USD Oficial", "USD"],
  USDC: ["USDC", "USD Cripto"],
  EUR: ["EUR", "Euro"],
};

function findRate(currency: string, rates: FXRate[]): FXRate | undefined {
  const aliases = CURRENCY_RATE_MAP[currency];
  if (!aliases) return undefined;
  for (const alias of aliases) {
    const rate = rates.find((r) => r.name === alias);
    if (rate) return rate;
  }
  return undefined;
}

/**
 * Normalize an amount from one currency to another using ARS as pivot.
 * Returns 0 and logs a warning if a required rate is not found.
 * Pure function — no network calls, no side effects.
 */
export const normalizeToBase = (
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rates: FXRate[],
): number => {
  if (fromCurrency === toCurrency) return amount;

  // Step 1: convert from → ARS
  let arsAmount: number;
  if (fromCurrency === "ARS") {
    arsAmount = amount;
  } else {
    const rate = findRate(fromCurrency, rates);
    if (!rate) {
      console.warn(`[fx] Rate not found for currency: ${fromCurrency}`);
      return 0;
    }
    arsAmount = amount * rate.avg;
  }

  // Step 2: convert ARS → target
  if (toCurrency === "ARS") return arsAmount;

  const toRate = findRate(toCurrency, rates);
  if (!toRate) {
    console.warn(`[fx] Rate not found for target currency: ${toCurrency}`);
    return 0;
  }

  return arsAmount / toRate.avg;
};
