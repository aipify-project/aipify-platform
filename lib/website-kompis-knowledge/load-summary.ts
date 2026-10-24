import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { WPKF_LIST_LIMIT_DEFAULT } from "@/lib/website-kompis-faq/constants";
import {
  faqCountContractMissing,
  faqCountSiteScope,
  parseFaqCountBreakdown,
} from "@/lib/website-kompis-faq/count-contract";
import { parseWebsiteKompisFaqList } from "@/lib/website-kompis-faq/parse";
import { getWebsiteKompisAnswerFeedbackOverview } from "@/lib/marketing/website-kompis-answer-feedback-server";
import { applyAuthoritativeFaqCount, buildFaqListWindow, type FaqListWindow } from "@/lib/website-kompis-faq/list-window";
import { summarizeFaqItems, type FaqKnowledgeCounts } from "@/lib/website-kompis-knowledge/source-inventory";
import { resolveWebsiteKompisSiteContextForRequest } from "@/lib/website-kompis-site-context";

export type WebsiteKompisKnowledgeSummary = {
  faq: FaqKnowledgeCounts;
  faqWindow: FaqListWindow;
  feedbackNeedsReview: number;
  feedbackPersistenceReady: boolean;
  faqLoadOk: boolean;
};

export async function loadWebsiteKompisKnowledgeSummary(
  supabase: SupabaseClient,
  requestedInstallId?: string | null,
): Promise<WebsiteKompisKnowledgeSummary> {
  const emptyFaq: FaqKnowledgeCounts = {
    total: 0,
    published: 0,
    draft: 0,
    archived: 0,
    lastUpdatedAt: null,
  };

  const siteContext = await resolveWebsiteKompisSiteContextForRequest(supabase, requestedInstallId);
  const countScope =
    siteContext.state === "unauthenticated"
      ? null
      : faqCountSiteScope(siteContext.state, siteContext.selectedInstallId ?? null);

  const [faqResult, feedback, countResult] = await Promise.all([
    supabase.rpc("list_tenant_public_companion_faq_items", {
      p_status: null,
      p_locale: null,
      p_content_type: null,
      p_query: null,
      p_limit: WPKF_LIST_LIMIT_DEFAULT,
      p_offset: 0,
    }),
    getWebsiteKompisAnswerFeedbackOverview(supabase, { limit: 1 }),
    countScope
      ? supabase.rpc("count_tenant_public_companion_faq_items", {
          p_status: null,
          p_locale: null,
          p_content_type: null,
          p_query: null,
          p_install_id: countScope.installId,
          p_site_scope: countScope.scope,
        })
      : Promise.resolve({ data: null, error: null }),
  ]);

  let faq = emptyFaq;
  let faqWindow = buildFaqListWindow({
    offset: 0,
    limit: WPKF_LIST_LIMIT_DEFAULT,
    tenantReturned: 0,
    visibleReturned: 0,
  });
  let faqLoadOk = false;
  const breakdown =
    countResult.error && !faqCountContractMissing(countResult.error)
      ? null
      : parseFaqCountBreakdown(countResult.data);
  if (breakdown) {
    let lastUpdatedAt: string | null = null;
    if (!faqResult.error) {
      try {
        lastUpdatedAt = summarizeFaqItems(parseWebsiteKompisFaqList(faqResult.data)).lastUpdatedAt;
      } catch {
        lastUpdatedAt = null;
      }
    }
    faq = {
      total: breakdown.total,
      published: breakdown.published,
      draft: breakdown.draft,
      archived: breakdown.archived,
      lastUpdatedAt,
    };
    faqWindow = applyAuthoritativeFaqCount(
      buildFaqListWindow({
        offset: 0,
        limit: WPKF_LIST_LIMIT_DEFAULT,
        tenantReturned: 0,
        visibleReturned: 0,
      }),
      breakdown.total,
    );
    faqLoadOk = true;
  }

  return {
    faq,
    faqWindow,
    feedbackNeedsReview: feedback.totals.notHelpful,
    feedbackPersistenceReady: feedback.persistenceReady,
    faqLoadOk,
  };
}
