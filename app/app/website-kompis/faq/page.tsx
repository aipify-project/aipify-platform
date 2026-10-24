import { Suspense } from "react";
import { WebsiteKompisKnowledgeCenterScreen } from "@/components/app/website-kompis/WebsiteKompisKnowledgeCenterScreen";
import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import { FOUNDATION_NAV_BINDINGS } from "@/lib/app-portal/foundation-nav/bindings";
import { hubCommon } from "@/lib/app-portal/hubs/hub-copy";
import {
  formatHubContextLine,
  resolveHubWorkspaceContext,
} from "@/lib/app-portal/hubs/resolve-workspace-context";
import { buildWebsiteKompisFaqLabels } from "@/lib/website-kompis-faq/labels";
import { buildWebsiteKompisFeedbackLabels } from "@/lib/website-kompis-feedback/labels";
import { buildWebsiteKompisKnowledgeLabels } from "@/lib/website-kompis-knowledge/labels";
import { loadWebsiteKompisKnowledgeSummary } from "@/lib/website-kompis-knowledge/load-summary";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import { createClient } from "@/lib/supabase/server";

/** Kompis Web Knowledge Center — FAQ menu entry; pages/documents honest when unsupported. */
export default async function WebsiteKompisFaqPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["core", "portalStructure"]);
  const t = createTranslator(dict);
  const faqLabels = buildWebsiteKompisFaqLabels(t);
  const feedbackLabels = buildWebsiteKompisFeedbackLabels(t);
  const knowledgeLabels = buildWebsiteKompisKnowledgeLabels(t);
  const common = hubCommon(t);
  const ctx = await resolveHubWorkspaceContext();
  const supabase = await createClient();
  const summary = await loadWebsiteKompisKnowledgeSummary(supabase);

  return (
    <Suspense fallback={<AipifyLoadingState />}>
      <WebsiteKompisKnowledgeCenterScreen
        breadcrumbLabel={common.breadcrumb}
        breadcrumb={[
          { label: common.home, href: FOUNDATION_NAV_BINDINGS.appHome },
          {
            label: t("customerApp.portalStructure.navGroups.kompisWeb"),
            href: FOUNDATION_NAV_BINDINGS.kompisWebDashboard,
          },
          { label: knowledgeLabels.title },
        ]}
        eyebrow={t("customerApp.portalStructure.navGroups.kompisWeb")}
        title={knowledgeLabels.title}
        description={knowledgeLabels.subtitle}
        contextLabel={formatHubContextLine(common, ctx)}
        publishedWord={knowledgeLabels.counts.published}
        unavailableLabel={knowledgeLabels.counts.unavailable}
        knowledgeLabels={knowledgeLabels}
        faqLabels={faqLabels}
        suggestFromFeedbackWarning={feedbackLabels.suggestFaqWarning}
        initialSummary={summary}
      />
    </Suspense>
  );
}
