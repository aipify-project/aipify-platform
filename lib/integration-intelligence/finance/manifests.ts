import type { FinanceProviderManifest } from "./types";

const FINANCE_PACK = "finance_pack";
const FINANCE_VIEW = "finance.view";
const FINANCE_MANAGE = "finance.manage";

function readCapability(
  capability_key: FinanceProviderManifest["capabilities"][number]["capability_key"],
  entity: string,
  permission: string | null = FINANCE_VIEW,
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
  capability_key: FinanceProviderManifest["capabilities"][number]["capability_key"],
  entity: string,
  permission: string | null = FINANCE_MANAGE,
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

/** Finance Business Pack manifests — capability IDs originate here, not in Core orchestrator. */
export const FINANCE_PROVIDER_MANIFESTS: readonly FinanceProviderManifest[] = [
  {
    provider_key: "finance_operations_center",
    display_name_key:
      "customerApp.companionPlatformKnowledge.finance.providers.finance_operations_center",
    source_engine: "finance_operations",
    implementation_status: "connected",
    business_pack_key: FINANCE_PACK,
    search_terms_key:
      "customerApp.companionPlatformKnowledge.finance.searchTerms.finance_operations_center",
    capabilities: [
      readCapability("revenue.read", "revenue"),
      readCapability("expense.read", "expense"),
      readCapability("invoice.read", "invoice"),
      readCapability("subscription.read", "subscription"),
      readCapability("payment.read", "payment", FINANCE_VIEW, true),
      readCapability("payout.read", "payout", FINANCE_VIEW, true),
      readCapability("billing_profile.read", "billing_profile", FINANCE_VIEW, true),
      readCapability("forecast.read", "forecast"),
      readCapability("report.read", "report"),
      readCapability("reconciliation.read", "reconciliation"),
      writeCapability("invoice.draft", "invoice"),
      writeCapability("report.export", "report"),
    ],
  },
  {
    provider_key: "revenue_operations",
    display_name_key:
      "customerApp.companionPlatformKnowledge.finance.providers.revenue_operations",
    source_engine: "revenue_operations",
    implementation_status: "partial",
    business_pack_key: FINANCE_PACK,
    search_terms_key:
      "customerApp.companionPlatformKnowledge.finance.searchTerms.revenue_operations",
    capabilities: [
      readCapability("revenue.read", "revenue"),
      readCapability("forecast.read", "forecast"),
      readCapability("report.read", "report"),
    ],
  },
  {
    provider_key: "unified_billing",
    display_name_key: "customerApp.companionPlatformKnowledge.finance.providers.unified_billing",
    source_engine: "unified_billing",
    implementation_status: "partial",
    business_pack_key: null,
    search_terms_key:
      "customerApp.companionPlatformKnowledge.finance.searchTerms.unified_billing",
    capabilities: [
      readCapability("subscription.read", "subscription", null),
      readCapability("billing_profile.read", "billing_profile", null, true),
      readCapability("invoice.read", "invoice", null),
      readCapability("payment.read", "payment", null, true),
    ],
  },
  {
    provider_key: "payment_providers",
    display_name_key:
      "customerApp.companionPlatformKnowledge.finance.providers.payment_providers",
    source_engine: "payment_providers",
    implementation_status: "partial",
    business_pack_key: FINANCE_PACK,
    search_terms_key:
      "customerApp.companionPlatformKnowledge.finance.searchTerms.payment_providers",
    capabilities: [readCapability("payment.read", "payment_provider", FINANCE_VIEW, true)],
  },
  {
    provider_key: "enterprise_invoicing",
    display_name_key:
      "customerApp.companionPlatformKnowledge.finance.providers.enterprise_invoicing",
    source_engine: "enterprise_invoicing",
    implementation_status: "partial",
    business_pack_key: FINANCE_PACK,
    search_terms_key:
      "customerApp.companionPlatformKnowledge.finance.searchTerms.enterprise_invoicing",
    capabilities: [
      readCapability("invoice.read", "enterprise_invoice", FINANCE_VIEW),
      readCapability("reconciliation.read", "reconciliation", FINANCE_VIEW),
    ],
  },
  {
    provider_key: "finance_pack_adapter",
    display_name_key:
      "customerApp.companionPlatformKnowledge.finance.providers.finance_pack_adapter",
    source_engine: "finance_pack_adapter",
    implementation_status: "specification_only",
    business_pack_key: null,
    search_terms_key:
      "customerApp.companionPlatformKnowledge.finance.searchTerms.finance_pack_adapter",
    capabilities: [
      readCapability("reconciliation.read", "accounting_export"),
      readCapability("report.read", "accounting_report"),
    ],
  },
];
