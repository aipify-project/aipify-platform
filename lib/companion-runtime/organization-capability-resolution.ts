import type { CustomerActiveLocale } from "@/lib/i18n/customer-active-locale-registry";
import { normalizeIntegrationQuery } from "@/lib/integration-intelligence/normalize-text";
import {
  resolveAuthorizationTargetFromQuery,
  shouldBlockOrganizationCapabilityRoute,
  hasOrganizationMemberDomainSignal,
  hasExplicitOrganizationMemberCountSignal,
} from "@/lib/core/authorization-target";
import { blocksOrganizationMemberCapabilityQuery } from "./companion-explicit-intent";
import { getSupportSourceDefinition } from "@/lib/integration-intelligence/providers/support-operations/support-source-map";
import { isCommunityMemberDirectoryReadSourceConnected } from "@/lib/integration-intelligence/providers/community-member-directory/community-member-directory-source-map";
import { isMemberVerificationReadSourceConnected } from "@/lib/integration-intelligence/providers/member-verification/member-verification-source-map";
import { resolveCompanionSemanticIntent } from "./companion-semantic-query-match";
import { resolveSupportSemanticIntent } from "./support-semantic-intent";
import { resolveVerificationSemanticIntent, collectVerificationDescriptorsFromManifests } from "./verification-semantic-intent";
import { listCommunityProviderManifests } from "@/lib/integration-intelligence/community/registry";
import {
  collectOrganizationSemanticDescriptors,
  findOrganizationCapabilityByKey,
  type OrganizationCapabilityModuleId,
} from "./organization-capability-registry";

export type OrganizationExecutionKind =
  | "member_count"
  | "member_active_list"
  | "member_detail_list"
  | "member_pending_verification"
  | "member_verification_status"
  | "support_sla"
  | "prioritize_today";

export type OrganizationCapabilityRoute = {
  module_id: OrganizationCapabilityModuleId;
  capability_key: string;
  provider_key: string;
  execution_kind: OrganizationExecutionKind;
  member_reference: string | null;
  confidence: "high" | "moderate" | "low";
  resolution_source: "manifest_schema" | "domain_semantic";
};

export type OrganizationReadinessStatus =
  | "production_ready_candidate"
  | "source_connected"
  | "adapter_missing"
  | "permission_required"
  | "source_unavailable"
  | "activation_pending";

export type OrganizationCapabilityReadiness = {
  status: OrganizationReadinessStatus;
  source_reference: string | null;
  provider_active: boolean;
};

function extractMemberReference(originalQuery: string, normalized: string): string | null {
  const bracket = originalQuery.match(/\[([^\]]{2,60})\]/);
  if (bracket?.[1]) return bracket[1].trim();

  const erMedlem = normalized.match(/\b(?:er medlem(?:et)?|is member)\s+([a-z0-9_@.-]{2,60})/i);
  if (erMedlem?.[1]) return erMedlem[1].trim();

  return null;
}

function wantsMemberDetailFields(normalized: string): boolean {
  return (
    /\b(brukernavn|username|member id|medlems-?id|medlemsnummer|status)\b/i.test(normalized) &&
    /\b(medlem|member|vis|show|list)\b/i.test(normalized)
  );
}

function wantsVerifiedMembers(normalized: string): boolean {
  return /\b(verifiserte medlemmer|verified members|medlemmer.*verifisert)\b/i.test(normalized);
}

function wantsPendingVerification(normalized: string): boolean {
  return (
    /\b(venter.*verifisering|pending verification|waiting for verification|ubehandlet verifisering)\b/i.test(
      normalized,
    ) || (/\b(medlem|member)\b/i.test(normalized) && /\b(venter|pending|waiting)\b/i.test(normalized))
  );
}

function wantsMemberVerificationStatus(originalQuery: string, normalized: string): boolean {
  const reference = extractMemberReference(originalQuery, normalized);
  if (reference && /\b(verifisert|verified|verification)\b/i.test(normalized)) return true;
  return (
    /\b(er medlem|is member)\b/i.test(normalized) &&
    /\b(verifisert|verified|verification)\b/i.test(normalized)
  );
}

