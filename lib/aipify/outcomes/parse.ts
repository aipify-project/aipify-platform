import type { OutcomesCard, OutcomesDashboard, ValidationActionResult } from "./types";

export function parseOutcomesCard(data: unknown): OutcomesCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    validated_success_score: d.validated_success_score as number | undefined,
    open_hypotheses: d.open_hypotheses as number | undefined,
    philosophy: d.philosophy as string | undefined,
    human_interpretation_required: d.human_interpretation_required as boolean | undefined,
  };
}

export function parseOutcomesDashboard(data: unknown): OutcomesDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    human_interpretation_required: d.human_interpretation_required as boolean | undefined,
    validation_enabled: d.validation_enabled as boolean | undefined,
    show_failed_initiatives: d.show_failed_initiatives as boolean | undefined,
    philosophy: d.philosophy as string | undefined,
    safety_note: d.safety_note as string | undefined,
    validated_success_score: d.validated_success_score as number | undefined,
    score_components: d.score_components as Record<string, number> | undefined,
    total_value_generated: d.total_value_generated as number | undefined,
    hypotheses: Array.isArray(d.hypotheses) ? (d.hypotheses as OutcomesDashboard["hypotheses"]) : [],
    validated_initiatives: Array.isArray(d.validated_initiatives)
      ? (d.validated_initiatives as OutcomesDashboard["validated_initiatives"])
      : [],
    failed_initiatives: Array.isArray(d.failed_initiatives)
      ? (d.failed_initiatives as OutcomesDashboard["failed_initiatives"])
      : [],
    roi_reports: Array.isArray(d.roi_reports) ? (d.roi_reports as OutcomesDashboard["roi_reports"]) : [],
    kpis: Array.isArray(d.kpis) ? (d.kpis as OutcomesDashboard["kpis"]) : [],
    briefings: Array.isArray(d.briefings) ? (d.briefings as OutcomesDashboard["briefings"]) : [],
    lessons_learned: Array.isArray(d.lessons_learned)
      ? (d.lessons_learned as OutcomesDashboard["lessons_learned"])
      : [],
    validation_windows: Array.isArray(d.validation_windows)
      ? (d.validation_windows as OutcomesDashboard["validation_windows"])
      : [],
    outcome_categories: Array.isArray(d.outcome_categories)
      ? (d.outcome_categories as OutcomesDashboard["outcome_categories"])
      : [],
    integrations: d.integrations as Record<string, string> | undefined,
  };
}

export function parseValidationActionResult(data: unknown): ValidationActionResult {
  return (data ?? {}) as ValidationActionResult;
}
