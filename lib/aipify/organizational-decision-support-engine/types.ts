export type OrganizationalDecisionItem = {
  id?: string;
  decision_title?: string;
  decision_category?: string;
  recommendation?: string;
  confidence_level?: string;
  status?: string;
  rationale?: string;
  expected_benefits?: string;
  potential_risks?: string;
  dependencies?: string;
  alternatives?: unknown[];
  scenarios?: unknown[];
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type OrganizationalDecisionOutcome = {
  id?: string;
  decision_id?: string;
  outcome_summary?: string;
  lessons_learned_metadata?: Record<string, unknown>;
  org_memory_hook_metadata?: Record<string, unknown>;
  created_at?: string;
  [key: string]: unknown;
};

export type OrganizationalDecisionSupportEngineCard = {
  has_organization: boolean;
  philosophy?: string;
  pending_review?: number;
  high_confidence_pending?: number;
  [key: string]: unknown;
};

export type OrganizationalDecisionSupportEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  principles?: string[];
  summary?: Record<string, unknown>;
  decisions?: OrganizationalDecisionItem[];
  outcomes?: OrganizationalDecisionOutcome[];
  executive_summary?: Record<string, unknown>;
  integration_notes?: Record<string, string>;
  integration_summaries?: Record<string, unknown>;
  [key: string]: unknown;
};

export type OrganizationalDecisionReportExport = {
  has_organization?: boolean;
  exported_at?: string;
  decision?: OrganizationalDecisionItem;
  outcomes?: OrganizationalDecisionOutcome[];
  decisions?: OrganizationalDecisionItem[];
  summary?: Record<string, unknown>;
  [key: string]: unknown;
};