function wantsSupportSla(normalized: string): boolean {
  const hasSupport =
    /\b(support(?:sak(?:er)?|saker)?|supportsak(?:er)?|supportk(?:ø|o)|sak(?:er)?|case|ticket|ärende|sag)\b/i.test(
      normalized,
    );
  const hasSla = /\b(sla|nærmer|breach|brutt|risiko|risk|deadline|termin)\b/i.test(normalized);
  return hasSupport && hasSla;
}

function wantsPrioritizeToday(normalized: string): boolean {
  return /\b(prioriter|prioritize|prioritet|focus today|hva bør|what should i)\b/i.test(normalized);
}

function mapSemanticToExecutionKind(input: {
  query: string;
  normalized: string;
  capabilityKey: string;
  operation: string | null;
  metric: string | null;
}): OrganizationExecutionKind | null {
  const { query, normalized, capabilityKey, operation, metric } = input;

  if (capabilityKey === "command_brief.prioritize" || wantsPrioritizeToday(normalized)) {
    return "prioritize_today";
  }

  if (capabilityKey === "support_sla.read" || wantsSupportSla(normalized)) {
    return "support_sla";
  }

  if (capabilityKey.startsWith("verification") || wantsPendingVerification(normalized)) {
    if (wantsMemberVerificationStatus(query, normalized)) {
      return "member_verification_status";
    }
    if (wantsPendingVerification(normalized)) {
      return "member_pending_verification";
    }
  }

  if (capabilityKey === "member.search" || /\b(medlem|member)\b/i.test(normalized)) {
    if (hasExplicitOrganizationMemberCountSignal(query)) {
      return "member_count";
    }
    if (wantsMemberVerificationStatus(query, normalized)) {
      return "member_verification_status";
    }
    if (wantsPendingVerification(normalized)) {
      return "member_pending_verification";
    }
    if (wantsMemberDetailFields(normalized)) {
      return "member_detail_list";
    }
    if (metric === "active" || operation === "list" && /\b(aktiv|active)\b/i.test(normalized)) {
      return "member_active_list";
    }
    if (
      operation === "count" ||
      metric === "total" ||
      /\b(hvor mange|how many|antall)\b/i.test(normalized)
    ) {
      if (
        !hasOrganizationMemberDomainSignal(normalized) &&
        !hasExplicitOrganizationMemberCountSignal(query)
      ) {
        return null;
      }
      return "member_count";
    }
    if (operation === "list" || metric === "list" || /\b(vis|show|list|hvilke)\b/i.test(normalized)) {
      return wantsVerifiedMembers(normalized) ? "member_active_list" : "member_detail_list";
    }
  }

  return null;
}

function isOrganizationNavigationHelpQuery(normalized: string): boolean {
  return (
    /\b(hvor finner|hvor ligger|where (?:do i|can i) find|how (?:do i|to) (?:find|open|access)|finn(?:e)? i appen|in the app|in appen)\b/i.test(
      normalized,
    ) && !/\b(hvor mange|how many|antall)\b/i.test(normalized)
  );
}

