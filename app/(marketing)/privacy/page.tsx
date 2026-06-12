import type { Metadata } from "next";
import { MarketingPageHeader } from "@/components/marketing";
import { getMarketingContext } from "@/lib/marketing/get-marketing-context";
import { getSection, recordValues } from "@/lib/marketing/parse-marketing";

export async function generateMetadata(): Promise<Metadata> {
  const { marketing } = await getMarketingContext();
  const meta = getSection<{ privacyTitle?: string; privacyDescription?: string }>(marketing, "meta");
  return { title: meta.privacyTitle, description: meta.privacyDescription };
}

export default async function PrivacyPage() {
  const { marketing } = await getMarketingContext();
  const privacyPage = getSection<{
    title?: string;
    updated?: string;
    sections?: Record<string, { title: string; body: string }>;
  }>(marketing, "privacyPage");

  const sections = recordValues(privacyPage.sections);

  return (
    <>
      <MarketingPageHeader title={privacyPage.title ?? ""} subtitle={privacyPage.updated} />
      <div className="mx-auto max-w-3xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
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
