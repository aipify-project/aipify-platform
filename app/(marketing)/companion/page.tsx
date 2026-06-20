import type { Metadata } from "next";
import CompanionPageContent from "@/components/marketing/CompanionPageContent";
import { getMarketingContext } from "@/lib/marketing/get-marketing-context";
import { parseHomepageRedesign } from "@/lib/marketing/parse-homepage";
import { getSection } from "@/lib/marketing/parse-marketing";

export async function generateMetadata(): Promise<Metadata> {
  const { marketing } = await getMarketingContext();
  const meta = getSection<{ title?: string; description?: string }>(marketing, "publicPages.companion.meta");
  return {
    title: meta.title ?? "Aipify Companion",
    description: meta.description,
  };
}

export default async function CompanionPage() {
  const { marketing, common } = await getMarketingContext();
  const content = parseHomepageRedesign(marketing);
  const labels = getSection<Parameters<typeof CompanionPageContent>[0]["labels"]>(
    marketing,
    "publicPages.companion"
  );

  return (
    <CompanionPageContent
      labels={labels}
      companion={content.companion}
      commandBrief={content.commandBrief}
      appName={common.appName}
    />
  );
}
