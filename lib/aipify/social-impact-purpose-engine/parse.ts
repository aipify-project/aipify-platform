import type {
  AbosSuccessCriterion,
  BlueprintObjective,
  IntegrationLink,
  LimitationPrinciples,
  SocialImpactPurposeBlueprint,
  SocialImpactPurposeCard,
  SocialImpactPurposeDashboard,
  SocialImpactPurposeEngagementSummary,
  ImplementationBlueprintMeta,
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

function parseEngagementSummary(data: unknown): SocialImpactPurposeEngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as SocialImpactPurposeEngagementSummary;
}

function parseBlueprintBlock(data: unknown): SocialImpactPurposeBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as SocialImpactPurposeBlueprint;
}

function parseRecord(data: unknown): Record<string, unknown> | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as Record<string, unknown>;
}

export function parseSocialImpactPurposeCard(data: unknown): SocialImpactPurposeCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    active_initiatives: Number(d.active_initiatives ?? 0),
    active_commitments: Number(d.active_commitments ?? 0),
    avg_initiative_progress: Number(d.avg_initiative_progress ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    human_oversight_required: Boolean(d.human_oversight_required),
    implementation_blueprint_phase118: parseBlueprintMeta(d.implementation_blueprint_phase118),
    social_impact_purpose_mission:
      typeof d.social_impact_purpose_mission === "string" ? d.social_impact_purpose_mission : undefined,
    social_impact_purpose_abos_principle:
      typeof d.social_impact_purpose_abos_principle === "string"
        ? d.social_impact_purpose_abos_principle
        : undefined,
    social_impact_purpose_engagement_summary: parseEngagementSummary(
      d.social_impact_purpose_engagement_summary,
    ),
    social_impact_purpose_note:
      typeof d.social_impact_purpose_note === "string" ? d.social_impact_purpose_note : undefined,
    social_impact_purpose_vision_note:
      typeof d.social_impact_purpose_vision_note === "string" ? d.social_impact_purpose_vision_note : undefined,
  };
}

export function parseSocialImpactPurposeDashboard(data: unknown): SocialImpactPurposeDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    human_oversight_required: Boolean(d.human_oversight_required),
    enabled: Boolean(d.enabled ?? true),
    purpose_visibility: typeof d.purpose_visibility === "string" ? d.purpose_visibility : undefined,
    wellbeing_programs_enabled: Boolean(d.wellbeing_programs_enabled ?? true),
    community_programs_enabled: Boolean(d.community_programs_enabled ?? true),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    active_initiatives: Number(d.active_initiatives ?? 0),
    active_commitments: Number(d.active_commitments ?? 0),
    avg_initiative_progress: Number(d.avg_initiative_progress ?? 0),
    total_participation: Number(d.total_participation ?? 0),
    alignment_snapshots: Number(d.alignment_snapshots ?? 0),
    impact_indicators_count: Number(d.impact_indicators_count ?? 0),
    initiatives: Array.isArray(d.initiatives)
      ? (d.initiatives as SocialImpactPurposeDashboard["initiatives"])
      : [],
    commitments: Array.isArray(d.commitments)
      ? (d.commitments as SocialImpactPurposeDashboard["commitments"])
      : [],
    alignment_snapshots_list: Array.isArray(d.alignment_snapshots_list)
      ? (d.alignment_snapshots_list as SocialImpactPurposeDashboard["alignment_snapshots_list"])
      : [],
    impact_indicators: Array.isArray(d.impact_indicators)
      ? (d.impact_indicators as SocialImpactPurposeDashboard["impact_indicators"])
      : [],
    initiative_type_scaffolds: Array.isArray(d.initiative_type_scaffolds)
      ? (d.initiative_type_scaffolds as SocialImpactPurposeDashboard["initiative_type_scaffolds"])
      : [],
    integration_links: parseIntegrationLinks(d.integration_links ?? d.sipbp118_integration_links),
    implementation_blueprint_phase118: parseBlueprintMeta(d.implementation_blueprint_phase118),
    social_impact_purpose_engine_note:
      typeof d.social_impact_purpose_engine_note === "string" ? d.social_impact_purpose_engine_note : undefined,
    social_impact_purpose_blueprint: parseBlueprintBlock(d.social_impact_purpose_blueprint),
    social_impact_purpose_distinction_note:
      typeof d.social_impact_purpose_distinction_note === "string"
        ? d.social_impact_purpose_distinction_note
        : undefined,
    social_impact_purpose_mission:
      typeof d.social_impact_purpose_mission === "string" ? d.social_impact_purpose_mission : undefined,
    social_impact_purpose_philosophy:
      typeof d.social_impact_purpose_philosophy === "string" ? d.social_impact_purpose_philosophy : undefined,
    social_impact_purpose_abos_principle:
      typeof d.social_impact_purpose_abos_principle === "string"
        ? d.social_impact_purpose_abos_principle
        : undefined,
    social_impact_purpose_objectives: parseObjectives(d.social_impact_purpose_objectives),
    purpose_center_meta: parseRecord(d.purpose_center_meta),
    social_impact_initiatives_meta: parseRecord(d.social_impact_initiatives_meta),
    employee_wellbeing_meta: parseRecord(d.employee_wellbeing_meta),
    purpose_alignment_meta: parseRecord(d.purpose_alignment_meta),
    impact_tracking_meta: parseRecord(d.impact_tracking_meta),
    companion_responsibilities_meta: parseRecord(d.companion_responsibilities_meta),
    growth_partner_participation_meta: parseRecord(d.growth_partner_participation_meta),
    self_love_in_organizations_meta: parseRecord(d.self_love_in_organizations_meta),
    community_impact_programs_meta: parseRecord(d.community_impact_programs_meta),
    executive_purpose_dashboard_meta: parseRecord(d.executive_purpose_dashboard_meta),
    sipbp118_cross_links: parseIntegrationLinks(d.sipbp118_cross_links),
    social_impact_purpose_limitation_principles: parseLimitationPrinciples(
      d.social_impact_purpose_limitation_principles,
    ),
    social_impact_purpose_companion_adaptation:
      typeof d.social_impact_purpose_companion_adaptation === "object" &&
      d.social_impact_purpose_companion_adaptation
        ? (d.social_impact_purpose_companion_adaptation as SocialImpactPurposeDashboard["social_impact_purpose_companion_adaptation"])
        : undefined,
    sipbp118_integration_links: parseIntegrationLinks(d.sipbp118_integration_links),
    social_impact_purpose_engagement_summary: parseEngagementSummary(
      d.social_impact_purpose_engagement_summary,
    ),
    social_impact_purpose_success_criteria: parseSuccessCriteria(d.social_impact_purpose_success_criteria),
    social_impact_purpose_success_metrics: Array.isArray(d.social_impact_purpose_success_metrics)
      ? (d.social_impact_purpose_success_metrics as SocialImpactPurposeDashboard["social_impact_purpose_success_metrics"])
      : undefined,
    social_impact_purpose_vision:
      typeof d.social_impact_purpose_vision === "string" ? d.social_impact_purpose_vision : undefined,
    social_impact_purpose_privacy_note:
      typeof d.social_impact_purpose_privacy_note === "string" ? d.social_impact_purpose_privacy_note : undefined,
  };
}
