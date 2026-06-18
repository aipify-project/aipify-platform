import type { Metadata } from "next";
import { MarketingPageHeader } from "@/components/marketing";
import { getMarketingContext } from "@/lib/marketing/get-marketing-context";
import { getSection, recordValues } from "@/lib/marketing/parse-marketing";

export async function generateMetadata(): Promise<Metadata> {
  const { marketing } = await getMarketingContext();
  const page = getSection<{ title?: string; intro?: string }>(marketing, "growthPartnerTermsPage");
  return { title: page.title };
}

export default async function GrowthPartnerTermsPage() {
  const { marketing } = await getMarketingContext();
  const page = getSection<{
    title?: string;
    updated?: string;
    intro?: string;
    sections?: Record<string, { title: string; body: string }>;
  }>(marketing, "growthPartnerTermsPage");

  const sections = recordValues(page.sections);

  return (
    <>
      <MarketingPageHeader title={page.title ?? ""} subtitle={page.updated} />
      <div className="mx-auto max-w-3xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
        {page.intro ? <p className="text-sm leading-relaxed text-slate-400">{page.intro}</p> : null}
        {sections.map((section) => (
          <article key={section.title}>
            <h2 className="text-xl font-semibold text-white">{section.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">{section.body}</p>
          </article>
        ))}
      </div>
    </>
  );
}
