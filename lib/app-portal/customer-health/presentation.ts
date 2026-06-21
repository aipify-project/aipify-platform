import { mapRiskLevelToSeverity } from "@/lib/app-portal/success-center/presentation";
import type { RiskLevel } from "@/lib/app-portal/success-center/types";
import type { CustomerHealthSortOption } from "./config";
import type {
  CustomerHealthDriver,
  CustomerHealthHistoryEntry,
  CustomerHealthNeedsAttentionItem,
  CustomerHealthOperationalSignal,
  CustomerHealthRiskItem,
  CustomerHealthStrength,
  CustomerHealthTrendPoint,
  CustomerHealthTrendState,
} from "./types";

export function mapRiskLevelToSeverityValue(risk: RiskLevel | string): string {
  return mapRiskLevelToSeverity(risk as RiskLevel);
}

export function resolveTrendIcon(trend: CustomerHealthTrendState): string {
  switch (trend) {
    case "improving":
      return "↑";
    case "declining":
      return "↓";
    case "rapid_decline":
      return "↓↓";
    case "stable":
      return "→";
    default:
      return "—";
  }
}

export function sortNeedsAttention(
  items: CustomerHealthNeedsAttentionItem[]
): CustomerHealthNeedsAttentionItem[] {
  const severityOrder: Record<string, number> = {
    critical: 0,
    high: 1,
    medium: 2,
    low: 3,
    info: 4,
  };
  return [...items].sort((a, b) => {
    const sa = severityOrder[a.severity] ?? 9;
    const sb = severityOrder[b.severity] ?? 9;
    if (sa !== sb) return sa - sb;
    return a.key.localeCompare(b.key);
  });
}

export function sortHistoryEntries(
  entries: CustomerHealthHistoryEntry[],
  sortBy: CustomerHealthSortOption
): CustomerHealthHistoryEntry[] {
  const copy = [...entries];
  if (sortBy === "date_asc") {
    return copy.sort(
      (a, b) => new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime()
    );
  }
  return copy.sort(
    (a, b) => new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime()
  );
}

export function dedupeHealthHistory(
  entries: CustomerHealthHistoryEntry[]
): CustomerHealthHistoryEntry[] {
  const seen = new Set<string>();
  const out: CustomerHealthHistoryEntry[] = [];
  for (const entry of entries) {
    const minute = entry.recorded_at.slice(0, 16);
    const dedupeKey = `${entry.event_type}:${entry.score ?? "na"}:${minute}`;
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);
    out.push(entry);
  }
  return out;
}

export function filterRisksAndSignals<T extends { category?: string; description: string }>(
  items: T[],
  category: string,
  search: string
): T[] {
  const q = search.trim().toLowerCase();
  return items.filter((item) => {
    if (category && item.category !== category) return false;
    if (q && !item.description.toLowerCase().includes(q)) return false;
    return true;
  });
}

export function hasTrendChartData(points: CustomerHealthTrendPoint[] | undefined): boolean {
  return (points?.length ?? 0) >= 2;
}

export function topDriverForAction(drivers: CustomerHealthDriver[]): CustomerHealthDriver | null {
  const negativeEffects = new Set([
    "moderate_negative",
    "strong_negative",
    "critical_negative",
  ]);
  const sorted = [...drivers].sort((a, b) => a.score - b.score);
  return sorted.find((d) => negativeEffects.has(d.effect)) ?? sorted[0] ?? null;
}

export function partitionVerifiedStrengths(strengths: CustomerHealthStrength[] | undefined): CustomerHealthStrength[] {
  return (strengths ?? []).filter((s) => s.impact === "positive");
}

export function sortRisks(items: CustomerHealthRiskItem[]): CustomerHealthRiskItem[] {
  const severityOrder: Record<string, number> = {
    critical: 0,
    high: 1,
    medium: 2,
    low: 3,
    info: 4,
  };
  return [...items].sort((a, b) => {
    const sa = severityOrder[a.severity] ?? 9;
    const sb = severityOrder[b.severity] ?? 9;
    if (sa !== sb) return sa - sb;
    return a.key.localeCompare(b.key);
  });
}

export function sortOperationalSignals(
  items: CustomerHealthOperationalSignal[]
): CustomerHealthOperationalSignal[] {
  return [...items].sort(
    (a, b) => a.category.localeCompare(b.category) || a.key.localeCompare(b.key)
  );
}
