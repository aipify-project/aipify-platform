import {
  getSalesProviderManifest,
  listSalesProviderManifests,
} from "@/lib/integration-intelligence/sales/registry";
import type { Translator } from "@/lib/i18n/translate";
import type { CompanionSalesContext } from "./companion-sales-context";
import { filterSalesCapabilitiesForPrivacy } from "./companion-sales-context";
import type { CompanionTenantContext } from "./companion-tenant-context";

export type SalesProviderMatch = {
  provider_key: string;
  capability_key: string | null;
  operation: "read" | "write" | null;
};

function normalizeSalesQuery(query: string): string {
  return query.trim().toLowerCase().replace(/\s+/g, " ");
}

export function hasSalesProviderIntent(query: string): boolean {
  const normalized = normalizeSalesQuery(query);
  return /\b(sales|crm|lead|leads|prospect|prospects|customer|customers|contact|contacts|opportunity|opportunities|pipeline|deal|deals|conversion|attribution|churn|follow.?up|sales task|customer health|revenue intelligence|forecast)\b/i.test(
    normalized,
  );
}

export function hasBlockedSalesOperationIntent(query: string): boolean {
  const normalized = normalizeSalesQuery(query);
  return /\b(auto send|send message|delete customer|approve contract|change price|apply discount|execute payment|issue refund|irreversible pipeline|close deal permanently|transfer customer ownership)\b/i.test(
    normalized,
  );
}

export function hasExternalSalesAdapterIntent(query: string): boolean {
  const normalized = normalizeSalesQuery(query);
  return /\b(external crm adapter|live salesforce sync|third.?party crm|external pipeline adapter)\b/i.test(
    normalized,
  );
}

