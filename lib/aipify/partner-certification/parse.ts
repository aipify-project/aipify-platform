import type {
  PartnerCredentialVerification,
  PartnerEcosystemActionResult,
  PartnerEcosystemBriefingResult,
  PartnerEcosystemCard,
  PartnerEcosystemDashboard,
} from "./types";

export function parsePartnerEcosystemCard(data: unknown): PartnerEcosystemCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    ecosystem_score: Number(d.ecosystem_score ?? 0),
    active_partners: Number(d.active_partners ?? 0),
    certified_partners: Number(d.certified_partners ?? 0),
    open_leads: Number(d.open_leads ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    human_oversight_required: Boolean(d.human_oversight_required),
  };
}

export function parsePartnerEcosystemDashboard(data: unknown): PartnerEcosystemDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    human_oversight_required: Boolean(d.human_oversight_required),
    program_enabled: Boolean(d.program_enabled ?? true),
    lead_referral_enabled: Boolean(d.lead_referral_enabled ?? true),
    public_directory_enabled: Boolean(d.public_directory_enabled ?? true),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    ecosystem_score: Number(d.ecosystem_score ?? 0),
    active_partners: Number(d.active_partners ?? 0),
    certified_partners: Number(d.certified_partners ?? 0),
    avg_partner_score: Number(d.avg_partner_score ?? 0),
    open_leads: Number(d.open_leads ?? 0),
    compliance_pct: Number(d.compliance_pct ?? 0),
    partner_categories: Array.isArray(d.partner_categories) ? (d.partner_categories as string[]) : [],
    partner_tiers: Array.isArray(d.partner_tiers)
      ? (d.partner_tiers as PartnerEcosystemDashboard["partner_tiers"])
      : [],
    partners: Array.isArray(d.partners) ? (d.partners as PartnerEcosystemDashboard["partners"]) : [],
    certification_tracks: Array.isArray(d.certification_tracks)
      ? (d.certification_tracks as PartnerEcosystemDashboard["certification_tracks"])
      : [],
    certification_progress: Array.isArray(d.certification_progress)
      ? (d.certification_progress as PartnerEcosystemDashboard["certification_progress"])
      : [],
    digital_credentials: Array.isArray(d.digital_credentials)
      ? (d.digital_credentials as PartnerEcosystemDashboard["digital_credentials"])
      : [],
    scorecards: Array.isArray(d.scorecards) ? (d.scorecards as PartnerEcosystemDashboard["scorecards"]) : [],
    lead_registrations: Array.isArray(d.lead_registrations)
      ? (d.lead_registrations as PartnerEcosystemDashboard["lead_registrations"])
      : [],
    resources: Array.isArray(d.resources) ? (d.resources as PartnerEcosystemDashboard["resources"]) : [],
    recognition_awards: Array.isArray(d.recognition_awards)
      ? (d.recognition_awards as PartnerEcosystemDashboard["recognition_awards"])
      : [],
    compliance_records: Array.isArray(d.compliance_records)
      ? (d.compliance_records as PartnerEcosystemDashboard["compliance_records"])
      : [],
    community_engagement: Array.isArray(d.community_engagement) ? (d.community_engagement as string[]) : [],
    briefings: Array.isArray(d.briefings) ? (d.briefings as PartnerEcosystemDashboard["briefings"]) : [],
    integrations: typeof d.integrations === "object" && d.integrations
      ? (d.integrations as Record<string, string>)
      : undefined,
  };
}

export function parsePartnerEcosystemActionResult(data: unknown): PartnerEcosystemActionResult {
  return (data ?? {}) as PartnerEcosystemActionResult;
}

export function parsePartnerCredentialVerification(data: unknown): PartnerCredentialVerification {
  return (data ?? {}) as PartnerCredentialVerification;
}

export function parsePartnerEcosystemBriefingResult(data: unknown): PartnerEcosystemBriefingResult {
  return (data ?? {}) as PartnerEcosystemBriefingResult;
}
