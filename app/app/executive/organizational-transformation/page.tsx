import { OrganizationalTransformationCenterPanel } from "@/components/app/organizational-transformation-center";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function OrganizationalTransformationCenterPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["dashboard"]);
  const t = createTranslator(dict);
  const p = "customerApp.organizationalTransformationCenter";

  return (
    <OrganizationalTransformationCenterPanel
      labels={{
        title: t(`${p}.title`),
        subtitle: t(`${p}.subtitle`),
        loading: t(`${p}.loading`),
        corePrinciple: t(`${p}.corePrinciple`),
        philosophyTitle: t(`${p}.philosophyTitle`),
        visionTitle: t(`${p}.visionTitle`),
        executiveLink: t(`${p}.executiveLink`),
        organizationalSustainabilityLink: t(`${p}.organizationalSustainabilityLink`),
        organizationalRenewalLink: t(`${p}.organizationalRenewalLink`),
        dashboardTitle: t(`${p}.dashboardTitle`),
        signalsTitle: t(`${p}.signalsTitle`),
        adoptionTitle: t(`${p}.adoptionTitle`),
        initiativesTitle: t(`${p}.initiativesTitle`),
        reviewsTitle: t(`${p}.reviewsTitle`),
        workflowTitle: t(`${p}.workflowTitle`),
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
        scheduleWorkshop: t(`${p}.scheduleWorkshop`),
        completeInitiative: t(`${p}.completeInitiative`),
        generateReport: t(`${p}.generateReport`),
        printSummary: t(`${p}.printSummary`),
        exportSnapshot: t(`${p}.exportSnapshot`),
        coordinateReview: t(`${p}.coordinateReview`),
        archiveMilestone: t(`${p}.archiveMilestone`),
        humansDecide: t(`${p}.humansDecide`),
        privacyNote: t(`${p}.privacyNote`),
        readinessScore: t(`${p}.readinessScore`),
        adoptionMomentum: t(`${p}.adoptionMomentum`),
        domains: {
          strategic: t(`${p}.domains.strategic`),
          digital: t(`${p}.domains.digital`),
          cultural: t(`${p}.domains.cultural`),
          leadership: t(`${p}.domains.leadership`),
          operational: t(`${p}.domains.operational`),
        },
        signalTypes: {
          initiative_momentum: t(`${p}.signalTypes.initiative_momentum`),
          adoption_effectiveness: t(`${p}.signalTypes.adoption_effectiveness`),
          capability_development: t(`${p}.signalTypes.capability_development`),
          leadership_participation: t(`${p}.signalTypes.leadership_participation`),
          risk_indicator: t(`${p}.signalTypes.risk_indicator`),
        },
        signalTones: {
          positive: t(`${p}.signalTones.positive`),
          neutral: t(`${p}.signalTones.neutral`),
          attention: t(`${p}.signalTones.attention`),
        },
        adoptionTypes: {
          behavioral_adoption: t(`${p}.adoptionTypes.behavioral_adoption`),
          workflow_integration: t(`${p}.adoptionTypes.workflow_integration`),
          capability_utilization: t(`${p}.adoptionTypes.capability_utilization`),
          leadership_reinforcement: t(`${p}.adoptionTypes.leadership_reinforcement`),
          long_term_sustainability: t(`${p}.adoptionTypes.long_term_sustainability`),
        },
        initiativeStatuses: {
          planned: t(`${p}.initiativeStatuses.planned`),
          in_progress: t(`${p}.initiativeStatuses.in_progress`),
          completed: t(`${p}.initiativeStatuses.completed`),
        },
        readinessLabels: {
          highly_ready: t(`${p}.readinessLabels.highly_ready`),
          prepared: t(`${p}.readinessLabels.prepared`),
          developing: t(`${p}.readinessLabels.developing`),
          limited_readiness: t(`${p}.readinessLabels.limited_readiness`),
          transformation_risk: t(`${p}.readinessLabels.transformation_risk`),
        },
        timelineTypes: {
          transformation_milestone: t(`${p}.timelineTypes.transformation_milestone`),
          leadership_initiative: t(`${p}.timelineTypes.leadership_initiative`),
          adoption_breakthrough: t(`${p}.timelineTypes.adoption_breakthrough`),
          capability_development: t(`${p}.timelineTypes.capability_development`),
          organizational_achievement: t(`${p}.timelineTypes.organizational_achievement`),
        },
        reviewTypes: {
          monthly_transformation: t(`${p}.reviewTypes.monthly_transformation`),
          quarterly_executive_reflection: t(`${p}.reviewTypes.quarterly_executive_reflection`),
          adoption_discussion: t(`${p}.reviewTypes.adoption_discussion`),
          annual_transformation_assessment: t(`${p}.reviewTypes.annual_transformation_assessment`),
        },
        sessionTypes: {
          reflection_session: t(`${p}.sessionTypes.reflection_session`),
          leadership_workshop: t(`${p}.sessionTypes.leadership_workshop`),
          stakeholder_review: t(`${p}.sessionTypes.stakeholder_review`),
        },
        metrics: {
          leadership: t(`${p}.metrics.leadership`),
          workforce: t(`${p}.metrics.workforce`),
          capability: t(`${p}.metrics.capability`),
          communication: t(`${p}.metrics.communication`),
          governance: t(`${p}.metrics.governance`),
          risks: t(`${p}.metrics.risks`),
          initiatives: t(`${p}.metrics.initiatives`),
          reviews: t(`${p}.metrics.reviews`),
        },
        executiveFields: {
          strategic: t(`${p}.executiveFields.strategic`),
          leadership: t(`${p}.executiveFields.leadership`),
          adoption: t(`${p}.executiveFields.adoption`),
          opportunities: t(`${p}.executiveFields.opportunities`),
        },
      }}
    />
  );
}
