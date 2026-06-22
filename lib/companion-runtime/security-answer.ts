import {
  getSecurityProviderManifest,
  listSecurityProviderManifests,
} from "@/lib/integration-intelligence/security/registry";
import type { Translator } from "@/lib/i18n/translate";
import type { CompanionSecurityContext } from "./companion-security-context";
import { filterSecurityCapabilitiesForPrivacy } from "./companion-security-context";
import type { CompanionTenantContext } from "./companion-tenant-context";

export type SecurityProviderMatch = {
  provider_key: string;
  capability_key: string | null;
  operation: "read" | "write" | null;
};

function normalizeSecurityQuery(query: string): string {
  return query.trim().toLowerCase().replace(/\s+/g, " ");
}

export function hasSecurityProviderIntent(query: string): boolean {
  const normalized = normalizeSecurityQuery(query);
  return /\b(security|verification|verify|compliance|audit|access review|permission|role|2fa|two.?factor|incident|governance|trust center|risk signal|policy violation|certificate|identity access)\b/i.test(
    normalized,
  );
}

export function hasBlockedSecurityOperationIntent(query: string): boolean {
  const normalized = normalizeSecurityQuery(query);
  return /\b(auto approve identity|permanent access revocation|delete audit log|disable 2fa|disable two factor|sensitive account change|compliance decision|irreversible security)\b/i.test(
    normalized,
  );
}

export function hasExternalSecurityAdapterIntent(query: string): boolean {
  const normalized = normalizeSecurityQuery(query);
  return /\b(external security adapter|live siem sync|third.?party identity provider|external compliance adapter)\b/i.test(
    normalized,
  );
}

