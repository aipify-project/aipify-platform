import type {
  EnterpriseOrgAdvisorSignal,
  EnterpriseOrgEntity,
  EnterpriseOrganizationCenter,
} from "./types";

function parseEntity(raw: unknown): EnterpriseOrgEntity {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    group_id: typeof d.group_id === "string" ? d.group_id : undefined,
    parent_entity_id: typeof d.parent_entity_id === "string" ? d.parent_entity_id : d.parent_entity_id === null ? null : undefined,
    name: typeof d.name === "string" ? d.name : undefined,
    slug: typeof d.slug === "string" ? d.slug : undefined,
    entity_type: typeof d.entity_type === "string" ? d.entity_type : undefined,
    status: typeof d.status === "string" ? d.status : undefined,
    leadership_name: typeof d.leadership_name === "string" ? d.leadership_name : undefined,
    revenue_amount: d.revenue_amount == null ? null : Number(d.revenue_amount),
    revenue_currency: typeof d.revenue_currency === "string" ? d.revenue_currency : undefined,
    employee_count: Number(d.employee_count ?? 0),
    digital_employee_count: Number(d.digital_employee_count ?? 0),
    health_score: Number(d.health_score ?? 0),
    performance_label: typeof d.performance_label === "string" ? d.performance_label : undefined,
    linked_organization_id: typeof d.linked_organization_id === "string" ? d.linked_organization_id : null,
    business_packs: Array.isArray(d.business_packs) ? d.business_packs : [],
    metrics: typeof d.metrics === "object" && d.metrics ? (d.metrics as Record<string, unknown>) : undefined,
    created_at: typeof d.created_at === "string" ? d.created_at : undefined,
    updated_at: typeof d.updated_at === "string" ? d.updated_at : undefined,
  };
}

function parseSignal(raw: unknown): EnterpriseOrgAdvisorSignal {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    signal_type: typeof d.signal_type === "string" ? d.signal_type : undefined,
    observation: typeof d.observation === "string" ? d.observation : undefined,
    impact: typeof d.impact === "string" ? d.impact : undefined,
    recommendation: typeof d.recommendation === "string" ? d.recommendation : undefined,
    effort: typeof d.effort === "string" ? d.effort : undefined,
    confidence: typeof d.confidence === "string" ? d.confidence : undefined,
    entity_id: typeof d.entity_id === "string" ? d.entity_id : null,
    region_id: typeof d.region_id === "string" ? d.region_id : null,
    created_at: typeof d.created_at === "string" ? d.created_at : undefined,
  };
}

export function parseEnterpriseOrganizationCenter(raw: unknown): EnterpriseOrganizationCenter {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    found: Boolean(d.found),
    has_access: Boolean(d.has_access),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    mission: typeof d.mission === "string" ? d.mission : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    organization_workspace_route: typeof d.organization_workspace_route === "string" ? d.organization_workspace_route : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    privacy_note: typeof d.privacy_note === "string" ? d.privacy_note : undefined,
    error: typeof d.error === "string" ? d.error : undefined,
    group: typeof d.group === "object" && d.group ? (d.group as Record<string, unknown>) : undefined,
    overview: typeof d.overview === "object" && d.overview ? (d.overview as Record<string, unknown>) : undefined,
    modules: Array.isArray(d.modules) ? (d.modules as Array<{ key?: string; route?: string }>) : [],
    entities: Array.isArray(d.entities) ? d.entities.map(parseEntity) : [],
    hierarchy: Array.isArray(d.hierarchy) ? (d.hierarchy as Array<Record<string, unknown>>) : [],
    regions: Array.isArray(d.regions) ? (d.regions as Array<Record<string, unknown>>) : [],
    shared_services: Array.isArray(d.shared_services) ? (d.shared_services as Array<Record<string, unknown>>) : [],
    access_scopes: Array.isArray(d.access_scopes) ? (d.access_scopes as Array<Record<string, unknown>>) : [],
    advisor_signals: Array.isArray(d.advisor_signals) ? d.advisor_signals.map(parseSignal) : [],
    audit_logs: Array.isArray(d.audit_logs) ? (d.audit_logs as Array<Record<string, unknown>>) : [],
    analytics: typeof d.analytics === "object" && d.analytics ? (d.analytics as Record<string, unknown>) : undefined,
    executive_dashboard: typeof d.executive_dashboard === "object" && d.executive_dashboard
      ? (d.executive_dashboard as Record<string, unknown>)
      : undefined,
  };
}
