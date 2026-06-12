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

export type PartnerEcosystemCard = {
  has_customer: boolean;
  ecosystem_score?: number;
  active_partners?: number;
  certified_partners?: number;
  open_leads?: number;
  philosophy?: string;
  human_oversight_required?: boolean;
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
