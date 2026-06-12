import type {
  AbosSuccessCriterion,
  BlueprintObjective,
  GlobalEcosystemMarketplaceBlueprint,
  GlobalEcosystemMarketplaceCard,
  GlobalEcosystemMarketplaceDashboard,
  GlobalEcosystemMarketplaceEngagementSummary,
  ImplementationBlueprintMeta,
  IntegrationLink,
  LimitationPrinciples,
  SolutionContribution,
  SolutionListing,
  SolutionValidation,
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

function parseIntegrationLinks(data: unknown): IntegrationLink[] {
  if (!Array.isArray(data)) return [];
  return data as IntegrationLink[];
}

function parseLimitationPrinciples(data: unknown): LimitationPrinciples | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as LimitationPrinciples;
}

function parseEngagementSummary(data: unknown): GlobalEcosystemMarketplaceEngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as GlobalEcosystemMarketplaceEngagementSummary;
}

function parseBlueprintBlock(data: unknown): GlobalEcosystemMarketplaceBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as GlobalEcosystemMarketplaceBlueprint;
}

function parseListings(data: unknown): SolutionListing[] {
  if (!Array.isArray(data)) return [];
  return data as SolutionListing[];
}

function parseValidations(data: unknown): SolutionValidation[] {
  if (!Array.isArray(data)) return [];
  return data as SolutionValidation[];
}

function parseContributions(data: unknown): SolutionContribution[] {
  if (!Array.isArray(data)) return [];
  return data as SolutionContribution[];
}

export function parseGlobalEcosystemMarketplaceCard(data: unknown): GlobalEcosystemMarketplaceCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    marketplace_score: Number(d.marketplace_score ?? 0),
    participation_status:
      typeof d.participation_status === "string" ? d.participation_status : undefined,
    enabled: Boolean(d.enabled),
    listings_count: Number(d.listings_count ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    approval_required: Boolean(d.approval_required),
    executive_approval_required: Boolean(d.executive_approval_required),
    implementation_blueprint: parseBlueprintMeta(d.implementation_blueprint),
    global_ecosystem_marketplace_mission:
      typeof d.global_ecosystem_marketplace_mission === "string"
        ? d.global_ecosystem_marketplace_mission
        : undefined,
    global_ecosystem_marketplace_abos_principle:
      typeof d.global_ecosystem_marketplace_abos_principle === "string"
        ? d.global_ecosystem_marketplace_abos_principle
        : undefined,
    global_ecosystem_marketplace_engagement_summary: parseEngagementSummary(
      d.global_ecosystem_marketplace_engagement_summary,
    ),
    global_ecosystem_marketplace_note:
      typeof d.global_ecosystem_marketplace_note === "string"
        ? d.global_ecosystem_marketplace_note
        : undefined,
    global_ecosystem_marketplace_vision_note:
      typeof d.global_ecosystem_marketplace_vision_note === "string"
        ? d.global_ecosystem_marketplace_vision_note
        : undefined,
  };
}

