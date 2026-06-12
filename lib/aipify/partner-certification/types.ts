export const PARTNER_TYPES = [
  "implementation",
  "certified_consultant",
  "development",
  "technology",
  "strategic_alliance",
  "training",
  "managed_service",
  "reseller",
] as const;

export const PARTNER_TIERS = [
  "registered",
  "certified",
  "advanced",
  "premier",
  "strategic",
] as const;

export const CERTIFICATION_AREAS = [
  "aipify_foundations",
  "support_ai_specialist",
  "governance_specialist",
  "enterprise_deployment",
  "commerce_specialist",
  "integration_specialist",
  "strategic_intelligence",
] as const;

export type PartnerProfile = {
  id: string;
  partner_name: string;
  partner_type: string;
  partner_tier: string;
  partner_tier_label?: string;
  status: string;
  country?: string | null;
  industry_expertise?: string[];
  languages?: string[];
  service_offerings?: string[];
  description?: string | null;
};

export type CertificationTrack = {
  id: string;
  track_key: string;
  title: string;
  description: string;
  certification_area: string;
  requirements?: unknown;
  renewal_months?: number;
};

export type CertificationProgress = {
  id: string;
  partner_name: string;
  track_title: string;
  status: string;
  progress_pct: number;
  expires_at?: string | null;
};

export type DigitalCredential = {
  id: string;
  credential_code: string;
  title: string;
  partner_name: string;
  badge_label?: string | null;
  status: string;
  issued_at?: string;
  expires_at?: string | null;
};

export type PartnerScorecard = {
  partner_name: string;
  partner_tier: string;
  partner_tier_label?: string;
  overall_score: number;
  certification_completion?: number;
  customer_feedback_score?: number;
  implementation_success?: number;
};

export type LeadRegistration = {
  id: string;
  opportunity_name: string;
  company_name?: string | null;
  country?: string | null;
  estimated_value?: number | null;
  status: string;
  partner_name?: string | null;
  protection_expires_at?: string | null;
};

export type PartnerResource = {
  id: string;
  title: string;
  description: string;
  resource_type: string;
  url?: string | null;
};

export type ComplianceRecord = {
  id: string;
  partner_id: string;
  partner_name: string;
  compliance_type: string;
  status: string;
  accepted_at?: string | null;
  expires_at?: string | null;
};

export type BlueprintObjective = {
  key?: string;
  label?: string;
  emoji?: string;
  description?: string;
};

export type AbosSuccessCriterion = {
  key?: string;
  label?: string;
  met?: boolean;
  note?: string | null;
};

export type IntegrationLink = {
  key?: string;
  label?: string;
  route?: string;
  note?: string;
};

export type ImplementationBlueprintMeta = {
  phase?: string | number;
  title?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
  mapping_note?: string;
};

export type CompanionGuidanceExample = {
  emoji?: string;
  key?: string;
  prompt?: string;
  consideration?: string;
};

export type CompanionGuidance = {
  principle?: string;
  companion_name?: string;
  not_label?: string;
  examples?: CompanionGuidanceExample[];
  boundary_note?: string;
};

export type LimitationPrinciples = {
  principle?: string;
  must_avoid?: string[];
  required?: string[];
  boundary_note?: string;
};

export type SelfLoveConnection = {
  principle?: string;
  quotes?: string[];
  practices?: string[];
  route?: string;
  boundary_note?: string;
};

export type TrustConnection = {
  principle?: string;
  users_should_see?: string[];
  operators_should_understand?: string[];
  audit_note?: string;
};

export type GrowthPartnerEngagementSummary = {
  ecosystem_score?: number;
  active_partners?: number;
  certified_partners?: number;
  open_leads?: number;
  compliance_pct?: number;
  certification_tracks?: number;
  active_credentials?: number;
  portal_resources?: number;
  objectives_documented?: number;
  certification_levels?: number;
  matching_dimensions?: number;
  companion_examples?: number;
  integration_links?: number;
  privacy_note?: string;
};

