import {
  getWarehouseProviderManifest,
  listWarehouseProviderManifests,
} from "@/lib/integration-intelligence/warehouse/registry";
import type { Translator } from "@/lib/i18n/translate";
import type { CompanionWarehouseContext } from "./companion-warehouse-context";
import { filterWarehouseCapabilitiesForPrivacy } from "./companion-warehouse-context";
import type { CompanionTenantContext } from "./companion-tenant-context";

export type WarehouseProviderMatch = {
  provider_key: string;
  capability_key: string | null;
  operation: "read" | "write" | null;
};

function normalizeWarehouseQuery(query: string): string {
  return query.trim().toLowerCase().replace(/\s+/g, " ");
}

export function hasWarehouseProviderIntent(query: string): boolean {
  const normalized = normalizeWarehouseQuery(query);
  return /\b(warehouse|inventory|stock|stock level|location|bin|item|product|supplier|purchase order|goods receipt|receiving|picking|pick order|packing|shipment|transfer|reservation|replenishment|stock alert|cycle count|inventory valuation|low stock|reorder|procurement|logistics)\b/i.test(
    normalized,
  );
}

export function hasBlockedWarehouseOperationIntent(query: string): boolean {
  const normalized = normalizeWarehouseQuery(query);
  return /\b(delete stock|permanent deletion|irreversible adjustment|supplier payment|pay supplier|cancel shipment|destructive bulk|bulk delete|financial posting|post to ledger|write off inventory permanently)\b/i.test(
    normalized,
  );
}

export function hasExternalWarehouseAdapterIntent(query: string): boolean {
  const normalized = normalizeWarehouseQuery(query);
  return /\b(external wms adapter|third.?party warehouse|live erp sync|external logistics adapter)\b/i.test(
    normalized,
  );
}

