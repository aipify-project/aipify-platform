/**
 * AIPIFY.COMPANION.CORE.UNIFY — One Aipify Core Runtime
 *
 * Single source of truth for Aipify/product/platform knowledge routing.
 * Companion must not answer product questions from lightweight smalltalk,
 * isolated phrase maps, or organization intelligence when Core can answer.
 *
 * Layers on top of Core: org data, customer context, integrations — not separate Aipify knowledge.
 */

import { resolveLightweightConversationalIntent } from "@/lib/companion-runtime/companion-turn-route";
import { isPlatformFoundationQuery } from "@/lib/companion-runtime/platform-foundation-intent";

export {
  isPlatformProductKnowledgeQuery,
  resolvePlatformProductCorpusArticleId,
  resolvePlatformProductFoundationTopic,
  shouldBypassOrganizationIntelligenceForProductQuery,
  PLATFORM_PRODUCT_CORPUS_MIN_SCORE,
  type PlatformProductFoundationTopic,
} from "./platform-product-foundation";

import { isPlatformProductKnowledgeQuery } from "./platform-product-foundation";

/** True greeting/social chat only — not product or platform questions. */
export function isTrueCompanionSmalltalk(query: string): boolean {
  return resolveLightweightConversationalIntent(query) !== null;
}

/** Product/platform/foundation questions must enter Core before org intelligence. */
export function shouldRouteThroughAipifyCore(query: string): boolean {
  return isPlatformFoundationQuery(query) || isPlatformProductKnowledgeQuery(query);
}

/** Alias — semantic product/platform detection for orchestrator and execute-turn. */
export function isAipifyCoreKnowledgeQuery(query: string): boolean {
  return isPlatformProductKnowledgeQuery(query);
}