export type GrowthPartnerEcosystemBlueprint = {
  phase?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
  mapping_note?: string;
  distinction_note?: string;
  mission?: string;
  philosophy?: string;
  abos_principle?: string;
  objectives?: BlueprintObjective[];
  who_can_become?: Record<string, unknown>;
  partner_business_opportunities?: Record<string, unknown>;
  partner_certification_levels?: Record<string, unknown>;
  partner_portal?: Record<string, unknown>;
  partner_matching_engine?: Record<string, unknown>;
  marketing_resource_center?: Record<string, unknown>;
  partner_recognition?: Record<string, unknown>;
  companion_guidance?: CompanionGuidance;
  self_love_connection?: SelfLoveConnection;
  leadership_connection?: Record<string, unknown>;
  trust_connection?: TrustConnection;
  limitation_principles?: LimitationPrinciples;
  dogfooding?: Record<string, unknown>;
  success_criteria?: AbosSuccessCriterion[];
  vision?: string;
  vision_phrases?: string[];
  integration_links?: IntegrationLink[];
  engagement_summary?: GrowthPartnerEngagementSummary;
  privacy_note?: string;
};

export type PartnerEcosystemCard = {
  has_customer: boolean;
  ecosystem_score?: number;
  active_partners?: number;
  certified_partners?: number;
  open_leads?: number;
  philosophy?: string;
  human_oversight_required?: boolean;
  implementation_blueprint_phase107?: ImplementationBlueprintMeta;
  growth_partner_mission?: string;
  growth_partner_abos_principle?: string;
  growth_partner_engagement_summary?: GrowthPartnerEngagementSummary;
  growth_partner_note?: string;
  growth_partner_vision_note?: string;
};

export type PartnerEcosystemDashboard = {
  has_customer: boolean;
  human_oversight_required?: boolean;
  program_enabled?: boolean;
  lead_referral_enabled?: boolean;
  public_directory_enabled?: boolean;
  philosophy?: string;
  safety_note?: string;
  ecosystem_score?: number;
  active_partners?: number;
  certified_partners?: number;
  avg_partner_score?: number;
  open_leads?: number;
  compliance_pct?: number;
  partner_categories?: string[];
  partner_tiers?: Array<{ tier: string; label: string }>;
  partners: PartnerProfile[];
  certification_tracks: CertificationTrack[];
  certification_progress: CertificationProgress[];
  digital_credentials: DigitalCredential[];
  scorecards: PartnerScorecard[];
  lead_registrations: LeadRegistration[];
  resources: PartnerResource[];
  recognition_awards: Array<{ id: string; title: string; award_type: string; partner_name?: string | null; year?: number }>;
  compliance_records: ComplianceRecord[];
  community_engagement?: string[];
  briefings: Array<{ id: string; summary: string; created_at?: string }>;
  integrations?: Record<string, string>;
  implementation_blueprint_phase107?: ImplementationBlueprintMeta;
  growth_partner_ecosystem_engine_note?: string;
  growth_partner_ecosystem_blueprint?: GrowthPartnerEcosystemBlueprint;
  growth_partner_distinction_note?: string;
  growth_partner_mission?: string;
  growth_partner_philosophy?: string;
  growth_partner_abos_principle?: string;
  growth_partner_objectives?: BlueprintObjective[];
  growth_partner_who_can_become?: Record<string, unknown>;
  growth_partner_business_opportunities?: Record<string, unknown>;
  growth_partner_certification_levels?: Record<string, unknown>;
  growth_partner_portal?: Record<string, unknown>;
  growth_partner_matching_engine?: Record<string, unknown>;
  growth_partner_marketing_resource_center?: Record<string, unknown>;
  growth_partner_recognition?: Record<string, unknown>;
  growth_partner_companion_guidance?: CompanionGuidance;
  growth_partner_self_love_connection?: SelfLoveConnection;
  growth_partner_leadership_connection?: Record<string, unknown>;
  growth_partner_trust_connection?: TrustConnection;
  growth_partner_limitation_principles?: LimitationPrinciples;
  growth_partner_dogfooding?: Record<string, unknown>;
  gpebp107_integration_links?: IntegrationLink[];
  growth_partner_engagement_summary?: GrowthPartnerEngagementSummary;
  growth_partner_success_criteria?: AbosSuccessCriterion[];
  growth_partner_vision?: string;
  growth_partner_vision_phrases?: string[];
  growth_partner_privacy_note?: string;
};

export type PartnerEcosystemActionResult = {
  status?: string;
  lead_id?: string;
  valid?: boolean;
  error?: string;
  human_oversight_required?: boolean;
};

export type PartnerCredentialVerification = {
  valid?: boolean;
  credential_code?: string;
  title?: string;
  partner_name?: string;
  partner_tier?: string;
  partner_tier_label?: string;
  track_title?: string;
  status?: string;
  issued_at?: string;
  expires_at?: string | null;
  error?: string;
};

export type PartnerEcosystemBriefingResult = {
  briefing_id?: string;
  summary?: string;
  error?: string;
};
