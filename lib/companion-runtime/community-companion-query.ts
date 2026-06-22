import type { CustomerActiveLocale } from "@/lib/i18n/customer-active-locale-registry";
import type { Translator } from "@/lib/i18n/translate";
import type { PlatformKnowledgeAnswer, PlatformSearchResult } from "@/lib/companion-platform-knowledge/types";
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
import type { CompanionTenantContext } from "./companion-tenant-context";

/** Shared community provider Companion query path — same branch as orchestrateCompanionSearch. */
export function resolveCommunityCompanionQuery(
  query: string,
  t: Translator,
  tenantContext: CompanionTenantContext,
  activeLocale: CustomerActiveLocale,
): PlatformSearchResult | null {
  if (hasBlockedCommunityOperationIntent(query)) {
    return {
      answer: buildBlockedCommunityOperationAnswer(t),
    };
  }

  if (!hasCommunityProviderIntent(query)) {
    return null;
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

  const match = matchCommunityProviderQuery(query, tenantContext);
  if (!match) {
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
