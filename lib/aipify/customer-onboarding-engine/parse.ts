import type { CustomerOnboardingEngineCard, CustomerOnboardingEngineDashboard } from "./types";

export function parseCustomerOnboardingEngineCard(data: unknown): CustomerOnboardingEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    current_step: typeof d.current_step === "string" ? d.current_step : undefined,
    completion_percentage: Number(d.completion_percentage ?? 0),
    completed: Boolean(d.completed),
    checklist_remaining: Number(d.checklist_remaining ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
  };
}

export function parseCustomerOnboardingEngineDashboard(
  data: unknown
): CustomerOnboardingEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    principles: Array.isArray(d.principles) ? (d.principles as string[]) : undefined,
    current_step: typeof d.current_step === "string" ? d.current_step : undefined,
    step_index: Number(d.step_index ?? 0),
    total_steps: Number(d.total_steps ?? 10),
    steps: Array.isArray(d.steps) ? (d.steps as CustomerOnboardingEngineDashboard["steps"]) : [],
    completion_percentage: Number(d.completion_percentage ?? 0),
    completed_at: typeof d.completed_at === "string" ? d.completed_at : null,
    checklist: Array.isArray(d.checklist)
      ? (d.checklist as CustomerOnboardingEngineDashboard["checklist"])
      : [],
    checklist_completed: Number(d.checklist_completed ?? 0),
    checklist_total: Number(d.checklist_total ?? 0),
    recommendations:
      typeof d.recommendations === "object" && d.recommendations
        ? (d.recommendations as CustomerOnboardingEngineDashboard["recommendations"])
        : undefined,
  };
}
