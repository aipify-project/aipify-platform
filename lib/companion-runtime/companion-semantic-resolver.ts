import { randomUUID } from "node:crypto";
import { normalizeIntegrationQuery } from "@/lib/integration-intelligence/normalize-text";
import type { CustomerActiveLocale } from "@/lib/i18n/customer-active-locale-registry";
import type {
  CompanionConversationSemanticContext,
  CompanionResolvedIntent,
  CompanionSemanticCapabilityDescriptor,
} from "@/lib/integration-intelligence/semantic/types";
import type { CommunityProviderManifest } from "@/lib/integration-intelligence/community/types";
import {
  COMPANION_SEMANTIC_FALLBACK_ORDER,
  type CompanionSemanticFallbackStage,
} from "./companion-semantic-policy";
import {
  collectSemanticDescriptorsFromManifests,
  resolveCompanionSemanticIntent,
  resolveRequestedMetricFromDescriptor,
} from "./companion-semantic-query-match";

const COMMUNITY_DOMAIN_ENTITIES = new Set([
  "member",
  "membership",
  "activity",
  "engagement",
  "moderation_queue",
  "report",
  "verification_status",
  "listing",
  "reward",
  "referral",
]);

function inferDomain(entity: string | null, descriptor: CompanionSemanticCapabilityDescriptor | null): string | null {
  if (descriptor?.domain) return descriptor.domain;
  if (!entity) return null;
  if (COMMUNITY_DOMAIN_ENTITIES.has(entity)) return "community";
  return null;
}

function findDescriptorForCapability(
  descriptors: readonly CompanionSemanticCapabilityDescriptor[],
  capabilityKey: string | null,
): CompanionSemanticCapabilityDescriptor | null {
  if (!capabilityKey) return null;
  return descriptors.find((entry) => entry.capability_key === capabilityKey) ?? null;
}

function findProviderForCapability(input: {
  manifests: readonly CommunityProviderManifest[];
  capabilityKey: string;
  preferredProviderKeys: readonly string[];
}): string | null {
  for (const providerKey of input.preferredProviderKeys) {
    const manifest = input.manifests.find((entry) => entry.provider_key === providerKey);
    if (manifest?.capabilities.some((capability) => capability.capability_key === input.capabilityKey)) {
      return providerKey;
    }
  }

  for (const manifest of input.manifests) {
    if (manifest.capabilities.some((capability) => capability.capability_key === input.capabilityKey)) {
      return manifest.provider_key;
    }
  }

  return null;
}

function entityExplicitlyMatched(input: {
  normalized: string;
  descriptor: CompanionSemanticCapabilityDescriptor | null;
  locale: CustomerActiveLocale;
}): boolean {
  if (!input.descriptor) return false;
  const aliases = [
    input.descriptor.entity.replace(/_/g, " "),
    ...(input.descriptor.entity_aliases?.[input.locale] ?? []),
    ...(input.descriptor.entity_aliases?.en ?? []),
  ];
  return aliases.some((alias) => aliasMatchesNormalized(alias, input.normalized));
}

function aliasMatchesNormalized(alias: string, normalized: string): boolean {
  const normalizedAlias = normalizeIntegrationQuery(alias);
  if (!normalizedAlias) return false;
  if (normalized.includes(normalizedAlias)) return true;
  const aliasTokens = normalizedAlias.split(" ").filter(Boolean);
  const queryTokens = normalized.split(" ").filter(Boolean);
  for (const aliasToken of aliasTokens) {
    if (queryTokens.includes(aliasToken)) return true;
  }
  return false;
}

function isBareCountQuery(normalized: string): boolean {
  return (
    /^(how many|hvor mange|hvor mangen|antall|count)\s+(do we have|har vi)\s*(now|nå|na)?[?.!]*$/.test(
      normalized,
    ) ||
    /^(how many|hvor mange|hvor mangen|antall|count)\s+(now|nå|na)[?.!]*$/.test(normalized)
  );
}