export function matchSalesProviderQuery(
  query: string,
  tenantContext: CompanionTenantContext,
): SalesProviderMatch | null {
  if (!hasSalesProviderIntent(query)) return null;

  const normalized = normalizeSalesQuery(query);
  const manifests = listSalesProviderManifests();

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
    if (normalized.includes("pipeline") || normalized.includes("deal")) {
      return manifest.provider_key === "sales_revenue_pipeline";
    }
    if (normalized.includes("lead") || normalized.includes("prospect")) {
      return manifest.provider_key === "lead_management";
    }
    if (normalized.includes("customer") || normalized.includes("contact")) {
      return manifest.provider_key === "customer_relationship";
    }
    if (normalized.includes("churn") || normalized.includes("attribution")) {
      return manifest.provider_key === "revenue_intelligence";
    }
    if (normalized.includes("opportunity")) {
      return manifest.capabilities.some(
        (capability) => capability.capability_key === "opportunity.read",
      );
    }
    if (normalized.includes("follow")) {
      return manifest.capabilities.some(
        (capability) =>
          capability.capability_key === "follow_up.read" ||
          capability.capability_key === "follow_up.create",
      );
    }
    if (normalized.includes("forecast")) {
      return manifest.capabilities.some(
        (capability) => capability.capability_key === "sales_forecast.read",
      );
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

  const writeIntent = /\b(create|draft|assign|task|follow)\b/i.test(normalized);
  const readIntent = /\b(read|show|list|status|what|which|find|summary|who)\b/i.test(normalized);
  const operation = writeIntent ? "write" : readIntent ? "read" : null;

  const firstProvider = tenantContext.salesContext.providers[0];
  if (firstProvider) {
    return { provider_key: firstProvider.provider_key, capability_key: null, operation };
  }

  return null;
}

function resolveSalesCrossLink(match: SalesProviderMatch, salesContext: CompanionSalesContext): string {
  if (match.provider_key === "lead_management") {
    return salesContext.cross_link_leads;
  }
  if (match.provider_key === "customer_relationship") {
    return salesContext.cross_link_customers;
  }
  if (match.provider_key === "revenue_intelligence") {
    return salesContext.cross_link_revenue;
  }
  return salesContext.cross_link_sales;
}

export function buildSalesProviderDiscoveryAnswer(
  match: SalesProviderMatch,
  salesContext: CompanionSalesContext,
  t: Translator,
): import("@/lib/companion-platform-knowledge/types").PlatformKnowledgeAnswer {
  const manifest = getSalesProviderManifest(match.provider_key);
  const providerStatus = salesContext.providers.find(
    (provider) => provider.provider_key === match.provider_key,
  );

  const statusKey = providerStatus?.implementation_status ?? "specification_only";
  const statusLabel = t(`customerApp.companionPlatformKnowledge.sales.status.${statusKey}`);

  const directAnswer = t("customerApp.companionPlatformKnowledge.sales.discoveryLead")
    .replace("{provider}", manifest ? t(manifest.display_name_key) : match.provider_key)
    .replace("{status}", statusLabel);

  const capabilityLines = filterSalesCapabilitiesForPrivacy(salesContext)
    .filter((capability) => capability.provider_key === match.provider_key)
    .slice(0, 6)
    .map((capability) =>
      t("customerApp.companionPlatformKnowledge.sales.capabilityLine")
        .replace("{capabilityId}", capability.capability_id)
        .replace(
          "{mode}",
          t(`customerApp.companionPlatformKnowledge.sales.operation.${capability.operation}`),
        ),
    )
    .join("\n");

  const governanceLines = [
    salesContext.auto_send_blocked
      ? t("customerApp.companionPlatformKnowledge.sales.autoSendBlocked")
      : null,
    salesContext.customer_deletion_blocked
      ? t("customerApp.companionPlatformKnowledge.sales.customerDeletionBlocked")
      : null,
    salesContext.contract_approval_blocked
      ? t("customerApp.companionPlatformKnowledge.sales.contractApprovalBlocked")
      : null,
    salesContext.partner_attribution_metadata_only
      ? t("customerApp.companionPlatformKnowledge.sales.partnerAttributionMetadataOnly")
      : null,
    salesContext.sales_role_filter_active
      ? t("customerApp.companionPlatformKnowledge.sales.salesRoleFilterActive")
      : null,
    salesContext.command_brief_events_linked
      ? t("customerApp.companionPlatformKnowledge.sales.commandBriefEventsLinked")
      : t("customerApp.companionPlatformKnowledge.sales.commandBriefEventsAvailable"),
  ]
    .filter(Boolean)
    .join("\n");

  const explanation = [
    t("customerApp.companionPlatformKnowledge.sales.discoveryExplanation"),
    capabilityLines,
    governanceLines,
    providerStatus?.verified
      ? t("customerApp.companionPlatformKnowledge.sales.verifiedProvider")
      : t("customerApp.companionPlatformKnowledge.sales.disconnectedProvider"),
    t("customerApp.companionPlatformKnowledge.sales.privacyNote"),
    t("customerApp.companionPlatformKnowledge.sales.policyNote"),
  ]
    .filter(Boolean)
    .join("\n");

  return {
    directAnswer,
    explanation,
    steps: [],
    actions: [
      {
        labelKey: "customerApp.companionPlatformKnowledge.sales.openSalesCenter",
        label: t("customerApp.companionPlatformKnowledge.sales.openSalesCenter"),
        href: resolveSalesCrossLink(match, salesContext),
        routeKey: "appSales",
      },
    ],
    sources: [
      {
        id: match.provider_key,
        label: t("customerApp.companionPlatformKnowledge.sales.sourceLabel"),
        kind: "customer_context",
        meta: statusKey,
      },
    ],
    sourceId: match.provider_key,
    source: "customer_context",
    confidence: providerStatus?.verified ? "moderate" : "low",
  };
}

export function buildSalesProviderUnavailableAnswer(
  t: Translator,
  salesContext: CompanionSalesContext,
): import("@/lib/companion-platform-knowledge/types").PlatformKnowledgeAnswer {
  return {
    directAnswer: t("customerApp.companionPlatformKnowledge.sales.unavailableLead"),
    explanation: salesContext.permission_denied
      ? t("customerApp.companionPlatformKnowledge.sales.permissionDenied")
      : salesContext.app_entitlement_blocked
        ? t("customerApp.companionPlatformKnowledge.sales.entitlementBlocked")
        : t("customerApp.companionPlatformKnowledge.sales.unavailableExplanation"),
    steps: [],
    actions: [],
    sources: [
      {
        id: "sales-provider-unavailable",
        label: t("customerApp.companionPlatformKnowledge.sales.sourceLabel"),
        kind: "customer_context",
      },
    ],
    sourceId: "sales-provider-unavailable",
    source: "customer_context",
    confidence: "low",
  };
}

export function buildBlockedSalesOperationAnswer(
  t: Translator,
): import("@/lib/companion-platform-knowledge/types").PlatformKnowledgeAnswer {
  return {
    directAnswer: t("customerApp.companionPlatformKnowledge.sales.blockedOperationLead"),
    explanation: t("customerApp.companionPlatformKnowledge.sales.blockedOperationExplanation"),
    steps: [],
    actions: [],
    sources: [
      {
        id: "sales-blocked-operation",
        label: t("customerApp.companionPlatformKnowledge.sales.sourceLabel"),
        kind: "customer_context",
      },
    ],
    sourceId: "sales-blocked-operation",
    source: "customer_context",
    confidence: "high",
  };
}

export function buildExternalSalesUnavailableAnswer(
  t: Translator,
): import("@/lib/companion-platform-knowledge/types").PlatformKnowledgeAnswer {
  return {
    directAnswer: t("customerApp.companionPlatformKnowledge.sales.externalUnavailableLead"),
    explanation: t("customerApp.companionPlatformKnowledge.sales.externalUnavailableExplanation"),
    steps: [],
    actions: [],
    sources: [
      {
        id: "sales-external-unavailable",
        label: t("customerApp.companionPlatformKnowledge.sales.sourceLabel"),
        kind: "customer_context",
      },
    ],
    sourceId: "sales-external-unavailable",
    source: "customer_context",
    confidence: "low",
  };
}
