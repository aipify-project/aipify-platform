import type {
  PlatformIntegrityCard,
  PlatformIntegrityDashboard,
  IntegrityActionResult,
  SelfAwarenessPlatformIntegrityBlueprint,
  BlueprintObjective,
  AbosSuccessCriterion,
  IntegrationLink,
  SelfAwarenessEngagementSummary,
  ImplementationBlueprint,
} from "./types";

function parseBlueprintObjectives(data: unknown): BlueprintObjective[] {
  return Array.isArray(data) ? (data as BlueprintObjective[]) : [];
}

function parseSuccessCriteria(data: unknown): AbosSuccessCriterion[] {
  return Array.isArray(data) ? (data as AbosSuccessCriterion[]) : [];
}

function parseIntegrationLinks(data: unknown): IntegrationLink[] {
  return Array.isArray(data) ? (data as IntegrationLink[]) : [];
}

function parseEngagementSummary(data: unknown): SelfAwarenessEngagementSummary | undefined {
  if (!data || typeof data !== "object") return undefined;
  return data as SelfAwarenessEngagementSummary;
}

function parseImplementationBlueprint(data: unknown): ImplementationBlueprint | undefined {
  if (!data || typeof data !== "object") return undefined;
  return data as ImplementationBlueprint;
}

function parseSelfAwarenessBlueprint(data: unknown): SelfAwarenessPlatformIntegrityBlueprint | undefined {
  if (!data || typeof data !== "object") return undefined;
  const b = data as Record<string, unknown>;
  return {
    implementation_blueprint_phase87: parseImplementationBlueprint(b.implementation_blueprint_phase87),
    self_awareness_platform_integrity_note: b.self_awareness_platform_integrity_note as string | undefined,
    distinction_note: b.distinction_note as string | undefined,
    mission: b.mission as string | undefined,
    philosophy: b.philosophy as string | undefined,
    abos_principle: b.abos_principle as string | undefined,
    vision: b.vision as string | undefined,
    objectives: parseBlueprintObjectives(b.objectives),
    platform_health_monitoring: b.platform_health_monitoring as SelfAwarenessPlatformIntegrityBlueprint["platform_health_monitoring"],
    self_observation_examples: b.self_observation_examples as SelfAwarenessPlatformIntegrityBlueprint["self_observation_examples"],
    capability_boundaries: b.capability_boundaries as SelfAwarenessPlatformIntegrityBlueprint["capability_boundaries"],
    self_improvement_opportunities: b.self_improvement_opportunities as SelfAwarenessPlatformIntegrityBlueprint["self_improvement_opportunities"],
    integrity_safeguards: b.integrity_safeguards as SelfAwarenessPlatformIntegrityBlueprint["integrity_safeguards"],
    companion_guidance: b.companion_guidance as SelfAwarenessPlatformIntegrityBlueprint["companion_guidance"],
    self_love_connection: b.self_love_connection as Record<string, unknown> | undefined,
    trust_connection: b.trust_connection as Record<string, unknown> | undefined,
    privacy_principles: b.privacy_principles as SelfAwarenessPlatformIntegrityBlueprint["privacy_principles"],
    dogfooding: b.dogfooding as Record<string, unknown> | undefined,
    success_criteria: parseSuccessCriteria(b.success_criteria),
    integration_links: parseIntegrationLinks(b.integration_links),
    engagement_summary: parseEngagementSummary(b.engagement_summary),
    privacy_note: b.privacy_note as string | undefined,
  };
}

export function parsePlatformIntegrityCard(data: unknown): PlatformIntegrityCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    integrity_score: d.integrity_score as number | undefined,
    integrity_band: d.integrity_band as string | undefined,
    integrity_band_label: d.integrity_band_label as string | undefined,
    open_findings: d.open_findings as number | undefined,
    philosophy: d.philosophy as string | undefined,
    human_oversight_required: d.human_oversight_required as boolean | undefined,
    implementation_blueprint_phase87: parseImplementationBlueprint(d.implementation_blueprint_phase87),
    blueprint_mission: d.blueprint_mission as string | undefined,
    blueprint_philosophy: d.blueprint_philosophy as string | undefined,
    blueprint_abos_principle: d.blueprint_abos_principle as string | undefined,
    blueprint_engagement_summary: parseEngagementSummary(d.blueprint_engagement_summary),
    blueprint_note: d.blueprint_note as string | undefined,
  };
}

export function parsePlatformIntegrityDashboard(data: unknown): PlatformIntegrityDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    human_oversight_required: d.human_oversight_required as boolean | undefined,
    reviews_enabled: d.reviews_enabled as boolean | undefined,
    show_critical_findings: d.show_critical_findings as boolean | undefined,
    philosophy: d.philosophy as string | undefined,
    safety_note: d.safety_note as string | undefined,
    integrity_score: d.integrity_score as number | undefined,
    integrity_band: d.integrity_band as string | undefined,
    integrity_band_label: d.integrity_band_label as string | undefined,
    score_components: d.score_components as Record<string, number> | undefined,
    review_queue: Array.isArray(d.review_queue) ? (d.review_queue as PlatformIntegrityDashboard["review_queue"]) : [],
    findings: Array.isArray(d.findings) ? (d.findings as PlatformIntegrityDashboard["findings"]) : [],
    actions: Array.isArray(d.actions) ? (d.actions as PlatformIntegrityDashboard["actions"]) : [],
    deprecated_assets: Array.isArray(d.deprecated_assets)
      ? (d.deprecated_assets as PlatformIntegrityDashboard["deprecated_assets"])
      : [],
    briefings: Array.isArray(d.briefings) ? (d.briefings as PlatformIntegrityDashboard["briefings"]) : [],
    integrity_trends: Array.isArray(d.integrity_trends)
      ? (d.integrity_trends as PlatformIntegrityDashboard["integrity_trends"])
      : [],
    review_domains: Array.isArray(d.review_domains)
      ? (d.review_domains as PlatformIntegrityDashboard["review_domains"])
      : [],
    review_frequencies: Array.isArray(d.review_frequencies)
      ? (d.review_frequencies as PlatformIntegrityDashboard["review_frequencies"])
      : [],
    integrations: d.integrations as Record<string, string> | undefined,
    self_awareness_platform_integrity_blueprint: parseSelfAwarenessBlueprint(
      d.self_awareness_platform_integrity_blueprint
    ),
  };
}

export function parseIntegrityActionResult(data: unknown): IntegrityActionResult {
  return (data ?? {}) as IntegrityActionResult;
}
