import type {
  OnboardingOverview,
  OnboardingRecommendationsResponse,
  OnboardingResponse,
  OnboardingStatus,
  OnboardingTask,
  OverviewStatus,
} from "./types";
import { reconcileIntegrationTask } from "./presentation";

const TASK_STATUS: Set<OnboardingStatus> = new Set([
  "not_started",
  "in_progress",
  "completed",
  "optional",
  "blocked",
]);
const OVERVIEW_STATUS: Set<OverviewStatus> = new Set(["not_started", "in_progress", "completed"]);

function str(v: unknown, fb = ""): string {
  return typeof v === "string" ? v : fb;
}

function num(v: unknown, fb = 0): number {
  return typeof v === "number" ? v : fb;
}

function bool(v: unknown): boolean {
  return v === true;
}

function parseTask(row: unknown): OnboardingTask {
  const r = (row ?? {}) as Record<string, unknown>;
  const status = str(r.status, "not_started") as OnboardingStatus;
  return {
    key: str(r.key),
    category: str(r.category),
    optional: bool(r.optional),
    status: TASK_STATUS.has(status) ? status : "not_started",
    completed_at: str(r.completed_at) || null,
    auto_detected: bool(r.auto_detected),
  };
}

function parseOverview(ov: unknown): OnboardingOverview {
  const o = (ov ?? {}) as Record<string, unknown>;
  const status = str(o.status, "not_started") as OverviewStatus;
  return {
    status: OVERVIEW_STATUS.has(status) ? status : "not_started",
    progress_percent: num(o.progress_percent),
    required_completed: num(o.required_completed),
    required_total: num(o.required_total),
    started_at: str(o.started_at) || null,
    completed_at: str(o.completed_at) || null,
    last_updated_at: str(o.last_updated_at) || null,
  };
}

export function parseOnboarding(data: unknown): OnboardingResponse {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  const adoption = (d.adoption_insights ?? {}) as Record<string, unknown>;
  const connected = num(d.connected_integrations);
  const checklist = Array.isArray(d.checklist)
    ? reconcileIntegrationTask(d.checklist.map(parseTask), connected)
    : [];

  return {
    found: d.found === true,
    started: d.started === true,
    connected_integrations: connected,
    overview: parseOverview(d.overview),
    checklist,
    milestones: Array.isArray(d.milestones)
      ? d.milestones.map((m) => {
          const row = m as Record<string, unknown>;
          return { key: str(row.key), celebration: bool(row.celebration) };
        })
      : [],
    recommendations: Array.isArray(d.recommendations)
      ? d.recommendations.map((r) => {
          const row = r as Record<string, unknown>;
          return {
            id: str(row.id),
            key: str(row.key),
            priority: str(row.priority),
            module: str(row.module) || undefined,
          };
        })
      : [],
    adoption_insights: {
      features_explored: num(adoption.features_explored),
      features_not_discovered: Array.isArray(adoption.features_not_discovered)
        ? adoption.features_not_discovered.map((x) => str(x))
        : [],
      suggested_business_packs: Array.isArray(adoption.suggested_business_packs)
        ? adoption.suggested_business_packs.map((x) => str(x))
        : [],
      recommended_actions: Array.isArray(adoption.recommended_actions)
        ? adoption.recommended_actions.map((r) => {
            const row = r as Record<string, unknown>;
            return {
              id: str(row.id),
              key: str(row.key),
              priority: str(row.priority),
              module: str(row.module) || undefined,
            };
          })
        : [],
    },
    completed_milestones: Array.isArray(d.completed_milestones) ? d.completed_milestones.map(parseTask) : [],
  };
}

export function parseOnboardingRecommendations(data: unknown): OnboardingRecommendationsResponse {
  if (!data || typeof data !== "object") return { found: false, recommendations: [] };
  const d = data as Record<string, unknown>;
  return {
    found: d.found === true,
    advisory_only: d.advisory_only === true,
    recommendations: Array.isArray(d.recommendations)
      ? d.recommendations.map((r) => {
          const row = r as Record<string, unknown>;
          return {
            id: str(row.id),
            key: str(row.key),
            priority: str(row.priority),
            module: str(row.module) || undefined,
          };
        })
      : [],
  };
}
