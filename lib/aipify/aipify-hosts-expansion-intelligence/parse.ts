import { normalizeHostsPlanKey } from "@/lib/aipify/aipify-hosts";
import type {
  AipifyHostsExpansionIntelligenceCard,
  AipifyHostsExpansionIntelligenceDashboard,
} from "./types";

function asArray<T>(data: unknown): T[] {
  return Array.isArray(data) ? (data as T[]) : [];
}

export function parseAipifyHostsExpansionIntelligenceDashboard(
  data: unknown,
): AipifyHostsExpansionIntelligenceDashboard | null {
  const d = (data ?? {}) as Record<string, unknown>;
  if (!d.has_customer) return null;

  const snapshot = (typeof d.growth_snapshot === "object" && d.growth_snapshot
    ? d.growth_snapshot
    : {}) as Record<string, unknown>;

  return {
    has_customer: true,
    enabled: Boolean(d.enabled),
    package_key: normalizeHostsPlanKey(typeof d.package_key === "string" ? d.package_key : undefined),
    property_count: Number(d.property_count ?? 0),
    human_oversight_required: Boolean(d.human_oversight_required ?? true),
    positioning: typeof d.positioning === "string" ? d.positioning : "",
    vision: typeof d.vision === "string" ? d.vision : "",
    modules: asArray(d.modules),
    playbooks: asArray(d.playbooks),
    simulation_examples: asArray<string>(d.simulation_examples),
    governance: (typeof d.governance === "object" && d.governance
      ? d.governance
      : {
          principle: "",
          approval_required: true,
          audit_required: true,
          recommendations_only: true,
        }) as AipifyHostsExpansionIntelligenceDashboard["governance"],
    success_metrics: asArray(d.success_metrics),
    knowledge_categories: asArray<string>(d.knowledge_categories),
    growth_snapshot: {
      expansion_readiness_score: Number(snapshot.expansion_readiness_score ?? 0),
      opportunity_score: Number(snapshot.opportunity_score ?? 0),
      portfolio_quality_index: Number(snapshot.portfolio_quality_index ?? 0),
      markets_on_watchlist: Number(snapshot.markets_on_watchlist ?? 0),
      underperforming_properties: Number(snapshot.underperforming_properties ?? 0),
    },
    opportunities: asArray(d.opportunities),
    executive_questions: asArray<string>(d.executive_questions),
    executive_metrics: asArray(d.executive_metrics),
  };
}

export function parseAipifyHostsExpansionIntelligenceCard(
  data: unknown,
): AipifyHostsExpansionIntelligenceCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    enabled: d.enabled !== undefined ? Boolean(d.enabled) : undefined,
    package_key: typeof d.package_key === "string" ? d.package_key : undefined,
    property_count: d.property_count !== undefined ? Number(d.property_count) : undefined,
    human_oversight_required: d.human_oversight_required !== undefined ? Boolean(d.human_oversight_required) : undefined,
    positioning: typeof d.positioning === "string" ? d.positioning : undefined,
    route: typeof d.route === "string" ? d.route : undefined,
  };
}
