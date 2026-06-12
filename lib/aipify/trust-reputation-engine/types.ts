export type OrganizationTrustProfile = {
  id?: string;
  entity_type?: string;
  entity_id?: string | null;
  trust_score?: number;
  trust_level?: string;
  status?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type OrganizationTrustSignal = {
  id?: string;
  profile_id?: string;
  signal_type?: string;
  signal_value?: number;
  metadata?: Record<string, unknown>;
  recorded_at?: string;
  [key: string]: unknown;
};

export type OrganizationTrustOutcome = {
  id?: string;
  profile_id?: string;
  outcome_type?: string;
  summary?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
  [key: string]: unknown;
};

export type TrustReputationEngineCard = {
  has_organization: boolean;
  philosophy?: string;
  active_profiles?: number;
  trusted_profiles?: number;
  under_review_profiles?: number;
  avg_trust_score?: number;
  [key: string]: unknown;
};

export type TrustReputationEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  principles?: string[];
  summary?: Record<string, unknown>;
  sections?: {
    trust_profiles?: OrganizationTrustProfile[];
    trust_trends?: Record<string, unknown>[];
    trusted_workflows?: OrganizationTrustProfile[];
    approval_quality?: Record<string, unknown>[];
    reputation_indicators?: OrganizationTrustSignal[];
    recent_outcomes?: OrganizationTrustOutcome[];
  };
  settings?: Record<string, unknown>;
  executive_summary?: Record<string, unknown>;
  integration_notes?: Record<string, string>;
  integration_summaries?: Record<string, unknown>;
  [key: string]: unknown;
};

export type TrustReputationExport = {
  has_organization?: boolean;
  exported_at?: string;
  manifest_type?: string;
  profiles?: OrganizationTrustProfile[];
  recent_signals?: OrganizationTrustSignal[];
  outcomes?: OrganizationTrustOutcome[];
  summary?: Record<string, unknown>;
  integration_summaries?: Record<string, unknown>;
  [key: string]: unknown;
};
