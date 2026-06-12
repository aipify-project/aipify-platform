import type { MarketingDictionary } from "@/lib/marketing/get-marketing-context";

export function recordValues<T>(obj: Record<string, T> | undefined): T[] {
  if (!obj) return [];
  return Object.keys(obj)
    .sort((a, b) => {
      const na = Number(a);
      const nb = Number(b);
      if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb;
      return a.localeCompare(b);
    })
    .map((key) => obj[key]);
}

export function stringRecord(obj: Record<string, string> | undefined): string[] {
  return recordValues(obj);
}

export function getMarketingSection<T>(marketing: MarketingDictionary, key: string): T {
  return (marketing[key] ?? {}) as T;
}
