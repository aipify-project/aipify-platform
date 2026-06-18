import type {
  CommerceAdvisorSignal,
  CommercePlatform,
  CommerceProduct,
  CommerceProductOpportunity,
  CommerceRetailOperationsCenter,
  CommerceStore,
  CommerceSupplier,
} from "./types";

function parseStore(raw: unknown): CommerceStore {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    store_key: typeof d.store_key === "string" ? d.store_key : undefined,
    store_name: typeof d.store_name === "string" ? d.store_name : undefined,
    platform: typeof d.platform === "string" ? d.platform : undefined,
    domain: typeof d.domain === "string" ? d.domain : undefined,
    country: typeof d.country === "string" ? d.country : undefined,
    language: typeof d.language === "string" ? d.language : undefined,
    currency: typeof d.currency === "string" ? d.currency : undefined,
    status: typeof d.status === "string" ? d.status : undefined,
    performance_label: typeof d.performance_label === "string" ? d.performance_label : undefined,
    portfolio_id: typeof d.portfolio_id === "string" ? d.portfolio_id : null,
  };
}

function parseProduct(raw: unknown): CommerceProduct {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    product_key: typeof d.product_key === "string" ? d.product_key : undefined,
    name: typeof d.name === "string" ? d.name : undefined,
    category: typeof d.category === "string" ? d.category : undefined,
    supplier_cost: Number(d.supplier_cost ?? 0),
    recommended_price_min: Number(d.recommended_price_min ?? 0),
    recommended_price_max: Number(d.recommended_price_max ?? 0),
    currency: typeof d.currency === "string" ? d.currency : undefined,
  };
}

function parseSupplier(raw: unknown): CommerceSupplier {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    supplier_key: typeof d.supplier_key === "string" ? d.supplier_key : undefined,
    supplier_name: typeof d.supplier_name === "string" ? d.supplier_name : undefined,
    reliability_score: Number(d.reliability_score ?? 0),
    lead_time_days: Number(d.lead_time_days ?? 0),
  };
}

function parseOpportunity(raw: unknown): CommerceProductOpportunity {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    opportunity_score: Number(d.opportunity_score ?? 0),
    recommendation_type: typeof d.recommendation_type === "string" ? d.recommendation_type : undefined,
    recommendation_summary: typeof d.recommendation_summary === "string" ? d.recommendation_summary : undefined,
    margin_classification: typeof d.margin_classification === "string" ? d.margin_classification : undefined,
    status: typeof d.status === "string" ? d.status : undefined,
  };
}

function parsePlatform(raw: unknown): CommercePlatform {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    platform_key: typeof d.platform_key === "string" ? d.platform_key : undefined,
    status: typeof d.status === "string" ? d.status : undefined,
  };
}

function parseSignal(raw: unknown): CommerceAdvisorSignal {
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

export function parseCommerceRetailOperationsCenter(raw: unknown): CommerceRetailOperationsCenter {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    found: Boolean(d.found),
    has_access: Boolean(d.has_access),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    mission: typeof d.mission === "string" ? d.mission : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    industry_packs_route: typeof d.industry_packs_route === "string" ? d.industry_packs_route : undefined,
    commerce_intelligence_route:
      typeof d.commerce_intelligence_route === "string" ? d.commerce_intelligence_route : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    privacy_note: typeof d.privacy_note === "string" ? d.privacy_note : undefined,
    error: typeof d.error === "string" ? d.error : undefined,
    settings: typeof d.settings === "object" && d.settings ? (d.settings as Record<string, unknown>) : undefined,
    overview: typeof d.overview === "object" && d.overview ? (d.overview as Record<string, unknown>) : undefined,
    modules: Array.isArray(d.modules) ? (d.modules as Array<{ key?: string; route?: string }>) : [],
    stores: Array.isArray(d.stores) ? d.stores.map(parseStore) : [],
    products: Array.isArray(d.products) ? d.products.map(parseProduct) : [],
    suppliers: Array.isArray(d.suppliers) ? d.suppliers.map(parseSupplier) : [],
    product_opportunities: Array.isArray(d.product_opportunities)
      ? d.product_opportunities.map(parseOpportunity)
      : [],
    platforms: Array.isArray(d.platforms) ? d.platforms.map(parsePlatform) : [],
    portfolios: Array.isArray(d.portfolios) ? (d.portfolios as Array<Record<string, unknown>>) : [],
    advisor_signals: Array.isArray(d.advisor_signals) ? d.advisor_signals.map(parseSignal) : [],
    audit_logs: Array.isArray(d.audit_logs) ? (d.audit_logs as Array<Record<string, unknown>>) : [],
    legacy_module_cross_links: Array.isArray(d.legacy_module_cross_links)
      ? (d.legacy_module_cross_links as Array<{ key?: string; route?: string }>)
      : [],
    operations: typeof d.operations === "object" && d.operations ? (d.operations as Record<string, string>) : undefined,
    executive_dashboard:
      typeof d.executive_dashboard === "object" && d.executive_dashboard
        ? (d.executive_dashboard as Record<string, unknown>)
        : undefined,
  };
}