/** Manifest-driven organization capability resolution — Core maps intent only. */
export function resolveOrganizationCapabilityRoute(
  query: string,
  locale: CustomerActiveLocale,
): OrganizationCapabilityRoute | null {
  const normalized = normalizeIntegrationQuery(query);
  if (!normalized.trim()) return null;
  if (blocksOrganizationMemberCapabilityQuery(query)) return null;
  if (shouldBlockOrganizationCapabilityRoute(query)) return null;
  const authorizationTarget = resolveAuthorizationTargetFromQuery(query, locale);
  if (
    authorizationTarget?.ownership === "user_owned_account" ||
    authorizationTarget?.ownership === "local_device_permission"
  ) {
    return null;
  }
  if (isOrganizationNavigationHelpQuery(normalized)) return null;

  const descriptors = collectOrganizationSemanticDescriptors();
  const semanticIntent = resolveCompanionSemanticIntent({
    query,
    descriptors,
    locale,
  });

  const verificationIntent = resolveVerificationSemanticIntent({
    query,
    locale,
    descriptors: collectVerificationDescriptorsFromManifests(listCommunityProviderManifests()),
  });

  const supportIntent = resolveSupportSemanticIntent({ query, locale });

  let capabilityKey =
    semanticIntent.capability_candidates[0] ??
    verificationIntent.capability_key ??
    supportIntent.capability_key ??
    null;

  if (wantsPrioritizeToday(normalized)) {
    capabilityKey = "command_brief.prioritize";
  } else if (wantsSupportSla(normalized)) {
    capabilityKey = "support_sla.read";
  } else if (wantsPendingVerification(normalized) || wantsMemberVerificationStatus(query, normalized)) {
    capabilityKey = capabilityKey ?? "verification_queue.read";
  }

  const capability =
    (capabilityKey ? findOrganizationCapabilityByKey(capabilityKey) : null) ??
    (capabilityKey === "verification_case.read"
      ? findOrganizationCapabilityByKey("verification_queue.read")
      : null) ??
    (capabilityKey === "support_queue.read" && wantsSupportSla(normalized)
      ? findOrganizationCapabilityByKey("support_sla.read")
      : null);

  const executionKind = mapSemanticToExecutionKind({
    query,
    normalized,
    capabilityKey: capabilityKey ?? "",
    operation: semanticIntent.operation,
    metric: semanticIntent.metric,
  });

  if (!executionKind) return null;

  const moduleId =
    executionKind === "prioritize_today"
      ? "organization.priority_signals"
      : executionKind === "support_sla"
        ? "support.sla"
        : executionKind === "member_verification_status" || executionKind === "member_pending_verification"
          ? "verification.member"
          : "directory.community_member";

  const resolvedCapability =
    findOrganizationCapabilityByKey(
      moduleId === "organization.priority_signals"
        ? "command_brief.prioritize"
        : moduleId === "support.sla"
          ? "support_sla.read"
          : moduleId === "verification.member"
            ? "verification_queue.read"
            : "member.search",
    ) ?? capability;

  if (!resolvedCapability) return null;

  const confidence =
    semanticIntent.confidence === "high" ||
    verificationIntent.confidence === "high" ||
    supportIntent.confidence === "high"
      ? "high"
      : semanticIntent.confidence === "moderate" ||
          verificationIntent.confidence === "moderate" ||
          supportIntent.confidence === "moderate"
        ? "moderate"
        : "low";

  const explicitMatch =
    wantsPrioritizeToday(normalized) ||
    wantsSupportSla(normalized) ||
    wantsPendingVerification(normalized) ||
    wantsMemberVerificationStatus(query, normalized) ||
    wantsMemberDetailFields(normalized) ||
    hasExplicitOrganizationMemberCountSignal(query) ||
    /\b(hvor mange|how many|antall|medlemstall|member count|how many members)\b/i.test(normalized);

  if (confidence === "low" && !explicitMatch) {
    return null;
  }

  return {
    module_id: resolvedCapability.module_id,
    capability_key: resolvedCapability.capability_key,
    provider_key: resolvedCapability.provider_key,
    execution_kind: executionKind,
    member_reference: extractMemberReference(query, normalized),
    confidence,
    resolution_source:
      verificationIntent.confidence !== "low" || supportIntent.confidence !== "low"
        ? "domain_semantic"
        : "manifest_schema",
  };
}

export function assessOrganizationCapabilityReadiness(route: OrganizationCapabilityRoute): OrganizationCapabilityReadiness {
  switch (route.module_id) {
    case "directory.community_member": {
      const connected = isCommunityMemberDirectoryReadSourceConnected("member.search");
      return {
        status: connected ? "production_ready_candidate" : "adapter_missing",
        source_reference: "get_customer_member_directory_center",
        provider_active: connected,
      };
    }
    case "verification.member": {
      const connected = isMemberVerificationReadSourceConnected("verification_queue.read");
      return {
        status: connected ? "production_ready_candidate" : "adapter_missing",
        source_reference: "get_customer_member_verification_center",
        provider_active: connected,
      };
    }
    case "support.sla":
    case "support.case": {
      const definition = getSupportSourceDefinition("support_sla.read");
      const connected = definition?.status === "live" && definition.read_only;
      return {
        status: connected ? "production_ready_candidate" : "adapter_missing",
        source_reference: "get_customer_support_operations_center",
        provider_active: Boolean(connected),
      };
    }
    case "organization.priority_signals":
      return {
        status: "production_ready_candidate",
        source_reference: "command_brief_bundle",
        provider_active: true,
      };
    default:
      return {
        status: "source_unavailable",
        source_reference: null,
        provider_active: false,
      };
  }
}

export function isOrganizationCapabilityQuery(query: string, locale: CustomerActiveLocale = "en"): boolean {
  return resolveOrganizationCapabilityRoute(query, locale) !== null;
}
