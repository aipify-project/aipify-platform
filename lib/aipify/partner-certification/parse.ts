import type {
  AbosSuccessCriterion,
  BlueprintObjective,
  CompanionGuidance,
  GrowthPartnerEcosystemBlueprint,
  GrowthPartnerEngagementSummary,
  ImplementationBlueprintMeta,
  IntegrationLink,
  LimitationPrinciples,
  PartnerCredentialVerification,
  PartnerEcosystemActionResult,
  PartnerEcosystemBriefingResult,
  PartnerEcosystemCard,
  PartnerEcosystemDashboard,
  SelfLoveConnection,
  TrustConnection,
} from "./types";

function parseBlueprintMeta(data: unknown): ImplementationBlueprintMeta | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as ImplementationBlueprintMeta;
}

function parseObjectives(data: unknown): BlueprintObjective[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as BlueprintObjective[];
}

function parseSuccessCriteria(data: unknown): AbosSuccessCriterion[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as AbosSuccessCriterion[];
}

function parseIntegrationLinks(data: unknown): IntegrationLink[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as IntegrationLink[];
}

function parseCompanionGuidance(data: unknown): CompanionGuidance | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as CompanionGuidance;
}

function parseLimitationPrinciples(data: unknown): LimitationPrinciples | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as LimitationPrinciples;
}

function parseSelfLoveConnection(data: unknown): SelfLoveConnection | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as SelfLoveConnection;
}

function parseTrustConnection(data: unknown): TrustConnection | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as TrustConnection;
}

function parseEngagementSummary(data: unknown): GrowthPartnerEngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as GrowthPartnerEngagementSummary;
}

function parseBlueprintBlock(data: unknown): GrowthPartnerEcosystemBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as GrowthPartnerEcosystemBlueprint;
}

function parseRecord(data: unknown): Record<string, unknown> | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as Record<string, unknown>;
}

function parseStringList(data: unknown): string[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data.filter((item): item is string => typeof item === "string");
}

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
    implementation_blueprint_phase107: parseBlueprintMeta(d.implementation_blueprint_phase107),
    growth_partner_mission:
      typeof d.growth_partner_mission === "string" ? d.growth_partner_mission : undefined,
    growth_partner_abos_principle:
      typeof d.growth_partner_abos_principle === "string" ? d.growth_partner_abos_principle : undefined,
    growth_partner_engagement_summary: parseEngagementSummary(d.growth_partner_engagement_summary),
    growth_partner_note: typeof d.growth_partner_note === "string" ? d.growth_partner_note : undefined,
    growth_partner_vision_note:
      typeof d.growth_partner_vision_note === "string" ? d.growth_partner_vision_note : undefined,
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
    implementation_blueprint_phase107: parseBlueprintMeta(d.implementation_blueprint_phase107),
    growth_partner_ecosystem_engine_note:
      typeof d.growth_partner_ecosystem_engine_note === "string"
        ? d.growth_partner_ecosystem_engine_note
        : undefined,
    growth_partner_ecosystem_blueprint: parseBlueprintBlock(d.growth_partner_ecosystem_blueprint),
    growth_partner_distinction_note:
      typeof d.growth_partner_distinction_note === "string" ? d.growth_partner_distinction_note : undefined,
    growth_partner_mission:
      typeof d.growth_partner_mission === "string" ? d.growth_partner_mission : undefined,
    growth_partner_philosophy:
      typeof d.growth_partner_philosophy === "string" ? d.growth_partner_philosophy : undefined,
    growth_partner_abos_principle:
      typeof d.growth_partner_abos_principle === "string" ? d.growth_partner_abos_principle : undefined,
    growth_partner_objectives: parseObjectives(d.growth_partner_objectives),
    growth_partner_who_can_become: parseRecord(d.growth_partner_who_can_become),
    growth_partner_business_opportunities: parseRecord(d.growth_partner_business_opportunities),
    growth_partner_certification_levels: parseRecord(d.growth_partner_certification_levels),
    growth_partner_portal: parseRecord(d.growth_partner_portal),
    growth_partner_matching_engine: parseRecord(d.growth_partner_matching_engine),
    growth_partner_marketing_resource_center: parseRecord(d.growth_partner_marketing_resource_center),
    growth_partner_recognition: parseRecord(d.growth_partner_recognition),
    growth_partner_companion_guidance: parseCompanionGuidance(d.growth_partner_companion_guidance),
    growth_partner_self_love_connection: parseSelfLoveConnection(d.growth_partner_self_love_connection),
    growth_partner_leadership_connection: parseRecord(d.growth_partner_leadership_connection),
    growth_partner_trust_connection: parseTrustConnection(d.growth_partner_trust_connection),
    growth_partner_limitation_principles: parseLimitationPrinciples(d.growth_partner_limitation_principles),
    growth_partner_dogfooding: parseRecord(d.growth_partner_dogfooding),
    gpebp107_integration_links: parseIntegrationLinks(d.gpebp107_integration_links),
    growth_partner_engagement_summary: parseEngagementSummary(d.growth_partner_engagement_summary),
    growth_partner_success_criteria: parseSuccessCriteria(d.growth_partner_success_criteria),
    growth_partner_vision: typeof d.growth_partner_vision === "string" ? d.growth_partner_vision : undefined,
    growth_partner_vision_phrases: parseStringList(d.growth_partner_vision_phrases),
    growth_partner_privacy_note:
      typeof d.growth_partner_privacy_note === "string" ? d.growth_partner_privacy_note : undefined,
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
