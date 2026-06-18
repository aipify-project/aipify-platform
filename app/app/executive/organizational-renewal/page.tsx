import { OrganizationalRenewalCenterPanel } from "@/components/app/organizational-renewal-center";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function OrganizationalRenewalCenterPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["dashboard"]);
  const t = createTranslator(dict);
  const p = "customerApp.organizationalRenewalCenter";

  return (
    <OrganizationalRenewalCenterPanel
      labels={{
        title: t(`${p}.title`),
        subtitle: t(`${p}.subtitle`),
        loading: t(`${p}.loading`),
        corePrinciple: t(`${p}.corePrinciple`),
        philosophyTitle: t(`${p}.philosophyTitle`),
        visionTitle: t(`${p}.visionTitle`),
        executiveLink: t(`${p}.executiveLink`),
        organizationalFlourishingLink: t(`${p}.organizationalFlourishingLink`),
        organizationalLearningLink: t(`${p}.organizationalLearningLink`),
        organizationalAdaptabilityLink: t(`${p}.organizationalAdaptabilityLink`),
        dashboardTitle: t(`${p}.dashboardTitle`),
        opportunitiesTitle: t(`${p}.opportunitiesTitle`),
        balanceTitle: t(`${p}.balanceTitle`),
        initiativesTitle: t(`${p}.initiativesTitle`),
        reviewsTitle: t(`${p}.reviewsTitle`),
        timelineTitle: t(`${p}.timelineTitle`),
        milestonesTitle: t(`${p}.milestonesTitle`),
        snapshotsTitle: t(`${p}.snapshotsTitle`),
        insightsTitle: t(`${p}.insightsTitle`),
        recommendationsTitle: t(`${p}.recommendationsTitle`),
        executiveTitle: t(`${p}.executiveTitle`),
        sessionsTitle: t(`${p}.sessionsTitle`),
        emptySection: t(`${p}.emptySection`),
        dismiss: t(`${p}.dismiss`),
        accept: t(`${p}.accept`),
        completeReview: t(`${p}.completeReview`),
        completeSession: t(`${p}.completeSession`),
        scheduleReflection: t(`${p}.scheduleReflection`),
        completeInitiative: t(`${p}.completeInitiative`),
        generateReport: t(`${p}.generateReport`),
        printSummary: t(`${p}.printSummary`),
        exportSnapshot: t(`${p}.exportSnapshot`),
        coordinateDiscussion: t(`${p}.coordinateDiscussion`),
        archiveMilestone: t(`${p}.archiveMilestone`),
        humansDecide: t(`${p}.humansDecide`),
        privacyNote: t(`${p}.privacyNote`),
        renewalScore: t(`${p}.renewalScore`),
        strategicReassessment: t(`${p}.strategicReassessment`),
        domains: {
          strategic: t(`${p}.domains.strategic`),
          leadership: t(`${p}.domains.leadership`),
          capability: t(`${p}.domains.capability`),
          knowledge: t(`${p}.domains.knowledge`),
          cultural: t(`${p}.domains.cultural`),
          operational: t(`${p}.domains.operational`),
        },
        opportunityTypes: {
          outdated_assumption: t(`${p}.opportunityTypes.outdated_assumption`),
          emerging_capability: t(`${p}.opportunityTypes.emerging_capability`),
          leadership_development: t(`${p}.opportunityTypes.leadership_development`),
          process_modernization: t(`${p}.opportunityTypes.process_modernization`),
          strategic_evolution: t(`${p}.opportunityTypes.strategic_evolution`),
        },
        opportunityTones: {
          positive: t(`${p}.opportunityTones.positive`),
          neutral: t(`${p}.opportunityTones.neutral`),
          attention: t(`${p}.opportunityTones.attention`),
        },
        balanceTypes: {
          preserve: t(`${p}.balanceTypes.preserve`),
          evolve: t(`${p}.balanceTypes.evolve`),
          retire: t(`${p}.balanceTypes.retire`),
          capability_investment: t(`${p}.balanceTypes.capability_investment`),
          timeless_values: t(`${p}.balanceTypes.timeless_values`),
        },
        initiativeStatuses: {
          planned: t(`${p}.initiativeStatuses.planned`),
          in_progress: t(`${p}.initiativeStatuses.in_progress`),
          completed: t(`${p}.initiativeStatuses.completed`),
        },
        healthLabels: {
          thriving: t(`${p}.healthLabels.thriving`),
          healthy: t(`${p}.healthLabels.healthy`),
          developing: t(`${p}.healthLabels.developing`),
          renewal_recommended: t(`${p}.healthLabels.renewal_recommended`),
          stagnation_risk: t(`${p}.healthLabels.stagnation_risk`),
        },
        timelineTypes: {
          strategic_update: t(`${p}.timelineTypes.strategic_update`),
          capability_improvement: t(`${p}.timelineTypes.capability_improvement`),
          leadership_milestone: t(`${p}.timelineTypes.leadership_milestone`),
          cultural_development: t(`${p}.timelineTypes.cultural_development`),
          knowledge_modernization: t(`${p}.timelineTypes.knowledge_modernization`),
        },
        reviewTypes: {
          quarterly_renewal: t(`${p}.reviewTypes.quarterly_renewal`),
          leadership_reflection: t(`${p}.reviewTypes.leadership_reflection`),
          annual_strategic_reflection: t(`${p}.reviewTypes.annual_strategic_reflection`),
          capability_reassessment: t(`${p}.reviewTypes.capability_reassessment`),
        },
        sessionTypes: {
          reflection_session: t(`${p}.sessionTypes.reflection_session`),
          leadership_learning: t(`${p}.sessionTypes.leadership_learning`),
          capability_workshop: t(`${p}.sessionTypes.capability_workshop`),
        },
        metrics: {
          adaptability: t(`${p}.metrics.adaptability`),
          learning: t(`${p}.metrics.learning`),
          leadership: t(`${p}.metrics.leadership`),
          capability: t(`${p}.metrics.capability`),
          momentum: t(`${p}.metrics.momentum`),
          integration: t(`${p}.metrics.integration`),
          initiatives: t(`${p}.metrics.initiatives`),
          reviews: t(`${p}.metrics.reviews`),
        },
        executiveFields: {
          strategic: t(`${p}.executiveFields.strategic`),
          leadership: t(`${p}.executiveFields.leadership`),
          capability: t(`${p}.executiveFields.capability`),
          opportunities: t(`${p}.executiveFields.opportunities`),
        },
      }}
    />
  );
}