function resolveFallbackStage(input: {
  query: string;
  manifests: readonly CommunityProviderManifest[];
  locale: CustomerActiveLocale;
  preferredProviderKeys: readonly string[];
}): { stage: CompanionSemanticFallbackStage; provider_key: string | null; capability_key: string | null } | null {
  const normalized = normalizeIntegrationQuery(input.query);

  for (const manifest of input.manifests) {
    for (const capability of manifest.capabilities) {
      const capabilityPhrase = capability.capability_key.replace(/\./g, " ");
      if (normalized.includes(capabilityPhrase)) {
        return {
          stage: "capability_key_phrase",
          provider_key: manifest.provider_key,
          capability_key: capability.capability_key,
        };
      }
    }
  }

  const keywordRules: Array<{ pattern: RegExp; capabilityKey: string }> = [
    { pattern: /\b(moderation|moderate)\b/, capabilityKey: "moderation_queue.read" },
    { pattern: /\b(report|reports)\b/, capabilityKey: "report.read" },
    { pattern: /\b(listing|marketplace)\b/, capabilityKey: "listing.read" },
    { pattern: /\b(member|membership|members)\b/, capabilityKey: "member.read" },
    { pattern: /\b(activity|engagement)\b/, capabilityKey: "activity.read" },
    { pattern: /\b(verification|verify)\b/, capabilityKey: "verification_status.read" },
  ];

  for (const rule of keywordRules) {
    if (!rule.pattern.test(normalized)) continue;
    const providerKey = findProviderForCapability({
      manifests: input.manifests,
      capabilityKey: rule.capabilityKey,
      preferredProviderKeys: input.preferredProviderKeys,
    });
    if (providerKey) {
      return {
        stage: "provider_search_terms",
        provider_key: providerKey,
        capability_key: rule.capabilityKey,
      };
    }
  }

  return null;
}

function buildBaseIntent(input: {
  query: string;
  locale: CustomerActiveLocale;
  conversation?: CompanionConversationSemanticContext | null;
}): Omit<
  CompanionResolvedIntent,
  "provider_key" | "capability_key" | "domain" | "outcome" | "clarification_key" | "fallback_stage"
> {
  return {
    intent_id: randomUUID(),
    source_language: input.locale,
    entity: null,
    operation: null,
    requested_metric: null,
    time_scope: null,
    filters: {},
    comparison_scope: null,
    requested_detail_level: "summary",
    capability_candidates: [],
    confidence: "low",
    ambiguous: false,
    ambiguity_reason: null,
    conversation_reference: Boolean(input.conversation?.previous_entity || input.conversation?.previous_capability_key),
    resolution_source: "unresolved",
  };
}

