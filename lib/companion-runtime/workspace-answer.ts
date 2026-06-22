import {
  getWorkspaceProviderManifest,
  listWorkspaceProviderManifests,
} from "@/lib/integration-intelligence/workspace/registry";
import type { Translator } from "@/lib/i18n/translate";
import type { CompanionWorkspaceContext } from "./companion-workspace-context";
import { filterWorkspaceCapabilitiesForPrivacy } from "./companion-workspace-context";
import type { CompanionTenantContext } from "./companion-tenant-context";

export type WorkspaceProviderMatch = {
  provider_key: string;
  capability_key: string | null;
  operation: "read" | "write" | null;
};

function normalizeWorkspaceQuery(query: string): string {
  return query.trim().toLowerCase().replace(/\s+/g, " ");
}

export function hasWorkspaceProviderIntent(query: string): boolean {
  const normalized = normalizeWorkspaceQuery(query);
  return /\b(email|inbox|draft|reply|calendar|appointment|appointments|task|tasks|contact|contacts|document|documents|file search|search files|print|printing|notification|notifications|workspace|scheduling|schedule|meeting|meetings)\b/i.test(
    normalized,
  );
}

export function hasExternalWorkspaceConnectorIntent(query: string): boolean {
  const normalized = normalizeWorkspaceQuery(query);
  return /\b(cloud storage|external inbox|external calendar|workspace sync|third.?party connector|oauth mailbox)\b/i.test(
    normalized,
  );
}

