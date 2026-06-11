import type {
  GlobalExpansionActionResult,
  GlobalExpansionBriefingResult,
  GlobalExpansionCard,
  GlobalExpansionDashboard,
} from "./types";

export function parseGlobalExpansionCard(data: unknown): GlobalExpansionCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    global_readiness_score: Number(d.global_readiness_score ?? 0),
    avg_language_coverage_pct: Number(d.avg_language_coverage_pct ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    human_oversight_required: Boolean(d.human_oversight_required),
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
  };
}

export function parseGlobalExpansionActionResult(data: unknown): GlobalExpansionActionResult {
  return (data ?? {}) as GlobalExpansionActionResult;
}

export function parseGlobalExpansionBriefingResult(data: unknown): GlobalExpansionBriefingResult {
  return (data ?? {}) as GlobalExpansionBriefingResult;
}
