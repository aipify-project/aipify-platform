import type {
  InnovationEngagementSummary,
  InnovationLabActionResult,
  InnovationLabBriefingResult,
  InnovationLabCard,
  InnovationLabDashboard,
} from "./types";

function parseEngagementSummary(data: unknown): InnovationEngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  const d = data as Record<string, unknown>;
  return {
    ideas_total: Number(d.ideas_total ?? 0),
    ideas_approved: Number(d.ideas_approved ?? 0),
    ideas_in_experiment: Number(d.ideas_in_experiment ?? 0),
    experiments_total: Number(d.experiments_total ?? 0),
    experiments_active: Number(d.experiments_active ?? 0),
    experiments_completed: Number(d.experiments_completed ?? 0),
    pilots_total: Number(d.pilots_total ?? 0),
    pilots_active: Number(d.pilots_active ?? 0),
    feature_flags_controlled: Number(d.feature_flags_controlled ?? 0),
    lessons_total: Number(d.lessons_total ?? 0),
    lessons_learning_or_pivot: Number(d.lessons_learning_or_pivot ?? 0),
    sandbox_isolated: Boolean(d.sandbox_isolated ?? true),
    privacy_note: typeof d.privacy_note === "string" ? d.privacy_note : undefined,
  };
}

export function parseInnovationLabCard(data: unknown): InnovationLabCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    innovation_score: Number(d.innovation_score ?? 0),
    active_experiments: Number(d.active_experiments ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    human_oversight_required: Boolean(d.human_oversight_required),
    implementation_blueprint_phase38:
      typeof d.implementation_blueprint_phase38 === "object" && d.implementation_blueprint_phase38
        ? (d.implementation_blueprint_phase38 as InnovationLabCard["implementation_blueprint_phase38"])
        : undefined,
    innovation_lab_mission: typeof d.innovation_lab_mission === "string" ? d.innovation_lab_mission : undefined,
    innovation_abos_principle:
      typeof d.innovation_abos_principle === "string" ? d.innovation_abos_principle : undefined,
    innovation_engagement_summary: parseEngagementSummary(d.innovation_engagement_summary),
    blueprint_note: typeof d.blueprint_note === "string" ? d.blueprint_note : undefined,
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
    implementation_blueprint_phase38:
      typeof d.implementation_blueprint_phase38 === "object" && d.implementation_blueprint_phase38
        ? (d.implementation_blueprint_phase38 as InnovationLabDashboard["implementation_blueprint_phase38"])
        : undefined,
    innovation_lab_mission: typeof d.innovation_lab_mission === "string" ? d.innovation_lab_mission : undefined,
    innovation_lab_philosophy:
      typeof d.innovation_lab_philosophy === "string" ? d.innovation_lab_philosophy : undefined,
    innovation_objectives: Array.isArray(d.innovation_objectives)
      ? (d.innovation_objectives as InnovationLabDashboard["innovation_objectives"])
      : undefined,
    idea_management:
      typeof d.idea_management === "object" && d.idea_management
        ? (d.idea_management as InnovationLabDashboard["idea_management"])
        : undefined,
    experimentation_principles:
      typeof d.experimentation_principles === "object" && d.experimentation_principles
        ? (d.experimentation_principles as InnovationLabDashboard["experimentation_principles"])
        : undefined,
    companion_innovation_support: Array.isArray(d.companion_innovation_support)
      ? (d.companion_innovation_support as InnovationLabDashboard["companion_innovation_support"])
      : undefined,
    learning_capture:
      typeof d.learning_capture === "object" && d.learning_capture
        ? (d.learning_capture as InnovationLabDashboard["learning_capture"])
        : undefined,
    innovation_self_love_connection:
      typeof d.innovation_self_love_connection === "object" && d.innovation_self_love_connection
        ? (d.innovation_self_love_connection as InnovationLabDashboard["innovation_self_love_connection"])
        : undefined,
    innovation_recognition_experiences:
      typeof d.innovation_recognition_experiences === "object" && d.innovation_recognition_experiences
        ? (d.innovation_recognition_experiences as InnovationLabDashboard["innovation_recognition_experiences"])
        : undefined,
    innovation_trust_connection:
      typeof d.innovation_trust_connection === "object" && d.innovation_trust_connection
        ? (d.innovation_trust_connection as InnovationLabDashboard["innovation_trust_connection"])
        : undefined,
    innovation_dogfooding:
      typeof d.innovation_dogfooding === "object" && d.innovation_dogfooding
        ? (d.innovation_dogfooding as InnovationLabDashboard["innovation_dogfooding"])
        : undefined,
    innovation_success_criteria: Array.isArray(d.innovation_success_criteria)
      ? (d.innovation_success_criteria as InnovationLabDashboard["innovation_success_criteria"])
      : undefined,
    innovation_vision_phrases: Array.isArray(d.innovation_vision_phrases)
      ? (d.innovation_vision_phrases as string[])
      : undefined,
    innovation_abos_principle:
      typeof d.innovation_abos_principle === "string" ? d.innovation_abos_principle : undefined,
    innovation_distinction_note:
      typeof d.innovation_distinction_note === "string" ? d.innovation_distinction_note : undefined,
    innovation_integration_links: Array.isArray(d.innovation_integration_links)
      ? (d.innovation_integration_links as InnovationLabDashboard["innovation_integration_links"])
      : undefined,
    innovation_engagement_summary: parseEngagementSummary(d.innovation_engagement_summary),
  };
}

export function parseInnovationLabActionResult(data: unknown): InnovationLabActionResult {
  return (data ?? {}) as InnovationLabActionResult;
}

export function parseInnovationLabBriefingResult(data: unknown): InnovationLabBriefingResult {
  return (data ?? {}) as InnovationLabBriefingResult;
}
