import type {
  AbosSuccessCriterion,
  BlueprintObjective,
  CompanionMarketplaceBlueprint,
  CompanionMarketplaceCard,
  CompanionMarketplaceDashboard,
  CompanionMarketplaceEngagementSummary,
  ImplementationBlueprintMeta,
  IntegrationLink,
  LimitationPrinciples,
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

function parseEngagementSummary(data: unknown): CompanionMarketplaceEngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as CompanionMarketplaceEngagementSummary;
}

function parseBlueprintBlock(data: unknown): CompanionMarketplaceBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as CompanionMarketplaceBlueprint;
}

function parseRecord(data: unknown): Record<string, unknown> | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as Record<string, unknown>;
}

export function parseCompanionMarketplaceCard(data: unknown): CompanionMarketplaceCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    marketplace_score: Number(d.marketplace_score ?? 0),
    active_deployments_count: Number(d.active_deployments_count ?? 0),
    catalog_items_count: Number(d.catalog_items_count ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    human_oversight_required: Boolean(d.human_oversight_required),
    human_approval_required: Boolean(d.human_approval_required ?? true),
    default_governance_level: Number(d.default_governance_level ?? 2),
    implementation_blueprint: parseBlueprintMeta(d.implementation_blueprint),
    companion_marketplace_mission:
      typeof d.companion_marketplace_mission === "string" ? d.companion_marketplace_mission : undefined,
    companion_marketplace_abos_principle:
      typeof d.companion_marketplace_abos_principle === "string"
        ? d.companion_marketplace_abos_principle
        : undefined,
    companion_marketplace_engagement_summary: parseEngagementSummary(d.companion_marketplace_engagement_summary),
    companion_marketplace_note:
      typeof d.companion_marketplace_note === "string" ? d.companion_marketplace_note : undefined,
    companion_marketplace_vision_note:
      typeof d.companion_marketplace_vision_note === "string" ? d.companion_marketplace_vision_note : undefined,
  };
}

export function parseCompanionMarketplaceDashboard(data: unknown): CompanionMarketplaceDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    human_oversight_required: Boolean(d.human_oversight_required),
    human_approval_required: Boolean(d.human_approval_required ?? true),
    marketplace_enabled: Boolean(d.marketplace_enabled ?? true),
    default_governance_level: Number(d.default_governance_level ?? 2),
    enterprise_center_enabled: Boolean(d.enterprise_center_enabled),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    marketplace_score: Number(d.marketplace_score ?? 0),
    deployments_count: Number(d.deployments_count ?? 0),
    active_deployments_count: Number(d.active_deployments_count ?? 0),
    catalog_items_count: Number(d.catalog_items_count ?? 0),
    recommendation_quality: Number(d.recommendation_quality ?? 0),
    escalation_frequency: Number(d.escalation_frequency ?? 0),
    user_satisfaction: Number(d.user_satisfaction ?? 0),
    adoption_rate: Number(d.adoption_rate ?? 0),
    policy_compliance: Number(d.policy_compliance ?? 0),
    catalog_by_category: Array.isArray(d.catalog_by_category)
      ? (d.catalog_by_category as CompanionMarketplaceDashboard["catalog_by_category"])
      : [],
    companion_directory: Array.isArray(d.companion_directory)
      ? (d.companion_directory as CompanionMarketplaceDashboard["companion_directory"])
      : [],
    health_snapshot:
      typeof d.health_snapshot === "object" && d.health_snapshot
        ? (d.health_snapshot as CompanionMarketplaceDashboard["health_snapshot"])
        : {},
    deployment_flow: parseRecord(d.deployment_flow),
    governance_layers: parseRecord(d.governance_layers),
    collaboration_rules: parseRecord(d.collaboration_rules),
    enterprise_center: parseRecord(d.enterprise_center),
    security_requirements: parseRecord(d.security_requirements),
    integration_links: parseIntegrationLinks(d.integration_links ?? d.cmbp113_integration_links),
    implementation_blueprint: parseBlueprintBlock(d.implementation_blueprint),
    companion_marketplace_engine_note:
      typeof d.companion_marketplace_engine_note === "string" ? d.companion_marketplace_engine_note : undefined,
    companion_marketplace_blueprint: parseBlueprintBlock(d.companion_marketplace_blueprint),
    companion_marketplace_distinction_note:
      typeof d.companion_marketplace_distinction_note === "string"
        ? d.companion_marketplace_distinction_note
        : undefined,
    companion_marketplace_mission:
      typeof d.companion_marketplace_mission === "string" ? d.companion_marketplace_mission : undefined,
    companion_marketplace_philosophy:
      typeof d.companion_marketplace_philosophy === "string" ? d.companion_marketplace_philosophy : undefined,
    companion_marketplace_abos_principle:
      typeof d.companion_marketplace_abos_principle === "string"
        ? d.companion_marketplace_abos_principle
        : undefined,
    companion_marketplace_objectives: parseObjectives(d.companion_marketplace_objectives),
    companion_marketplace_categories: parseRecord(d.companion_marketplace_categories),
    companion_marketplace_digital_employee_model: parseRecord(d.companion_marketplace_digital_employee_model),
    companion_marketplace_employee_types: parseRecord(d.companion_marketplace_employee_types),
    companion_marketplace_directory_fields: parseRecord(d.companion_marketplace_directory_fields),
    companion_marketplace_health_metrics: parseRecord(d.companion_marketplace_health_metrics),
    companion_marketplace_lifecycle_states: parseRecord(d.companion_marketplace_lifecycle_states),
    companion_marketplace_limitation_principles: parseLimitationPrinciples(
      d.companion_marketplace_limitation_principles,
    ),
    companion_marketplace_companion_adaptation: d.companion_marketplace_companion_adaptation as
      | CompanionMarketplaceDashboard["companion_marketplace_companion_adaptation"]
      | undefined,
    companion_marketplace_success_metrics: parseRecord(d.companion_marketplace_success_metrics),
    cmbp113_integration_links: parseIntegrationLinks(d.cmbp113_integration_links),
    companion_marketplace_engagement_summary: parseEngagementSummary(d.companion_marketplace_engagement_summary),
    companion_marketplace_success_criteria: parseSuccessCriteria(d.companion_marketplace_success_criteria),
    companion_marketplace_vision:
      typeof d.companion_marketplace_vision === "string" ? d.companion_marketplace_vision : undefined,
    companion_marketplace_privacy_note:
      typeof d.companion_marketplace_privacy_note === "string" ? d.companion_marketplace_privacy_note : undefined,
  };
}
