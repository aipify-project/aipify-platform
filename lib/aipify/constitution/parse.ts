import type {
  ConstitutionActionResult,
  ConstitutionBriefingResult,
  ConstitutionCard,
  ConstitutionDashboard,
} from "./types";

export function parseConstitutionCard(data: unknown): ConstitutionCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    constitution_score: Number(d.constitution_score ?? 0),
    principles_count: Number(d.principles_count ?? 0),
    current_version: typeof d.current_version === "string" ? d.current_version : undefined,
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    human_oversight_required: Boolean(d.human_oversight_required),
  };
}

export function parseConstitutionDashboard(data: unknown): ConstitutionDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    human_oversight_required: Boolean(d.human_oversight_required),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    constitution_enabled: Boolean(d.constitution_enabled ?? true),
    acknowledgement_required: Boolean(d.acknowledgement_required ?? true),
    partner_alignment_tracking: Boolean(d.partner_alignment_tracking ?? true),
    current_version: typeof d.current_version === "string" ? d.current_version : undefined,
    review_cycle_months: Number(d.review_cycle_months ?? 12),
    constitution_score: Number(d.constitution_score ?? 0),
    principles_count: Number(d.principles_count ?? 0),
    principles_acknowledged: Number(d.principles_acknowledged ?? 0),
    alignment_score: Number(d.alignment_score ?? 0),
    partner_alignment_avg: Number(d.partner_alignment_avg ?? 0),
    preamble: typeof d.preamble === "string" ? d.preamble : undefined,
    decision_framework: Array.isArray(d.decision_framework) ? (d.decision_framework as string[]) : [],
    core_principles: Array.isArray(d.core_principles) ? (d.core_principles as ConstitutionDashboard["core_principles"]) : [],
    responsible_ai_commitments: Array.isArray(d.responsible_ai_commitments)
      ? (d.responsible_ai_commitments as ConstitutionDashboard["responsible_ai_commitments"])
      : [],
    commitment_records: Array.isArray(d.commitment_records)
      ? (d.commitment_records as ConstitutionDashboard["commitment_records"])
      : [],
    constitutional_reviews: Array.isArray(d.constitutional_reviews)
      ? (d.constitutional_reviews as ConstitutionDashboard["constitutional_reviews"])
      : [],
    partner_alignment: Array.isArray(d.partner_alignment)
      ? (d.partner_alignment as ConstitutionDashboard["partner_alignment"])
      : [],
    governance_decisions: Array.isArray(d.governance_decisions)
      ? (d.governance_decisions as ConstitutionDashboard["governance_decisions"])
      : [],
    review_process: Array.isArray(d.review_process) ? (d.review_process as string[]) : [],
    briefings: Array.isArray(d.briefings) ? (d.briefings as ConstitutionDashboard["briefings"]) : [],
    integrations: typeof d.integrations === "object" && d.integrations
      ? (d.integrations as Record<string, string>)
      : undefined,
  };
}

export function parseConstitutionActionResult(data: unknown): ConstitutionActionResult {
  return (data ?? {}) as ConstitutionActionResult;
}

export function parseConstitutionBriefingResult(data: unknown): ConstitutionBriefingResult {
  return (data ?? {}) as ConstitutionBriefingResult;
}
