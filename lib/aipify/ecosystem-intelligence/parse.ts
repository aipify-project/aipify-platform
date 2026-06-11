import type {
  EcosystemIntelligenceCard,
  EcosystemIntelligenceDashboard,
  EcosystemBriefingResult,
} from "./types";

export function parseEcosystemIntelligenceCard(data: unknown): EcosystemIntelligenceCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    ecosystem_score: d.ecosystem_score as number | undefined,
    ecosystem_band: d.ecosystem_band as string | undefined,
    ecosystem_band_label: d.ecosystem_band_label as string | undefined,
    open_risks: d.open_risks as number | undefined,
    philosophy: d.philosophy as string | undefined,
    consent_required: d.consent_required as boolean | undefined,
  };
}

export function parseEcosystemIntelligenceDashboard(data: unknown): EcosystemIntelligenceDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    consent_required: d.consent_required as boolean | undefined,
    human_governance_required: d.human_governance_required as boolean | undefined,
    intelligence_enabled: d.intelligence_enabled as boolean | undefined,
    external_monitoring_consent: d.external_monitoring_consent as boolean | undefined,
    philosophy: d.philosophy as string | undefined,
    safety_note: d.safety_note as string | undefined,
    ecosystem_score: d.ecosystem_score as number | undefined,
    ecosystem_band: d.ecosystem_band as string | undefined,
    ecosystem_band_label: d.ecosystem_band_label as string | undefined,
    score_components: d.score_components as Record<string, number> | undefined,
    dependency_score: d.dependency_score as number | undefined,
    resilience_score: d.resilience_score as number | undefined,
    partner_score: d.partner_score as number | undefined,
    relationships: Array.isArray(d.relationships)
      ? (d.relationships as EcosystemIntelligenceDashboard["relationships"])
      : [],
    critical_dependencies: Array.isArray(d.critical_dependencies)
      ? (d.critical_dependencies as EcosystemIntelligenceDashboard["critical_dependencies"])
      : [],
    external_risks: Array.isArray(d.external_risks)
      ? (d.external_risks as EcosystemIntelligenceDashboard["external_risks"])
      : [],
    partnership_opportunities: Array.isArray(d.partnership_opportunities)
      ? (d.partnership_opportunities as EcosystemIntelligenceDashboard["partnership_opportunities"])
      : [],
    briefings: Array.isArray(d.briefings)
      ? (d.briefings as EcosystemIntelligenceDashboard["briefings"])
      : [],
    relationship_categories: Array.isArray(d.relationship_categories)
      ? (d.relationship_categories as EcosystemIntelligenceDashboard["relationship_categories"])
      : [],
    review_frequencies: Array.isArray(d.review_frequencies)
      ? (d.review_frequencies as EcosystemIntelligenceDashboard["review_frequencies"])
      : [],
    integrations: d.integrations as Record<string, string> | undefined,
  };
}

export function parseEcosystemBriefingResult(data: unknown): EcosystemBriefingResult {
  return (data ?? {}) as EcosystemBriefingResult;
}
