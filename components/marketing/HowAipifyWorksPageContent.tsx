import SimpleFlowSection from "@/components/marketing/homepage/SimpleFlowSection";
import { PublicCTA, PublicPageHero } from "@/components/marketing/public";
import {
  First30DaysSection,
  ImplementationCtaBand,
  MarketingDifferentiationStrip,
  OnboardingChecklistSection,
  VerticalFlowSection,
} from "@/components/marketing";
import type { GetStartedPageLabels } from "@/components/marketing/GetStartedPageContent";
import type { HomepageRedesignContent } from "@/lib/marketing/parse-homepage";
import { MARKETING_PRIMARY_CTA_HREFS } from "@/lib/marketing/primary-ctas";

type HowAipifyWorksPageLabels = {
  meta: { title: string; description: string };
  breadcrumbs: { home: string; howItWorks: string };
  hero: { eyebrow: string; title: string; subtitle: string };
  cta: {
    title: string;
    subtitle: string;
    bookDemo: string;
    getStarted: string;
  };
};

type Props = {
  labels: HowAipifyWorksPageLabels;
  simpleFlow: HomepageRedesignContent["simpleFlow"];
  getStarted: GetStartedPageLabels;
  differentiationThemes: string[];
};

export default function HowAipifyWorksPageContent({
  labels,
  simpleFlow,
  getStarted,
  differentiationThemes,
}: Props) {
  return (
    <>
      <PublicPageHero
        eyebrow={labels.hero.eyebrow}
        title={labels.hero.title}
        subtitle={labels.hero.subtitle}
        breadcrumbs={[
          { label: labels.breadcrumbs.home, href: "/" },
          { label: labels.breadcrumbs.howItWorks },
        ]}
        primaryCta={{
          label: labels.cta.bookDemo,
          href: MARKETING_PRIMARY_CTA_HREFS.bookDemo,
          analyticsId: "how_it_works_hero_book_demo",
        }}
        secondaryCta={{
          label: labels.cta.getStarted,
          href: "/book-demo",
          analyticsId: "how_it_works_hero_demo",
        }}
      />

      <SimpleFlowSection
        title={simpleFlow.title}
        subtitle={simpleFlow.subtitle}
        learnMore={simpleFlow.learnMore}
        steps={simpleFlow.steps}
      />

      <MarketingDifferentiationStrip themes={differentiationThemes} />

      <First30DaysSection title={getStarted.first30Days.title} milestones={getStarted.first30Days.milestones} />

      <VerticalFlowSection
        sectionId="implementation-timeline"
        title={getStarted.implementationTimeline.title}
        steps={getStarted.implementationTimeline.steps}
        muted
      />

      <OnboardingChecklistSection
        title={getStarted.companionChecklist.title}
        items={getStarted.companionChecklist.items}
      />

      <ImplementationCtaBand {...getStarted.implementationCta} />

      <PublicCTA
        title={labels.cta.title}
        subtitle={labels.cta.subtitle}
        primaryLabel={labels.cta.bookDemo}
        primaryHref={MARKETING_PRIMARY_CTA_HREFS.bookDemo}
        secondaryLabel={labels.cta.getStarted}
        secondaryHref="/book-demo"
        analyticsPrimary="how_it_works_cta_book_demo"
        analyticsSecondary="how_it_works_cta_demo"
      />
    </>
  );
}
