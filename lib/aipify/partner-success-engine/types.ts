export type PartnerRecord = {
  id?: string;
  organization_id?: string;
  partner_name?: string;
  partner_type?: string;
  status?: string;
  primary_contact?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type PartnerEngagement = {
  id?: string;
  organization_id?: string;
  partner_id?: string;
  engagement_type?: string;
  onboarding_status?: string;
  adoption_score?: number;
  renewal_readiness?: string;
  open_risks?: Record<string, unknown>[];
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type PartnerSuccessOutcome = {
  id?: string;
  organization_id?: string;
  partner_id?: string;
  engagement_id?: string;
  outcome_type?: string;
  outcome_summary?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
  [key: string]: unknown;
};

export type PartnerSuccessSettings = {
  organization_id?: string;
  default_engagement_type?: string;
  adoption_target?: number;
  renewal_review_cadence_days?: number;
  notify_on_risk?: boolean;
  metadata?: Record<string, unknown>;
  updated_at?: string;
  [key: string]: unknown;
};

export type PartnerSuccessEngineCard = {
  has_organization: boolean;
  philosophy?: string;
  active_partners?: number;
  avg_adoption_score?: number;
  high_renewal_risk?: number;
  customer_health_score?: number;
  [key: string]: unknown;
};

export type PartnerSuccessEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  principles?: string[];
  summary?: Record<string, unknown>;
  settings?: PartnerSuccessSettings;
  sections?: {
    customer_health?: Record<string, unknown>;
    onboarding?: Record<string, unknown>[];
    adoption?: Record<string, unknown>[];
    risks?: Record<string, unknown>[];
    renewal_readiness?: Record<string, unknown>[];
    opportunities?: Record<string, unknown>[];
  };
  partners?: PartnerRecord[];
  engagements?: PartnerEngagement[];
  outcomes?: PartnerSuccessOutcome[];
  integration_notes?: Record<string, string>;
  integration_summaries?: Record<string, unknown>;
  [key: string]: unknown;
};

export type PartnerSuccessExport = {
  has_organization?: boolean;
  exported_at?: string;
  manifest_type?: string;
  format?: string;
  settings?: PartnerSuccessSettings;
  summary?: Record<string, unknown>;
  partners?: PartnerRecord[];
  engagements?: PartnerEngagement[];
  outcomes?: PartnerSuccessOutcome[];
  integration_summaries?: Record<string, unknown>;
  [key: string]: unknown;
};
