import {
  getCommerceProviderManifest,
  listCommerceProviderManifests,
} from "@/lib/integration-intelligence/commerce/registry";
import type { Translator } from "@/lib/i18n/translate";
import type { CompanionCommerceContext } from "./companion-commerce-context";
import { filterCommerceCapabilitiesForPrivacy } from "./companion-commerce-context";
import type { CompanionTenantContext } from "./companion-tenant-context";

export type CommerceProviderMatch = {
  provider_key: string;
  capability_key: string | null;
  operation: "read" | "write" | null;
};

function normalizeCommerceQuery(query: string): string {
  return query.trim().toLowerCase().replace(/\s+/g, " ");
}

export function hasCommerceProviderIntent(query: string): boolean {
  const normalized = normalizeCommerceQuery(query);
  return /\b(product|products|inventory|stock|order|orders|customer|customers|commerce|storefront|store|stores|shopify|woocommerce|wordpress|cms|seo|translation|import|margin|margins|category|categories|multi.?store|dropship|retail|publish|catalog)\b/i.test(
    normalized,
  );
}

export function hasExternalCommerceAdapterIntent(query: string): boolean {
  const normalized = normalizeCommerceQuery(query);
  return /\b(live shopify api|woocommerce api|wordpress api|external storefront sync|payment gateway|process payment|issue refund|cancel order|delete product)\b/i.test(
    normalized,
  );
}

export function hasBlockedCommerceOperationIntent(query: string): boolean {
  const normalized = normalizeCommerceQuery(query);
  return /\b(process payment|capture payment|issue refund|refund order|cancel order|delete product|delete customer|remove order)\b/i.test(
    normalized,
  );
}

export function matchCommerceProviderQuery(
  query: string,
  tenantContext: CompanionTenantContext,
): CommerceProviderMatch | null {
  if (!hasCommerceProviderIntent(query)) return null;

  const normalized = normalizeCommerceQuery(query);
  const manifests = listCommerceProviderManifests();

  const mentionedProviders = manifests.filter((manifest) => {
    const provider = manifest.provider_key.toLowerCase();
    const providerSpaced = provider.replace(/_/g, " ");
    return normalized.includes(providerSpaced) || normalized.includes(provider);
  });

  if (mentionedProviders.length > 0) {
    for (const manifest of mentionedProviders) {
      for (const capability of manifest.capabilities) {
        const capabilityPhrase = capability.capability_key.replace(/\./g, " ");
        if (normalized.includes(capabilityPhrase)) {
          return {
            provider_key: manifest.provider_key,
            capability_key: capability.capability_key,
            operation: capability.operation,
          };
        }
      }
    }

    return {
      provider_key: mentionedProviders[0]!.provider_key,
      capability_key: null,
      operation: null,
    };
  }

  for (const manifest of manifests) {
    for (const capability of manifest.capabilities) {
      const capabilityPhrase = capability.capability_key.replace(/\./g, " ");
      if (normalized.includes(capabilityPhrase)) {
        return {
          provider_key: manifest.provider_key,
          capability_key: capability.capability_key,
          operation: capability.operation,
        };
      }
    }
  }

  const keywordMatch = manifests.find((manifest) => {
    if (normalized.includes("product") || normalized.includes("catalog")) {
      return manifest.capabilities.some((capability) => capability.capability_key.startsWith("product."));
    }
    if (normalized.includes("inventory") || normalized.includes("stock")) {
      return manifest.capabilities.some((capability) => capability.capability_key.startsWith("inventory."));
    }
    if (normalized.includes("order")) {
      return manifest.capabilities.some((capability) => capability.capability_key.startsWith("order."));
    }
    if (normalized.includes("customer")) {
      return manifest.capabilities.some((capability) => capability.capability_key.startsWith("customer."));
    }
    if (normalized.includes("seo")) {
      return manifest.capabilities.some((capability) => capability.capability_key.startsWith("seo."));
    }
    if (normalized.includes("translation") || normalized.includes("translate")) {
      return manifest.capabilities.some((capability) =>
        capability.capability_key.startsWith("translation."),
      );
    }
    if (normalized.includes("import")) {
      return manifest.capabilities.some((capability) => capability.capability_key.startsWith("product.import"));
    }
    if (normalized.includes("publish") || normalized.includes("storefront")) {
      return manifest.capabilities.some((capability) =>
        capability.capability_key.startsWith("storefront."),
      );
    }
    if (normalized.includes("margin") || normalized.includes("profit")) {
      return manifest.capabilities.some((capability) => capability.capability_key.startsWith("margin."));
    }
    if (normalized.includes("trend")) {
      return manifest.provider_key === "commerce_intelligence";
    }
    if (normalized.includes("multi") && normalized.includes("store")) {
      return manifest.provider_key === "multi_store_orchestration";
    }
    if (normalized.includes("wordpress") || normalized.includes("cms")) {
      return manifest.provider_key === "wordpress";
    }
    return false;
  });

  if (keywordMatch) {
    return {
      provider_key: keywordMatch.provider_key,
      capability_key: null,
      operation: null,
    };
  }

  const writeIntent = /\b(create|import|publish|generate|update|add)\b/i.test(normalized);
  const readIntent = /\b(read|show|list|status|what|which|find|margin|inventory)\b/i.test(normalized);
  const operation = writeIntent ? "write" : readIntent ? "read" : null;

  const firstProvider = tenantContext.commerceContext.providers[0];
  if (firstProvider) {
    return { provider_key: firstProvider.provider_key, capability_key: null, operation };
  }

  return null;
}

