import type { CustomerActiveLocale } from "@/lib/i18n/customer-active-locale-registry";
import type { Translator } from "@/lib/i18n/translate";
import type { PlatformKnowledgeAnswer, PlatformSearchResult } from "@/lib/companion-platform-knowledge/types";
import type { CompanionConversationSemanticContext } from "@/lib/integration-intelligence/semantic/types";
import { listCommunityProviderManifests } from "@/lib/integration-intelligence/community/registry";
import {
  buildBlockedCommunityOperationAnswer,
  buildCommunityProviderDiscoveryAnswer,
  buildCommunityProviderUnavailableAnswer,
  buildExternalCommunityUnavailableAnswer,
  hasBlockedCommunityOperationIntent,
  hasCommunityProviderIntent,
  hasExternalCommunityAdapterIntent,
  matchCommunityProviderQuery,
} from "./community-answer";
import { resolveCommunityProviderAdapterGroundedAnswer } from "./community-provider-adapter-answer";
import {
  buildSemanticOutcomeAnswer,
  updateConversationSemanticContext,
} from "./companion-semantic-outcome";
import { resolveCompanionSemanticQuery } from "./companion-semantic-resolver";
import type { CompanionTenantContext } from "./companion-tenant-context";

function preferredCommunityProviderKeys(
  communityContext: CompanionTenantContext["communityContext"],
): string[] {
  const adapterKeys =
    communityContext.external_provider_adapters
      ?.filter((entry) => entry.activation.status === "active" || entry.activation.status === "activating")
      .map((entry) => entry.provider_key) ?? [];
  const providerKeys = communityContext.providers.map((provider) => provider.provider_key);
  return [...new Set([...adapterKeys, ...providerKeys])];
}

function manifestsForTenant(tenantContext: CompanionTenantContext) {
  const manifests = listCommunityProviderManifests();
  const preferred = preferredCommunityProviderKeys(tenantContext.communityContext);
  if (preferred.length > 0) {
    return manifests.filter((manifest) => preferred.includes(manifest.provider_key));
  }

  const activeBusinessPacks = tenantContext.activeBusinessPacks ?? [];
  const connectedProviders = tenantContext.connectedProviders ?? [];
  if (activeBusinessPacks.length === 0 && connectedProviders.length === 0) {
    return [];
  }

  return manifests.filter(
    (manifest) =>
      manifest.business_pack_key == null ||
      activeBusinessPacks.includes(manifest.business_pack_key),
  );
}

function resolveCommunityPermissionOutcome(
  tenantContext: CompanionTenantContext,
  capabilityKey: string | null,
): "allowed" | "denied" | "disabled" | "activating" {
  if (tenantContext.communityContext.permission_denied || tenantContext.communityContext.app_entitlement_blocked) {
    return "disabled";
  }

  const overlay = tenantContext.communityContext.external_provider_adapters?.[0];
  if (overlay?.activation.status === "activating") return "activating";
  if (overlay?.activation.status === "disabled") return "disabled";

  if (!capabilityKey) return "allowed";
  const capability = tenantContext.communityContext.capabilities.find(
    (entry) => entry.capability_key === capabilityKey,
  );
  if (capability && !capability.enabled) return "denied";
  return "allowed";
}

/** Shared community provider Companion query path — same branch as orchestrateCompanionSearch. */
export function resolveCommunityCompanionQuery(
  query: string,
  t: Translator,
  tenantContext: CompanionTenantContext,
  activeLocale: CustomerActiveLocale,
  conversation?: CompanionConversationSemanticContext | null,
): PlatformSearchResult | null {
  if (hasBlockedCommunityOperationIntent(query)) {
    return {
      answer: buildBlockedCommunityOperationAnswer(t),
    };
  }

  if (!hasCommunityProviderIntent(query)) {
    return null;
  }

  const tenantManifests = manifestsForTenant(tenantContext);
  const resolved = resolveCompanionSemanticQuery({
    query,
    locale: activeLocale,
    manifests: tenantManifests,
    conversation,
    preferredProviderKeys: preferredCommunityProviderKeys(tenantContext.communityContext),
  });

  if (resolved.outcome === "intent_ambiguous") {
    const clarification = buildSemanticOutcomeAnswer(resolved, t);
    if (clarification) {
      return { answer: clarification };
    }
  }

  if (tenantContext.communityContext.permission_denied) {
    return {
      answer: buildCommunityProviderUnavailableAnswer(t, tenantContext.communityContext),
    };
  }

  if (
    hasExternalCommunityAdapterIntent(query, tenantContext.communityContext) &&
    !tenantContext.communityContext.external_provider_adapters?.length
  ) {
    return {
      answer: buildExternalCommunityUnavailableAnswer(t),
    };
  }

  const permissionOutcome = resolveCommunityPermissionOutcome(
    tenantContext,
    resolved.capability_key,
  );
  if (permissionOutcome === "denied") {
    const denied = buildSemanticOutcomeAnswer(
      { ...resolved, outcome: "intent_resolved_permission_denied" },
      t,
    );
    if (denied) return { answer: denied };
  }
  if (permissionOutcome === "activating") {
    const pending = buildSemanticOutcomeAnswer(
      { ...resolved, outcome: "intent_resolved_activation_pending" },
      t,
    );
    if (pending) return { answer: pending };
  }

  const match = matchCommunityProviderQuery(query, tenantContext, activeLocale, conversation);
  if (!match) {
    if (resolved.outcome === "intent_unresolved") {
      const unresolved = buildSemanticOutcomeAnswer(resolved, t);
      if (unresolved) return { answer: unresolved };
    }
    return {
      answer: buildCommunityProviderUnavailableAnswer(t, tenantContext.communityContext),
    };
  }

  const grounded = resolveCommunityProviderAdapterGroundedAnswer(
    match,
    tenantContext.communityContext,
    t,
    activeLocale,
  );
  if (grounded) {
    return { answer: grounded };
  }

  return {
    answer: buildCommunityProviderDiscoveryAnswer(match, tenantContext.communityContext, t),
  };
}

export function extractCommunityCompanionAnswerMetadata(answer: PlatformKnowledgeAnswer): {
  source_reference: string | null;
  confidence: string;
  has_customer_context_source: boolean;
} {
  const primarySource = answer.sources[0];
  return {
    source_reference: answer.sourceId ?? primarySource?.id ?? null,
    confidence: answer.confidence,
    has_customer_context_source: answer.source === "customer_context" || primarySource?.kind === "customer_context",
  };
}

export { updateConversationSemanticContext };
