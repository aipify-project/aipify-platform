/**
 * Authoritative audit matrix for Platform control plane.
 * Reuse existing sources — never introduce parallel customer/finance/partner models.
 */

export type PlatformCapabilityMatrixRow = {
  area: string;
  existingUi: string;
  existingData: string;
  authoritativeSource: string;
  gaps: string;
  risk: "low" | "medium" | "high";
  recommendedPlacement: string;
};

export const PLATFORM_CAPABILITY_MATRIX: PlatformCapabilityMatrixRow[] = [
  {
    area: "Overview",
    existingUi: "/platform",
    existingData: "get_platform_portal_dashboard",
    authoritativeSource: "platform-portal dashboard",
    gaps: "MRR, outstanding invoices, partner payout KPIs not in portal dashboard",
    risk: "medium",
    recommendedPlacement: "Overview",
  },
  {
    area: "Organizations",
    existingUi: "/platform/customers",
    existingData: "get_platform_portal_customers",
    authoritativeSource: "platform-portal customers",
    gaps: "Economic risk columns are partial",
    risk: "low",
    recommendedPlacement: "Customers → Organizations",
  },
  {
    area: "Customer success",
    existingUi: "/platform/customer-success (+ ops/hub)",
    existingData: "get_platform_portal_customer_success_overview",
    authoritativeSource: "platform-portal customer success",
    gaps: "Three CS surfaces; portal overview is primary",
    risk: "medium",
    recommendedPlacement: "Customers → Customer success",
  },
  {
    area: "Support",
    existingUi: "/platform/support",
    existingData: "list_platform_support_queue",
    authoritativeSource: "legacy support queue",
    gaps: "Not portal-style reader",
    risk: "medium",
    recommendedPlacement: "Customers → Support",
  },
  {
    area: "Subscriptions / licenses",
    existingUi: "/platform/subscriptions, /platform/licenses",
    existingData: "portal agreements + licenses overview RPCs",
    authoritativeSource: "platform-portal",
    gaps: "Billing section duplicates some lists",
    risk: "medium",
    recommendedPlacement: "Customers + Sales & finance",
  },
  {
    area: "Payments",
    existingUi: "/platform/billing*",
    existingData: "billing commerce / unified billing centers",
    authoritativeSource: "billing engines (not invent new)",
    gaps: "Provider truth may remain provider-side",
    risk: "high",
    recommendedPlacement: "Sales & finance → Payments",
  },
  {
    area: "Invoices",
    existingUi: "/platform/billing/invoices",
    existingData: "list_platform_invoices",
    authoritativeSource: "invoices + billing commerce",
    gaps: "Partner invoices not on Platform",
    risk: "medium",
    recommendedPlacement: "Sales & finance → Invoices",
  },
  {
    area: "Partners",
    existingUi: "/platform/partners hub; attribution; commissions; /partners settlement",
    existingData: "growth partner attribution + partners portal settlement",
    authoritativeSource: "existing partner economy tables/RPCs",
    gaps: "No full Platform partner admin; settlement primarily Partners portal",
    risk: "high",
    recommendedPlacement: "Partners",
  },
  {
    area: "Commissions",
    existingUi: "/platform/billing/commissions",
    existingData: "unified billing admin commissions",
    authoritativeSource: "billing + partner ops commissions",
    gaps: "Approval/payout flows must stay on existing safe backends",
    risk: "high",
    recommendedPlacement: "Partners → Commissions",
  },
  {
    area: "Partner invoices",
    existingUi: "/platform/partners/settlement (read-only ops + discrepancy queue)",
    existingData: "get_platform_partner_settlement_operations",
    authoritativeSource: "growth_partner_portal_settlements + settlement_invoices",
    gaps: "No payout/invoice mutation from Platform; Partners portal remains write path",
    risk: "medium",
    recommendedPlacement: "Partners → Settlement operations",
  },
  {
    area: "Product / Core",
    existingUi: "providers, modules, Kompis, website verification",
    existingData: "verified providers + onboarding + module registry",
    authoritativeSource: "existing product/engine RPCs",
    gaps: "Some product management pages are foundation stubs",
    risk: "medium",
    recommendedPlacement: "Product & Core",
  },
  {
    area: "Operations / monitoring",
    existingUi: "/platform/operations/*, /platform/reliability",
    existingData: "health + reliability centers",
    authoritativeSource: "operations engines",
    gaps: "Deployments/audit-log pages are stubs; unknown ≠ healthy",
    risk: "medium",
    recommendedPlacement: "Operations",
  },
  {
    area: "Governance",
    existingUi: "/platform/actions, /platform/trust, governance centers",
    existingData: "action engine + trust governance",
    authoritativeSource: "existing governance RPCs",
    gaps: "Activity log foundation stub",
    risk: "medium",
    recommendedPlacement: "Governance",
  },
  {
    area: "Global search",
    existingUi: "shell nav search + command bar",
    existingData: "nav index + list_platform_customers",
    authoritativeSource: "command bar adapters",
    gaps: "No dedicated search page; entity coverage partial",
    risk: "low",
    recommendedPlacement: "Shell (extend index)",
  },
];