function resolveCommerceCrossLink(
  match: CommerceProviderMatch,
  commerceContext: CompanionCommerceContext,
): string {
  if (match.provider_key === "commerce_intelligence") {
    return commerceContext.cross_link_intelligence;
  }
  if (match.provider_key === "product_automation") {
    return commerceContext.cross_link_automation;
  }
  if (match.provider_key === "multi_store_orchestration") {
    return commerceContext.cross_link_multi_store;
  }
  return commerceContext.cross_link_commerce;
}

export function buildCommerceProviderDiscoveryAnswer(
  match: CommerceProviderMatch,
  commerceContext: CompanionCommerceContext,
  t: Translator,
): import("@/lib/companion-platform-knowledge/types").PlatformKnowledgeAnswer {
  const manifest = getCommerceProviderManifest(match.provider_key);
  const providerStatus = commerceContext.providers.find(
    (provider) => provider.provider_key === match.provider_key,
  );

  const statusKey = providerStatus?.implementation_status ?? "specification_only";
  const statusLabel = t(`customerApp.companionPlatformKnowledge.commerce.status.${statusKey}`);

  const directAnswer = t("customerApp.companionPlatformKnowledge.commerce.discoveryLead")
    .replace("{provider}", manifest ? t(manifest.display_name_key) : match.provider_key)
    .replace("{status}", statusLabel);

  const capabilityLines = filterCommerceCapabilitiesForPrivacy(commerceContext)
    .filter((capability) => capability.provider_key === match.provider_key)
    .slice(0, 6)
    .map((capability) =>
      t("customerApp.companionPlatformKnowledge.commerce.capabilityLine")
        .replace("{capabilityId}", capability.capability_id)
        .replace(
          "{mode}",
          t(`customerApp.companionPlatformKnowledge.commerce.operation.${capability.operation}`),
        ),
    )
    .join("\n");

  const explanation = [
    t("customerApp.companionPlatformKnowledge.commerce.discoveryExplanation"),
    capabilityLines,
    providerStatus?.verified
      ? t("customerApp.companionPlatformKnowledge.commerce.verifiedProvider")
      : t("customerApp.companionPlatformKnowledge.commerce.disconnectedProvider"),
    t("customerApp.companionPlatformKnowledge.commerce.privacyNote"),
    t("customerApp.companionPlatformKnowledge.commerce.policyNote"),
  ]
    .filter(Boolean)
    .join("\n");

  return {
    directAnswer,
    explanation,
    steps: [],
    actions: [
      {
        labelKey: "customerApp.companionPlatformKnowledge.commerce.openCommerceCenter",
        label: t("customerApp.companionPlatformKnowledge.commerce.openCommerceCenter"),
        href: resolveCommerceCrossLink(match, commerceContext),
        routeKey: "commerceCenter",
      },
    ],
    sources: [
      {
        id: match.provider_key,
        label: t("customerApp.companionPlatformKnowledge.commerce.sourceLabel"),
        kind: "customer_context",
        meta: statusKey,
      },
    ],
    sourceId: match.provider_key,
    source: "customer_context",
    confidence: providerStatus?.verified ? "moderate" : "low",
  };
}

export function buildCommerceProviderUnavailableAnswer(
  t: Translator,
  commerceContext: CompanionCommerceContext,
): import("@/lib/companion-platform-knowledge/types").PlatformKnowledgeAnswer {
  return {
    directAnswer: t("customerApp.companionPlatformKnowledge.commerce.unavailableLead"),
    explanation: commerceContext.permission_denied
      ? t("customerApp.companionPlatformKnowledge.commerce.permissionDenied")
      : commerceContext.app_entitlement_blocked
        ? t("customerApp.companionPlatformKnowledge.commerce.entitlementBlocked")
        : t("customerApp.companionPlatformKnowledge.commerce.unavailableExplanation"),
    steps: [],
    actions: [],
    sources: [
      {
        id: "commerce-provider-unavailable",
        label: t("customerApp.companionPlatformKnowledge.commerce.sourceLabel"),
        kind: "customer_context",
      },
    ],
    sourceId: "commerce-provider-unavailable",
    source: "customer_context",
    confidence: "low",
  };
}

export function buildBlockedCommerceOperationAnswer(
  t: Translator,
): import("@/lib/companion-platform-knowledge/types").PlatformKnowledgeAnswer {
  return {
    directAnswer: t("customerApp.companionPlatformKnowledge.commerce.blockedOperationLead"),
    explanation: t("customerApp.companionPlatformKnowledge.commerce.blockedOperationExplanation"),
    steps: [],
    actions: [],
    sources: [
      {
        id: "commerce-blocked-operation",
        label: t("customerApp.companionPlatformKnowledge.commerce.sourceLabel"),
        kind: "customer_context",
      },
    ],
    sourceId: "commerce-blocked-operation",
    source: "customer_context",
    confidence: "high",
  };
}

export function buildExternalCommerceUnavailableAnswer(
  t: Translator,
): import("@/lib/companion-platform-knowledge/types").PlatformKnowledgeAnswer {
  return {
    directAnswer: t("customerApp.companionPlatformKnowledge.commerce.externalUnavailableLead"),
    explanation: t("customerApp.companionPlatformKnowledge.commerce.externalUnavailableExplanation"),
    steps: [],
    actions: [],
    sources: [
      {
        id: "commerce-external-unavailable",
        label: t("customerApp.companionPlatformKnowledge.commerce.sourceLabel"),
        kind: "customer_context",
      },
    ],
    sourceId: "commerce-external-unavailable",
    source: "customer_context",
    confidence: "low",
  };
}
