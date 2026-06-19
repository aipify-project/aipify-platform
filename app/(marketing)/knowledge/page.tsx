import type { Metadata } from "next";
import { MarketingCtaBand, MarketingPageHeader, MarketingTrustSignalStrip } from "@/components/marketing";
import { getMarketingContext } from "@/lib/marketing/get-marketing-context";
import { getSection, parseCtaBandLabels, parseStringList } from "@/lib/marketing/parse-marketing";

type KnowledgeFaq = { q: string; a: string };

export async function generateMetadata(): Promise<Metadata> {
  const { marketing } = await getMarketingContext();
  const meta = getSection<{ knowledgeTitle?: string; knowledgeDescription?: string }>(marketing, "meta");
  return { title: meta.knowledgeTitle, description: meta.knowledgeDescription };
}

export default async function KnowledgePage() {
  const { marketing } = await getMarketingContext();
  const knowledgePage = getSection<{
    title?: string;
    subtitle?: string;
    faqIntro?: string;
    faqs?: Record<string, KnowledgeFaq>;
  }>(marketing, "knowledgePage");
  const ctaBand = parseCtaBandLabels(marketing);
  const trustSignals = parseStringList(marketing, "trustSignalStrip", "signals");

  const faqs = Object.values(knowledgePage.faqs ?? {}).slice(0, 3);

  return (
    <>
      <MarketingPageHeader title={knowledgePage.title ?? ""} subtitle={knowledgePage.subtitle} />
      <MarketingTrustSignalStrip signals={trustSignals} />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-aipify-text-secondary">{knowledgePage.faqIntro}</p>
        <p className="mt-4 text-sm text-aipify-text-muted">
          Full FAQ: content/knowledge/aipify/public-website/faq/public-website-faq.md
        </p>
        <div className="mt-10 space-y-6 rounded-2xl border border-aipify-border bg-aipify-surface p-6 shadow-sm">
          {faqs.map((faq) => (
            <article key={faq.q}>
              <h2 className="text-lg font-semibold text-aipify-text">{faq.q}</h2>
              <p className="mt-2 text-sm text-aipify-text-secondary">{faq.a}</p>
            </article>
          ))}
        </div>
      </div>
      <MarketingCtaBand {...ctaBand} />
    </>
  );
}
