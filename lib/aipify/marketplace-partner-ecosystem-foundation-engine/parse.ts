import type {
  AbosSuccessCriterion,
  CertificationConnection,
  CompanionSkillsBlueprint,
  ConnectorMarketplaceEntry,
  EcosystemActivationSummary,
  EcosystemObjective,
  IndustryPack,
  IntegrationLink,
  KnowledgePacksBlueprint,
  MarketplacePartnerEcosystemFoundationEngineCard,
  MarketplacePartnerEcosystemFoundationEngineDashboard,
  MarketplaceOfferingRecord,
  PartnerCapability,
  PartnerEngagementSummary,
  PartnerMarketplaceConnection,
  PartnerObjective,
  PartnerRecord,
  PartnerTier,
  PartnerTrustConnection,
  QualityGuardianConnection,
  SelfLoveConnection,
  TrustConnection,
  MarketObservationsBlueprint,
  IndustryIntelligenceBlueprint,
  RegionalInsightsBlueprint,
  SalesExpertFeedbackLoops,
  PartnerEcosystemInsights,
  ExecutiveSupportBlueprint,
  EcosystemGrowthSummary,
  MarketIntelligenceTrustConnection,
} from "./types";

function parsePartnerList(data: unknown): PartnerRecord[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as PartnerRecord[];
}

function parseOfferingList(data: unknown): MarketplaceOfferingRecord[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as MarketplaceOfferingRecord[];
}

function parseStringArray(data: unknown): string[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data.filter((item): item is string => typeof item === "string");
}

function parseSuccessCriteria(data: unknown): AbosSuccessCriterion[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as AbosSuccessCriterion[];
}

function parseIntegrationLinks(data: unknown): IntegrationLink[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as IntegrationLink[];
}

function parseEcosystemObjectives(data: unknown): EcosystemObjective[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as EcosystemObjective[];
}

function parseIndustryPacks(data: unknown): IndustryPack[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as IndustryPack[];
}

function parseConnectorMarketplace(data: unknown): ConnectorMarketplaceEntry[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as ConnectorMarketplaceEntry[];
}

function parseKnowledgePacks(data: unknown): KnowledgePacksBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as KnowledgePacksBlueprint;
}

function parseCompanionSkills(data: unknown): CompanionSkillsBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as CompanionSkillsBlueprint;
}

function parseSelfLoveConnection(data: unknown): SelfLoveConnection | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as SelfLoveConnection;
}

function parseTrustConnection(data: unknown): TrustConnection | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as TrustConnection;
}

function parseQualityGuardianConnection(data: unknown): QualityGuardianConnection | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as QualityGuardianConnection;
}

function parseEcosystemActivationSummary(data: unknown): EcosystemActivationSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as EcosystemActivationSummary;
}

function parsePartnerObjectives(data: unknown): PartnerObjective[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as PartnerObjective[];
}

function parsePartnerTiers(data: unknown): PartnerTier[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as PartnerTier[];
}

function parsePartnerCapabilities(data: unknown): PartnerCapability[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as PartnerCapability[];
}

function parsePartnerMarketplaceConnection(data: unknown): PartnerMarketplaceConnection | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as PartnerMarketplaceConnection;
}

function parseCertificationConnection(data: unknown): CertificationConnection | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as CertificationConnection;
}

function parsePartnerTrustConnection(data: unknown): PartnerTrustConnection | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as PartnerTrustConnection;
}

function parsePartnerEngagementSummary(data: unknown): PartnerEngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as PartnerEngagementSummary;
}

function parseMarketObservations(data: unknown): MarketObservationsBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as MarketObservationsBlueprint;
}

function parseIndustryIntelligence(data: unknown): IndustryIntelligenceBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as IndustryIntelligenceBlueprint;
}

function parseRegionalInsights(data: unknown): RegionalInsightsBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as RegionalInsightsBlueprint;
}

function parseSalesExpertFeedbackLoops(data: unknown): SalesExpertFeedbackLoops | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as SalesExpertFeedbackLoops;
}

function parsePartnerEcosystemInsights(data: unknown): PartnerEcosystemInsights | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as PartnerEcosystemInsights;
}

function parseExecutiveSupport(data: unknown): ExecutiveSupportBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as ExecutiveSupportBlueprint;
}

function parseEcosystemGrowthSummary(data: unknown): EcosystemGrowthSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as EcosystemGrowthSummary;
}

function parseMarketIntelligenceTrustConnection(data: unknown): MarketIntelligenceTrustConnection | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as MarketIntelligenceTrustConnection;
}

export function parseMarketplacePartnerEcosystemFoundationEngineCard(
  data: unknown
): MarketplacePartnerEcosystemFoundationEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    mission: typeof d.mission === "string" ? d.mission : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    ecosystem_activation_summary: parseEcosystemActivationSummary(d.ecosystem_activation_summary),
    partner_mission: typeof d.partner_mission === "string" ? d.partner_mission : undefined,
    partner_philosophy: typeof d.partner_philosophy === "string" ? d.partner_philosophy : undefined,
    partner_abos_principle: typeof d.partner_abos_principle === "string" ? d.partner_abos_principle : undefined,
    partner_engagement_summary: parsePartnerEngagementSummary(d.partner_engagement_summary),
    ecosystem_growth_summary: parseEcosystemGrowthSummary(d.ecosystem_growth_summary),
    market_intelligence_mission: typeof d.market_intelligence_mission === "string" ? d.market_intelligence_mission : undefined,
    market_intelligence_philosophy: typeof d.market_intelligence_philosophy === "string" ? d.market_intelligence_philosophy : undefined,
    ...d,
  } as MarketplacePartnerEcosystemFoundationEngineCard;
}

