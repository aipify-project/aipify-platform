export const OUTCOME_CATEGORIES = [
  "operational",
  "knowledge",
  "support",
  "governance",
  "human_success",
  "strategic",
  "continuity",
  "marketplace",
] as const;

export const VALIDATION_STATUSES = [
  "validated",
  "partially_validated",
  "not_validated",
  "in_review",
] as const;

export const VALIDATION_WINDOWS = ["immediate", "short_term", "medium_term", "long_term"] as const;

export type SuccessHypothesis = {
  id: string;
  category: string;
  initiative_type?: string;
  title: string;
  description: string;
  hypothesis?: string;
  expected_outcome: string;
  validation_window?: string;
  validation_window_label?: string;
  status: string;
  estimated_value?: number | null;
  source_module?: string | null;
  created_at?: string;
};

export type ValidationResult = {
  id: string;
  title?: string;
  category?: string;
  validation_status: string;
  findings?: string;
  lessons_learned?: string | null;
  what_happened?: string | null;
  why_it_happened?: string | null;
  what_should_change?: string | null;
  validated_at?: string;
};

export type RoiReport = {
  id: string;
  title: string;
  initiative_type?: string;
  estimated_roi: number;
  actual_roi: number;
  variance: number;
  currency?: string;
  created_at?: string;
};

export type SuccessKpi = {
  id: string;
  kpi_key: string;
  name: string;
  description?: string | null;
  target_value?: number | null;
  current_value: number;
  unit: string;
  category: string;
  active?: boolean;
};

export type OutcomesCard = {
  has_customer: boolean;
  validated_success_score?: number;
  open_hypotheses?: number;
  philosophy?: string;
  human_interpretation_required?: boolean;
};

export type OutcomesDashboard = {
  has_customer: boolean;
  human_interpretation_required?: boolean;
  validation_enabled?: boolean;
  show_failed_initiatives?: boolean;
  philosophy?: string;
  safety_note?: string;
  validated_success_score?: number;
  score_components?: Record<string, number>;
  total_value_generated?: number;
  hypotheses: SuccessHypothesis[];
  validated_initiatives: ValidationResult[];
  failed_initiatives: ValidationResult[];
  roi_reports: RoiReport[];
  kpis: SuccessKpi[];
  briefings: Array<{ id: string; summary: string; created_at?: string }>;
  lessons_learned: Array<{ title?: string; lessons_learned?: string; what_should_change?: string }>;
  validation_windows?: Array<{ key: string; label: string }>;
  outcome_categories?: Array<{ key: string; label: string }>;
  integrations?: Record<string, string>;
};

export type ValidationActionResult = {
  validation_status?: string;
  human_interpretation_required?: boolean;
  note?: string;
  error?: string;
};
