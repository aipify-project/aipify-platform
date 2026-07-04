import type { CustomerActiveLocale } from "@/lib/i18n/customer-active-locale-registry";
import { normalizeIntegrationQuery } from "@/lib/integration-intelligence/normalize-text";
import {
  isLocalDevicePermissionQuery,
  isUserOwnedAccountControlQuery,
} from "@/lib/core/authorization-target";
import { isOrganizationCapabilityQuery } from "./organization-capability-resolution";
import { isPlatformFoundationQuery } from "./platform-foundation-intent";
import { detectOperationalQueryKind } from "./companion-operational-query-match";
import { resolveCompanionExplicitIntent } from "./companion-explicit-intent";
import { shouldDeferLightweightConversationalAnswer } from "@/lib/companion/enrichment/companion-response-enrichment";

export { resolveCompanionEnrichmentIntent } from "@/lib/companion/enrichment/companion-response-enrichment";

export type CompanionTurnRoute = "lightweight" | "foundation" | "exact_source" | "full";

export type LightweightConversationalIntent =
  | "greeting"
  | "thanks"
  | "humor"
  | "social"
  | "personality"
  | "general";

function matchesGreeting(normalized: string): boolean {
  return (
    /^(hei|hello|hi|hey|god\s*(morgen|dag|kveld)|good\s*(morning|day|evening)|hallo|hejsan|hej)\b/i.test(
      normalized,
    ) || /\b(how are you|hvordan går det|hvordan har du det)\b/i.test(normalized)
  );
}

function matchesThanks(normalized: string): boolean {
  return /\b(takk|thanks|thank you|tack|tak|merci)\b/i.test(normalized);
}

function matchesHumor(normalized: string): boolean {
  return (
    /\b(kan du le|can you laugh|make me laugh|si noe morsomt|tell me a joke|fortell en vits|humor|morsom)\b/i.test(
      normalized,
    ) ||
    (/\b(le|laugh|latter|joke|vitser|vits)\b/i.test(normalized) &&
      normalized.split(/\s+/).length <= 8)
  );
}

function matchesPersonalityQuestion(normalized: string): boolean {
  return (
    /\b(hvem er du|who are you|what are you|hva er du|din personlighet|your personality|how do you work)\b/i.test(
      normalized,
    ) && !/\b(medlem|member|data|integrasjon|integration|abonnement|subscription)\b/i.test(normalized)
  );
}

function matchesSocialSmalltalk(normalized: string): boolean {
  if (normalized.split(/\s+/).length > 14) return false;
  return (
    /\b(ha det|goodbye|bye|see you|vi snakkes|kos deg|have a nice|hyggelig)\b/i.test(normalized) ||
    (/\b(aipify|companion)\b/i.test(normalized) &&
      /\b(friend|venn|buddy|kompis|sosial|social|sier|say)\b/i.test(normalized)) ||
    (/\b(kaffe|coffee|tea|te)\b/i.test(normalized) &&
      /\b(tenker|think|opinion|synes|like|elsker|mener|favoritt|favorite)\b/i.test(normalized))
  );
}

export function resolveLightweightConversationalIntent(
  query: string,
): LightweightConversationalIntent | null {
  const normalized = normalizeIntegrationQuery(query);
  if (!normalized.trim()) return null;

  if (matchesGreeting(normalized)) return "greeting";
  if (matchesThanks(normalized)) return "thanks";
  if (matchesHumor(normalized)) return "humor";
  if (matchesPersonalityQuestion(normalized)) return "personality";
  if (matchesSocialSmalltalk(normalized)) return "social";

  return null;
}

import { isCapabilityHelpQuery } from "@/lib/companion-platform-knowledge/aipify-core-query";
import { isPlatformProductKnowledgeQuery } from "@/lib/companion-platform-knowledge/platform-product-foundation";

export { isCapabilityHelpQuery };

/** Escalate to full route only when the query clearly needs org data, actions, or integrations. */
export function needsFullCompanionRoute(
  query: string,
  options: { hasAttachments?: boolean; hasActiveArtifact?: boolean } = {},
): boolean {
  if (options.hasAttachments || options.hasActiveArtifact) return true;

  const normalized = normalizeIntegrationQuery(query);
  if (!normalized.trim()) return false;

  if (isCapabilityHelpQuery(query)) return true;

  if (normalized.split(/\s+/).length > 40) return true;

  return (
    /\b(canva|shopify|wordpress|integrasjon|integration|abonnement|subscription|faktura|invoice|betaling|payment|support\s*(sak|case|ticket)|henvendelser?|nye henvendelser|ordre|order|lager|inventory|analytics|analyse|rapport|report|installer|installasjon|document|dokument|vedlegg|attachment|csv|pdf|excel|database|medlemmer|members|aktive medlemmer|verifisert|pending|godkjen|approve|execute|kjør|run workflow|automation|automatisering)\b/i.test(
      normalized,
    ) ||
    /\b(vis meg|show me|list|liste|tell me how many|hvor mange|how many|count)\b/i.test(normalized) &&
      /\b(medlem|member|kunde|customer|ordre|order|sak|case|abonnent|subscriber)\b/i.test(
        normalized,
      )
  );
}

export function classifyCompanionTurnRoute(
  query: string,
  locale: CustomerActiveLocale = "en",
  options: { hasAttachments?: boolean; hasActiveArtifact?: boolean } = {},
): CompanionTurnRoute {
  if (options.hasAttachments || options.hasActiveArtifact) {
    if (isOrganizationCapabilityQuery(query, locale)) return "exact_source";
    return "full";
  }

  const explicitIntent = resolveCompanionExplicitIntent(query);
  if (explicitIntent?.kind === "companion_registration_meta") return "lightweight";
  if (
    explicitIntent?.kind === "media_verification" ||
    explicitIntent?.kind === "knowledge_provider_fetch" ||
    explicitIntent?.kind === "integration_install_check"
  ) {
    return "exact_source";
  }

  if (isPlatformFoundationQuery(query)) return "foundation";
  if (shouldDeferLightweightConversationalAnswer(query)) return "full";
  if (isUserOwnedAccountControlQuery(query) || isLocalDevicePermissionQuery(query)) {
    return "exact_source";
  }
  if (detectOperationalQueryKind(query)) return "exact_source";
  if (isPlatformProductKnowledgeQuery(query)) {
    if (isCapabilityHelpQuery(query)) return "full";
    return "lightweight";
  }
  if (isOrganizationCapabilityQuery(query, locale)) return "exact_source";
  if (isCapabilityHelpQuery(query)) return "full";
  if (needsFullCompanionRoute(query, options)) return "full";
  return "lightweight";
}