/** Central Companion semantic routing chain — manifest/schema first, fallback-only support after. */
export function resolveCompanionSemanticQuery(input: {
  query: string;
  locale: CustomerActiveLocale;
  manifests: readonly CommunityProviderManifest[];
  conversation?: CompanionConversationSemanticContext | null;
  preferredProviderKeys?: readonly string[];
}): CompanionResolvedIntent {
  const preferredProviderKeys = input.preferredProviderKeys ?? [];
  const normalized = normalizeIntegrationQuery(input.query);
  const conversationEntity = input.conversation?.previous_entity ?? null;
  const descriptors = collectSemanticDescriptorsFromManifests(input.manifests);
  const intent = resolveCompanionSemanticIntent({
    query: input.query,
    descriptors,
    locale: input.locale,
    conversationEntity,
  });

  const base = buildBaseIntent(input);
  const topCapability = intent.capability_candidates[0] ?? null;
  const descriptor = findDescriptorForCapability(descriptors, topCapability);
  const metricResolution = resolveRequestedMetricFromDescriptor({ descriptor, intent });
  const domain = inferDomain(intent.entity, descriptor);

  if (
    isBareCountQuery(normalized) &&
    !conversationEntity &&
    !entityExplicitlyMatched({ normalized, descriptor, locale: input.locale })
  ) {
    return {
      ...base,
      domain,
      entity: null,
      operation: intent.operation,
      requested_metric: null,
      time_scope: intent.time_scope,
      capability_candidates: intent.capability_candidates,
      confidence: intent.confidence,
      ambiguous: true,
      ambiguity_reason: "Bare count query without entity or conversation context",
      resolution_source: "manifest_schema",
      fallback_stage: null,
      outcome: "intent_ambiguous",
      clarification_key: "customerApp.companionPlatformKnowledge.semanticRouting.clarification.bareCount",
      provider_key: null,
      capability_key: null,
    };
  }

  if (intent.ambiguous && intent.confidence === "low") {
    return {
      ...base,
      domain,
      entity: intent.entity,
      operation: intent.operation,
      requested_metric: metricResolution.requested_metric,
      time_scope: intent.time_scope,
      capability_candidates: intent.capability_candidates,
      confidence: intent.confidence,
      ambiguous: true,
      ambiguity_reason: intent.ambiguity_reason,
      resolution_source: conversationEntity ? "conversation_context" : "manifest_schema",
      fallback_stage: "manifest_entity_alias",
      outcome: "intent_ambiguous",
      clarification_key: "customerApp.companionPlatformKnowledge.semanticRouting.clarification.multipleCandidates",
      provider_key: null,
      capability_key: null,
    };
  }

  if (topCapability && intent.confidence !== "low") {
    const providerKey = findProviderForCapability({
      manifests: input.manifests,
      capabilityKey: topCapability,
      preferredProviderKeys,
    });

    return {
      ...base,
      domain,
      entity: intent.entity,
      operation: intent.operation,
      requested_metric: metricResolution.requested_metric,
      time_scope: intent.time_scope,
      requested_detail_level: intent.operation === "list" ? "list" : "summary",
      capability_candidates: intent.capability_candidates,
      provider_key: providerKey,
      capability_key: topCapability,
      confidence: intent.confidence,
      ambiguous: false,
      ambiguity_reason: null,
      conversation_reference:
        base.conversation_reference ||
        Boolean(conversationEntity && intent.entity === conversationEntity),
      resolution_source: conversationEntity ? "conversation_context" : "manifest_schema",
      fallback_stage: "manifest_entity_alias",
      outcome: providerKey ? "intent_resolved_and_grounded" : "intent_resolved_provider_missing",
      clarification_key: null,
    };
  }

  const fallback = resolveFallbackStage({
    query: input.query,
    manifests: input.manifests,
    locale: input.locale,
    preferredProviderKeys,
  });

  if (fallback) {
    const fallbackDescriptor = findDescriptorForCapability(descriptors, fallback.capability_key);
    const fallbackMetric = resolveRequestedMetricFromDescriptor({
      descriptor: fallbackDescriptor,
      intent,
    });

    return {
      ...base,
      domain: inferDomain(fallbackDescriptor?.entity ?? null, fallbackDescriptor),
      entity: fallbackDescriptor?.entity ?? intent.entity,
      operation: intent.operation,
      requested_metric: fallbackMetric.requested_metric,
      time_scope: intent.time_scope,
      capability_candidates: fallback.capability_key ? [fallback.capability_key] : [],
      provider_key: fallback.provider_key,
      capability_key: fallback.capability_key,
      confidence: "moderate",
      ambiguous: false,
      ambiguity_reason: null,
      resolution_source: "exact_phrase_support",
      fallback_stage: fallback.stage,
      outcome: fallback.provider_key ? "intent_resolved_and_grounded" : "intent_resolved_provider_missing",
      clarification_key: null,
    };
  }

  return {
    ...base,
    domain,
    entity: intent.entity,
    operation: intent.operation,
    requested_metric: metricResolution.requested_metric,
    time_scope: intent.time_scope,
    capability_candidates: intent.capability_candidates,
    confidence: intent.confidence,
    ambiguous: intent.ambiguous,
    ambiguity_reason: intent.ambiguity_reason,
    resolution_source: "unresolved",
    fallback_stage: null,
    outcome: "intent_unresolved",
    clarification_key: null,
    provider_key: null,
    capability_key: null,
  };
}

export function resolvedIntentToProviderMatch(
  resolved: CompanionResolvedIntent,
): {
  provider_key: string;
  capability_key: string | null;
  operation: "read" | "write" | null;
  requested_metric: string | null;
  requested_period: string | null;
} | null {
  if (!resolved.provider_key) return null;
  return {
    provider_key: resolved.provider_key,
    capability_key: resolved.capability_key,
    operation: "read",
    requested_metric: resolved.requested_metric,
    requested_period: resolved.time_scope,
  };
}

export function companionSemanticFallbackOrder(): readonly CompanionSemanticFallbackStage[] {
  return COMPANION_SEMANTIC_FALLBACK_ORDER;
}
