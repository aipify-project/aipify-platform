import type {
  AbosSuccessCriterion,
  BlueprintObjective,
  GrowthPartnerOperationsBlueprint,
  GrowthPartnerOperationsCard,
  GrowthPartnerOperationsDashboard,
  GrowthPartnerOperationsEngagementSummary,
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

function parseEngagementSummary(data: unknown): GrowthPartnerOperationsEngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as GrowthPartnerOperationsEngagementSummary;
}

function parseBlueprintBlock(data: unknown): GrowthPartnerOperationsBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as GrowthPartnerOperationsBlueprint;
}

function parseRecord(data: unknown): Record<string, unknown> | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as Record<string, unknown>;
}

export function parseGrowthPartnerOperationsCard(data: unknown): GrowthPartnerOperationsCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    partner_health_score: Number(d.partner_health_score ?? 0),
    active_customers: Number(d.active_customers ?? 0),
    upcoming_renewals: Number(d.upcoming_renewals ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    human_oversight_required: Boolean(d.human_oversight_required),
    implementation_blueprint_phase114: parseBlueprintMeta(d.implementation_blueprint_phase114),
    growth_partner_operations_mission:
      typeof d.growth_partner_operations_mission === "string"
        ? d.growth_partner_operations_mission
        : undefined,
    growth_partner_operations_abos_principle:
      typeof d.growth_partner_operations_abos_principle === "string"
        ? d.growth_partner_operations_abos_principle
        : undefined,
    growth_partner_operations_engagement_summary: parseEngagementSummary(
      d.growth_partner_operations_engagement_summary,
    ),
    growth_partner_operations_note:
      typeof d.growth_partner_operations_note === "string"
        ? d.growth_partner_operations_note
        : undefined,
    growth_partner_operations_vision_note:
      typeof d.growth_partner_operations_vision_note === "string"
        ? d.growth_partner_operations_vision_note
        : undefined,
  };
}

