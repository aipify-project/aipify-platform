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

export type IntegrationLink = {
  label?: string;
  route?: string;
  note?: string;
};

export type ImplementationBlueprint = {
  phase?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
  mapping_note?: string;
};

export type BlueprintObjective = {
  key?: string;
  label?: string;
  description?: string;
};

export type AbosSuccessCriterion = {
  key?: string;
  label?: string;
  met?: boolean;
  note?: string | null;
};

export type BlueprintPrincipleBlock = {
  principle?: string;
  forbidden?: string[];
  required?: string[];
  boundary_note?: string;
  safeguards?: Array<Record<string, unknown>>;
  boundaries?: Array<Record<string, unknown>>;
  opportunities?: Array<Record<string, unknown>>;
  dimensions?: Array<Record<string, unknown>>;
};

export type BlueprintGuidanceBlock = {
  principle?: string;
  examples?: Array<Record<string, unknown>>;
  observations?: Array<Record<string, unknown>>;
  opportunities?: Array<Record<string, unknown>>;
};

export type SelfAwarenessEngagementSummary = {
  open_findings?: number;
  critical_findings?: number;
  pending_actions?: number;
  monitoring_dimensions?: number;
  self_observation_examples?: number;
  improvement_opportunities?: number;
  integrity_safeguards?: number;
  companion_examples?: number;
  capability_boundaries?: number;
  integration_links?: number;
  privacy_note?: string;
};

export type SelfAwarenessPlatformIntegrityBlueprint = {
  implementation_blueprint_phase87?: ImplementationBlueprint;
  self_awareness_platform_integrity_note?: string;
  distinction_note?: string;
  mission?: string;
  philosophy?: string;
  abos_principle?: string;
  vision?: string;
  objectives?: BlueprintObjective[];
  platform_health_monitoring?: BlueprintPrincipleBlock;
  self_observation_examples?: BlueprintGuidanceBlock;
  capability_boundaries?: BlueprintPrincipleBlock;
  self_improvement_opportunities?: BlueprintGuidanceBlock;
  integrity_safeguards?: BlueprintPrincipleBlock;
  companion_guidance?: BlueprintGuidanceBlock;
  self_love_connection?: Record<string, unknown>;
  trust_connection?: Record<string, unknown>;
  privacy_principles?: BlueprintPrincipleBlock;
  dogfooding?: Record<string, unknown>;
  success_criteria?: AbosSuccessCriterion[];
  integration_links?: IntegrationLink[];
  engagement_summary?: SelfAwarenessEngagementSummary;
  privacy_note?: string;
};

export type PlatformIntegrityCard = {
  has_customer: boolean;
  integrity_score?: number;
  integrity_band?: string;
  integrity_band_label?: string;
  open_findings?: number;
  philosophy?: string;
  human_oversight_required?: boolean;
  implementation_blueprint_phase87?: ImplementationBlueprint;
  blueprint_mission?: string;
  blueprint_philosophy?: string;
  blueprint_abos_principle?: string;
  blueprint_engagement_summary?: SelfAwarenessEngagementSummary;
  blueprint_note?: string;
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
  self_awareness_platform_integrity_blueprint?: SelfAwarenessPlatformIntegrityBlueprint;
};

export type IntegrityActionResult = {
  status?: string;
  human_oversight_required?: boolean;
  autonomous_correction?: boolean;
  error?: string;
};
