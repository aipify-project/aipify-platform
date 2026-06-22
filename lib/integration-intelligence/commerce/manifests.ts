import type { CommerceProviderManifest } from "./types";

const COMMERCE_VIEW = "commerce.view";
const COMMERCE_MANAGE = "commerce.manage";

function readCapability(
  capability_key: CommerceProviderManifest["capabilities"][number]["capability_key"],
  entity: string,
  permission: string | null = COMMERCE_VIEW,
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
  capability_key: CommerceProviderManifest["capabilities"][number]["capability_key"],
  entity: string,
  permission: string | null = COMMERCE_MANAGE,
  options?: { irreversible?: boolean; privacy_sensitive?: boolean },
) {
  const irreversible = options?.irreversible ?? false;
  return {
    capability_key,
    operation: "write" as const,
    adapter_available: false,
    approval_required: true,
    reversible: !irreversible,
    risk_level: (irreversible ? 3 : 2) as 2 | 3,
    entity,
    required_permission: permission,
    privacy_sensitive: options?.privacy_sensitive ?? false,
  };
}

/** Blueprint-derived commerce manifests — capability IDs originate here, not in Core orchestrator. */
export const COMMERCE_PROVIDER_MANIFESTS: readonly CommerceProviderManifest[] = [
  {
    provider_key: "commerce_retail_operations",
    display_name_key:
      "customerApp.companionPlatformKnowledge.commerce.providers.commerce_retail_operations",
    source_engine: "commerce_retail_operations_pack",
    implementation_status: "partial",
    search_terms_key:
      "customerApp.companionPlatformKnowledge.commerce.searchTerms.commerce_retail_operations",
    capabilities: [
      readCapability("product.read", "product"),
      readCapability("order.read", "order", COMMERCE_VIEW, true),
      readCapability("customer.read", "customer", COMMERCE_VIEW, true),
      readCapability("inventory.read", "inventory"),
      readCapability("category.read", "category"),
      readCapability("store.read", "store"),
      readCapability("margin.read", "margin"),
      writeCapability("product.create", "product"),
      writeCapability("product.import", "product"),
      writeCapability("store.create", "store"),
    ],
  },
  {
    provider_key: "commerce_intelligence",
    display_name_key:
      "customerApp.companionPlatformKnowledge.commerce.providers.commerce_intelligence",
    source_engine: "commerce_intelligence",
    implementation_status: "partial",
    search_terms_key:
      "customerApp.companionPlatformKnowledge.commerce.searchTerms.commerce_intelligence",
    capabilities: [
      readCapability("product.read", "product"),
      readCapability("category.read", "category"),
      readCapability("margin.read", "margin"),
      readCapability("trend.read", "trend"),
    ],
  },
  {
    provider_key: "product_automation",
    display_name_key:
      "customerApp.companionPlatformKnowledge.commerce.providers.product_automation",
    source_engine: "product_automation",
    implementation_status: "partial",
    search_terms_key:
      "customerApp.companionPlatformKnowledge.commerce.searchTerms.product_automation",
    capabilities: [
      readCapability("product.read", "product"),
      readCapability("category.read", "category"),
      writeCapability("content.generate", "content"),
      writeCapability("translation.generate", "translation"),
      writeCapability("seo.generate", "seo"),
      writeCapability("product.import", "product"),
      writeCapability("storefront.publish", "storefront", COMMERCE_MANAGE, {
        irreversible: true,
      }),
    ],
  },
  {
    provider_key: "multi_store_orchestration",
    display_name_key:
      "customerApp.companionPlatformKnowledge.commerce.providers.multi_store_orchestration",
    source_engine: "multi_store_orchestration",
    implementation_status: "partial",
    search_terms_key:
      "customerApp.companionPlatformKnowledge.commerce.searchTerms.multi_store_orchestration",
    capabilities: [readCapability("store.read", "store")],
  },
  {
    provider_key: "shopify",
    display_name_key: "customerApp.companionPlatformKnowledge.commerce.providers.shopify",
    source_engine: "app_portal_integration",
    implementation_status: "specification_only",
    search_terms_key: "customerApp.companionPlatformKnowledge.commerce.searchTerms.shopify",
    capabilities: [
      readCapability("product.read", "product"),
      readCapability("order.read", "order", COMMERCE_VIEW, true),
      readCapability("customer.read", "customer", COMMERCE_VIEW, true),
      readCapability("inventory.read", "inventory"),
      readCapability("category.read", "category"),
    ],
  },
  {
    provider_key: "woocommerce",
    display_name_key: "customerApp.companionPlatformKnowledge.commerce.providers.woocommerce",
    source_engine: "app_portal_integration",
    implementation_status: "specification_only",
    search_terms_key: "customerApp.companionPlatformKnowledge.commerce.searchTerms.woocommerce",
    capabilities: [
      readCapability("product.read", "product"),
      readCapability("order.read", "order", COMMERCE_VIEW, true),
      readCapability("customer.read", "customer", COMMERCE_VIEW, true),
      readCapability("inventory.read", "inventory"),
      readCapability("category.read", "category"),
    ],
  },
  {
    provider_key: "wordpress",
    display_name_key: "customerApp.companionPlatformKnowledge.commerce.providers.wordpress",
    source_engine: "app_portal_integration",
    implementation_status: "specification_only",
    search_terms_key: "customerApp.companionPlatformKnowledge.commerce.searchTerms.wordpress",
    capabilities: [
      readCapability("content.read", "content"),
      readCapability("category.read", "category"),
      writeCapability("content.generate", "content", COMMERCE_MANAGE, { irreversible: false }),
    ],
  },
];
