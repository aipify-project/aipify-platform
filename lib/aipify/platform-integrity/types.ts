export const INTEGRITY_DOMAINS = [
  "knowledge",
  "support",
  "marketplace",
  "blueprint",
  "recommendation",
  "explanation",
  "human_success",
  "desktop",
  "strategic_intelligence",
  "governance",
] as const;

export const FINDING_SEVERITIES = [
  "healthy",
  "monitor",
  "attention_required",
  "critical_review_required",
] as const;

export type IntegrityFinding = {
  id: string;
  domain: string;
  severity: string;
  status: string;
  summary: string;
  evidence?: Record<string, unknown>;
  affected_domains?: unknown;
  potential_impact?: string | null;
  recommended_actions?: unknown;
  governance_requirements?: string | null;
  created_at?: string;
};

export type IntegrityAction = {
  id: string;
  finding_id?: string;
  action_description: string;
  status: string;
  requires_governance?: boolean;
  created_at?: string;
};

export type DeprecatedAsset = {
  id: string;
  asset_type: string;
  asset_title: string;
  reason: string;
  status: string;
  flagged_at?: string;
};

export type PlatformIntegrityCard = {
  has_customer: boolean;
  integrity_score?: number;
  integrity_band?: string;
  integrity_band_label?: string;
  open_findings?: number;
  philosophy?: string;
  human_oversight_required?: boolean;
};

export type PlatformIntegrityDashboard = {
  has_customer: boolean;
  human_oversight_required?: boolean;
  reviews_enabled?: boolean;
  show_critical_findings?: boolean;
  philosophy?: string;
  safety_note?: string;
  integrity_score?: number;
  integrity_band?: string;
  integrity_band_label?: string;
  score_components?: Record<string, number>;
  review_queue: Array<{
    id: string;
    review_type: string;
    review_period: string;
    status: string;
    summary?: string | null;
    created_at?: string;
  }>;
  findings: IntegrityFinding[];
  actions: IntegrityAction[];
  deprecated_assets: DeprecatedAsset[];
  briefings: Array<{ id: string; summary: string; created_at?: string }>;
  integrity_trends: Array<{ score: number; band: string; created_at?: string }>;
  review_domains?: Array<{ key: string; label: string }>;
  review_frequencies?: Array<{ key: string; label: string; purpose: string }>;
  integrations?: Record<string, string>;
};

export type IntegrityActionResult = {
  status?: string;
  human_oversight_required?: boolean;
  autonomous_correction?: boolean;
  error?: string;
};
