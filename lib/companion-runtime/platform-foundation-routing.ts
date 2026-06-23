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
  loadSelfLoveFoundationSpec,
} from "./platform-foundation-loader";
import { resolvePlatformFoundationTopicId } from "./platform-foundation-intent";
import type { CompanionTenantContext } from "./companion-tenant-context";

async function resolveSelfLoveFoundationAnswer(input: {
  query: string;
  supabase: SupabaseClient;
  t: Translator;
  locale: CustomerActiveLocale;
}): Promise<PlatformSearchResult> {
  const topic = findPlatformFoundationTopic("self_love_principle");
  const kcArticle = await searchCanonicalKnowledgeCenter(input.supabase, input.query, input.locale);

  if (kcArticle) {
    const body = formatKnowledgeCenterAnswerBody(kcArticle);
    if (body) {
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

  const spec = loadSelfLoveFoundationSpec();
  const fallbackBody = [
    input.t("customerApp.companionPlatformKnowledge.foundation.selfLoveLead"),
    spec.philosophy,
    spec.abosPrinciple,
    input.t("customerApp.companionPlatformKnowledge.foundation.selfLoveBoundariesLead"),
    ...spec.boundaries.map((entry) => `• ${entry}`),
  ].join("\n");

  if (!fallbackBody.trim()) {
    return {
      answer: buildPlatformFoundationGapAnswer(input.t, "foundation_unavailable", {
        topicId: topic?.topic_id ?? "self_love_principle",
      }),
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
      answer: buildPlatformFoundationGapAnswer(input.t, "foundation_unavailable", {
        topicId: "playful_fox_exchange",
      }),
    };
  }

  if (
    input.tenantContext.identityContext.serious_context_only ||
    input.tenantContext.identityContext.crisis_mode_active ||
    !input.tenantContext.identityContext.humor_enabled
  ) {
    return {
      answer: buildPlatformFoundationGapAnswer(input.t, "foundation_unavailable", {
        topicId: "playful_fox_exchange",
      }),
    };
  }

  const { data: bellMoment } = await input.supabase.rpc("get_playful_bell_moment", {
    p_context: "fox_spoken",
  });

  const bellPayload =
    bellMoment && typeof bellMoment === "object" ? (bellMoment as Record<string, unknown>) : null;
  const bellText = typeof bellPayload?.text === "string" ? bellPayload.text : null;

  if (!bellText) {
    return {
      answer: buildPlatformFoundationGapAnswer(input.t, "foundation_unavailable", {
        topicId: "playful_fox_exchange",
      }),
    };
  }

  const bell = await recordPlayfulFoxBellNotification(input.supabase, {
    t: input.t,
    companyId: input.tenantContext.companyId,
    conversationId: input.conversationId,
    bellText,
  });

  const followUp =
    typeof exchange.follow_up === "string"
      ? exchange.follow_up
      : input.t("customerApp.companionPlatformKnowledge.foundation.foxFollowUp");

  return {
    answer: buildFoxFoundationAnswer({
      response: exchange.aipify_responds,
      followUp,
      bellText: bell.created ? bellText : null,
      sourceLabel: input.t("customerApp.companionPlatformKnowledge.foundation.platformSpecLabel"),
      t: input.t,
      locale: input.locale,
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
      answer: buildPlatformFoundationGapAnswer(input.t, "foundation_unavailable", { topicId }),
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