export function matchWarehouseProviderQuery(
  query: string,
  tenantContext: CompanionTenantContext,
): WarehouseProviderMatch | null {
  if (!hasWarehouseProviderIntent(query)) return null;

  const normalized = normalizeWarehouseQuery(query);
  const manifests = listWarehouseProviderManifests();

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
    if (normalized.includes("stock") || normalized.includes("inventory")) {
      return manifest.provider_key === "inventory_stock_center";
    }
    if (normalized.includes("warehouse")) {
      return manifest.provider_key === "warehouse_control";
    }
    if (normalized.includes("supplier")) {
      return manifest.capabilities.some(
        (capability) => capability.capability_key === "supplier.read",
      );
    }
    if (normalized.includes("purchase order") || normalized.includes("purchase_order")) {
      return manifest.capabilities.some(
        (capability) => capability.capability_key === "purchase_order.read",
      );
    }
    if (normalized.includes("receiving") || normalized.includes("goods receipt")) {
      return manifest.capabilities.some(
        (capability) => capability.capability_key === "goods_receipt.read",
      );
    }
    if (normalized.includes("transfer")) {
      return manifest.capabilities.some(
        (capability) =>
          capability.capability_key === "transfer.read" ||
          capability.capability_key === "transfer.create",
      );
    }
    if (normalized.includes("pick")) {
      return manifest.provider_key === "warehouse_fulfillment";
    }
    if (normalized.includes("shipment") || normalized.includes("logistics")) {
      return manifest.provider_key === "warehouse_logistics";
    }
    if (normalized.includes("replenishment") || normalized.includes("reorder")) {
      return manifest.capabilities.some(
        (capability) => capability.capability_key === "replenishment.read",
      );
    }
    if (normalized.includes("low stock") || normalized.includes("stock alert")) {
      return manifest.capabilities.some(
        (capability) => capability.capability_key === "stock_alert.read",
      );
    }
    if (normalized.includes("location") || normalized.includes("bin")) {
      return manifest.capabilities.some(
        (capability) => capability.capability_key === "location.read",
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

  const writeIntent = /\b(create|adjust|transfer|pick)\b/i.test(normalized);
  const readIntent = /\b(read|show|list|status|what|which|find|summary|how many)\b/i.test(
    normalized,
  );
  const operation = writeIntent ? "write" : readIntent ? "read" : null;

  const firstProvider = tenantContext.warehouseContext.providers[0];
  if (firstProvider) {
    return { provider_key: firstProvider.provider_key, capability_key: null, operation };
  }

  return null;
}

function resolveWarehouseCrossLink(
  match: WarehouseProviderMatch,
  warehouseContext: CompanionWarehouseContext,
): string {
  if (match.provider_key === "warehouse_logistics") {
    return warehouseContext.cross_link_logistics;
  }
  if (match.provider_key === "warehouse_control") {
    return warehouseContext.cross_link_locations;
  }
  if (match.capability_key === "goods_receipt.read") {
    return warehouseContext.cross_link_receiving;
  }
  if (
    match.capability_key === "transfer.read" ||
    match.capability_key === "transfer.create"
  ) {
    return warehouseContext.cross_link_transfers;
  }
  return warehouseContext.cross_link_inventory;
}

export function buildWarehouseProviderDiscoveryAnswer(
  match: WarehouseProviderMatch,
  warehouseContext: CompanionWarehouseContext,
  t: Translator,
): import("@/lib/companion-platform-knowledge/types").PlatformKnowledgeAnswer {
  const manifest = getWarehouseProviderManifest(match.provider_key);
  const providerStatus = warehouseContext.providers.find(
    (provider) => provider.provider_key === match.provider_key,
  );

  const statusKey = providerStatus?.implementation_status ?? "specification_only";
  const statusLabel = t(`customerApp.companionPlatformKnowledge.warehouse.status.${statusKey}`);

  const directAnswer = t("customerApp.companionPlatformKnowledge.warehouse.discoveryLead")
    .replace("{provider}", manifest ? t(manifest.display_name_key) : match.provider_key)
    .replace("{status}", statusLabel);

  const capabilityLines = filterWarehouseCapabilitiesForPrivacy(warehouseContext)
    .filter((capability) => capability.provider_key === match.provider_key)
    .slice(0, 6)
    .map((capability) =>
      t("customerApp.companionPlatformKnowledge.warehouse.capabilityLine")
        .replace("{capabilityId}", capability.capability_id)
        .replace(
          "{mode}",
          t(`customerApp.companionPlatformKnowledge.warehouse.operation.${capability.operation}`),
        ),
    )
    .join("\n");

  const governanceLines = [
    warehouseContext.stock_deletion_blocked
      ? t("customerApp.companionPlatformKnowledge.warehouse.stockDeletionBlocked")
      : null,
    warehouseContext.irreversible_adjustment_blocked
      ? t("customerApp.companionPlatformKnowledge.warehouse.irreversibleAdjustmentBlocked")
      : null,
    warehouseContext.supplier_payment_blocked
      ? t("customerApp.companionPlatformKnowledge.warehouse.supplierPaymentBlocked")
      : null,
    warehouseContext.least_privilege_enforced
      ? t("customerApp.companionPlatformKnowledge.warehouse.leastPrivilegeEnforced")
      : null,
    warehouseContext.warehouse_scope_active
      ? t("customerApp.companionPlatformKnowledge.warehouse.warehouseScopeActive")
      : null,
    warehouseContext.location_scope_active
      ? t("customerApp.companionPlatformKnowledge.warehouse.locationScopeActive")
      : null,
    warehouseContext.command_brief_events_linked
      ? t("customerApp.companionPlatformKnowledge.warehouse.commandBriefEventsLinked")
      : t("customerApp.companionPlatformKnowledge.warehouse.commandBriefEventsAvailable"),
  ]
    .filter(Boolean)
    .join("\n");

  const explanation = [
    t("customerApp.companionPlatformKnowledge.warehouse.discoveryExplanation"),
    capabilityLines,
    governanceLines,
    providerStatus?.verified
      ? t("customerApp.companionPlatformKnowledge.warehouse.verifiedProvider")
      : t("customerApp.companionPlatformKnowledge.warehouse.disconnectedProvider"),
    t("customerApp.companionPlatformKnowledge.warehouse.privacyNote"),
    t("customerApp.companionPlatformKnowledge.warehouse.policyNote"),
  ]
    .filter(Boolean)
    .join("\n");

  return {
    directAnswer,
    explanation,
    steps: [],
    actions: [
      {
        labelKey: "customerApp.companionPlatformKnowledge.warehouse.openInventoryCenter",
        label: t("customerApp.companionPlatformKnowledge.warehouse.openInventoryCenter"),
        href: resolveWarehouseCrossLink(match, warehouseContext),
        routeKey: "appInventory",
      },
    ],
    sources: [
      {
        id: match.provider_key,
        label: t("customerApp.companionPlatformKnowledge.warehouse.sourceLabel"),
        kind: "customer_context",
        meta: statusKey,
      },
    ],
    sourceId: match.provider_key,
    source: "customer_context",
    confidence: providerStatus?.verified ? "moderate" : "low",
  };
}

export function buildWarehouseProviderUnavailableAnswer(
  t: Translator,
  warehouseContext: CompanionWarehouseContext,
): import("@/lib/companion-platform-knowledge/types").PlatformKnowledgeAnswer {
  return {
    directAnswer: t("customerApp.companionPlatformKnowledge.warehouse.unavailableLead"),
    explanation: warehouseContext.permission_denied
      ? t("customerApp.companionPlatformKnowledge.warehouse.permissionDenied")
      : warehouseContext.app_entitlement_blocked
        ? t("customerApp.companionPlatformKnowledge.warehouse.entitlementBlocked")
        : t("customerApp.companionPlatformKnowledge.warehouse.unavailableExplanation"),
    steps: [],
    actions: [],
    sources: [
      {
        id: "warehouse-provider-unavailable",
        label: t("customerApp.companionPlatformKnowledge.warehouse.sourceLabel"),
        kind: "customer_context",
      },
    ],
    sourceId: "warehouse-provider-unavailable",
    source: "customer_context",
    confidence: "low",
  };
}

export function buildBlockedWarehouseOperationAnswer(
  t: Translator,
): import("@/lib/companion-platform-knowledge/types").PlatformKnowledgeAnswer {
  return {
    directAnswer: t("customerApp.companionPlatformKnowledge.warehouse.blockedOperationLead"),
    explanation: t("customerApp.companionPlatformKnowledge.warehouse.blockedOperationExplanation"),
    steps: [],
    actions: [],
    sources: [
      {
        id: "warehouse-blocked-operation",
        label: t("customerApp.companionPlatformKnowledge.warehouse.sourceLabel"),
        kind: "customer_context",
      },
    ],
    sourceId: "warehouse-blocked-operation",
    source: "customer_context",
    confidence: "high",
  };
}

export function buildExternalWarehouseUnavailableAnswer(
  t: Translator,
): import("@/lib/companion-platform-knowledge/types").PlatformKnowledgeAnswer {
  return {
    directAnswer: t("customerApp.companionPlatformKnowledge.warehouse.externalUnavailableLead"),
    explanation: t(
      "customerApp.companionPlatformKnowledge.warehouse.externalUnavailableExplanation",
    ),
    steps: [],
    actions: [],
    sources: [
      {
        id: "warehouse-external-unavailable",
        label: t("customerApp.companionPlatformKnowledge.warehouse.sourceLabel"),
        kind: "customer_context",
      },
    ],
    sourceId: "warehouse-external-unavailable",
    source: "customer_context",
    confidence: "low",
  };
}
