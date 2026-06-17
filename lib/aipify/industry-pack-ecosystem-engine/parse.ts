import type {
  IndustryPackAdvisorSignal,
  IndustryPackEcosystemCenter,
  IndustryPackInstall,
  IndustryPackRegistry,
} from "./types";

function parseRegistry(raw: unknown): IndustryPackRegistry {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    pack_key: typeof d.pack_key === "string" ? d.pack_key : undefined,
    slug: typeof d.slug === "string" ? d.slug : undefined,
    display_name: typeof d.display_name === "string" ? d.display_name : undefined,
    industry_type: typeof d.industry_type === "string" ? d.industry_type : undefined,
    pack_source: typeof d.pack_source === "string" ? d.pack_source : undefined,
    lifecycle_status: typeof d.lifecycle_status === "string" ? d.lifecycle_status : undefined,
    short_description: typeof d.short_description === "string" ? d.short_description : undefined,
    inherits: Array.isArray(d.inherits) ? d.inherits : [],
    dependencies: Array.isArray(d.dependencies) ? d.dependencies : [],
    marketplace_item_id: typeof d.marketplace_item_id === "string" ? d.marketplace_item_id : null,
  };
}

function parseInstall(raw: unknown): IndustryPackInstall {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    registry_id: typeof d.registry_id === "string" ? d.registry_id : undefined,
    install_status: typeof d.install_status === "string" ? d.install_status : undefined,
    lifecycle_status: typeof d.lifecycle_status === "string" ? d.lifecycle_status : undefined,
    install_mode: typeof d.install_mode === "string" ? d.install_mode : undefined,
    health_score: Number(d.health_score ?? 0),
    version_label: typeof d.version_label === "string" ? d.version_label : undefined,
    installed_at: typeof d.installed_at === "string" ? d.installed_at : undefined,
    updated_at: typeof d.updated_at === "string" ? d.updated_at : undefined,
    pack: typeof d.pack === "object" && d.pack ? parseRegistry(d.pack) : undefined,
  };
}

function parseSignal(raw: unknown): IndustryPackAdvisorSignal {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    signal_type: typeof d.signal_type === "string" ? d.signal_type : undefined,
    observation: typeof d.observation === "string" ? d.observation : undefined,
    impact: typeof d.impact === "string" ? d.impact : undefined,
    recommendation: typeof d.recommendation === "string" ? d.recommendation : undefined,
    effort: typeof d.effort === "string" ? d.effort : undefined,
    confidence: typeof d.confidence === "string" ? d.confidence : undefined,
    created_at: typeof d.created_at === "string" ? d.created_at : undefined,
  };
}

export function parseIndustryPackEcosystemCenter(raw: unknown): IndustryPackEcosystemCenter {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    found: Boolean(d.found),
    has_access: Boolean(d.has_access),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    mission: typeof d.mission === "string" ? d.mission : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    business_packs_route: typeof d.business_packs_route === "string" ? d.business_packs_route : undefined,
    marketplace_route: typeof d.marketplace_route === "string" ? d.marketplace_route : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    privacy_note: typeof d.privacy_note === "string" ? d.privacy_note : undefined,
    error: typeof d.error === "string" ? d.error : undefined,
    inherited_architecture: Array.isArray(d.inherited_architecture) ? (d.inherited_architecture as string[]) : [],
    modules: Array.isArray(d.modules) ? (d.modules as Array<{ key?: string; route?: string }>) : [],
    overview: typeof d.overview === "object" && d.overview ? (d.overview as Record<string, unknown>) : undefined,
    installed_packs: Array.isArray(d.installed_packs) ? d.installed_packs.map(parseInstall) : [],
    available_packs: Array.isArray(d.available_packs) ? d.available_packs.map(parseRegistry) : [],
    marketplace_packs: Array.isArray(d.marketplace_packs) ? (d.marketplace_packs as Array<Record<string, unknown>>) : [],
    governance_policies: Array.isArray(d.governance_policies) ? (d.governance_policies as Array<Record<string, unknown>>) : [],
    advisor_signals: Array.isArray(d.advisor_signals) ? d.advisor_signals.map(parseSignal) : [],
    audit_logs: Array.isArray(d.audit_logs) ? (d.audit_logs as Array<Record<string, unknown>>) : [],
    analytics: typeof d.analytics === "object" && d.analytics ? (d.analytics as Record<string, unknown>) : undefined,
    executive_dashboard: typeof d.executive_dashboard === "object" && d.executive_dashboard
      ? (d.executive_dashboard as Record<string, unknown>)
      : undefined,
  };
}
