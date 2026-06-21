import {
  mapHealthScoreToHealthState,
  mapExecutivePriorityToSeverity,
  type HealthState,
} from "@/lib/design/semantic-status-system";
import type { RiskLevel, SuccessRecommendation, SuccessTimelineEvent } from "./types";
import { RECOMMENDATION_PRIORITY_ORDER, SUCCESS_RECOMMENDATION_LINKS } from "./config";

export function resolveOverviewHealthState(score: number, healthState?: string): HealthState {
  const normalized = String(healthState ?? "")
    .trim()
    .toLowerCase()
    .replace(/-/g, "_");
  if (["healthy", "moderate", "poor", "critical_health", "good"].includes(normalized)) {
    return normalized === "good" ? "healthy" : (normalized as HealthState);
  }
  return mapHealthScoreToHealthState(score);
}

export function mapRiskLevelToSeverity(risk: RiskLevel): string {
  switch (risk) {
    case "low":
      return "low";
    case "moderate":
      return "medium";
    case "elevated":
      return "high";
    case "high":
      return "critical";
    default:
      return "info";
  }
}

export function mapRecommendationPriorityToSeverity(priority: string): string {
  return mapExecutivePriorityToSeverity(
    priority === "high" ? "urgent" : priority === "medium" ? "attention" : "information"
  );
}

export type PurposeSummaryKey = "healthy" | "moderate" | "poor" | "critical";

export function resolvePurposeSummaryKey(healthState: HealthState): PurposeSummaryKey {
  if (healthState === "healthy" || healthState === "good") return "healthy";
  if (healthState === "moderate") return "moderate";
  if (healthState === "poor") return "poor";
  return "critical";
}

export function sortRecommendations(recommendations: SuccessRecommendation[]): SuccessRecommendation[] {
  return [...recommendations].sort((a, b) => {
    const pa = RECOMMENDATION_PRIORITY_ORDER[a.priority] ?? 9;
    const pb = RECOMMENDATION_PRIORITY_ORDER[b.priority] ?? 9;
    if (pa !== pb) return pa - pb;
    return a.key.localeCompare(b.key);
  });
}

export function partitionRecommendations(recommendations: SuccessRecommendation[]): {
  open: SuccessRecommendation[];
  completed: SuccessRecommendation[];
} {
  const open: SuccessRecommendation[] = [];
  const completed: SuccessRecommendation[] = [];
  for (const rec of sortRecommendations(recommendations)) {
    if (rec.status === "completed") completed.push(rec);
    else open.push(rec);
  }
  return { open, completed };
}

export function resolveRecommendationHref(key: string): string | undefined {
  return SUCCESS_RECOMMENDATION_LINKS[key]?.href;
}

export function dedupeTimelineEvents(events: SuccessTimelineEvent[]): SuccessTimelineEvent[] {
  const seen = new Set<string>();
  const out: SuccessTimelineEvent[] = [];
  for (const event of events) {
    if (event.type === "health_score_change") continue;
    const dedupeKey = `${event.type}:${event.id}`;
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);
    out.push(event);
  }
  return out.sort(
    (a, b) => new Date(b.occurred_at).getTime() - new Date(a.occurred_at).getTime()
  );
}

export function growthOpportunityAccent(key: string): "violet" | "blue" | "teal" {
  if (key === "plan_upgrade") return "teal";
  if (key === "integrations") return "blue";
  return "violet";
}
