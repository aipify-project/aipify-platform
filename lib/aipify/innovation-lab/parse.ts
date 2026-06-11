import type {
  InnovationLabActionResult,
  InnovationLabBriefingResult,
  InnovationLabCard,
  InnovationLabDashboard,
} from "./types";

export function parseInnovationLabCard(data: unknown): InnovationLabCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    innovation_score: Number(d.innovation_score ?? 0),
    active_experiments: Number(d.active_experiments ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    human_oversight_required: Boolean(d.human_oversight_required),
  };
}

export function parseInnovationLabDashboard(data: unknown): InnovationLabDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    human_oversight_required: Boolean(d.human_oversight_required),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    lab_enabled: Boolean(d.lab_enabled ?? true),
    sandbox_enabled: Boolean(d.sandbox_enabled ?? true),
    customer_cocreation_enabled: Boolean(d.customer_cocreation_enabled ?? true),
    feature_flags_enabled: Boolean(d.feature_flags_enabled ?? true),
    executive_approval_required: Boolean(d.executive_approval_required ?? true),
    failure_learning_enabled: Boolean(d.failure_learning_enabled ?? true),
    innovation_score: Number(d.innovation_score ?? 0),
    experiment_completion_pct: Number(d.experiment_completion_pct ?? 0),
    active_experiments: Number(d.active_experiments ?? 0),
    ideas_in_pipeline: Number(d.ideas_in_pipeline ?? 0),
    return_on_innovation: Number(d.return_on_innovation ?? 0),
    lab_structure: Array.isArray(d.lab_structure)
      ? (d.lab_structure as InnovationLabDashboard["lab_structure"])
      : [],
    experiment_stages: Array.isArray(d.experiment_stages) ? (d.experiment_stages as string[]) : [],
    sandbox_capabilities: Array.isArray(d.sandbox_capabilities) ? (d.sandbox_capabilities as string[]) : [],
    ideas: Array.isArray(d.ideas) ? (d.ideas as InnovationLabDashboard["ideas"]) : [],
    experiments: Array.isArray(d.experiments) ? (d.experiments as InnovationLabDashboard["experiments"]) : [],
    pilot_programs: Array.isArray(d.pilot_programs) ? (d.pilot_programs as InnovationLabDashboard["pilot_programs"]) : [],
    feature_flags: Array.isArray(d.feature_flags) ? (d.feature_flags as InnovationLabDashboard["feature_flags"]) : [],
    scorecard: typeof d.scorecard === "object" && d.scorecard
      ? (d.scorecard as InnovationLabDashboard["scorecard"])
      : undefined,
    lessons_learned: Array.isArray(d.lessons_learned)
      ? (d.lessons_learned as InnovationLabDashboard["lessons_learned"])
      : [],
    governance_controls: Array.isArray(d.governance_controls) ? (d.governance_controls as string[]) : [],
    briefings: Array.isArray(d.briefings) ? (d.briefings as InnovationLabDashboard["briefings"]) : [],
    integrations: typeof d.integrations === "object" && d.integrations
      ? (d.integrations as Record<string, string>)
      : undefined,
  };
}

export function parseInnovationLabActionResult(data: unknown): InnovationLabActionResult {
  return (data ?? {}) as InnovationLabActionResult;
}

export function parseInnovationLabBriefingResult(data: unknown): InnovationLabBriefingResult {
  return (data ?? {}) as InnovationLabBriefingResult;
}