export function parseMarketplacePartnerEcosystemFoundationEngineDashboard(
  data: unknown
): MarketplacePartnerEcosystemFoundationEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    principles: parseStringArray(d.principles),
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    approved_partners: parsePartnerList(d.approved_partners),
    pending_partners: parsePartnerList(d.pending_partners),
    offerings: parseOfferingList(d.offerings),
    certification_breakdown:
      typeof d.certification_breakdown === "object" && d.certification_breakdown
        ? (d.certification_breakdown as Record<string, unknown>)
        : undefined,
    quality_indicators:
      typeof d.quality_indicators === "object" && d.quality_indicators
        ? (d.quality_indicators as Record<string, unknown>)
        : undefined,
    integration_notes:
      typeof d.integration_notes === "object" && d.integration_notes
        ? (d.integration_notes as Record<string, unknown>)
        : undefined,
    recent_activity: Array.isArray(d.recent_activity) ? (d.recent_activity as Array<Record<string, unknown>>) : undefined,
    mission: typeof d.mission === "string" ? d.mission : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    ecosystem_objectives: parseEcosystemObjectives(d.ecosystem_objectives),
    industry_packs: parseIndustryPacks(d.industry_packs),
    connector_marketplace: parseConnectorMarketplace(d.connector_marketplace),
    knowledge_packs: parseKnowledgePacks(d.knowledge_packs),
    companion_skills: parseCompanionSkills(d.companion_skills),
    self_love_connection: parseSelfLoveConnection(d.self_love_connection),
    trust_connection: parseTrustConnection(d.trust_connection),
    quality_guardian_connection: parseQualityGuardianConnection(d.quality_guardian_connection),
    integration_links: parseIntegrationLinks(d.integration_links),
    ecosystem_activation_summary: parseEcosystemActivationSummary(d.ecosystem_activation_summary),
    success_criteria: parseSuccessCriteria(d.success_criteria),
    vision_phrases: parseStringArray(d.vision_phrases),
    partner_mission: typeof d.partner_mission === "string" ? d.partner_mission : undefined,
    partner_philosophy: typeof d.partner_philosophy === "string" ? d.partner_philosophy : undefined,
    partner_abos_principle: typeof d.partner_abos_principle === "string" ? d.partner_abos_principle : undefined,
    partner_vision: typeof d.partner_vision === "string" ? d.partner_vision : undefined,
    partner_objectives: parsePartnerObjectives(d.partner_objectives),
    partner_tiers: parsePartnerTiers(d.partner_tiers),
    partner_capabilities: parsePartnerCapabilities(d.partner_capabilities),
    partner_marketplace_connection: parsePartnerMarketplaceConnection(d.partner_marketplace_connection),
    partner_self_love_connection: parseSelfLoveConnection(d.partner_self_love_connection),
    partner_trust_connection: parsePartnerTrustConnection(d.partner_trust_connection),
    certification_connection: parseCertificationConnection(d.certification_connection),
    penbp_integration_links: parseIntegrationLinks(d.penbp_integration_links),
    partner_engagement_summary: parsePartnerEngagementSummary(d.partner_engagement_summary),
    blueprint_success_criteria: parseSuccessCriteria(d.blueprint_success_criteria),
    partner_vision_phrases: parseStringArray(d.partner_vision_phrases),
    blueprint_distinction_note:
      typeof d.blueprint_distinction_note === "string" ? d.blueprint_distinction_note : undefined,
    market_intelligence_mission: typeof d.market_intelligence_mission === "string" ? d.market_intelligence_mission : undefined,
    market_intelligence_philosophy: typeof d.market_intelligence_philosophy === "string" ? d.market_intelligence_philosophy : undefined,
    market_intelligence_abos_principle:
      typeof d.market_intelligence_abos_principle === "string" ? d.market_intelligence_abos_principle : undefined,
    market_intelligence_objectives: parseEcosystemObjectives(d.market_intelligence_objectives),
    market_observations: parseMarketObservations(d.market_observations),
    industry_intelligence: parseIndustryIntelligence(d.industry_intelligence),
    regional_insights: parseRegionalInsights(d.regional_insights),
    sales_expert_feedback_loops: parseSalesExpertFeedbackLoops(d.sales_expert_feedback_loops),
    partner_ecosystem_insights: parsePartnerEcosystemInsights(d.partner_ecosystem_insights),
    executive_support: parseExecutiveSupport(d.executive_support),
    market_intelligence_self_love_connection: parseSelfLoveConnection(d.market_intelligence_self_love_connection),
    market_intelligence_trust_connection: parseMarketIntelligenceTrustConnection(d.market_intelligence_trust_connection),
    egmibp_integration_links: parseIntegrationLinks(d.egmibp_integration_links),
    ecosystem_growth_summary: parseEcosystemGrowthSummary(d.ecosystem_growth_summary),
    market_intelligence_success_criteria: parseSuccessCriteria(d.market_intelligence_success_criteria),
    market_intelligence_vision_phrases: parseStringArray(d.market_intelligence_vision_phrases),
    market_intelligence_distinction_note:
      typeof d.market_intelligence_distinction_note === "string" ? d.market_intelligence_distinction_note : undefined,
    ...d,
  } as MarketplacePartnerEcosystemFoundationEngineDashboard;
}
