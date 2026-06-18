import { StrategicIntelligenceCenterPanel } from "@/components/app/executive/StrategicIntelligenceCenterPanel";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ExecutiveStrategicIntelligencePage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["dashboard"]);
  const t = createTranslator(dict);
  const p = "customerApp.executiveStrategicIntelligence";

  return (
    <StrategicIntelligenceCenterPanel
      labels={{
        title: t(`${p}.title`),
        subtitle: t(`${p}.subtitle`),
        loading: t(`${p}.loading`),
        corePrinciple: t(`${p}.corePrinciple`),
        philosophyTitle: t(`${p}.philosophyTitle`),
        visionTitle: t(`${p}.visionTitle`),
        executiveLink: t(`${p}.executiveLink`),
        decisionSupportLink: t(`${p}.decisionSupportLink`),
        strategicFoundationLink: t(`${p}.strategicFoundationLink`),
        executiveIntelligenceLink: t(`${p}.executiveIntelligenceLink`),
        dashboardTitle: t(`${p}.dashboardTitle`),
        opportunitiesTitle: t(`${p}.opportunitiesTitle`),
        risksTitle: t(`${p}.risksTitle`),
        trendsTitle: t(`${p}.trendsTitle`),
        prioritiesTitle: t(`${p}.prioritiesTitle`),
        insightsTitle: t(`${p}.insightsTitle`),
        recommendationsTitle: t(`${p}.recommendationsTitle`),
        reviewsTitle: t(`${p}.reviewsTitle`),
        scenariosTitle: t(`${p}.scenariosTitle`),
        emptySection: t(`${p}.emptySection`),
        domain: t(`${p}.domain`),
        impact: t(`${p}.impact`),
        urgency: t(`${p}.urgency`),
        priorityMatrix: t(`${p}.priorityMatrix`),
        trend: t(`${p}.trend`),
        escalate: t(`${p}.escalate`),
        prioritize: t(`${p}.prioritize`),
        evaluate: t(`${p}.evaluate`),
        monitor: t(`${p}.monitor`),
        accept: t(`${p}.accept`),
        dismiss: t(`${p}.dismiss`),
        completeReview: t(`${p}.completeReview`),
        leadershipDecides: t(`${p}.leadershipDecides`),
        domains: {
          business_performance: t(`${p}.domains.business_performance`),
          customer_intelligence: t(`${p}.domains.customer_intelligence`),
          workforce_intelligence: t(`${p}.domains.workforce_intelligence`),
          market_intelligence: t(`${p}.domains.market_intelligence`),
          executive_intelligence: t(`${p}.domains.executive_intelligence`),
        },
        reviewTypes: {
          monthly: t(`${p}.reviewTypes.monthly`),
          quarterly: t(`${p}.reviewTypes.quarterly`),
          annual: t(`${p}.reviewTypes.annual`),
        },
        metrics: {
          opportunities: t(`${p}.metrics.opportunities`),
          risks: t(`${p}.metrics.risks`),
          trends: t(`${p}.metrics.trends`),
          escalations: t(`${p}.metrics.escalations`),
          reviewsPending: t(`${p}.metrics.reviewsPending`),
          satisfaction: t(`${p}.metrics.satisfaction`),
          trust: t(`${p}.metrics.trust`),
        },
        privacyNote: t(`${p}.privacyNote`),
      }}
    />
  );
}
