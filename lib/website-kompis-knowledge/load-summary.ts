import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { WPKF_LIST_LIMIT_DEFAULT } from "@/lib/website-kompis-faq/constants";
import { parseWebsiteKompisFaqList } from "@/lib/website-kompis-faq/parse";
import { getWebsiteKompisAnswerFeedbackOverview } from "@/lib/marketing/website-kompis-answer-feedback-server";
import { summarizeFaqItems, type FaqKnowledgeCounts } from "@/lib/website-kompis-knowledge/source-inventory";

export type WebsiteKompisKnowledgeSummary = {
  faq: FaqKnowledgeCounts;
  feedbackNeedsReview: number;
  feedbackPersistenceReady: boolean;
  faqLoadOk: boolean;
};

export async function loadWebsiteKompisKnowledgeSummary(
  supabase: SupabaseClient,
): Promise<WebsiteKompisKnowledgeSummary> {
  const emptyFaq: FaqKnowledgeCounts = {
    total: 0,
    published: 0,
    draft: 0,
    archived: 0,
    lastUpdatedAt: null,
  };

  const [faqResult, feedback] = await Promise.all([
    supabase.rpc("list_tenant_public_companion_faq_items", {
      p_status: null,
      p_locale: null,
      p_content_type: null,
      p_query: null,
      p_limit: WPKF_LIST_LIMIT_DEFAULT,
      p_offset: 0,
    }),
    getWebsiteKompisAnswerFeedbackOverview(supabase, { limit: 1 }),
  ]);

  let faq = emptyFaq;
  let faqLoadOk = false;
  if (!faqResult.error) {
    try {
      const items = parseWebsiteKompisFaqList(faqResult.data);
      faq = summarizeFaqItems(items);
      faqLoadOk = true;
    } catch {
      faqLoadOk = false;
    }
  }

  return {
    faq,
    feedbackNeedsReview: feedback.totals.notHelpful,
    feedbackPersistenceReady: feedback.persistenceReady,
    faqLoadOk,
  };
}
