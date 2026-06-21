import { mapRiskLevelToSeverity } from "@/lib/app-portal/success-center/presentation";
import type { RiskLevel } from "@/lib/app-portal/success-center/types";
import {
  formatScoreDisplayValue,
  resolveScoreHealthState,
  type ScoreEntry,
} from "@/lib/app-portal/customer-success/score-availability";
import type { HealthState } from "@/lib/design/semantic-status-system";
import type { CustomerHealthSortOption } from "./config";
import type {
  CustomerHealthDriver,
  CustomerHealthHistoryEntry,
  CustomerHealthLabels,
  CustomerHealthNeedsAttentionItem,
  CustomerHealthOperationalSignal,
  CustomerHealthOverviewSection,
  CustomerHealthRiskItem,
  CustomerHealthStrength,
  CustomerHealthTrendPoint,
  CustomerHealthTrendState,
} from "./types";

export function mapRiskLevelToSeverityValue(risk: RiskLevel | string): string {
  return mapRiskLevelToSeverity(risk as RiskLevel);
}

export function resolveHealthOverviewState(overview: CustomerHealthOverviewSection | undefined): HealthState {
  if (!overview) return "unknown";
  if (overview.score_availability !== "available" || overview.health_score === null) {
    return "unknown";
  }
  return resolveScoreHealthState({
    score: overview.health_score,
    availability: overview.score_availability,
    calculatedAt: overview.last_calculated_at ?? null,
    sourceFreshness: overview.source_freshness,
    explanationKey: overview.explanation_key,
  }) ?? overview.health_state ?? "unknown";
}

export function formatHealthScoreDisplay(overview: CustomerHealthOverviewSection | undefined): string {
  if (!overview) return "—";
  return formatScoreDisplayValue({
    score: overview.health_score,
    availability: overview.score_availability,
    calculatedAt: overview.last_calculated_at ?? null,
    sourceFreshness: overview.source_freshness,
    explanationKey: overview.explanation_key,
  });
}

export function formatScoreChangeDisplay(
  overview: CustomerHealthOverviewSection | undefined,
  unavailableLabel: string
): string {
  if (!overview || overview.score_availability !== "available") return unavailableLabel;
  if (overview.trend_state === "insufficient_data" || overview.score_change === null) {
    return unavailableLabel;
  }
  const change = overview.score_change;
  return `${change >= 0 ? "+" : ""}${change}`;
}

export function resolveDriverEffectSemantic(effect: string): HealthState | "unknown" {
  if (effect === "unavailable") return "unknown";
  if (effect === "positive") return "healthy";
  if (effect === "critical_negative") return "critical_health";
  if (effect === "strong_negative") return "poor";
  if (effect === "moderate_negative") return "moderate";
  return "unknown";
}

export function mapSignalStatusToSemantic(status: string | undefined): string {
  switch (status) {
    case "positive":
      return "healthy";
    case "warning":
      return "moderate";
    case "unavailable":
      return "unknown";
    default:
      return "unknown";
  }
}

export function mapHistoryStatusToSemantic(status: string | undefined): HealthState | "unknown" {
  const normalized = String(status ?? "")
    .trim()
    .toLowerCase()
    .replace(/-/g, "_");
  if (["healthy", "good", "moderate", "poor", "critical_health"].includes(normalized)) {
    return normalized === "good" ? "healthy" : (normalized as HealthState);
  }
  if (normalized === "unavailable" || normalized === "neutral" || normalized === "unknown") {
    return "unknown";
  }
  return "unknown";
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

export function resolveRiskDescription(
  risk: CustomerHealthRiskItem,
  labels: CustomerHealthLabels
): string {
  if (risk.description_key) {
    const template =
      labels.riskDescriptions[risk.description_key as keyof typeof labels.riskDescriptions];
    if (template && risk.description_params?.count != null) {
      return template.replace("{count}", String(risk.description_params.count));
    }
    if (template) return template;
  }
  return risk.description ?? labels.risks[risk.key as keyof typeof labels.risks] ?? risk.key;
}

export function resolveSignalDescription(
  signal: CustomerHealthOperationalSignal,
  labels: CustomerHealthLabels
): string {
  if (signal.description_key) {
    const template =
      labels.signalDescriptions[signal.description_key as keyof typeof labels.signalDescriptions];
    if (template && signal.description_params?.count != null) {
      return template.replace("{count}", String(signal.description_params.count));
    }
    if (template) return template;
  }
  return (
    signal.description ??
    labels.operationalSignals[signal.key as keyof typeof labels.operationalSignals] ??
    signal.key
  );
}

export function resolveStrengthDisplay(
  strength: CustomerHealthStrength,
  labels: CustomerHealthLabels
): string {
  const key = strength.description_key ?? strength.key;
  const template = labels.strengthValues[key as keyof typeof labels.strengthValues];
  if (template) {
    return template.replace("{count}", String(strength.value));
  }
  if (strength.value === 0) {
    return labels.strengthValues.none ?? "—";
  }
  return String(strength.value);
}

export function resolveHistoryDescription(
  entry: CustomerHealthHistoryEntry,
  labels: CustomerHealthLabels
): string {
  if (entry.description_key) {
    const template =
      labels.historyDescriptions[entry.description_key as keyof typeof labels.historyDescriptions];
    const score = entry.score ?? entry.description_params?.overall_score;
    if (template && score != null) {
      return template.replace("{score}", String(score));
    }
    if (template) return template;
  }
  return entry.description ?? entry.event_type;
}

export function resolveExplanationLabel(
  overview: CustomerHealthOverviewSection | undefined,
  labels: CustomerHealthLabels
): string {
  if (!overview) return labels.scoreAvailability.insufficient_data;
  const normalizedKey = overview.explanation_key.replace(".customerSuccess.", ".customerHealth.");
  const key = normalizedKey.split(".").pop() ?? "insufficientData";
  const camel = key.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());
  return (
    labels.scoreAvailabilityDescriptions[camel as keyof typeof labels.scoreAvailabilityDescriptions] ??
    labels.scoreAvailability[overview.score_availability] ??
    labels.overview.explanation
  );
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

export function filterRisksAndSignals<T extends { category?: string; description?: string }>(
  items: T[],
  category: string,
  search: string
): T[] {
  const q = search.trim().toLowerCase();
  return items.filter((item) => {
    if (category && item.category !== category) return false;
    if (q && !(item.description ?? "").toLowerCase().includes(q)) return false;
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
  const sorted = [...drivers].filter((d) => d.effect !== "unavailable").sort((a, b) => (a.score ?? 0) - (b.score ?? 0));
  return sorted.find((d) => negativeEffects.has(d.effect)) ?? sorted[0] ?? null;
}

export function partitionVerifiedStrengths(strengths: CustomerHealthStrength[] | undefined): CustomerHealthStrength[] {
  return (strengths ?? []).filter((s) => s.impact === "positive" && s.availability !== "insufficient_data");
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

export function isScoreAvailable(entry: ScoreEntry | CustomerHealthOverviewSection | undefined): boolean {
  if (!entry) return false;
  if ("score_availability" in entry) return entry.score_availability === "available";
  return entry.availability === "available";
}
