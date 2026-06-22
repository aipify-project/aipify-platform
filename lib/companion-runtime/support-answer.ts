import {
  getSupportProviderManifest,
  listSupportProviderManifests,
} from "@/lib/integration-intelligence/support/registry";
import type { Translator } from "@/lib/i18n/translate";
import type { CompanionSupportContext } from "./companion-support-context";
import { filterSupportCapabilitiesForPrivacy } from "./companion-support-context";
import type { CompanionTenantContext } from "./companion-tenant-context";

export type SupportProviderMatch = {
  provider_key: string;
  capability_key: string | null;
  operation: "read" | "write" | null;
};

function normalizeSupportQuery(query: string): string {
  return query.trim().toLowerCase().replace(/\s+/g, " ");
}

export function hasSupportProviderIntent(query: string): boolean {
  const normalized = normalizeSupportQuery(query);
  return /\b(support|customer service|helpdesk|inbox|ticket|tickets|case|cases|escalat|sla|conversation|knowledge gap|proactive support|self.?support|response draft|support ai|support specialist)\b/i.test(
    normalized,
  );
}

export function hasBlockedSupportOperationIntent(query: string): boolean {
  const normalized = normalizeSupportQuery(query);
  return /\b(send response|send reply|auto.?send|close case|close ticket|delete case|delete ticket|account change|sensitive account|irreversible)\b/i.test(
    normalized,
  );
}

export function hasExternalSupportAdapterIntent(query: string): boolean {
  const normalized = normalizeSupportQuery(query);
  return /\b(external ticketing adapter|third.?party helpdesk|live zendesk|live intercom|external support api)\b/i.test(
    normalized,
  );
}

