import type {
  RealEstateAdvisorSignal,
  RealEstateLease,
  RealEstatePortfolioOperationsCenter,
  RealEstateProperty,
} from "./types";

function parseProperty(raw: unknown): RealEstateProperty {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    property_key: typeof d.property_key === "string" ? d.property_key : undefined,
    property_name: typeof d.property_name === "string" ? d.property_name : undefined,
    property_type: typeof d.property_type === "string" ? d.property_type : undefined,
    location: typeof d.location === "string" ? d.location : undefined,
    ownership_label: typeof d.ownership_label === "string" ? d.ownership_label : undefined,
    market_value: Number(d.market_value ?? 0),
    monthly_revenue: Number(d.monthly_revenue ?? 0),
    monthly_expenses: Number(d.monthly_expenses ?? 0),
    performance_label: typeof d.performance_label === "string" ? d.performance_label : undefined,
    portfolio_id: typeof d.portfolio_id === "string" ? d.portfolio_id : null,
  };
}

function parseLease(raw: unknown): RealEstateLease {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    lease_reference: typeof d.lease_reference === "string" ? d.lease_reference : undefined,
    lease_status: typeof d.lease_status === "string" ? d.lease_status : undefined,
    lease_start: typeof d.lease_start === "string" ? d.lease_start : undefined,
    lease_end: typeof d.lease_end === "string" ? d.lease_end : undefined,
    monthly_rent: Number(d.monthly_rent ?? 0),
    renewal_status: typeof d.renewal_status === "string" ? d.renewal_status : undefined,
    property_id: typeof d.property_id === "string" ? d.property_id : null,
    unit_id: typeof d.unit_id === "string" ? d.unit_id : null,
  };
}

function parseSignal(raw: unknown): RealEstateAdvisorSignal {
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

export function parseRealEstatePortfolioOperationsCenter(raw: unknown): RealEstatePortfolioOperationsCenter {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    found: Boolean(d.found),
    has_access: Boolean(d.has_access),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    mission: typeof d.mission === "string" ? d.mission : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    industry_packs_route: typeof d.industry_packs_route === "string" ? d.industry_packs_route : undefined,
    hospitality_route: typeof d.hospitality_route === "string" ? d.hospitality_route : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    privacy_note: typeof d.privacy_note === "string" ? d.privacy_note : undefined,
    error: typeof d.error === "string" ? d.error : undefined,
    overview: typeof d.overview === "object" && d.overview ? (d.overview as Record<string, unknown>) : undefined,
    modules: Array.isArray(d.modules) ? (d.modules as Array<{ key?: string; route?: string }>) : [],
    properties: Array.isArray(d.properties) ? d.properties.map(parseProperty) : [],
    units: Array.isArray(d.units) ? (d.units as Array<Record<string, unknown>>) : [],
    tenants: Array.isArray(d.tenants) ? (d.tenants as Array<Record<string, unknown>>) : [],
    leases: Array.isArray(d.leases) ? d.leases.map(parseLease) : [],
    vendors: Array.isArray(d.vendors) ? (d.vendors as Array<Record<string, unknown>>) : [],
    maintenance_requests: Array.isArray(d.maintenance_requests)
      ? (d.maintenance_requests as Array<Record<string, unknown>>)
      : [],
    portfolios: Array.isArray(d.portfolios) ? (d.portfolios as Array<Record<string, unknown>>) : [],
    advisor_signals: Array.isArray(d.advisor_signals) ? d.advisor_signals.map(parseSignal) : [],
    audit_logs: Array.isArray(d.audit_logs) ? (d.audit_logs as Array<Record<string, unknown>>) : [],
    operations: typeof d.operations === "object" && d.operations ? (d.operations as Record<string, string>) : undefined,
    executive_dashboard: typeof d.executive_dashboard === "object" && d.executive_dashboard
      ? (d.executive_dashboard as Record<string, unknown>)
      : undefined,
  };
}
