import { KnowledgeCenterPanel } from "@/components/app/knowledge/KnowledgeCenterPanel";
import { KNOWLEDGE_STATUSES } from "@/lib/aipify/knowledge";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function KnowledgeCenterPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);

  const statuses = Object.fromEntries(
    KNOWLEDGE_STATUSES.map((s) => [s, t(`customerApp.knowledge.statuses.${s}`)])
  );

  return (
    <KnowledgeCenterPanel
      labels={{
        title: t("customerApp.knowledge.title"),
        subtitle: t("customerApp.knowledge.subtitle"),
        loading: t("customerApp.knowledge.loading"),
        back: t("customerApp.knowledge.back"),
        privacy: t("customerApp.knowledge.privacy"),
        upgradeTitle: t("customerApp.knowledge.upgrade.title"),
        upgradeBody: t("customerApp.knowledge.upgrade.body"),
        upgradeCta: t("customerApp.knowledge.upgrade.cta"),
        metrics: {
          published_articles: t("customerApp.knowledge.metrics.published"),
          draft_articles: t("customerApp.knowledge.metrics.drafts"),
          review_articles: t("customerApp.knowledge.metrics.review"),
          open_gaps: t("customerApp.knowledge.metrics.gaps"),
          searches_24h: t("customerApp.knowledge.metrics.searches"),
        },
        sections: {
          articles: t("customerApp.knowledge.articles.title"),
          gaps: t("customerApp.knowledge.gaps.title"),
        },
        actions: {
          createArticle: t("customerApp.knowledge.createArticle"),
          importSeed: t("customerApp.knowledge.importSeed"),
          createFromGap: t("customerApp.knowledge.createFromGap"),
          dismiss: t("customerApp.knowledge.dismiss"),
          publish: t("customerApp.knowledge.publish"),
        },
        emptyArticles: t("customerApp.knowledge.articles.empty"),
        emptyGaps: t("customerApp.knowledge.gaps.empty"),
        links: {
          gaps: t("customerApp.knowledge.links.gaps"),
          settings: t("customerApp.knowledge.links.settings"),
        },
        statuses,
      }}
    />
  );
}
