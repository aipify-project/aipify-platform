import { NextResponse } from "next/server";
import {
  answerToLegacyArticle,
  resolveAnswerLocale,
  searchPlatformKnowledge,
  trackLowConfidenceQuery,
  COMPANION_PLATFORM_KNOWLEDGE_CORPUS_VERSION,
} from "@/lib/companion-platform-knowledge";
import {
  buildSupportAssistantCorpus,
  buildSupportAssistantLabels,
  getSupportAssistantArticleById,
} from "@/lib/app-portal/support-assistant";
import {
  buildPlatformSearchContextFromTenant,
  loadCompanionTenantContext,
  resolveCompanionIntegrationContext,
} from "@/lib/companion-runtime/tenant-context";
import { loadCompanionArtifactContext } from "@/lib/companion-runtime/artifact-context/server";
import { enrichAnswerWithArtifactContext } from "@/lib/companion-runtime/artifact-context/enrich-answer";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import { buildCompanionExperienceLabels } from "@/lib/app/companion/labels";
import { getDashboardProfile } from "@/lib/tenant/get-profile";
import type { UserRole } from "@/lib/tenant/types";
import { createClient } from "@/lib/supabase/server";

function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  const parts = path.replace(/^customerApp\./, "").split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (!current || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}

function getSearchTermsArray(dict: Record<string, unknown>, key: string): string[] {
  const raw = getNestedValue(dict, key);
  if (typeof raw === "string") {
    return raw.split("|").map((s) => s.trim()).filter(Boolean);
  }
  if (Array.isArray(raw)) return raw.map(String);
  return [];
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") ?? "";
    const articleId = searchParams.get("article_id");
    const requestedLocale = searchParams.get("locale");
    const integrationContextParam = searchParams.get("integration_context");
    const integrationContext =
      integrationContextParam && integrationContextParam.trim().length > 0
        ? integrationContextParam.trim()
        : null;
    const platformActiveModules = searchParams.get("platform_active_modules");
    const conversationId = searchParams.get("conversation_id");
    const activeArtifactId = searchParams.get("active_artifact_id");
    const attachmentIdsParam = searchParams.get("attachment_ids");
    const externalProvider = searchParams.get("external_provider");
    const externalConsent = searchParams.get("external_consent") === "true";
    const snapshotContext = platformActiveModules
      ? {
          activeModules: platformActiveModules
            .split(",")
            .map((entry) => entry.trim())
            .filter(Boolean),
        }
      : undefined;

    const appLocale = await getLocale();
    const answerLocale = query
      ? resolveAnswerLocale(requestedLocale ?? appLocale, query)
      : resolveAnswerLocale(requestedLocale ?? appLocale, articleId ?? "");

    const dict = await getCustomerAppDictionaryForSplits(answerLocale, [
      "navigation",
      "portalStructure",
      "companionPlatformKnowledge",
    ]);
    const t = createTranslator(dict);
    const labels = buildSupportAssistantLabels(t);
    const legacyCorpus = buildSupportAssistantCorpus(labels, t);

    const profile = await getDashboardProfile(supabase);
    const userRole = (profile?.user.role ?? "staff") as UserRole;

    const tenantContext = await loadCompanionTenantContext(supabase, { locale: answerLocale });
    const resolvedIntegrationContext = resolveCompanionIntegrationContext(
      integrationContext,
      tenantContext,
    );
    const searchContext = buildPlatformSearchContextFromTenant(tenantContext, userRole);

    let artifactContextBundle:
      | Awaited<ReturnType<typeof loadCompanionArtifactContext>>
      | null = null;

    if (conversationId && query.trim()) {
      artifactContextBundle = await loadCompanionArtifactContext(supabase, {
        conversation_id: conversationId,
        query,
        active_artifact_id: activeArtifactId,
        attachment_ids: attachmentIdsParam
          ? attachmentIdsParam
              .split(",")
              .map((entry) => entry.trim())
              .filter(Boolean)
          : undefined,
        external_provider: externalProvider,
        external_consent: externalConsent,
      });
    }

    let subscriptionRaw: unknown = null;
    try {
      const { data } = await supabase.rpc("get_customer_license_center");
      subscriptionRaw = data;
    } catch {
      subscriptionRaw = null;
    }

    const searchOptions = {
      t,
      locale: answerLocale,
      ctx: searchContext,
      getSearchTermsArray: (key: string) =>
        getSearchTermsArray(dict.customerApp as Record<string, unknown>, key),
      subscriptionRaw,
      supabase,
      integrationContext: resolvedIntegrationContext,
      snapshotContext,
      artifactContext: artifactContextBundle
        ? {
            conversation_id: artifactContextBundle.conversation_id,
            active_artifact: artifactContextBundle.active_artifact,
            attachment_ids: artifactContextBundle.attachment_ids,
            references: artifactContextBundle.references,
          }
        : undefined,
      tenantContext,
    };

    if (articleId) {
      const platformResult = await searchPlatformKnowledge(articleId.replace(/_/g, "-"), searchOptions);
      const legacy = getSupportAssistantArticleById(articleId, legacyCorpus);
      const article = legacy ?? answerToLegacyArticle(platformResult.answer);
      if (!article && !platformResult.answer.directAnswer) {
        return NextResponse.json({ found: false, query: "", articles: [] });
      }
      return NextResponse.json({
        found: true,
        query: articleId,
        answer: platformResult.answer,
        articles: [article],
        corpus_version: COMPANION_PLATFORM_KNOWLEDGE_CORPUS_VERSION,
      });
    }

    const result = await searchPlatformKnowledge(query, searchOptions);

    if (result.answer.confidence === "low") {
      void trackLowConfidenceQuery(supabase, query, answerLocale, result.answer.confidence);
    }

    let answer = result.answer;

    if (artifactContextBundle) {
      const companionDict = await getCustomerAppDictionaryForSplits(answerLocale, ["companion"]);
      const companionLabels = buildCompanionExperienceLabels(createTranslator(companionDict));
      const att = companionLabels.attachments;

      answer = enrichAnswerWithArtifactContext(
        answer,
        artifactContextBundle,
        artifactContextBundle.attachments,
        {
          resolvedActive: (filename) =>
            att.context.resolvedActive.replace("{filename}", filename),
          unresolvedReference: att.context.unresolvedReference,
          noBinaryNote: att.context.noBinaryNote,
        },
      );

      if (artifactContextBundle.externalHandoff) {
        const handoff = artifactContextBundle.externalHandoff;
        answer.externalHandoff = handoff;
        const handoffCopy =
          handoff.status === "consent_required"
            ? att.externalHandoff.consentRequired
            : handoff.status === "permission_denied"
              ? att.externalHandoff.permissionDenied
              : handoff.status === "adapter_available"
                ? att.externalHandoff.ready
                : att.externalHandoff.adapterMissing;
        answer = {
          ...answer,
          explanation: [answer.explanation, handoffCopy].filter(Boolean).join("\n\n"),
        };
      }
    }

    const legacyArticle = answerToLegacyArticle(answer);

    return NextResponse.json({
      found: true,
      query,
      answer,
      articles: [legacyArticle],
      matched_article_id: result.matchedArticleId,
      principle: labels.principle,
      corpus_version: COMPANION_PLATFORM_KNOWLEDGE_CORPUS_VERSION,
      source: answer.source,
      confidence: answer.confidence,
      answer_locale: answerLocale,
    });
  } catch {
    return NextResponse.json({ error: "Failed to search knowledge" }, { status: 500 });
  }
}
