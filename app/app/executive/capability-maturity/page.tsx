import { CapabilityMaturityCenterPanel } from "@/components/app/capability-maturity-center";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function CapabilityMaturityCenterPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["core"]);
  const t = createTranslator(dict);
  const p = "customerApp.capabilityMaturityCenter";

  return (
    <CapabilityMaturityCenterPanel
      labels={{
        title: t(`${p}.title`),
        subtitle: t(`${p}.subtitle`),
        loading: t(`${p}.loading`),
        corePrinciple: t(`${p}.corePrinciple`),
        philosophyTitle: t(`${p}.philosophyTitle`),
        visionTitle: t(`${p}.visionTitle`),
        executiveLink: t(`${p}.executiveLink`),
        organizationalHealthLink: t(`${p}.organizationalHealthLink`),
        continuousImprovementLink: t(`${p}.continuousImprovementLink`),
        organizationalLearningLink: t(`${p}.organizationalLearningLink`),
        knowledgeEvolutionLink: t(`${p}.knowledgeEvolutionLink`),
        maturityEngineLink: t(`${p}.maturityEngineLink`),
        dashboardTitle: t(`${p}.dashboardTitle`),
        capabilitiesTitle: t(`${p}.capabilitiesTitle`),
        milestonesTitle: t(`${p}.milestonesTitle`),
        roadmapTitle: t(`${p}.roadmapTitle`),
        snapshotsTitle: t(`${p}.snapshotsTitle`),
        maturityLevelsTitle: t(`${p}.maturityLevelsTitle`),
        insightsTitle: t(`${p}.insightsTitle`),
        recommendationsTitle: t(`${p}.recommendationsTitle`),
        executiveTitle: t(`${p}.executiveTitle`),
        reviewsTitle: t(`${p}.reviewsTitle`),
        emptySection: t(`${p}.emptySection`),
        dismiss: t(`${p}.dismiss`),
        accept: t(`${p}.accept`),
        captureSnapshot: t(`${p}.captureSnapshot`),
        completeReview: t(`${p}.completeReview`),
        launchInitiative: t(`${p}.launchInitiative`),
        generateReport: t(`${p}.generateReport`),
        generateSummary: t(`${p}.generateSummary`),
        humansDecide: t(`${p}.humansDecide`),
        privacyNote: t(`${p}.privacyNote`),
        currentLevel: t(`${p}.currentLevel`),
        previousLevel: t(`${p}.previousLevel`),
        score: t(`${p}.score`),
        domains: {
          customer_experience: t(`${p}.domains.customer_experience`),
          operational: t(`${p}.domains.operational`),
          governance: t(`${p}.domains.governance`),
          knowledge: t(`${p}.domains.knowledge`),
          technology: t(`${p}.domains.technology`),
          leadership: t(`${p}.domains.leadership`),
          workforce: t(`${p}.domains.workforce`),
        },
        maturityLevels: {
          emerging: t(`${p}.maturityLevels.emerging`),
          developing: t(`${p}.maturityLevels.developing`),
          established: t(`${p}.maturityLevels.established`),
          advanced: t(`${p}.maturityLevels.advanced`),
          transformational: t(`${p}.maturityLevels.transformational`),
        },
        priorityTypes: {
          quick_win: t(`${p}.priorityTypes.quick_win`),
          strategic_initiative: t(`${p}.priorityTypes.strategic_initiative`),
          long_term_investment: t(`${p}.priorityTypes.long_term_investment`),
          capability_building: t(`${p}.priorityTypes.capability_building`),
        },
        momentumLabels: {
          up: t(`${p}.momentumLabels.up`),
          stable: t(`${p}.momentumLabels.stable`),
          down: t(`${p}.momentumLabels.down`),
        },
        metrics: {
          assessed: t(`${p}.metrics.assessed`),
          strongest: t(`${p}.metrics.strongest`),
          developing: t(`${p}.metrics.developing`),
          improving: t(`${p}.metrics.improving`),
          opportunities: t(`${p}.metrics.opportunities`),
          confidence: t(`${p}.metrics.confidence`),
          participation: t(`${p}.metrics.participation`),
        },
        executiveFields: {
          strengths: t(`${p}.executiveFields.strengths`),
          gaps: t(`${p}.executiveFields.gaps`),
          momentum: t(`${p}.executiveFields.momentum`),
          readiness: t(`${p}.executiveFields.readiness`),
        },
      }}
    />
  );
}
