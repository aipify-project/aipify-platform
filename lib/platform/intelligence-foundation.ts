import type { ActivityLogEntry, OpportunitySignal } from "./types";
import {
  parseCustomerSelfLearning,
  type CustomerSelfLearning,
} from "./self-learning";

export type TimelineCategory =
  | "support"
  | "billing"
  | "automation"
  | "installation"
  | "user"
  | "system"
  | "ai_recommendation"
  | "subscription";

export type CustomerTimelineEvent = {
  id: string;
  tenant_id: string;
  category: TimelineCategory;
  title: string;
  description: string | null;
  metadata: Record<string, unknown>;
  event_date: string;
  created_at: string;
};

export type AiRecommendationRecord = {
  id: string;
  tenant_id: string;
  title: string;
  reason: string;
  recommendation: string;
  priority: "low" | "medium" | "high" | "critical";
  confidence_score: number;
  status: "active" | "dismissed" | "executed";
  dismissed_at: string | null;
  created_at: string;
};

export type CustomerSuccessScoreRecord = {
  id: string;
  tenant_id: string;
  score: number;
  login_score: number;
  feature_adoption_score: number;
  support_score: number;
  automation_score: number;
  ai_interaction_score: number;
  updated_at: string;
};

export type InstallationHealthRecord = {
  id: string;
  tenant_id: string;
  health_score: number;
  api_health: number;
  webhook_health: number;
  integration_health: number;
  last_scan_at: string | null;
  created_at: string;
  updated_at: string;
};

export type AutomationRunRecord = {
  id: string;
  tenant_id: string;
  automation_name: string;
  status: "success" | "warning" | "failed";
  execution_time_ms: number | null;
  error_message: string | null;
  executed_at: string;
};

export type OpportunitySignalRecord = {
  id: string;
  tenant_id: string;
  type:
    | "upgrade_opportunity"
    | "retention_risk"
    | "low_engagement"
    | "expansion_opportunity"
    | "customer_advocate";
  severity: string;
  status: "active" | "resolved" | "dismissed";
  detected_at: string;
  resolved_at: string | null;
};

export type CustomerIntelligenceFoundation = {
  timeline: CustomerTimelineEvent[];
  ai_recommendations: AiRecommendationRecord[];
  success_score: CustomerSuccessScoreRecord | null;
  installation_health: InstallationHealthRecord | null;
  automation_runs: AutomationRunRecord[];
  opportunity_signals: OpportunitySignalRecord[];
  self_learning: CustomerSelfLearning;
};

const TIMELINE_CATEGORY_STYLES: Record<TimelineCategory, string> = {
  support: "bg-blue-50 text-blue-700 ring-blue-100",
  billing: "bg-amber-50 text-amber-700 ring-amber-100",
  automation: "bg-violet-50 text-violet-700 ring-violet-100",
  installation: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  user: "bg-indigo-50 text-indigo-700 ring-indigo-100",
  system: "bg-gray-50 text-gray-700 ring-gray-100",
  ai_recommendation: "bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-100",
  subscription: "bg-sky-50 text-sky-700 ring-sky-100",
};

export function getTimelineCategoryStyle(category: TimelineCategory): string {
  return TIMELINE_CATEGORY_STYLES[category] ?? TIMELINE_CATEGORY_STYLES.system;
}

export function formatRelativeTime(isoDate: string, locale: string): string {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(isoDate).toLocaleDateString(locale);
}

export function timelineToActivityCompat(
  events: CustomerTimelineEvent[]
): ActivityLogEntry[] {
  return events.map((event) => ({
    id: event.id,
    customer_id: event.tenant_id,
    event_type: event.category,
    title: event.title,
    category: mapTimelineToActivityCategory(event.category),
    details: {
      ...event.metadata,
      description: event.description ?? undefined,
    },
    created_at: event.event_date,
  }));
}

function mapTimelineToActivityCategory(
  category: TimelineCategory
): ActivityLogEntry["category"] {
  if (category === "installation") return "installations";
  if (category === "automation") return "automations";
  if (category === "user") return "users";
  if (category === "ai_recommendation") return "ai_recommendations";
  return category as ActivityLogEntry["category"];
}

export function aiRecommendationsToWorkspace(
  records: AiRecommendationRecord[]
): Array<{
  id: string;
  message: string;
  priority: "low" | "normal" | "high" | "urgent";
  recommendedAction: string;
  confidence: number;
  source: "db";
}> {
  const priorityMap: Record<AiRecommendationRecord["priority"], "low" | "normal" | "high" | "urgent"> = {
    low: "low",
    medium: "normal",
    high: "high",
    critical: "urgent",
  };
  return records.map((rec) => ({
    id: rec.id,
    message: rec.title,
    priority: priorityMap[rec.priority],
    recommendedAction: rec.recommendation,
    confidence: rec.confidence_score,
    source: "db" as const,
  }));
}

export function opportunityTypeToSignal(
  type: OpportunitySignalRecord["type"]
): OpportunitySignal {
  const map: Record<OpportunitySignalRecord["type"], OpportunitySignal> = {
    upgrade_opportunity: "upgrade",
    expansion_opportunity: "expansion",
    retention_risk: "retention_risk",
    low_engagement: "low_engagement",
    customer_advocate: "advocate",
  };
  return map[type] ?? "low_engagement";
}

export function parseIntelligenceFoundation(data: unknown): CustomerIntelligenceFoundation {
  const raw = (data ?? {}) as Record<string, unknown>;
  return {
    timeline: Array.isArray(raw.timeline) ? (raw.timeline as CustomerTimelineEvent[]) : [],
    ai_recommendations: Array.isArray(raw.ai_recommendations)
      ? (raw.ai_recommendations as AiRecommendationRecord[])
      : [],
    success_score: (raw.success_score as CustomerSuccessScoreRecord) ?? null,
    installation_health: (raw.installation_health as InstallationHealthRecord) ?? null,
    automation_runs: Array.isArray(raw.automation_runs)
      ? (raw.automation_runs as AutomationRunRecord[])
      : [],
    opportunity_signals: Array.isArray(raw.opportunity_signals)
      ? (raw.opportunity_signals as OpportunitySignalRecord[])
      : [],
    self_learning: parseCustomerSelfLearning(raw.self_learning),
  };
}