export function parseGrowthPartnerOperationsDashboard(data: unknown): GrowthPartnerOperationsDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    human_oversight_required: Boolean(d.human_oversight_required),
    operations_enabled: Boolean(d.operations_enabled ?? true),
    portfolio_segmentation_enabled: Boolean(d.portfolio_segmentation_enabled ?? true),
    mandatory_2fa_for_sensitive_roles: Boolean(d.mandatory_2fa_for_sensitive_roles ?? true),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    partner_health_score: Number(d.partner_health_score ?? 0),
    active_customers: Number(d.active_customers ?? 0),
    upcoming_renewals: Number(d.upcoming_renewals ?? 0),
    implementations_in_progress: Number(d.implementations_in_progress ?? 0),
    open_renewal_items: Number(d.open_renewal_items ?? 0),
    risk_signals_count: Number(d.risk_signals_count ?? 0),
    training_programs_count: Number(d.training_programs_count ?? 0),
    implementation_stages_count: Number(d.implementation_stages_count ?? 0),
    certification_levels_count: Number(d.certification_levels_count ?? 0),
    portfolio_customers: Array.isArray(d.portfolio_customers)
      ? (d.portfolio_customers as GrowthPartnerOperationsDashboard["portfolio_customers"])
      : [],
    implementations: Array.isArray(d.implementations)
      ? (d.implementations as GrowthPartnerOperationsDashboard["implementations"])
      : [],
    renewal_items: Array.isArray(d.renewal_items)
      ? (d.renewal_items as GrowthPartnerOperationsDashboard["renewal_items"])
      : [],
    health_snapshot:
      typeof d.health_snapshot === "object" && d.health_snapshot
        ? (d.health_snapshot as GrowthPartnerOperationsDashboard["health_snapshot"])
        : undefined,
    implementation_stage_templates: Array.isArray(d.implementation_stage_templates)
      ? (d.implementation_stage_templates as GrowthPartnerOperationsDashboard["implementation_stage_templates"])
      : [],
    training_programs: Array.isArray(d.training_programs)
      ? (d.training_programs as GrowthPartnerOperationsDashboard["training_programs"])
      : [],
    certification_levels: Array.isArray(d.certification_levels)
      ? (d.certification_levels as GrowthPartnerOperationsDashboard["certification_levels"])
      : [],
    integration_links: parseIntegrationLinks(d.integration_links ?? d.gpocbp114_integration_links),
    implementation_blueprint_phase114: parseBlueprintMeta(d.implementation_blueprint_phase114),
    growth_partner_operations_engine_note:
      typeof d.growth_partner_operations_engine_note === "string"
        ? d.growth_partner_operations_engine_note
        : undefined,
    growth_partner_operations_blueprint: parseBlueprintBlock(d.growth_partner_operations_blueprint),
    growth_partner_operations_distinction_note:
      typeof d.growth_partner_operations_distinction_note === "string"
        ? d.growth_partner_operations_distinction_note
        : undefined,
    growth_partner_operations_mission:
      typeof d.growth_partner_operations_mission === "string"
        ? d.growth_partner_operations_mission
        : undefined,
    growth_partner_operations_philosophy:
      typeof d.growth_partner_operations_philosophy === "string"
        ? d.growth_partner_operations_philosophy
        : undefined,
    growth_partner_operations_abos_principle:
      typeof d.growth_partner_operations_abos_principle === "string"
        ? d.growth_partner_operations_abos_principle
        : undefined,
    growth_partner_operations_objectives: parseObjectives(d.growth_partner_operations_objectives),
    operations_center_modules: Array.isArray(d.operations_center_modules)
      ? (d.operations_center_modules as GrowthPartnerOperationsDashboard["operations_center_modules"])
      : undefined,
    partner_dashboard_meta: parseRecord(d.partner_dashboard_meta),
    customer_portfolio_meta: parseRecord(d.customer_portfolio_meta),
    implementation_center_meta: parseRecord(d.implementation_center_meta),
    companion_deployment_center_meta: parseRecord(d.companion_deployment_center_meta),
    customer_success_metrics_meta: parseRecord(d.customer_success_metrics_meta),
    partner_health_scores_meta: parseRecord(d.partner_health_scores_meta),
    training_academy_meta: parseRecord(d.training_academy_meta),
    certification_framework_meta: parseRecord(d.certification_framework_meta),
    knowledge_distribution_meta: parseRecord(d.knowledge_distribution_meta),
    renewal_center_meta: parseRecord(d.renewal_center_meta),
    partner_insights_meta: parseRecord(d.partner_insights_meta),
    marketplace_integration_meta: parseRecord(d.marketplace_integration_meta),
    security_requirements_meta: parseRecord(d.security_requirements_meta),
    gpocbp114_cross_links: parseIntegrationLinks(d.gpocbp114_cross_links),
    growth_partner_operations_limitation_principles: parseLimitationPrinciples(
      d.growth_partner_operations_limitation_principles,
    ),
    growth_partner_operations_companion_adaptation:
      typeof d.growth_partner_operations_companion_adaptation === "object" &&
      d.growth_partner_operations_companion_adaptation
        ? (d.growth_partner_operations_companion_adaptation as GrowthPartnerOperationsDashboard["growth_partner_operations_companion_adaptation"])
        : undefined,
    gpocbp114_integration_links: parseIntegrationLinks(d.gpocbp114_integration_links),
    growth_partner_operations_engagement_summary: parseEngagementSummary(
      d.growth_partner_operations_engagement_summary,
    ),
    growth_partner_operations_success_criteria: parseSuccessCriteria(
      d.growth_partner_operations_success_criteria,
    ),
    growth_partner_operations_success_metrics: Array.isArray(d.growth_partner_operations_success_metrics)
      ? (d.growth_partner_operations_success_metrics as GrowthPartnerOperationsDashboard["growth_partner_operations_success_metrics"])
      : undefined,
    growth_partner_operations_vision:
      typeof d.growth_partner_operations_vision === "string"
        ? d.growth_partner_operations_vision
        : undefined,
    growth_partner_operations_privacy_note:
      typeof d.growth_partner_operations_privacy_note === "string"
        ? d.growth_partner_operations_privacy_note
        : undefined,
  };
}
