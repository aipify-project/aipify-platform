import { notFound } from "next/navigation";
import { AppKnowledgeArticlePanel } from "@/components/app/support/AppKnowledgeArticlePanel";
import { getMarketingContext } from "@/lib/marketing/get-marketing-context";
import { getPublicKnowledgeArticle, getPublicKnowledgeFaqs, getPublicKnowledgeHubLabels } from "@/lib/marketing/knowledge/load";
import { getAllArticleSlugs } from "@/lib/marketing/knowledge/registry";
import { getCustomerAppDictionaryForSplits, getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllArticleSlugs().map((slug) => ({ slug }));
}

export default async function AppSupportKnowledgeArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const locale = await getLocale();
  const { marketing } = await getMarketingContext();
  const article = getPublicKnowledgeArticle(marketing, slug);
  if (!article) notFound();

  const dict = {
    ...(await getCustomerAppDictionaryForSplits(locale, ["portalStructure"])),
    ...(await getDictionary(locale, ["pwa"])),
  };
  const t = createTranslator(dict);
  const hubLabels = getPublicKnowledgeHubLabels(marketing);
  const faqs = getPublicKnowledgeFaqs(marketing, slug);

  return (
    <AppKnowledgeArticlePanel
      article={article}
      faqs={faqs}
      backHref="/app/account/preferences"
      labels={{
        back: t("customerApp.settings.accountPreferences.back"),
        introductionLabel: hubLabels.introductionLabel,
        keyTakeawaysTitle: hubLabels.keyTakeawaysTitle,
        examplesTitle: hubLabels.examplesTitle,
        faqTitle: hubLabels.faqTitle,
        readingTimeLabel: hubLabels.readingTimeLabel,
        publishedLabel: hubLabels.publishedLabel,
      }}
    />
  );
}
