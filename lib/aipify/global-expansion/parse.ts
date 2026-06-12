import type {
  GlobalExpansionActionResult,
  GlobalExpansionBriefingResult,
  GlobalExpansionCard,
  GlobalExpansionDashboard,
} from "./types";

function parseBlueprintPhase35(d: Record<string, unknown>): GlobalExpansionDashboard["implementation_blueprint_phase35"] {
  const bp = d.implementation_blueprint_phase35;
  if (!bp || typeof bp !== "object") return undefined;
  const b = bp as Record<string, unknown>;
  return {
    phase: typeof b.phase === "number" ? b.phase : undefined,
    title: typeof b.title === "string" ? b.title : undefined,
    doc: typeof b.doc === "string" ? b.doc : undefined,
    engine_phase: typeof b.engine_phase === "string" ? b.engine_phase : undefined,
    route: typeof b.route === "string" ? b.route : undefined,
    mapping_note: typeof b.mapping_note === "string" ? b.mapping_note : undefined,
  };
}

function parseLocalizationSummary(d: unknown): GlobalExpansionDashboard["localization_summary"] {
  if (!d || typeof d !== "object") return undefined;
  const s = d as Record<string, unknown>;
  return {
    active_languages: Number(s.active_languages ?? 0),
    avg_coverage_pct: Number(s.avg_coverage_pct ?? 0),
    active_markets: Number(s.active_markets ?? 0),
    open_recommendations: Number(s.open_recommendations ?? 0),
    published_projects: Number(s.published_projects ?? 0),
    regional_content_items: Number(s.regional_content_items ?? 0),
    privacy_note: typeof s.privacy_note === "string" ? s.privacy_note : undefined,
  };
}

export function parseGlobalExpansionCard(data: unknown): GlobalExpansionCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    global_readiness_score: Number(d.global_readiness_score ?? 0),
    avg_language_coverage_pct: Number(d.avg_language_coverage_pct ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    human_oversight_required: Boolean(d.human_oversight_required),
    implementation_blueprint_phase35: parseBlueprintPhase35(d),
    localization_expansion_phase:
      typeof d.localization_expansion_phase === "number" ? d.localization_expansion_phase : undefined,
    localization_abos_principle:
      typeof d.localization_abos_principle === "string" ? d.localization_abos_principle : undefined,
    localization_summary: parseLocalizationSummary(d.localization_summary),
    blueprint_note: typeof d.blueprint_note === "string" ? d.blueprint_note : undefined,
  };
}

