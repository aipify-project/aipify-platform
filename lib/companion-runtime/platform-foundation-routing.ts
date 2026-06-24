import type { SupabaseClient } from "@supabase/supabase-js";
import type { CustomerActiveLocale } from "@/lib/i18n/customer-active-locale-registry";
import type { Translator } from "@/lib/i18n/translate";
import type { PlatformSearchResult } from "@/lib/companion-platform-knowledge/types";
import {
  formatKnowledgeCenterAnswerBody,
  searchCanonicalKnowledgeCenter,
} from "./knowledge-sources";
import { recordPlayfulFoxBellNotification } from "./platform-foundation-bell";
import {
  buildFoxFoundationAnswer,
  buildPlatformFoundationGapAnswer,
  buildSelfLoveFoundationAnswer,
} from "./platform-foundation-answer";
import {
  findPlatformFoundationTopic,
  loadPlayfulFoxFoundationSpec,
} from "./platform-foundation-loader";
import { resolvePlatformFoundationTopicId } from "./platform-foundation-intent";
import type { CompanionTenantContext } from "./companion-tenant-context";

const BASE = "customerApp.companionPlatformKnowledge.foundation";

function resolveFoundationLocalizedText(
  t: Translator,
  key: string,
  fallback: string,
): string {
  const translated = t(key);
  return translated !== key ? translated : fallback;
}

async function resolveSelfLoveFoundationAnswer(input: {
  query: string;
  supabase: SupabaseClient;
  t: Translator;
  locale: CustomerActiveLocale;
}): Promise<PlatformSearchResult> {
  const topic = findPlatformFoundationTopic("self_love_principle");
  const kcArticle =
    input.locale === "en"
      ? await searchCanonicalKnowledgeCenter(input.supabase, input.query, input.locale)
      : null;

  if (kcArticle) {
    const summary = kcArticle.summary?.trim() ?? "";
    const body = formatKnowledgeCenterAnswerBody(kcArticle);
    const looksLikeStubTitle =
      summary.length > 0 &&
      summary.length <= 40 &&
      /^self love/i.test(summary) &&
      !/[.!?]/.test(summary);
    const bodyLongEnough = body.length >= 120;

    if (body && bodyLongEnough && !looksLikeStubTitle) {
      return {
        answer: buildSelfLoveFoundationAnswer({
          body,
          sourceLabel: input.t("customerApp.companionPlatformKnowledge.sources.knowledgeCenter"),
          sourceId: kcArticle.slug,
          source: "knowledge_center",
          sourceKind: "knowledge_center",
          t: input.t,
          locale: input.locale,
        }),
      };
    }
  }

  const fallbackBody = [
    input.t("customerApp.companionPlatformKnowledge.foundation.selfLoveLead"),
    input.t("customerApp.companionPlatformKnowledge.foundation.selfLovePhilosophy"),
    input.t("customerApp.companionPlatformKnowledge.foundation.selfLoveAbosPrinciple"),
    input.t("customerApp.companionPlatformKnowledge.foundation.selfLoveBoundariesLead"),
    input.t("customerApp.companionPlatformKnowledge.foundation.selfLoveBoundary1"),
    input.t("customerApp.companionPlatformKnowledge.foundation.selfLoveBoundary2"),
    input.t("customerApp.companionPlatformKnowledge.foundation.selfLoveBoundary3"),
  ].join("\n");

  if (!fallbackBody.trim()) {
    return {
      answer: buildPlatformFoundationGapAnswer(input.t, "foundation_unavailable"),
    };
  }

  return {
    answer: buildSelfLoveFoundationAnswer({
      body: fallbackBody,
      sourceLabel: input.t("customerApp.companionPlatformKnowledge.foundation.platformSpecLabel"),
      sourceId: "self-love-engine-vocabulary",
      source: "platform_corpus",
      sourceKind: "platform_corpus",
      t: input.t,
      locale: input.locale,
    }),
  };
}

async function resolveFoxFoundationAnswer(input: {
  supabase: SupabaseClient;
  t: Translator;
  locale: CustomerActiveLocale;
  tenantContext: CompanionTenantContext;
  conversationId?: string | null;
}): Promise<PlatformSearchResult> {
  const spec = loadPlayfulFoxFoundationSpec();
  const exchange = spec.fox_exchange;
  if (!exchange?.aipify_responds) {
    return {
      answer: buildPlatformFoundationGapAnswer(input.t, "foundation_unavailable"),
    };
  }

  if (
    input.tenantContext.identityContext.crisis_mode_active ||
    input.tenantContext.identityContext.serious_context_only
  ) {
    return {
      answer: buildPlatformFoundationGapAnswer(input.t, "foundation_unavailable"),
    };
  }

  const localizedResponse = resolveFoundationLocalizedText(
    input.t,
    `${BASE}.foxResponse`,
    exchange.aipify_responds,
  );
  const localizedFollowUp = resolveFoundationLocalizedText(
    input.t,
    `${BASE}.foxFollowUp`,
    exchange.follow_up ?? "",
  );
  const localizedBellBody = resolveFoundationLocalizedText(
    input.t,
    `${BASE}.foxBellBody`,
    "Ring-ding-ding-ding-dingeringeding — playful moment acknowledged.",
  );

  const response = localizedResponse;

  const { data: bellMoment } = await input.supabase.rpc("get_playful_bell_moment", {
    p_context: "fox_spoken",
  });

  const bellPayload =
    bellMoment && typeof bellMoment === "object" ? (bellMoment as Record<string, unknown>) : null;
  const bellAvailable =
    typeof bellPayload?.text === "string"
      ? bellPayload.text.trim().length > 0
      : localizedBellBody.trim().length > 0;

  if (!bellAvailable) {
    return {
      answer: buildFoxFoundationAnswer({
        response,
        followUp: localizedFollowUp || null,
        t: input.t,
      }),
    };
  }

  void recordPlayfulFoxBellNotification(input.supabase, {
    t: input.t,
    companyId: input.tenantContext.companyId,
    conversationId: input.conversationId,
    bellText: localizedBellBody,
  }).catch(() => {
    // Bell notification must not block the chat response.
  });

  return {
    answer: buildFoxFoundationAnswer({
      response,
      followUp: localizedFollowUp,
      t: input.t,
    }),
  };
}

/** Routes Aipify-owned platform foundation before organization exact sources or generic APP help. */
export async function resolvePlatformFoundationAnswer(
  query: string,
  input: {
    t: Translator;
    activeLocale: CustomerActiveLocale;
    supabase: SupabaseClient | null | undefined;
    tenantContext: CompanionTenantContext;
    companionSurface?: boolean;
    conversationId?: string | null;
  },
): Promise<PlatformSearchResult | null> {
  const topicId = resolvePlatformFoundationTopicId(query);
  if (!topicId) return null;

  if (!input.supabase) {
    return {
      answer: buildPlatformFoundationGapAnswer(input.t, "foundation_unavailable"),
    };
  }

  if (topicId === "self_love_principle") {
    return resolveSelfLoveFoundationAnswer({
      query,
      supabase: input.supabase,
      t: input.t,
      locale: input.activeLocale,
    });
  }

  return resolveFoxFoundationAnswer({
    supabase: input.supabase,
    t: input.t,
    locale: input.activeLocale,
    tenantContext: input.tenantContext,
    conversationId: input.conversationId,
  });
}

export function shouldBypassGenericHelpForFoundationQuery(query: string): boolean {
  return resolvePlatformFoundationTopicId(query) !== null;
}
