export const PARTICIPATION_MODES = ["none", "anonymous_insights", "extended"] as const;

export const LEARNING_CATEGORIES = [
  "knowledge",
  "support",
  "desktop",
  "action_center",
  "quality",
  "marketplace",
  "industry_blueprints",
  "evolution_lab",
] as const;

export const PROPOSAL_STATUSES = [
  "pending",
  "approved",
  "rejected",
  "snoozed",
  "implemented",
  "archived",
] as const;

export const PROPOSAL_DECISIONS = ["approve", "reject", "snooze", "request_info"] as const;

export type GlobalLearningSettings = {
  tenant_id: string;
  participation_mode: string;
  enabled_categories: string[];
  extended_consent_at?: string | null;
  review_before_submit: boolean;
  created_at?: string;
  updated_at?: string;
};

export type GlobalLearningContribution = {
  category: string;
  learning_type: string;
  signal_count: number;
  last_signal_at?: string | null;
};

export type GlobalLearningCard = {
  has_customer: boolean;
  participation_mode?: string;
  contribution_count?: number;
  philosophy?: string;
  privacy_note?: string;
};

export type GlobalLearningDashboard = {
  has_customer: boolean;
  settings?: GlobalLearningSettings;
  contributions: GlobalLearningContribution[];
  intelligence_levels?: {
    local?: string;
    organizational?: string;
    global?: string;
  };
  total_contributions?: number;
  pending_proposals?: number;
};

export type GlobalLearningPattern = {
  id: string;
  pattern_type: string;
  category: string;
  frequency: number;
  trend_direction: string;
  confidence: number;
  status: string;
  metadata?: Record<string, unknown>;
};

export type EvolutionProposal = {
  id: string;
  proposal_type: string;
  title: string;
  summary?: string | null;
  rationale?: string | null;
  expected_value?: string | null;
  risk_level: string;
  status: string;
  explainability?: Record<string, unknown>;
  tenant_feedback?: {
    decision?: string;
    rejected_reason?: string | null;
  } | null;
};

export type EvolutionBoard = {
  has_customer: boolean;
  proposals: EvolutionProposal[];
  trend_summaries: GlobalLearningPattern[];
  philosophy?: string;
};

export type ContributionExport = {
  exported_at?: string;
  participation_mode?: string;
  contributions: GlobalLearningContribution[];
  note?: string;
};
