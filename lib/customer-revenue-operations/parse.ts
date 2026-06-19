import type { CustomerRevenueOperationsCenter } from "./types";

export function parseCustomerRevenueOperationsCenter(data: unknown): CustomerRevenueOperationsCenter | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  return {
    found: Boolean(row.found),
    principle: row.principle as string | undefined,
    section: row.section as string | undefined,
    organization: row.organization as CustomerRevenueOperationsCenter["organization"],
    overview: row.overview as CustomerRevenueOperationsCenter["overview"],
    pipeline_engine: row.pipeline_engine as CustomerRevenueOperationsCenter["pipeline_engine"],
    revenue_lifecycle: row.revenue_lifecycle as CustomerRevenueOperationsCenter["revenue_lifecycle"],
    subscription_intelligence: row.subscription_intelligence as CustomerRevenueOperationsCenter["subscription_intelligence"],
    expansion_engine: row.expansion_engine as CustomerRevenueOperationsCenter["expansion_engine"],
    renewal_operations: row.renewal_operations as CustomerRevenueOperationsCenter["renewal_operations"],
    forecast_engine: row.forecast_engine as CustomerRevenueOperationsCenter["forecast_engine"],
    revenue_health: row.revenue_health as Record<string, unknown> | undefined,
    growth_partner_intelligence: row.growth_partner_intelligence as CustomerRevenueOperationsCenter["growth_partner_intelligence"],
    marketing_attribution: row.marketing_attribution as CustomerRevenueOperationsCenter["marketing_attribution"],
    business_pack_revenue: row.business_pack_revenue as CustomerRevenueOperationsCenter["business_pack_revenue"],
    domain_revenue: row.domain_revenue as CustomerRevenueOperationsCenter["domain_revenue"],
    revenue_risk_engine: row.revenue_risk_engine as CustomerRevenueOperationsCenter["revenue_risk_engine"],
    companion_revenue_advisor: row.companion_revenue_advisor as Record<string, unknown> | undefined,
    executive_dashboard: row.executive_dashboard as Record<string, unknown> | undefined,
    reports: row.reports as Record<string, unknown> | undefined,
    audit_recent: row.audit_recent as CustomerRevenueOperationsCenter["audit_recent"],
    mobile_access: row.mobile_access as Record<string, unknown> | undefined,
    routes: row.routes as Record<string, string> | undefined,
    error: row.error as string | undefined,
  };
}
