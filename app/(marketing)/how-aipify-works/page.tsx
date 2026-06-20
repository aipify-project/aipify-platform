import type { Metadata } from "next";
import HowAipifyWorksPageContent from "@/components/marketing/HowAipifyWorksPageContent";
import { getMarketingContext } from "@/lib/marketing/get-marketing-context";
import { parseHomepageRedesign } from "@/lib/marketing/parse-homepage";
import { getSection, parseGetStartedPageLabels, parseStringList } from "@/lib/marketing/parse-marketing";

export async function generateMetadata(): Promise<Metadata> {
  const { marketing } = await getMarketingContext();
  const meta = getSection<{ title?: string; description?: string }>(
    marketing,
    "publicPages.howAipifyWorks.meta"
  );
  return {
    title: meta.title ?? "How Aipify Works",
    description: meta.description,
  };
}

export default async function HowAipifyWorksPage() {
  const { marketing } = await getMarketingContext();
  const content = parseHomepageRedesign(marketing);
  const labels = getSection<Parameters<typeof HowAipifyWorksPageContent>[0]["labels"]>(
    marketing,
    "publicPages.howAipifyWorks"
  );
  const getStarted = parseGetStartedPageLabels(marketing);

  return (
    <HowAipifyWorksPageContent
      labels={labels}
      simpleFlow={content.simpleFlow}
      getStarted={getStarted}
      differentiationThemes={parseStringList(marketing, "differentiationStrip", "themes")}
    />
  );
}
