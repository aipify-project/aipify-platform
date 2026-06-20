import dynamic from "next/dynamic";
import {
  CommandBriefSection,
  CoreOutcomesSection,
  CuratedPacksSection,
  HomepageCompanionSection,
  HomepageFinalCta,
  HomepageHero,
  HomepageTrustSection,
  SimpleFlowSection,
} from "@/components/marketing/homepage";
import { getMarketingContext } from "@/lib/marketing/get-marketing-context";
import { parseHomepageRedesign } from "@/lib/marketing/parse-homepage";
import { getSection } from "@/lib/marketing/parse-marketing";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { createTranslator } from "@/lib/i18n/translate";
import { buildHumanVerificationLabels } from "@/lib/system-notice/labels";

const HomepageWorkflowDemo = dynamic(
  () => import("@/components/marketing/homepage/HomepageWorkflowDemo"),
  { loading: () => null }
);

export default async function MarketingHomePage() {
  const { marketing, common, locale } = await getMarketingContext();
  const content = parseHomepageRedesign(marketing);
  const earlyAccess = getSection<Record<string, unknown>>(marketing, "earlyAccess");
  const dict = await getDictionary(locale, ["common"]);
  const t = createTranslator(dict);

  const flowSteps = content.simpleFlow.steps;
  const companionCapabilities = content.companion.capabilities;

  return (
    <>
      <HomepageHero hero={content.hero} commandBrief={content.commandBrief} />

      <CommandBriefSection labels={content.commandBrief} />

      <CoreOutcomesSection title={content.coreOutcomes.title} items={content.coreOutcomes.items} />

      <SimpleFlowSection
        title={content.simpleFlow.title}
        subtitle={content.simpleFlow.subtitle}
        learnMore={content.simpleFlow.learnMore}
        steps={flowSteps}
      />

      <CuratedPacksSection
        title={content.businessPacks.title}
        subtitle={content.businessPacks.subtitle}
        viewDetails={content.businessPacks.viewDetails}
        exploreAll={content.businessPacks.exploreAll}
        packs={content.businessPacks.packs}
      />

      <HomepageWorkflowDemo
        title={content.workflowDemo.title}
        subtitle={content.workflowDemo.subtitle}
        steps={content.workflowDemo.steps}
      />

      <HomepageTrustSection
        title={content.enterpriseTrust.title}
        subtitle={content.enterpriseTrust.subtitle}
        exploreEnterprise={content.enterpriseTrust.exploreEnterprise}
        points={content.enterpriseTrust.points}
      />

      <HomepageCompanionSection
        title={content.companion.title}
        subtitle={content.companion.subtitle}
        learnMore={content.companion.learnMore}
        capabilities={companionCapabilities}
        appName={common.appName}
      />

      <HomepageFinalCta
        title={content.finalCta.title}
        subtitle={content.finalCta.subtitle}
        bookDemo={content.finalCta.bookDemo}
        earlyAccessDivider={content.finalCta.earlyAccessDivider}
        earlyAccessLabels={earlyAccess as Parameters<typeof HomepageFinalCta>[0]["earlyAccessLabels"]}
        verificationLabels={buildHumanVerificationLabels(t)}
      />
    </>
  );
}
