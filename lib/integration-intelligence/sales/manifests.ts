import type { SalesProviderManifest } from "./types";

const REVENUE_PACK = "revenue_pack";
const SALES_VIEW = "sales.view";
const SALES_MANAGE = "sales.manage";
const CUSTOMERS_VIEW = "customers.view";
const CUSTOMERS_MANAGE = "customers.manage";

function readCapability(
  capability_key: SalesProviderManifest["capabilities"][number]["capability_key"],
  entity: string,
  permission: string | null = SALES_VIEW,
  privacy_sensitive = false,
) {
  return {
    capability_key,
    operation: "read" as const,
    adapter_available: false,
    approval_required: false,
    reversible: true,
    risk_level: 1 as const,
    entity,
    required_permission: permission,
    privacy_sensitive,
  };
}

function writeCapability(
  capability_key: SalesProviderManifest["capabilities"][number]["capability_key"],
  entity: string,
  permission: string | null = SALES_MANAGE,
) {
  return {
    capability_key,
    operation: "write" as const,
    adapter_available: false,
    approval_required: true,
    reversible: true,
    risk_level: 2 as const,
    entity,
    required_permission: permission,
    privacy_sensitive: false,
  };
}

/** Sales / CRM Business Pack manifests — capability IDs originate here, not in Core orchestrator. */
export const SALES_PROVIDER_MANIFESTS: readonly SalesProviderManifest[] = [
  {
    provider_key: "sales_revenue_pipeline",
    display_name_key:
      "customerApp.companionPlatformKnowledge.sales.providers.sales_revenue_pipeline",
    source_engine: "sales_revenue_pipeline",
    implementation_status: "connected",
    business_pack_key: REVENUE_PACK,
    search_terms_key:
      "customerApp.companionPlatformKnowledge.sales.searchTerms.sales_revenue_pipeline",
    capabilities: [
      readCapability("pipeline.read", "pipeline"),
      readCapability("opportunity.read", "opportunity"),
      readCapability("deal.read", "deal"),
      readCapability("conversion.read", "conversion"),
      readCapability("sales_forecast.read", "sales_forecast"),
      writeCapability("follow_up.create", "follow_up"),
      writeCapability("sales_task.create", "sales_task"),
      writeCapability("response.draft", "response"),
    ],
  },
  {
    provider_key: "customer_relationship",
    display_name_key:
      "customerApp.companionPlatformKnowledge.sales.providers.customer_relationship",
    source_engine: "customer_relationship",
    implementation_status: "connected",
    business_pack_key: REVENUE_PACK,
    search_terms_key:
      "customerApp.companionPlatformKnowledge.sales.searchTerms.customer_relationship",
    capabilities: [
      readCapability("customer.read", "customer", CUSTOMERS_VIEW, true),
      readCapability("contact.read", "contact", CUSTOMERS_VIEW, true),
      readCapability("opportunity.read", "crm_opportunity", CUSTOMERS_VIEW),
      readCapability("customer_health.read", "customer_health", CUSTOMERS_VIEW, true),
      readCapability("follow_up.read", "follow_up", CUSTOMERS_VIEW),
      writeCapability("follow_up.create", "follow_up", CUSTOMERS_MANAGE),
      writeCapability("sales_task.create", "sales_task", CUSTOMERS_MANAGE),
      writeCapability("response.draft", "response", CUSTOMERS_MANAGE),
    ],
  },
  {
    provider_key: "lead_management",
    display_name_key: "customerApp.companionPlatformKnowledge.sales.providers.lead_management",
    source_engine: "lead_management",
    implementation_status: "connected",
    business_pack_key: REVENUE_PACK,
    search_terms_key:
      "customerApp.companionPlatformKnowledge.sales.searchTerms.lead_management",
    capabilities: [
      readCapability("lead.read", "lead", CUSTOMERS_VIEW, true),
      readCapability("prospect.read", "prospect", CUSTOMERS_VIEW, true),
      readCapability("conversion.read", "lead_conversion", CUSTOMERS_VIEW),
      writeCapability("follow_up.create", "lead_follow_up", CUSTOMERS_MANAGE),
    ],
  },
  {
    provider_key: "revenue_intelligence",
    display_name_key:
      "customerApp.companionPlatformKnowledge.sales.providers.revenue_intelligence",
    source_engine: "revenue_intelligence",
    implementation_status: "partial",
    business_pack_key: REVENUE_PACK,
    search_terms_key:
      "customerApp.companionPlatformKnowledge.sales.searchTerms.revenue_intelligence",
    capabilities: [
      readCapability("attribution.read", "attribution"),
      readCapability("churn_risk.read", "churn_risk"),
      readCapability("sales_forecast.read", "revenue_forecast"),
      readCapability("conversion.read", "revenue_conversion"),
    ],
  },
  {
    provider_key: "growth_partner_attribution",
    display_name_key:
      "customerApp.companionPlatformKnowledge.sales.providers.growth_partner_attribution",
    source_engine: "growth_partner_attribution",
    implementation_status: "specification_only",
    business_pack_key: null,
    search_terms_key:
      "customerApp.companionPlatformKnowledge.sales.searchTerms.growth_partner_attribution",
    capabilities: [readCapability("attribution.read", "partner_attribution", null)],
  },
  {
    provider_key: "sales_pack_adapter",
    display_name_key: "customerApp.companionPlatformKnowledge.sales.providers.sales_pack_adapter",
    source_engine: "sales_pack_adapter",
    implementation_status: "specification_only",
    business_pack_key: null,
    search_terms_key:
      "customerApp.companionPlatformKnowledge.sales.searchTerms.sales_pack_adapter",
    capabilities: [
      readCapability("pipeline.read", "external_pipeline"),
      readCapability("customer.read", "external_customer", null, true),
    ],
  },
];
