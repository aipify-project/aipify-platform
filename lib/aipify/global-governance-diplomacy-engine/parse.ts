import type {
  AbosSuccessCriterion,
  BlueprintObjective,
  DiplomacyEngagement,
  GlobalGovernanceDiplomacyBlueprint,
  GlobalGovernanceDiplomacyCard,
  GlobalGovernanceDiplomacyDashboard,
  GlobalGovernanceDiplomacyEngagementSummary,
  ImplementationBlueprintMeta,
  IntegrationLink,
  LimitationPrinciples,
  PartnershipCharter,
  PolicyLibraryRef,
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

function parseEngagementSummary(data: unknown): GlobalGovernanceDiplomacyEngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as GlobalGovernanceDiplomacyEngagementSummary;
}

function parseBlueprintBlock(data: unknown): GlobalGovernanceDiplomacyBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as GlobalGovernanceDiplomacyBlueprint;
}

function parseCharters(data: unknown): PartnershipCharter[] {
  if (!Array.isArray(data)) return [];
  return data as PartnershipCharter[];
}

function parseEngagements(data: unknown): DiplomacyEngagement[] {
  if (!Array.isArray(data)) return [];
  return data as DiplomacyEngagement[];
}

function parsePolicyRefs(data: unknown): PolicyLibraryRef[] {
  if (!Array.isArray(data)) return [];
  return data as PolicyLibraryRef[];
}

export function parseGlobalGovernanceDiplomacyCard(data: unknown): GlobalGovernanceDiplomacyCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    governance_score: Number(d.governance_score ?? 0),
    enabled: Boolean(d.enabled),
    governance_maturity_level: Number(d.governance_maturity_level ?? 1),
    charters_count: Number(d.charters_count ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    executive_approval_required: Boolean(d.executive_approval_required),
    legal_disclaimer: typeof d.legal_disclaimer === "string" ? d.legal_disclaimer : undefined,
    implementation_blueprint: parseBlueprintMeta(d.implementation_blueprint),
    global_governance_diplomacy_mission:
      typeof d.global_governance_diplomacy_mission === "string"
        ? d.global_governance_diplomacy_mission
        : undefined,
    global_governance_diplomacy_abos_principle:
      typeof d.global_governance_diplomacy_abos_principle === "string"
        ? d.global_governance_diplomacy_abos_principle
        : undefined,
    global_governance_diplomacy_engagement_summary: parseEngagementSummary(
      d.global_governance_diplomacy_engagement_summary,
    ),
    global_governance_diplomacy_note:
      typeof d.global_governance_diplomacy_note === "string"
        ? d.global_governance_diplomacy_note
        : undefined,
    global_governance_diplomacy_vision_note:
      typeof d.global_governance_diplomacy_vision_note === "string"
        ? d.global_governance_diplomacy_vision_note
        : undefined,
  };
}

