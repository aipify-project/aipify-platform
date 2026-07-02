import type { Metadata } from "next";
import CustomerStoriesPageContent, { type CustomerStoriesPageLabels } from "@/components/marketing/CustomerStoriesPageContent";
import { PublicPageHero } from "@/components/marketing/public";
import { getMarketingContext } from "@/lib/marketing/get-marketing-context";
import { getSection } from "@/lib/marketing/parse-marketing";
import { MARKETING_PRIMARY_CTA_HREFS } from "@/lib/marketing/primary-ctas";

export async function generateMetadata(): Promise<Metadata> {
  const { marketing } = await getMarketingContext();
  const stories = getSection<{ meta?: { title?: string; description?: string } }>(marketing, "customerStoriesPage");
  return {
    title: stories.meta?.title,
    description: stories.meta?.description,
  };
}

export default async function CustomerStoriesPage() {
  const { marketing } = await getMarketingContext();
  const labels = getSection<CustomerStoriesPageLabels>(marketing, "customerStoriesPage");
  const publicPages = getSection<{ breadcrumbs?: { home?: string } }>(marketing, "publicPages");
  const nav = getSection<Record<string, string>>(marketing, "nav");
  const homeLabel = publicPages.breadcrumbs?.home;
  const currentLabel = nav.customerStories;

  return (
    <>
      <PublicPageHero
        eyebrow={labels.hero.eyebrow ?? "Customer Stories"}
        title={labels.hero.headline}
        subtitle={labels.hero.subheadline}
        breadcrumbs={
          homeLabel && currentLabel
            ? [
                { label: homeLabel, href: "/" },
                { label: currentLabel },
              ]
            : undefined
        }
        primaryCta={{ label: labels.hero.cta, href: "#industry-examples", analyticsId: "customer_stories_explore" }}
        secondaryCta={{
          label: labels.hero.ctaSecondary ?? "Book a Demo",
          href: MARKETING_PRIMARY_CTA_HREFS.bookDemo,
          analyticsId: "customer_stories_book_demo",
        }}
      />
      <CustomerStoriesPageContent labels={labels} />
    </>
  );
}