export function parseGlobalEcosystemMarketplaceDashboard(
  data: unknown,
): GlobalEcosystemMarketplaceDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    enabled: Boolean(d.enabled),
    participation_status:
      typeof d.participation_status === "string" ? d.participation_status : undefined,
    approval_required: Boolean(d.approval_required),
    executive_approval_required: Boolean(d.executive_approval_required),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    marketplace_score: Number(d.marketplace_score ?? 0),
    listings_count: Number(d.listings_count ?? 0),
    approved_listings_count: Number(d.approved_listings_count ?? 0),
    pending_listings_count: Number(d.pending_listings_count ?? 0),
    validations_count: Number(d.validations_count ?? 0),
    contributions_count: Number(d.contributions_count ?? 0),
    approved_contributions_count: Number(d.approved_contributions_count ?? 0),
    listings: parseListings(d.listings),
    validations: parseValidations(d.validations),
    contributions: parseContributions(d.contributions),
    integration_links: parseIntegrationLinks(d.integration_links),
    implementation_blueprint: parseBlueprintMeta(d.implementation_blueprint),
    global_ecosystem_marketplace_blueprint: parseBlueprintBlock(d.global_ecosystem_marketplace_blueprint),
    global_ecosystem_marketplace_mission:
      typeof d.global_ecosystem_marketplace_mission === "string"
        ? d.global_ecosystem_marketplace_mission
        : undefined,
    global_ecosystem_marketplace_philosophy:
      typeof d.global_ecosystem_marketplace_philosophy === "string"
        ? d.global_ecosystem_marketplace_philosophy
        : undefined,
    global_ecosystem_marketplace_abos_principle:
      typeof d.global_ecosystem_marketplace_abos_principle === "string"
        ? d.global_ecosystem_marketplace_abos_principle
        : undefined,
    global_ecosystem_marketplace_objectives: parseObjectives(d.global_ecosystem_marketplace_objectives),
    global_solution_marketplace_center_meta:
      typeof d.global_solution_marketplace_center_meta === "object" &&
      d.global_solution_marketplace_center_meta
        ? (d.global_solution_marketplace_center_meta as Record<string, unknown>)
        : undefined,
    marketplace_categories_meta:
      typeof d.marketplace_categories_meta === "object" && d.marketplace_categories_meta
        ? (d.marketplace_categories_meta as Record<string, unknown>)
        : undefined,
    industry_solution_pack_engine_meta:
      typeof d.industry_solution_pack_engine_meta === "object" &&
      d.industry_solution_pack_engine_meta
        ? (d.industry_solution_pack_engine_meta as Record<string, unknown>)
        : undefined,
    growth_partner_marketplace_engine_meta:
      typeof d.growth_partner_marketplace_engine_meta === "object" &&
      d.growth_partner_marketplace_engine_meta
        ? (d.growth_partner_marketplace_engine_meta as Record<string, unknown>)
        : undefined,
    solution_validation_framework_meta:
      typeof d.solution_validation_framework_meta === "object" &&
      d.solution_validation_framework_meta
        ? (d.solution_validation_framework_meta as Record<string, unknown>)
        : undefined,
    procurement_readiness_engine_meta:
      typeof d.procurement_readiness_engine_meta === "object" &&
      d.procurement_readiness_engine_meta
        ? (d.procurement_readiness_engine_meta as Record<string, unknown>)
        : undefined,
    marketplace_companion_meta:
      typeof d.marketplace_companion_meta === "object" && d.marketplace_companion_meta
        ? (d.marketplace_companion_meta as Record<string, unknown>)
        : undefined,
    solution_contribution_engine_meta:
      typeof d.solution_contribution_engine_meta === "object" &&
      d.solution_contribution_engine_meta
        ? (d.solution_contribution_engine_meta as Record<string, unknown>)
        : undefined,
    companion_limitations_meta: parseLimitationPrinciples(d.companion_limitations_meta),
    self_love_connection_meta:
      typeof d.self_love_connection_meta === "object" && d.self_love_connection_meta
        ? (d.self_love_connection_meta as Record<string, unknown>)
        : undefined,
    security_requirements_meta:
      typeof d.security_requirements_meta === "object" && d.security_requirements_meta
        ? (d.security_requirements_meta as Record<string, unknown>)
        : undefined,
    gsembp148_integration_links: parseIntegrationLinks(d.gsembp148_integration_links),
    global_ecosystem_marketplace_engagement_summary: parseEngagementSummary(
      d.global_ecosystem_marketplace_engagement_summary,
    ),
    global_ecosystem_marketplace_success_criteria: parseSuccessCriteria(
      d.global_ecosystem_marketplace_success_criteria,
    ),
    global_ecosystem_marketplace_vision:
      typeof d.global_ecosystem_marketplace_vision === "string"
        ? d.global_ecosystem_marketplace_vision
        : undefined,
    global_ecosystem_marketplace_vision_phrases: Array.isArray(
      d.global_ecosystem_marketplace_vision_phrases,
    )
      ? (d.global_ecosystem_marketplace_vision_phrases as string[])
      : undefined,
    global_ecosystem_marketplace_privacy_note:
      typeof d.global_ecosystem_marketplace_privacy_note === "string"
        ? d.global_ecosystem_marketplace_privacy_note
        : undefined,
    global_ecosystem_marketplace_dogfooding:
      typeof d.global_ecosystem_marketplace_dogfooding === "string"
        ? d.global_ecosystem_marketplace_dogfooding
        : undefined,
    global_ecosystem_marketplace_engine_note:
      typeof d.global_ecosystem_marketplace_engine_note === "string"
        ? d.global_ecosystem_marketplace_engine_note
        : undefined,
    global_ecosystem_marketplace_distinction_note:
      typeof d.global_ecosystem_marketplace_distinction_note === "string"
        ? d.global_ecosystem_marketplace_distinction_note
        : undefined,
  };
}