export function parseGlobalGovernanceDiplomacyDashboard(
  data: unknown,
): GlobalGovernanceDiplomacyDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    enabled: Boolean(d.enabled),
    governance_maturity_level: Number(d.governance_maturity_level ?? 1),
    executive_approval_required: Boolean(d.executive_approval_required),
    partnership_prep_enabled: Boolean(d.partnership_prep_enabled),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    legal_disclaimer: typeof d.legal_disclaimer === "string" ? d.legal_disclaimer : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    governance_score: Number(d.governance_score ?? 0),
    charters_count: Number(d.charters_count ?? 0),
    active_charters_count: Number(d.active_charters_count ?? 0),
    engagements_count: Number(d.engagements_count ?? 0),
    active_engagements_count: Number(d.active_engagements_count ?? 0),
    policy_library_refs_count: Number(d.policy_library_refs_count ?? 0),
    partnership_charters: parseCharters(d.partnership_charters),
    diplomacy_engagements: parseEngagements(d.diplomacy_engagements),
    policy_library_refs: parsePolicyRefs(d.policy_library_refs),
    integration_links: parseIntegrationLinks(d.integration_links),
    implementation_blueprint: parseBlueprintMeta(d.implementation_blueprint),
    global_governance_diplomacy_blueprint: parseBlueprintBlock(d.global_governance_diplomacy_blueprint),
    global_governance_diplomacy_mission:
      typeof d.global_governance_diplomacy_mission === "string"
        ? d.global_governance_diplomacy_mission
        : undefined,
    global_governance_diplomacy_philosophy:
      typeof d.global_governance_diplomacy_philosophy === "string"
        ? d.global_governance_diplomacy_philosophy
        : undefined,
    global_governance_diplomacy_abos_principle:
      typeof d.global_governance_diplomacy_abos_principle === "string"
        ? d.global_governance_diplomacy_abos_principle
        : undefined,
    global_governance_diplomacy_objectives: parseObjectives(d.global_governance_diplomacy_objectives),
    global_governance_center_meta:
      typeof d.global_governance_center_meta === "object" && d.global_governance_center_meta
        ? (d.global_governance_center_meta as Record<string, unknown>)
        : undefined,
    digital_diplomacy_engine_meta:
      typeof d.digital_diplomacy_engine_meta === "object" && d.digital_diplomacy_engine_meta
        ? (d.digital_diplomacy_engine_meta as Record<string, unknown>)
        : undefined,
    partnership_charter_engine_meta:
      typeof d.partnership_charter_engine_meta === "object" && d.partnership_charter_engine_meta
        ? (d.partnership_charter_engine_meta as Record<string, unknown>)
        : undefined,
    executive_alignment_engine_meta:
      typeof d.executive_alignment_engine_meta === "object" && d.executive_alignment_engine_meta
        ? (d.executive_alignment_engine_meta as Record<string, unknown>)
        : undefined,
    cross_cultural_collaboration_engine_meta:
      typeof d.cross_cultural_collaboration_engine_meta === "object" &&
      d.cross_cultural_collaboration_engine_meta
        ? (d.cross_cultural_collaboration_engine_meta as Record<string, unknown>)
        : undefined,
    governance_companion_meta:
      typeof d.governance_companion_meta === "object" && d.governance_companion_meta
        ? (d.governance_companion_meta as Record<string, unknown>)
        : undefined,
    conflict_prevention_framework_meta:
      typeof d.conflict_prevention_framework_meta === "object" &&
      d.conflict_prevention_framework_meta
        ? (d.conflict_prevention_framework_meta as Record<string, unknown>)
        : undefined,
    global_policy_library_meta:
      typeof d.global_policy_library_meta === "object" && d.global_policy_library_meta
        ? (d.global_policy_library_meta as Record<string, unknown>)
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
    ggdebp144_integration_links: parseIntegrationLinks(d.ggdebp144_integration_links),
    global_governance_diplomacy_engagement_summary: parseEngagementSummary(
      d.global_governance_diplomacy_engagement_summary,
    ),
    global_governance_diplomacy_success_criteria: parseSuccessCriteria(
      d.global_governance_diplomacy_success_criteria,
    ),
    global_governance_diplomacy_vision:
      typeof d.global_governance_diplomacy_vision === "string"
        ? d.global_governance_diplomacy_vision
        : undefined,
    global_governance_diplomacy_vision_phrases: Array.isArray(
      d.global_governance_diplomacy_vision_phrases,
    )
      ? (d.global_governance_diplomacy_vision_phrases as string[])
      : undefined,
    global_governance_diplomacy_privacy_note:
      typeof d.global_governance_diplomacy_privacy_note === "string"
        ? d.global_governance_diplomacy_privacy_note
        : undefined,
    global_governance_diplomacy_dogfooding:
      typeof d.global_governance_diplomacy_dogfooding === "string"
        ? d.global_governance_diplomacy_dogfooding
        : undefined,
    global_governance_diplomacy_engine_note:
      typeof d.global_governance_diplomacy_engine_note === "string"
        ? d.global_governance_diplomacy_engine_note
        : undefined,
    global_governance_diplomacy_distinction_note:
      typeof d.global_governance_diplomacy_distinction_note === "string"
        ? d.global_governance_diplomacy_distinction_note
        : undefined,
  };
}
