import { OrganizationalEnergyCenterPanel } from "@/components/app/organizational-energy-center";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function OrganizationalEnergyCenterPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.organizationalEnergyCenter";

  return (
    <OrganizationalEnergyCenterPanel
      labels={{
        title: t(`${p}.title`),
        subtitle: t(`${p}.subtitle`),
        loading: t(`${p}.loading`),
        corePrinciple: t(`${p}.corePrinciple`),
        philosophyTitle: t(`${p}.philosophyTitle`),
        visionTitle: t(`${p}.visionTitle`),
        executiveLink: t(`${p}.executiveLink`),
        organizationalFocusLink: t(`${p}.organizationalFocusLink`),
        organizationalHealthLink: t(`${p}.organizationalHealthLink`),
        organizationalResilienceLink: t(`${p}.organizationalResilienceLink`),
        changeManagementLink: t(`${p}.changeManagementLink`),
        dashboardTitle: t(`${p}.dashboardTitle`),
        capacityTitle: t(`${p}.capacityTitle`),
        patternsTitle: t(`${p}.patternsTitle`),
        recoveryTitle: t(`${p}.recoveryTitle`),
        loadTrendsTitle: t(`${p}.loadTrendsTitle`),
        timelineTitle: t(`${p}.timelineTitle`),
        snapshotsTitle: t(`${p}.snapshotsTitle`),
        insightsTitle: t(`${p}.insightsTitle`),
        recommendationsTitle: t(`${p}.recommendationsTitle`),
        executiveTitle: t(`${p}.executiveTitle`),
        reviewsTitle: t(`${p}.reviewsTitle`),
        emptySection: t(`${p}.emptySection`),
        dismiss: t(`${p}.dismiss`),
        accept: t(`${p}.accept`),
        completeReview: t(`${p}.completeReview`),
        discussPattern: t(`${p}.discussPattern`),
        scheduleRecovery: t(`${p}.scheduleRecovery`),
        generateSummary: t(`${p}.generateSummary`),
        generateReport: t(`${p}.generateReport`),
        exportSnapshot: t(`${p}.exportSnapshot`),
        humansDecide: t(`${p}.humansDecide`),
        privacyNote: t(`${p}.privacyNote`),
        energyScore: t(`${p}.energyScore`),
        domains: {
          leadership: t(`${p}.domains.leadership`),
          team: t(`${p}.domains.team`),
          organizational: t(`${p}.domains.organizational`),
          customer: t(`${p}.domains.customer`),
          change: t(`${p}.domains.change`),
        },
        healthLabels: {
          thriving: t(`${p}.healthLabels.thriving`),
          healthy: t(`${p}.healthLabels.healthy`),
          balanced: t(`${p}.healthLabels.balanced`),
          strained: t(`${p}.healthLabels.strained`),
          exhausted: t(`${p}.healthLabels.exhausted`),
        },
        patternTypes: {
          sustained_overload: t(`${p}.patternTypes.sustained_overload`),
          healthy_momentum: t(`${p}.patternTypes.healthy_momentum`),
          recovery_opportunity: t(`${p}.patternTypes.recovery_opportunity`),
          seasonal_intensity: t(`${p}.patternTypes.seasonal_intensity`),
          change_fatigue: t(`${p}.patternTypes.change_fatigue`),
        },
        timelineTypes: {
          intensity_period: t(`${p}.timelineTypes.intensity_period`),
          recovery_period: t(`${p}.timelineTypes.recovery_period`),
          initiative_peak: t(`${p}.timelineTypes.initiative_peak`),
          strategic_pause: t(`${p}.timelineTypes.strategic_pause`),
          org_transition: t(`${p}.timelineTypes.org_transition`),
        },
        reviewTypes: {
          monthly: t(`${p}.reviewTypes.monthly`),
          quarterly: t(`${p}.reviewTypes.quarterly`),
          annual: t(`${p}.reviewTypes.annual`),
          executive_wellbeing: t(`${p}.reviewTypes.executive_wellbeing`),
        },
        metrics: {
          recovery: t(`${p}.metrics.recovery`),
          focusAlerts: t(`${p}.metrics.focusAlerts`),
          initiativeLoad: t(`${p}.metrics.initiativeLoad`),
          reviewIntensity: t(`${p}.metrics.reviewIntensity`),
          changeSaturation: t(`${p}.metrics.changeSaturation`),
          recoveryHeadroom: t(`${p}.metrics.recoveryHeadroom`),
          confidence: t(`${p}.metrics.confidence`),
        },
        executiveFields: {
          leadership: t(`${p}.executiveFields.leadership`),
          pacing: t(`${p}.executiveFields.pacing`),
          recovery: t(`${p}.executiveFields.recovery`),
          execution: t(`${p}.executiveFields.execution`),
        },
      }}
    />
  );
}
