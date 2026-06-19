import type { MarketObservatoryCenter } from "./types";

export function parseMarketObservatoryCenter(data: unknown): MarketObservatoryCenter | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  return {
    found: Boolean(row.found),
    principle: row.principle as string | undefined,
    ethics_note: row.ethics_note as string | undefined,
    section: row.section as string | undefined,
    organization: row.organization as MarketObservatoryCenter["organization"],
    overview: row.overview as MarketObservatoryCenter["overview"],
    market_observatory: row.market_observatory as MarketObservatoryCenter["market_observatory"],
    competitor_intelligence: row.competitor_intelligence as MarketObservatoryCenter["competitor_intelligence"],
    industry_intelligence: row.industry_intelligence as MarketObservatoryCenter["industry_intelligence"],
    trend_detection: row.trend_detection as MarketObservatoryCenter["trend_detection"],
    opportunity_engine: row.opportunity_engine as MarketObservatoryCenter["opportunity_engine"],
    threat_detection: row.threat_detection as MarketObservatoryCenter["threat_detection"],
    external_signals_dashboard: row.external_signals_dashboard as MarketObservatoryCenter["external_signals_dashboard"],
    executive_briefings: row.executive_briefings as MarketObservatoryCenter["executive_briefings"],
    competitive_positioning: row.competitive_positioning as Record<string, unknown> | undefined,
    business_pack_intelligence: row.business_pack_intelligence as MarketObservatoryCenter["business_pack_intelligence"],
    growth_partner_intelligence: row.growth_partner_intelligence as MarketObservatoryCenter["growth_partner_intelligence"],
    domain_intelligence: row.domain_intelligence as MarketObservatoryCenter["domain_intelligence"],
    digital_twin_integration: row.digital_twin_integration as Record<string, unknown> | undefined,
    companion_market_advisor: row.companion_market_advisor as Record<string, unknown> | undefined,
    executive_dashboard: row.executive_dashboard as Record<string, unknown> | undefined,
    reports: row.reports as Record<string, unknown> | undefined,
    audit_recent: row.audit_recent as MarketObservatoryCenter["audit_recent"],
    mobile_access: row.mobile_access as Record<string, unknown> | undefined,
    routes: row.routes as Record<string, string> | undefined,
    error: row.error as string | undefined,
  };
}
