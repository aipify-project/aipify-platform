import {
  BuyingJourneySection,
  CuratedPacksSection,
  HomepageCompanionSection,
  HomepageFinalCta,
  HomepageHero,
  HomepageTrustSection,
  PracticeSection,
  ProblemOutcomeSection,
  SimpleFlowSection,
  TrustFoundationStrip,
} from "@/components/marketing/homepage";
import { getMarketingContext } from "@/lib/marketing/get-marketing-context";
import { parseHomepageRedesign } from "@/lib/marketing/parse-homepage";

export default async function MarketingHomePage() {
  const { marketing, common } = await getMarketingContext();
  const content = parseHomepageRedesign(marketing);

  return (
    <>
      <HomepageHero hero={content.hero} commandBrief={content.commandBrief} />

      <TrustFoundationStrip items={content.trustFoundation.items} />

      <ProblemOutcomeSection {...content.problemOutcome} />

      <SimpleFlowSection
        title={content.simpleFlow.title}
        subtitle={content.simpleFlow.subtitle}
        learnMore={content.simpleFlow.learnMore}
        permissionNote={content.simpleFlow.permissionNote}
        steps={content.simpleFlow.steps}
      />

      <CuratedPacksSection
        title={content.businessPacks.title}
        subtitle={content.businessPacks.subtitle}
        viewDetails={content.businessPacks.viewDetails}
        exploreAll={content.businessPacks.exploreAll}
        packs={content.businessPacks.packs}
      />

      <HomepageCompanionSection
        title={content.companion.title}
        subtitle={content.companion.subtitle}
        learnMore={content.companion.learnMore}
        capabilities={content.companion.capabilities}
        appName={common.appName}
      />

      <HomepageTrustSection
        title={content.enterpriseTrust.title}
        subtitle={content.enterpriseTrust.subtitle}
        exploreEnterprise={content.enterpriseTrust.exploreEnterprise}
        points={content.enterpriseTrust.points}
      />

      <PracticeSection
        title={content.practice.title}
        subtitle={content.practice.subtitle}
        illustrativeLabel={content.practice.illustrativeLabel}
        exampleLabel={content.practice.exampleLabel}
        examples={content.practice.examples}
      />

      <BuyingJourneySection
        title={content.buyingJourney.title}
        subtitle={content.buyingJourney.subtitle}
        footnote={content.buyingJourney.footnote}
        comparePlans={content.buyingJourney.comparePlans}
        plans={content.buyingJourney.plans}
      />

      <HomepageFinalCta
        title={content.finalCta.title}
        subtitle={content.finalCta.subtitle}
        bookDemo={content.finalCta.bookDemo}
        talkToAipify={content.finalCta.talkToAipify}
      />
    </>
  );
}
