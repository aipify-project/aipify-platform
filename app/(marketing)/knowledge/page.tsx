import type { Metadata } from "next";
import { MarketingPageHeader } from "@/components/marketing";
import { getMarketingContext } from "@/lib/marketing/get-marketing-context";
import { getSection } from "@/lib/marketing/parse-marketing";

export async function generateMetadata(): Promise<Metadata> {
  const { marketing } = await getMarketingContext();
  const meta = getSection<{ knowledgeTitle?: string; knowledgeDescription?: string }>(marketing, "meta");
  return { title: meta.knowledgeTitle, description: meta.knowledgeDescription };
}

export default async function KnowledgePage() {
  const { marketing } = await getMarketingContext();
  const knowledgePage = getSection<Record<string, string>>(marketing, "knowledgePage");

  return (
    <>
      <MarketingPageHeader title={knowledgePage.title ?? ""} subtitle={knowledgePage.subtitle} />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="text-slate-400">{knowledgePage.faqIntro}</p>
          <p className="mt-4 text-sm text-slate-500">
            Full FAQ: content/knowledge/aipify/public-website/faq/public-website-faq.md
          </p>
        <div className="mt-10 space-y-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <article>
            <h2 className="text-lg font-semibold text-white">What is Aipify?</h2>
            <p className="mt-2 text-sm text-slate-400">
              An AI Business Operating System — install-first operational intelligence, not a chatbot.
            </p>
          </article>
          <article>
            <h2 className="text-lg font-semibold text-white">Does Aipify monitor employees?</h2>
            <p className="mt-2 text-sm text-slate-400">
              No. Aipify does not monitor keystrokes, screens, or employee activity. Presence reflects system state only.
            </p>
          </article>
          <article>
            <h2 className="text-lg font-semibold text-white">How do humans stay in control?</h2>
            <p className="mt-2 text-sm text-slate-400">
              Sensitive and critical actions require explicit approval. Critical actions are prohibited for AI alone.
            </p>
          </article>
        </div>
      </div>
    </>
  );
}
