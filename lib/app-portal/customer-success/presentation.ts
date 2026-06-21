import {
  mapExecutivePriorityToSeverity,
  mapHealthScoreToHealthState,
  type HealthState,
} from "@/lib/design/semantic-status-system";
import {
  formatScoreDisplayValue,
  resolveScoreHealthState,
  type ScoreEntry,
} from "./score-availability";
import type { SuccessPlanStatus } from "./config";
import type { CustomerSuccessLabels, CustomerSuccessRecommendation } from "./types";
import { CUSTOMER_SUCCESS_RECOMMENDATION_LINKS, RECOMMENDATION_PRIORITY_ORDER } from "./config";

function snakeToCamel(value: string): string {
  return value.replace(/_([a-z])/g, (_, char: string) => char.toUpperCase());
}

export function resolveScoreCardHealthState(entry: ScoreEntry | undefined): HealthState {
  if (!entry || entry.availability !== "available" || entry.score === null) return "unknown";
  return resolveScoreHealthState(entry) ?? "unknown";
}

export function resolveScoreStatusLabel(
  entry: ScoreEntry | undefined,
  labels: CustomerSuccessLabels
): string {
  if (!entry) return labels.healthStates.unknown;
  if (entry.availability !== "available" || entry.score === null) {
    const key = snakeToCamel(entry.availability) as keyof typeof labels.scoreAvailability;
    return labels.scoreAvailability[key] ?? labels.healthStates.unknown;
  }
  const health = resolveScoreHealthState(entry) ?? "unknown";
  return labels.healthStates[health] ?? labels.healthStates.unknown;
}

export function resolveScoreDescription(
  entry: ScoreEntry | undefined,
  labels: CustomerSuccessLabels
): string {
  if (!entry) return labels.scoreAvailabilityDescriptions.insufficientData;
  const key = snakeToCamel(entry.availability) as keyof typeof labels.scoreAvailabilityDescriptions;
  return labels.scoreAvailabilityDescriptions[key] ?? labels.overview.advisory;
}

export function formatScoreCardValue(entry: ScoreEntry | undefined): string {
  if (!entry) return "—";
  return formatScoreDisplayValue(entry);
}

export function resolveWorkflowStatusLabel(status: string, labels: CustomerSuccessLabels): string {
  const normalized = status.trim().toLowerCase();
  return labels.workflowStates[normalized as keyof typeof labels.workflowStates] ?? status;
}

export function resolveRiskImpactLabel(impact: string, labels: CustomerSuccessLabels): string {
  const normalized = impact.trim().toLowerCase();
  if (normalized === "major") return labels.severityLabels.high;
  if (normalized === "moderate") return labels.severityLabels.medium;
  return labels.severityLabels[normalized as keyof typeof labels.severityLabels] ?? impact;
}

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

export function mapRecommendationPriorityToSeverity(priority: string): string {
  switch (priority) {
    case "high_impact":
      return mapExecutivePriorityToSeverity("urgent");
    case "important":
      return mapExecutivePriorityToSeverity("attention");
    case "recommended":
      return mapExecutivePriorityToSeverity("attention");
    case "opportunity":
      return "info";
    default:
      return "info";
  }
}

export function sortRecommendations(recommendations: CustomerSuccessRecommendation[]): CustomerSuccessRecommendation[] {
  return [...recommendations].sort((a, b) => {
    const pa = RECOMMENDATION_PRIORITY_ORDER[a.priority] ?? 9;
    const pb = RECOMMENDATION_PRIORITY_ORDER[b.priority] ?? 9;
    if (pa !== pb) return pa - pb;
    return a.key.localeCompare(b.key);
  });
}

export function resolveRecommendationHref(key: string): string | undefined {
  return CUSTOMER_SUCCESS_RECOMMENDATION_LINKS[key]?.href;
}

export function mapPlanStatusToWorkflow(status: string): string {
  switch (status) {
    case "draft":
      return "pending";
    case "active":
      return "open";
    case "in_progress":
      return "in_progress";
    case "requires_attention":
      return "overdue";
    case "at_risk":
      return "blocked";
    case "blocked":
      return "blocked";
    case "completed":
      return "completed";
    case "archived":
      return "cancelled";
    default:
      return "open";
  }
}

export function mapPlanStatusToLifecycle(status: string): string | undefined {
  if (status === "active") return "active";
  if (status === "archived") return "archived";
  return undefined;
}

export function mapPlanStatusToSeverity(status: SuccessPlanStatus | string): string | undefined {
  if (status === "requires_attention" || status === "at_risk") return "high";
  if (status === "blocked") return "medium";
  return undefined;
}

export function mapRiskImpactToSeverity(impact: string): string {
  switch (impact) {
    case "critical":
      return "critical";
    case "major":
      return "high";
    case "moderate":
      return "medium";
    case "minor":
      return "low";
    default:
      return "info";
  }
}

export function mapFollowUpStatusToWorkflow(status: string): string {
  switch (status) {
    case "open":
      return "open";
    case "in_progress":
      return "in_progress";
    case "waiting":
      return "pending";
    case "completed":
      return "completed";
    case "cancelled":
      return "cancelled";
    case "escalated":
      return "blocked";
    default:
      return "open";
  }
}

export function isFollowUpOverdue(dueAt?: string, status?: string): boolean {
  if (!dueAt || status === "completed" || status === "cancelled") return false;
  return new Date(dueAt).getTime() < Date.now();
}

export function isValidSortOption(value: string): boolean {
  return ["due_date", "priority", "title", "progress", "updated"].includes(value);
}
