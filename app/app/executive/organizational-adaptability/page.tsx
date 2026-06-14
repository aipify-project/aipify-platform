import { OrganizationalAdaptabilityCenterPanel } from "@/components/app/organizational-adaptability-center";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function OrganizationalAdaptabilityCenterPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.organizationalAdaptabilityCenter";

  return (
    <OrganizationalAdaptabilityCenterPanel
      labels={{
        title: t(`${p}.title`),
        subtitle: t(`${p}.subtitle`),
        loading: t(`${p}.loading`),
        corePrinciple: t(`${p}.corePrinciple`),
        philosophyTitle: t(`${p}.philosophyTitle`),
        visionTitle: t(`${p}.visionTitle`),
        executiveLink: t(`${p}.executiveLink`),
        organizationalResilienceLink: t(`${p}.organizationalResilienceLink`),
        changeManagementLink: t(`${p}.changeManagementLink`),
        organizationalLearningLink: t(`${p}.organizationalLearningLink`),
        organizationalEnergyLink: t(`${p}.organizationalEnergyLink`),
        dashboardTitle: t(`${p}.dashboardTitle`),
        signalsTitle: t(`${p}.signalsTitle`),
        opportunitiesTitle: t(`${p}.opportunitiesTitle`),
        responsivenessTitle: t(`${p}.responsivenessTitle`),
        prioritiesTitle: t(`${p}.prioritiesTitle`),
        historyTitle: t(`${p}.historyTitle`),
        snapshotsTitle: t(`${p}.snapshotsTitle`),
        insightsTitle: t(`${p}.insightsTitle`),
        recommendationsTitle: t(`${p}.recommendationsTitle`),
        executiveTitle: t(`${p}.executiveTitle`),
        reviewsTitle: t(`${p}.reviewsTitle`),
        emptySection: t(`${p}.emptySection`),
        dismiss: t(`${p}.dismiss`),
        accept: t(`${p}.accept`),
        completeReview: t(`${p}.completeReview`),
        discussSignal: t(`${p}.discussSignal`),
        scheduleReflection: t(`${p}.scheduleReflection`),
        generateSummary: t(`${p}.generateSummary`),
        generateReport: t(`${p}.generateReport`),
        exportSnapshot: t(`${p}.exportSnapshot`),
        humansDecide: t(`${p}.humansDecide`),
        privacyNote: t(`${p}.privacyNote`),
        owner: t(`${p}.owner`),
        adaptabilityScore: t(`${p}.adaptabilityScore`),
        domains: {
          strategic: t(`${p}.domains.strategic`),
          operational: t(`${p}.domains.operational`),
          workforce: t(`${p}.domains.workforce`),
          technology: t(`${p}.domains.technology`),
          customer: t(`${p}.domains.customer`),
          leadership: t(`${p}.domains.leadership`),
        },
        healthLabels: {
          exceptional: t(`${p}.healthLabels.exceptional`),
          strong: t(`${p}.healthLabels.strong`),
          stable: t(`${p}.healthLabels.stable`),
          developing: t(`${p}.healthLabels.developing`),
          rigid: t(`${p}.healthLabels.rigid`),
        },
        signalTypes: {
          emerging_trend: t(`${p}.signalTypes.emerging_trend`),
          customer_shift: t(`${p}.signalTypes.customer_shift`),
          operational_pressure: t(`${p}.signalTypes.operational_pressure`),
          technology_development: t(`${p}.signalTypes.technology_development`),
          workforce_change: t(`${p}.signalTypes.workforce_change`),
          strategic_disruption: t(`${p}.signalTypes.strategic_disruption`),
        },
        historyTypes: {
          org_adjustment: t(`${p}.historyTypes.org_adjustment`),
          strategic_shift: t(`${p}.historyTypes.strategic_shift`),
          initiative_recalibration: t(`${p}.historyTypes.initiative_recalibration`),
          recovery_response: t(`${p}.historyTypes.recovery_response`),
          learning_application: t(`${p}.historyTypes.learning_application`),
        },
        reviewTypes: {
          monthly: t(`${p}.reviewTypes.monthly`),
          quarterly: t(`${p}.reviewTypes.quarterly`),
          annual: t(`${p}.reviewTypes.annual`),
          executive_learning: t(`${p}.reviewTypes.executive_learning`),
        },
        metrics: {
          opportunities: t(`${p}.metrics.opportunities`),
          emergingChanges: t(`${p}.metrics.emergingChanges`),
          responsiveness: t(`${p}.metrics.responsiveness`),
          learning: t(`${p}.metrics.learning`),
          readiness: t(`${p}.metrics.readiness`),
          recovery: t(`${p}.metrics.recovery`),
          confidence: t(`${p}.metrics.confidence`),
        },
        executiveFields: {
          flexibility: t(`${p}.executiveFields.flexibility`),
          responsiveness: t(`${p}.executiveFields.responsiveness`),
          learning: t(`${p}.executiveFields.learning`),
          opportunities: t(`${p}.executiveFields.opportunities`),
        },
      }}
    />
  );
}