export function matchWorkspaceProviderQuery(
  query: string,
  tenantContext: CompanionTenantContext,
): WorkspaceProviderMatch | null {
  if (!hasWorkspaceProviderIntent(query)) return null;

  const normalized = normalizeWorkspaceQuery(query);
  const manifests = listWorkspaceProviderManifests();

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
    if (normalized.includes("calendar") || normalized.includes("appointment") || normalized.includes("meeting")) {
      return manifest.capabilities.some((capability) => capability.capability_key.startsWith("calendar."));
    }
    if (normalized.includes("task")) {
      return manifest.capabilities.some((capability) => capability.capability_key.startsWith("task."));
    }
    if (normalized.includes("email") || normalized.includes("draft") || normalized.includes("inbox")) {
      return manifest.capabilities.some((capability) => capability.capability_key.startsWith("email."));
    }
    if (normalized.includes("document") || normalized.includes("file")) {
      return manifest.capabilities.some((capability) =>
        ["document.", "file."].some((prefix) => capability.capability_key.startsWith(prefix)),
      );
    }
    if (normalized.includes("notification")) {
      return manifest.capabilities.some((capability) => capability.capability_key.startsWith("notification."));
    }
    if (normalized.includes("print")) {
      return manifest.provider_key === "print_output";
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

  const writeIntent = /\b(send|draft|create|schedule|print|assign|update|book)\b/i.test(normalized);
  const readIntent = /\b(read|show|list|status|what|which|search|find)\b/i.test(normalized);
  const operation = writeIntent ? "write" : readIntent ? "read" : null;

  const firstProvider = tenantContext.workspaceContext.providers[0];
  if (firstProvider) {
    return { provider_key: firstProvider.provider_key, capability_key: null, operation };
  }

  return null;
}

function resolveWorkspaceCrossLink(
  match: WorkspaceProviderMatch,
  workspaceContext: CompanionWorkspaceContext,
): string {
  if (match.provider_key.includes("calendar")) {
    return match.provider_key.includes("context")
      ? workspaceContext.cross_link_context
      : workspaceContext.cross_link_calendar;
  }
  if (match.provider_key.includes("task")) return workspaceContext.cross_link_tasks;
  if (match.provider_key.includes("document") || match.provider_key === "print_output") {
    return workspaceContext.cross_link_documents;
  }
  if (match.provider_key === "universal_search") return workspaceContext.cross_link_search;
  if (match.provider_key.includes("email")) return workspaceContext.cross_link_support_email;
  return workspaceContext.cross_link_calendar;
}

export function buildWorkspaceProviderDiscoveryAnswer(
  match: WorkspaceProviderMatch,
  workspaceContext: CompanionWorkspaceContext,
  t: Translator,
): import("@/lib/companion-platform-knowledge/types").PlatformKnowledgeAnswer {
  const manifest = getWorkspaceProviderManifest(match.provider_key);
  const providerStatus = workspaceContext.providers.find(
    (provider) => provider.provider_key === match.provider_key,
  );

  const statusKey = providerStatus?.implementation_status ?? "specification_only";
  const statusLabel = t(`customerApp.companionPlatformKnowledge.workspace.status.${statusKey}`);

  const directAnswer = t("customerApp.companionPlatformKnowledge.workspace.discoveryLead")
    .replace("{provider}", manifest ? t(manifest.display_name_key) : match.provider_key)
    .replace("{status}", statusLabel);

  const capabilityLines = filterWorkspaceCapabilitiesForPrivacy(workspaceContext)
    .filter((capability) => capability.provider_key === match.provider_key)
    .slice(0, 6)
    .map((capability) =>
      t("customerApp.companionPlatformKnowledge.workspace.capabilityLine")
        .replace("{capabilityId}", capability.capability_id)
        .replace(
          "{mode}",
          t(`customerApp.companionPlatformKnowledge.workspace.operation.${capability.operation}`),
        ),
    )
    .join("\n");

  const explanation = [
    t("customerApp.companionPlatformKnowledge.workspace.discoveryExplanation"),
    capabilityLines,
    providerStatus?.verified
      ? t("customerApp.companionPlatformKnowledge.workspace.verifiedProvider")
      : t("customerApp.companionPlatformKnowledge.workspace.disconnectedProvider"),
    t("customerApp.companionPlatformKnowledge.workspace.privacyNote"),
    t("customerApp.companionPlatformKnowledge.workspace.policyNote"),
  ]
    .filter(Boolean)
    .join("\n");

  return {
    directAnswer,
    explanation,
    steps: [],
    actions: [
      {
        labelKey: "customerApp.companionPlatformKnowledge.workspace.openWorkspaceCenter",
        label: t("customerApp.companionPlatformKnowledge.workspace.openWorkspaceCenter"),
        href: resolveWorkspaceCrossLink(match, workspaceContext),
        routeKey: "workspaceCenter",
      },
    ],
    sources: [
      {
        id: match.provider_key,
        label: t("customerApp.companionPlatformKnowledge.workspace.sourceLabel"),
        kind: "customer_context",
        meta: statusKey,
      },
    ],
    sourceId: match.provider_key,
    source: "customer_context",
    confidence: providerStatus?.verified ? "moderate" : "low",
  };
}

export function buildWorkspaceProviderUnavailableAnswer(
  t: Translator,
  workspaceContext: CompanionWorkspaceContext,
): import("@/lib/companion-platform-knowledge/types").PlatformKnowledgeAnswer {
  return {
    directAnswer: t("customerApp.companionPlatformKnowledge.workspace.unavailableLead"),
    explanation: workspaceContext.permission_denied
      ? t("customerApp.companionPlatformKnowledge.workspace.permissionDenied")
      : workspaceContext.app_entitlement_blocked
        ? t("customerApp.companionPlatformKnowledge.workspace.entitlementBlocked")
        : t("customerApp.companionPlatformKnowledge.workspace.unavailableExplanation"),
    steps: [],
    actions: [],
    sources: [
      {
        id: "workspace-provider-unavailable",
        label: t("customerApp.companionPlatformKnowledge.workspace.sourceLabel"),
        kind: "customer_context",
      },
    ],
    sourceId: "workspace-provider-unavailable",
    source: "customer_context",
    confidence: "low",
  };
}

export function buildExternalWorkspaceUnavailableAnswer(
  t: Translator,
): import("@/lib/companion-platform-knowledge/types").PlatformKnowledgeAnswer {
  return {
    directAnswer: t("customerApp.companionPlatformKnowledge.workspace.externalUnavailableLead"),
    explanation: t("customerApp.companionPlatformKnowledge.workspace.externalUnavailableExplanation"),
    steps: [],
    actions: [],
    sources: [
      {
        id: "workspace-external-unavailable",
        label: t("customerApp.companionPlatformKnowledge.workspace.sourceLabel"),
        kind: "customer_context",
      },
    ],
    sourceId: "workspace-external-unavailable",
    source: "customer_context",
    confidence: "low",
  };
}
