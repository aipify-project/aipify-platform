import { normalizeIntegrationQuery } from "@/lib/integration-intelligence/normalize-text";
import type { PlatformFoundationTopicId } from "./platform-foundation-loader";

function matchesSelfLoveConcept(normalized: string): boolean {
  const hasSelfLove =
    /\b(self[\s-]?love|selflove)\b/i.test(normalized) ||
    normalized.includes("self love");
  if (!hasSelfLove) return false;

  return (
    /\b(hva er|what is|what's|explain|forklar|hva betyr|what does|what do|hva gjør)\b/i.test(
      normalized,
    ) || normalized.split(/\s+/).length <= 8
  );
}

function matchesFoxExchange(normalized: string, original: string): boolean {
  if (
    /\b(what does the fox say|hva sier reven|vad sager räven|hvad siger ræven|co mówi lis|shcho kaže lis)\b/i.test(
      original,
    )
  ) {
    return true;
  }

  const hasFox = /\b(reven|fox|räv|ræv|lis|lisica)\b/i.test(normalized);
  const hasSay = /\b(sier|say|säger|siger|mówi|kaže)\b/i.test(normalized);
  return hasFox && hasSay;
}

export function resolvePlatformFoundationTopicId(query: string): PlatformFoundationTopicId | null {
  const normalized = normalizeIntegrationQuery(query);
  if (!normalized.trim()) return null;

  if (matchesFoxExchange(normalized, query)) {
    return "playful_fox_exchange";
  }

  if (matchesSelfLoveConcept(normalized)) {
    return "self_love_principle";
  }

  return null;
}

export function isPlatformFoundationQuery(query: string): boolean {
  return resolvePlatformFoundationTopicId(query) !== null;
}

export {
  isPlatformProductKnowledgeQuery,
  resolvePlatformProductCorpusArticleId,
  resolvePlatformProductFoundationTopic,
  shouldBypassOrganizationIntelligenceForProductQuery,
} from "@/lib/companion-platform-knowledge/platform-product-foundation";
