import type { Metadata } from "next";
import DigitalHeadquartersPageContent from "@/components/marketing/DigitalHeadquartersPageContent";
import { parseDigitalHeadquartersPageLabels } from "@/lib/marketing/governance/labels";
import { getMarketingContext } from "@/lib/marketing/get-marketing-context";
import { parseCtaBandLabels } from "@/lib/marketing/parse-marketing";

export async function generateMetadata(): Promise<Metadata> {
  const { marketing } = await getMarketingContext();
  const page = parseDigitalHeadquartersPageLabels(marketing, "media");
  return { title: page.meta.title, description: page.meta.description };
}

export default async function MediaPage() {
  const { marketing } = await getMarketingContext();
  const page = parseDigitalHeadquartersPageLabels(marketing, "media");
  const ctaBand = parseCtaBandLabels(marketing);

  return (
    <DigitalHeadquartersPageContent
      title={page.title}
      subtitle={page.subtitle}
      intro={page.intro}
      futureItems={page.futureItems}
      emptyMessage={page.emptyMessage}
      ctaPrimary={page.ctaPrimary}
      ctaSecondary={page.ctaSecondary}
      ctaHref={page.ctaHref}
      ctaSecondaryHref={page.ctaSecondaryHref}
      ctaBand={ctaBand}
      variant={page.variant}
    />
  );
}