export function matchSupportProviderQuery(
  query: string,
  tenantContext: CompanionTenantContext,
): SupportProviderMatch | null {
  if (!hasSupportProviderIntent(query)) return null;

  const normalized = normalizeSupportQuery(query);
  const manifests = listSupportProviderManifests();

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
    if (normalized.includes("inbox") || normalized.includes("portal")) {
      return manifest.provider_key === "app_portal_support";
    }
    if (normalized.includes("self support") || normalized.includes("self-service")) {
      return manifest.provider_key === "self_support_engine";
    }
    if (normalized.includes("proactive") || normalized.includes("anticipatory")) {
      return manifest.provider_key === "proactive_organization_support";
    }
    if (normalized.includes("business dna") || normalized.includes("knowledge")) {
      return manifest.provider_key === "business_dna_knowledge";
    }
    if (normalized.includes("autonomous") || normalized.includes("self healing")) {
      return manifest.provider_key === "autonomous_support_operations";
    }
    if (normalized.includes("sla") || normalized.includes("metric")) {
      return manifest.capabilities.some((capability) => capability.capability_key === "sla.read");
    }
    if (normalized.includes("escalat")) {
      return manifest.capabilities.some(
        (capability) => capability.capability_key === "escalation.create",
      );
    }
    if (normalized.includes("draft")) {
      return manifest.capabilities.some(
        (capability) => capability.capability_key === "response.draft",
      );
    }
    if (normalized.includes("conversation") || normalized.includes("history")) {
      return manifest.capabilities.some(
        (capability) => capability.capability_key === "conversation.read",
      );
    }
    if (normalized.includes("case") || normalized.includes("ticket")) {
      return manifest.capabilities.some((capability) =>
        capability.capability_key.startsWith("support_case."),
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

  const writeIntent = /\b(create|assign|update|draft|escalate)\b/i.test(normalized);
  const readIntent = /\b(read|show|list|status|what|which|find|search|summary)\b/i.test(normalized);
  const operation = writeIntent ? "write" : readIntent ? "read" : null;

  const firstProvider = tenantContext.supportContext.providers[0];
  if (firstProvider) {
    return { provider_key: firstProvider.provider_key, capability_key: null, operation };
  }

  return null;
}

function resolveSupportCrossLink(
  match: SupportProviderMatch,
  supportContext: CompanionSupportContext,
): string {
  if (match.provider_key === "autonomous_support_operations") {
    return supportContext.cross_link_support_operations;
  }
  if (match.provider_key === "self_support_engine") {
    return supportContext.cross_link_self_support;
  }
  if (match.provider_key === "app_portal_support") {
    return supportContext.cross_link_app_portal;
  }
  if (match.provider_key === "proactive_organization_support") {
    return supportContext.cross_link_proactive;
  }
  if (match.provider_key === "business_dna_knowledge") {
    return supportContext.cross_link_business_dna;
  }
  return supportContext.cross_link_support_ai;
}

export function buildSupportProviderDiscoveryAnswer(
  match: SupportProviderMatch,
  supportContext: CompanionSupportContext,
  t: Translator,
): import("@/lib/companion-platform-knowledge/types").PlatformKnowledgeAnswer {
  const manifest = getSupportProviderManifest(match.provider_key);
  const providerStatus = supportContext.providers.find(
    (provider) => provider.provider_key === match.provider_key,
  );

  const statusKey = providerStatus?.implementation_status ?? "specification_only";
  const statusLabel = t(`customerApp.companionPlatformKnowledge.support.status.${statusKey}`);

  const directAnswer = t("customerApp.companionPlatformKnowledge.support.discoveryLead")
    .replace("{provider}", manifest ? t(manifest.display_name_key) : match.provider_key)
    .replace("{status}", statusLabel);

  const capabilityLines = filterSupportCapabilitiesForPrivacy(supportContext)
    .filter((capability) => capability.provider_key === match.provider_key)
    .slice(0, 6)
    .map((capability) =>
      t("customerApp.companionPlatformKnowledge.support.capabilityLine")
        .replace("{capabilityId}", capability.capability_id)
        .replace(
          "{mode}",
          t(`customerApp.companionPlatformKnowledge.support.operation.${capability.operation}`),
        ),
    )
    .join("\n");

  const governanceLines = [
    supportContext.auto_send_blocked
      ? t("customerApp.companionPlatformKnowledge.support.autoSendBlocked")
      : null,
    supportContext.case_close_blocked
      ? t("customerApp.companionPlatformKnowledge.support.caseCloseBlocked")
      : null,
    supportContext.human_oversight_required
      ? t("customerApp.companionPlatformKnowledge.support.humanOversightRequired")
      : null,
    supportContext.knowledge_gap_detection_enabled
      ? t("customerApp.companionPlatformKnowledge.support.knowledgeGapDetectionActive")
      : t("customerApp.companionPlatformKnowledge.support.knowledgeGapDetectionAvailable"),
  ]
    .filter(Boolean)
    .join("\n");

  const explanation = [
    t("customerApp.companionPlatformKnowledge.support.discoveryExplanation"),
    capabilityLines,
    governanceLines,
    providerStatus?.verified
      ? t("customerApp.companionPlatformKnowledge.support.verifiedProvider")
      : t("customerApp.companionPlatformKnowledge.support.disconnectedProvider"),
    t("customerApp.companionPlatformKnowledge.support.privacyNote"),
    t("customerApp.companionPlatformKnowledge.support.policyNote"),
  ]
    .filter(Boolean)
    .join("\n");

  return {
    directAnswer,
    explanation,
    steps: [],
    actions: [
      {
        labelKey: "customerApp.companionPlatformKnowledge.support.openSupportCenter",
        label: t("customerApp.companionPlatformKnowledge.support.openSupportCenter"),
        href: resolveSupportCrossLink(match, supportContext),
        routeKey: "supportCenter",
      },
    ],
    sources: [
      {
        id: match.provider_key,
        label: t("customerApp.companionPlatformKnowledge.support.sourceLabel"),
        kind: "customer_context",
        meta: statusKey,
      },
    ],
    sourceId: match.provider_key,
    source: "customer_context",
    confidence: providerStatus?.verified ? "moderate" : "low",
  };
}

export function buildSupportProviderUnavailableAnswer(
  t: Translator,
  supportContext: CompanionSupportContext,
): import("@/lib/companion-platform-knowledge/types").PlatformKnowledgeAnswer {
  return {
    directAnswer: t("customerApp.companionPlatformKnowledge.support.unavailableLead"),
    explanation: supportContext.permission_denied
      ? t("customerApp.companionPlatformKnowledge.support.permissionDenied")
      : supportContext.app_entitlement_blocked
        ? t("customerApp.companionPlatformKnowledge.support.entitlementBlocked")
        : t("customerApp.companionPlatformKnowledge.support.unavailableExplanation"),
    steps: [],
    actions: [],
    sources: [
      {
        id: "support-provider-unavailable",
        label: t("customerApp.companionPlatformKnowledge.support.sourceLabel"),
        kind: "customer_context",
      },
    ],
    sourceId: "support-provider-unavailable",
    source: "customer_context",
    confidence: "low",
  };
}

export function buildBlockedSupportOperationAnswer(
  t: Translator,
): import("@/lib/companion-platform-knowledge/types").PlatformKnowledgeAnswer {
  return {
    directAnswer: t("customerApp.companionPlatformKnowledge.support.blockedOperationLead"),
    explanation: t("customerApp.companionPlatformKnowledge.support.blockedOperationExplanation"),
    steps: [],
    actions: [],
    sources: [
      {
        id: "support-blocked-operation",
        label: t("customerApp.companionPlatformKnowledge.support.sourceLabel"),
        kind: "customer_context",
      },
    ],
    sourceId: "support-blocked-operation",
    source: "customer_context",
    confidence: "high",
  };
}

export function buildExternalSupportUnavailableAnswer(
  t: Translator,
): import("@/lib/companion-platform-knowledge/types").PlatformKnowledgeAnswer {
  return {
    directAnswer: t("customerApp.companionPlatformKnowledge.support.externalUnavailableLead"),
    explanation: t("customerApp.companionPlatformKnowledge.support.externalUnavailableExplanation"),
    steps: [],
    actions: [],
    sources: [
      {
        id: "support-external-unavailable",
        label: t("customerApp.companionPlatformKnowledge.support.sourceLabel"),
        kind: "customer_context",
      },
    ],
    sourceId: "support-external-unavailable",
    source: "customer_context",
    confidence: "low",
  };
}
