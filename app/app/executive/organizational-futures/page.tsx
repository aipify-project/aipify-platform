import { OrganizationalFuturesCenterPanel } from "@/components/app/organizational-futures-center";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function OrganizationalFuturesCenterPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["dashboard"]);
  const t = createTranslator(dict);
  const p = "customerApp.organizationalFuturesCenter";

  return (
    <OrganizationalFuturesCenterPanel
      labels={{
        title: t(`${p}.title`),
        subtitle: t(`${p}.subtitle`),
        loading: t(`${p}.loading`),
        corePrinciple: t(`${p}.corePrinciple`),
        philosophyTitle: t(`${p}.philosophyTitle`),
        visionTitle: t(`${p}.visionTitle`),
        executiveLink: t(`${p}.executiveLink`),
        organizationalMomentumLink: t(`${p}.organizationalMomentumLink`),
        organizationalTrustLink: t(`${p}.organizationalTrustLink`),
        organizationalStewardshipLink: t(`${p}.organizationalStewardshipLink`),
        organizationalSimplicityLink: t(`${p}.organizationalSimplicityLink`),
        organizationalPurposeLink: t(`${p}.organizationalPurposeLink`),
        dashboardTitle: t(`${p}.dashboardTitle`),
        scenariosTitle: t(`${p}.scenariosTitle`),
        signalsTitle: t(`${p}.signalsTitle`),
        readinessTitle: t(`${p}.readinessTitle`),
        reviewsTitle: t(`${p}.reviewsTitle`),
        timelineTitle: t(`${p}.timelineTitle`),
        archivesTitle: t(`${p}.archivesTitle`),
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
        scheduleWorkshop: t(`${p}.scheduleWorkshop`),
        exploreScenario: t(`${p}.exploreScenario`),
        generateReport: t(`${p}.generateReport`),
        printSummary: t(`${p}.printSummary`),
        exportSnapshot: t(`${p}.exportSnapshot`),
        coordinateReflection: t(`${p}.coordinateReflection`),
        archiveHistory: t(`${p}.archiveHistory`),
        humansDecide: t(`${p}.humansDecide`),
        privacyNote: t(`${p}.privacyNote`),
        readinessScore: t(`${p}.readinessScore`),
        domains: {
          market: t(`${p}.domains.market`),
          technology: t(`${p}.domains.technology`),
          workforce: t(`${p}.domains.workforce`),
          customer: t(`${p}.domains.customer`),
          organizational: t(`${p}.domains.organizational`),
        },
        scenarioTypes: {
          best_case: t(`${p}.scenarioTypes.best_case`),
          expected: t(`${p}.scenarioTypes.expected`),
          challenging: t(`${p}.scenarioTypes.challenging`),
          transformational: t(`${p}.scenarioTypes.transformational`),
        },
        scenarioStatuses: {
          draft: t(`${p}.scenarioStatuses.draft`),
          explored: t(`${p}.scenarioStatuses.explored`),
        },
        signalTypes: {
          emerging_opportunity: t(`${p}.signalTypes.emerging_opportunity`),
          environmental_shift: t(`${p}.signalTypes.environmental_shift`),
          customer_change: t(`${p}.signalTypes.customer_change`),
          technology_development: t(`${p}.signalTypes.technology_development`),
          workforce_transition: t(`${p}.signalTypes.workforce_transition`),
        },
        signalTones: {
          positive: t(`${p}.signalTones.positive`),
          neutral: t(`${p}.signalTones.neutral`),
          attention: t(`${p}.signalTones.attention`),
        },
        readinessLevels: {
          highly_prepared: t(`${p}.readinessLevels.highly_prepared`),
          prepared: t(`${p}.readinessLevels.prepared`),
          developing: t(`${p}.readinessLevels.developing`),
          limited_readiness: t(`${p}.readinessLevels.limited_readiness`),
          review_recommended: t(`${p}.readinessLevels.review_recommended`),
        },
        readinessDimensions: {
          capabilities: t(`${p}.readinessDimensions.capabilities`),
          governance: t(`${p}.readinessDimensions.governance`),
          technology: t(`${p}.readinessDimensions.technology`),
          leadership: t(`${p}.readinessDimensions.leadership`),
          knowledge: t(`${p}.readinessDimensions.knowledge`),
          strategic_flexibility: t(`${p}.readinessDimensions.strategic_flexibility`),
        },
        healthLabels: {
          highly_prepared: t(`${p}.healthLabels.highly_prepared`),
          prepared: t(`${p}.healthLabels.prepared`),
          developing: t(`${p}.healthLabels.developing`),
          limited_readiness: t(`${p}.healthLabels.limited_readiness`),
          review_recommended: t(`${p}.healthLabels.review_recommended`),
        },
        timelineTypes: {
          scenario_explored: t(`${p}.timelineTypes.scenario_explored`),
          signal_detected: t(`${p}.timelineTypes.signal_detected`),
          strategic_adjustment: t(`${p}.timelineTypes.strategic_adjustment`),
          preparedness_initiative: t(`${p}.timelineTypes.preparedness_initiative`),
          executive_reflection: t(`${p}.timelineTypes.executive_reflection`),
        },
        reviewTypes: {
          quarterly_futures: t(`${p}.reviewTypes.quarterly_futures`),
          annual_scenario_planning: t(`${p}.reviewTypes.annual_scenario_planning`),
          strategic_foresight: t(`${p}.reviewTypes.strategic_foresight`),
          executive_reflection: t(`${p}.reviewTypes.executive_reflection`),
        },
        sessionTypes: {
          executive_workshop: t(`${p}.sessionTypes.executive_workshop`),
          leadership_reflection: t(`${p}.sessionTypes.leadership_reflection`),
          scenario_planning: t(`${p}.sessionTypes.scenario_planning`),
        },
        metrics: {
          scenariosExplored: t(`${p}.metrics.scenariosExplored`),
          signals: t(`${p}.metrics.signals`),
          preparedness: t(`${p}.metrics.preparedness`),
          reviews: t(`${p}.metrics.reviews`),
          capabilities: t(`${p}.metrics.capabilities`),
          technology: t(`${p}.metrics.technology`),
          flexibility: t(`${p}.metrics.flexibility`),
          confidence: t(`${p}.metrics.confidence`),
        },
        executiveFields: {
          scenarioReadiness: t(`${p}.executiveFields.scenarioReadiness`),
          resilience: t(`${p}.executiveFields.resilience`),
          signals: t(`${p}.executiveFields.signals`),
          opportunities: t(`${p}.executiveFields.opportunities`),
        },
      }}
    />
  );
}