export function parseGlobalExpansionDashboard(data: unknown): GlobalExpansionDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    human_oversight_required: Boolean(d.human_oversight_required),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    default_language: typeof d.default_language === "string" ? d.default_language : undefined,
    default_region: typeof d.default_region === "string" ? d.default_region : undefined,
    default_timezone: typeof d.default_timezone === "string" ? d.default_timezone : undefined,
    default_currency: typeof d.default_currency === "string" ? d.default_currency : undefined,
    multi_language_enabled: Boolean(d.multi_language_enabled ?? true),
    localized_notifications: Boolean(d.localized_notifications ?? true),
    timezone_intelligence: Boolean(d.timezone_intelligence ?? true),
    global_readiness_score: Number(d.global_readiness_score ?? 0),
    avg_language_coverage_pct: Number(d.avg_language_coverage_pct ?? 0),
    active_markets: Number(d.active_markets ?? 0),
    planned_markets: Number(d.planned_markets ?? 0),
    localization_dimensions: Array.isArray(d.localization_dimensions) ? (d.localization_dimensions as string[]) : [],
    supported_languages: Array.isArray(d.supported_languages)
      ? (d.supported_languages as GlobalExpansionDashboard["supported_languages"])
      : [],
    future_languages: Array.isArray(d.future_languages) ? (d.future_languages as string[]) : [],
    localization_projects: Array.isArray(d.localization_projects)
      ? (d.localization_projects as GlobalExpansionDashboard["localization_projects"])
      : [],
    country_playbooks: Array.isArray(d.country_playbooks)
      ? (d.country_playbooks as GlobalExpansionDashboard["country_playbooks"])
      : [],
    recommendations: Array.isArray(d.recommendations)
      ? (d.recommendations as GlobalExpansionDashboard["recommendations"])
      : [],
    terminology_glossary: Array.isArray(d.terminology_glossary)
      ? (d.terminology_glossary as GlobalExpansionDashboard["terminology_glossary"])
      : [],
    regional_content: Array.isArray(d.regional_content)
      ? (d.regional_content as GlobalExpansionDashboard["regional_content"])
      : [],
    localization_audits: Array.isArray(d.localization_audits)
      ? (d.localization_audits as GlobalExpansionDashboard["localization_audits"])
      : [],
    international_analytics: Array.isArray(d.international_analytics)
      ? (d.international_analytics as GlobalExpansionDashboard["international_analytics"])
      : [],
    timezone_capabilities: Array.isArray(d.timezone_capabilities) ? (d.timezone_capabilities as string[]) : [],
    compliance_readiness: Array.isArray(d.compliance_readiness) ? (d.compliance_readiness as string[]) : [],
    briefings: Array.isArray(d.briefings) ? (d.briefings as GlobalExpansionDashboard["briefings"]) : [],
    integrations: typeof d.integrations === "object" && d.integrations
      ? (d.integrations as Record<string, string>)
      : undefined,
    implementation_blueprint_phase35: parseBlueprintPhase35(d),
    localization_expansion_mission:
      typeof d.localization_expansion_mission === "string" ? d.localization_expansion_mission : undefined,
    localization_expansion_philosophy:
      typeof d.localization_expansion_philosophy === "string" ? d.localization_expansion_philosophy : undefined,
    localization_objectives: Array.isArray(d.localization_objectives)
      ? (d.localization_objectives as GlobalExpansionDashboard["localization_objectives"])
      : undefined,
    language_strategy:
      typeof d.language_strategy === "object" && d.language_strategy
        ? (d.language_strategy as GlobalExpansionDashboard["language_strategy"])
        : undefined,
    companion_localization:
      typeof d.companion_localization === "object" && d.companion_localization
        ? (d.companion_localization as GlobalExpansionDashboard["companion_localization"])
        : undefined,
    knowledge_center_localization:
      typeof d.knowledge_center_localization === "object" && d.knowledge_center_localization
        ? (d.knowledge_center_localization as GlobalExpansionDashboard["knowledge_center_localization"])
        : undefined,
    sales_expert_localization:
      typeof d.sales_expert_localization === "object" && d.sales_expert_localization
        ? (d.sales_expert_localization as GlobalExpansionDashboard["sales_expert_localization"])
        : undefined,
    payment_financial_localization:
      typeof d.payment_financial_localization === "object" && d.payment_financial_localization
        ? (d.payment_financial_localization as GlobalExpansionDashboard["payment_financial_localization"])
        : undefined,
    training_certification_localization:
      typeof d.training_certification_localization === "object" && d.training_certification_localization
        ? (d.training_certification_localization as GlobalExpansionDashboard["training_certification_localization"])
        : undefined,
    localization_trust_connection:
      typeof d.localization_trust_connection === "object" && d.localization_trust_connection
        ? (d.localization_trust_connection as GlobalExpansionDashboard["localization_trust_connection"])
        : undefined,
    localization_dogfooding:
      typeof d.localization_dogfooding === "object" && d.localization_dogfooding
        ? (d.localization_dogfooding as GlobalExpansionDashboard["localization_dogfooding"])
        : undefined,
    localization_success_criteria: Array.isArray(d.localization_success_criteria)
      ? (d.localization_success_criteria as GlobalExpansionDashboard["localization_success_criteria"])
      : undefined,
    localization_vision_phrases: Array.isArray(d.localization_vision_phrases)
      ? (d.localization_vision_phrases as string[])
      : undefined,
    localization_abos_principle:
      typeof d.localization_abos_principle === "string" ? d.localization_abos_principle : undefined,
    localization_distinction_note:
      typeof d.localization_distinction_note === "string" ? d.localization_distinction_note : undefined,
    localization_integration_links: Array.isArray(d.localization_integration_links)
      ? (d.localization_integration_links as GlobalExpansionDashboard["localization_integration_links"])
      : undefined,
    localization_summary: parseLocalizationSummary(d.localization_summary),
  };
}

export function parseGlobalExpansionActionResult(data: unknown): GlobalExpansionActionResult {
  return (data ?? {}) as GlobalExpansionActionResult;
}

export function parseGlobalExpansionBriefingResult(data: unknown): GlobalExpansionBriefingResult {
  return (data ?? {}) as GlobalExpansionBriefingResult;
}