export function matchSecurityProviderQuery(
  query: string,
  tenantContext: CompanionTenantContext,
): SecurityProviderMatch | null {
  if (!hasSecurityProviderIntent(query)) return null;

  const normalized = normalizeSecurityQuery(query);
  const manifests = listSecurityProviderManifests();

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
    if (normalized.includes("verification") || normalized.includes("verify")) {
      return manifest.provider_key === "trust_center_verification";
    }
    if (normalized.includes("audit")) {
      return manifest.provider_key === "audit_accountability";
    }
    if (normalized.includes("incident") || normalized.includes("security event")) {
      return manifest.provider_key === "security_compliance_center";
    }
    if (normalized.includes("compliance")) {
      return manifest.capabilities.some(
        (capability) => capability.capability_key === "compliance_status.read",
      );
    }
    if (normalized.includes("access review") || normalized.includes("governance")) {
      return manifest.provider_key === "governance_management";
    }
    if (
      normalized.includes("permission") ||
      normalized.includes("role") ||
      normalized.includes("access")
    ) {
      return manifest.provider_key === "identity_access_management";
    }
    if (normalized.includes("risk")) {
      return manifest.capabilities.some(
        (capability) => capability.capability_key === "risk_signal.read",
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

  const writeIntent = /\b(create|request|start|initiate|review)\b/i.test(normalized);
  const readIntent = /\b(read|show|list|status|what|which|find|summary|who)\b/i.test(normalized);
  const operation = writeIntent ? "write" : readIntent ? "read" : null;

  const firstProvider = tenantContext.securityContext.providers[0];
  if (firstProvider) {
    return { provider_key: firstProvider.provider_key, capability_key: null, operation };
  }

  return null;
}

function resolveSecurityCrossLink(
  match: SecurityProviderMatch,
  securityContext: CompanionSecurityContext,
): string {
  if (match.provider_key === "trust_center_verification") {
    return securityContext.cross_link_trust;
  }
  if (match.provider_key === "identity_access_management") {
    return securityContext.cross_link_identity_access;
  }
  if (match.provider_key === "security_compliance_center") {
    return securityContext.cross_link_security;
  }
  if (match.provider_key === "audit_accountability") {
    return securityContext.cross_link_audit;
  }
  if (match.provider_key === "governance_management") {
    return securityContext.cross_link_governance;
  }
  return securityContext.cross_link_security;
}

export function buildSecurityProviderDiscoveryAnswer(
  match: SecurityProviderMatch,
  securityContext: CompanionSecurityContext,
  t: Translator,
): import("@/lib/companion-platform-knowledge/types").PlatformKnowledgeAnswer {
  const manifest = getSecurityProviderManifest(match.provider_key);
  const providerStatus = securityContext.providers.find(
    (provider) => provider.provider_key === match.provider_key,
  );

  const statusKey = providerStatus?.implementation_status ?? "specification_only";
  const statusLabel = t(`customerApp.companionPlatformKnowledge.security.status.${statusKey}`);

  const directAnswer = t("customerApp.companionPlatformKnowledge.security.discoveryLead")
    .replace("{provider}", manifest ? t(manifest.display_name_key) : match.provider_key)
    .replace("{status}", statusLabel);

  const capabilityLines = filterSecurityCapabilitiesForPrivacy(securityContext)
    .filter((capability) => capability.provider_key === match.provider_key)
    .slice(0, 6)
    .map((capability) =>
      t("customerApp.companionPlatformKnowledge.security.capabilityLine")
        .replace("{capabilityId}", capability.capability_id)
        .replace(
          "{mode}",
          t(`customerApp.companionPlatformKnowledge.security.operation.${capability.operation}`),
        ),
    )
    .join("\n");

  const governanceLines = [
    securityContext.identity_auto_approve_blocked
      ? t("customerApp.companionPlatformKnowledge.security.identityAutoApproveBlocked")
      : null,
    securityContext.permanent_access_revocation_blocked
      ? t("customerApp.companionPlatformKnowledge.security.permanentAccessRevocationBlocked")
      : null,
    securityContext.audit_log_deletion_blocked
      ? t("customerApp.companionPlatformKnowledge.security.auditLogDeletionBlocked")
      : null,
    securityContext.tfa_disable_blocked
      ? t("customerApp.companionPlatformKnowledge.security.tfaDisableBlocked")
      : null,
    securityContext.sensitive_documents_masked
      ? t("customerApp.companionPlatformKnowledge.security.sensitiveDocumentsMasked")
      : null,
    securityContext.secrets_and_auth_data_filtered
      ? t("customerApp.companionPlatformKnowledge.security.secretsAndAuthDataFiltered")
      : null,
    securityContext.role_based_access_active
      ? t("customerApp.companionPlatformKnowledge.security.roleBasedAccessActive")
      : null,
    securityContext.command_brief_events_linked
      ? t("customerApp.companionPlatformKnowledge.security.commandBriefEventsLinked")
      : t("customerApp.companionPlatformKnowledge.security.commandBriefEventsAvailable"),
  ]
    .filter(Boolean)
    .join("\n");

  const explanation = [
    t("customerApp.companionPlatformKnowledge.security.discoveryExplanation"),
    capabilityLines,
    governanceLines,
    providerStatus?.verified
      ? t("customerApp.companionPlatformKnowledge.security.verifiedProvider")
      : t("customerApp.companionPlatformKnowledge.security.disconnectedProvider"),
    t("customerApp.companionPlatformKnowledge.security.privacyNote"),
    t("customerApp.companionPlatformKnowledge.security.policyNote"),
  ]
    .filter(Boolean)
    .join("\n");

  return {
    directAnswer,
    explanation,
    steps: [],
    actions: [
      {
        labelKey: "customerApp.companionPlatformKnowledge.security.openSecurityCenter",
        label: t("customerApp.companionPlatformKnowledge.security.openSecurityCenter"),
        href: resolveSecurityCrossLink(match, securityContext),
        routeKey: "appSecurity",
      },
    ],
    sources: [
      {
        id: match.provider_key,
        label: t("customerApp.companionPlatformKnowledge.security.sourceLabel"),
        kind: "customer_context",
        meta: statusKey,
      },
    ],
    sourceId: match.provider_key,
    source: "customer_context",
    confidence: providerStatus?.verified ? "moderate" : "low",
  };
}

export function buildSecurityProviderUnavailableAnswer(
  t: Translator,
  securityContext: CompanionSecurityContext,
): import("@/lib/companion-platform-knowledge/types").PlatformKnowledgeAnswer {
  return {
    directAnswer: t("customerApp.companionPlatformKnowledge.security.unavailableLead"),
    explanation: securityContext.permission_denied
      ? t("customerApp.companionPlatformKnowledge.security.permissionDenied")
      : securityContext.app_entitlement_blocked
        ? t("customerApp.companionPlatformKnowledge.security.entitlementBlocked")
        : t("customerApp.companionPlatformKnowledge.security.unavailableExplanation"),
    steps: [],
    actions: [],
    sources: [
      {
        id: "security-provider-unavailable",
        label: t("customerApp.companionPlatformKnowledge.security.sourceLabel"),
        kind: "customer_context",
      },
    ],
    sourceId: "security-provider-unavailable",
    source: "customer_context",
    confidence: "low",
  };
}

export function buildBlockedSecurityOperationAnswer(
  t: Translator,
): import("@/lib/companion-platform-knowledge/types").PlatformKnowledgeAnswer {
  return {
    directAnswer: t("customerApp.companionPlatformKnowledge.security.blockedOperationLead"),
    explanation: t("customerApp.companionPlatformKnowledge.security.blockedOperationExplanation"),
    steps: [],
    actions: [],
    sources: [
      {
        id: "security-blocked-operation",
        label: t("customerApp.companionPlatformKnowledge.security.sourceLabel"),
        kind: "customer_context",
      },
    ],
    sourceId: "security-blocked-operation",
    source: "customer_context",
    confidence: "high",
  };
}

export function buildExternalSecurityUnavailableAnswer(
  t: Translator,
): import("@/lib/companion-platform-knowledge/types").PlatformKnowledgeAnswer {
  return {
    directAnswer: t("customerApp.companionPlatformKnowledge.security.externalUnavailableLead"),
    explanation: t("customerApp.companionPlatformKnowledge.security.externalUnavailableExplanation"),
    steps: [],
    actions: [],
    sources: [
      {
        id: "security-external-unavailable",
        label: t("customerApp.companionPlatformKnowledge.security.sourceLabel"),
        kind: "customer_context",
      },
    ],
    sourceId: "security-external-unavailable",
    source: "customer_context",
    confidence: "low",
  };
}
