import { DatabaseGovernanceCenterPanel } from "@/components/app/database-governance-center";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function DatabaseGovernanceCenterPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["commandCenter"]);
  const t = createTranslator(dict);
  const p = "customerApp.databaseGovernanceCenter";

  return (
    <DatabaseGovernanceCenterPanel
      labels={{
        title: t(`${p}.title`),
        subtitle: t(`${p}.subtitle`),
        loading: t(`${p}.loading`),
        corePrinciple: t(`${p}.corePrinciple`),
        philosophyTitle: t(`${p}.philosophyTitle`),
        visionTitle: t(`${p}.visionTitle`),
        operationsLink: t(`${p}.operationsLink`),
        automationControlLink: t(`${p}.automationControlLink`),
        updatesLink: t(`${p}.updatesLink`),
        securityLink: t(`${p}.securityLink`),
        executiveLink: t(`${p}.executiveLink`),
        dashboardTitle: t(`${p}.dashboardTitle`),
        migrationsTitle: t(`${p}.migrationsTitle`),
        validationTitle: t(`${p}.validationTitle`),
        driftTitle: t(`${p}.driftTitle`),
        insightsTitle: t(`${p}.insightsTitle`),
        recommendationsTitle: t(`${p}.recommendationsTitle`),
        environmentTitle: t(`${p}.environmentTitle`),
        reviewsTitle: t(`${p}.reviewsTitle`),
        emptySection: t(`${p}.emptySection`),
        healthScore: t(`${p}.healthScore`),
        dismiss: t(`${p}.dismiss`),
        accept: t(`${p}.accept`),
        acknowledge: t(`${p}.acknowledge`),
        review: t(`${p}.review`),
        validate: t(`${p}.validate`),
        archive: t(`${p}.archive`),
        completeReview: t(`${p}.completeReview`),
        generateReport: t(`${p}.generateReport`),
        resolve: t(`${p}.resolve`),
        humansDecide: t(`${p}.humansDecide`),
        privacyNote: t(`${p}.privacyNote`),
        migrationStatus: t(`${p}.migrationStatus`),
        riskLevel: t(`${p}.riskLevel`),
        environment: t(`${p}.environment`),
        rollbackNotes: t(`${p}.rollbackNotes`),
        healthBands: {
          excellent: t(`${p}.healthBands.excellent`),
          healthy: t(`${p}.healthBands.healthy`),
          attention_required: t(`${p}.healthBands.attention_required`),
          critical: t(`${p}.healthBands.critical`),
        },
        migrationStatuses: {
          pending: t(`${p}.migrationStatuses.pending`),
          applied: t(`${p}.migrationStatuses.applied`),
          failed: t(`${p}.migrationStatuses.failed`),
          rolled_back: t(`${p}.migrationStatuses.rolled_back`),
          archived: t(`${p}.migrationStatuses.archived`),
        },
        riskLevels: {
          low: t(`${p}.riskLevels.low`),
          medium: t(`${p}.riskLevels.medium`),
          high: t(`${p}.riskLevels.high`),
          critical: t(`${p}.riskLevels.critical`),
        },
        reviewTypes: {
          weekly: t(`${p}.reviewTypes.weekly`),
          pre_release: t(`${p}.reviewTypes.pre_release`),
          quarterly_audit: t(`${p}.reviewTypes.quarterly_audit`),
          executive_summary: t(`${p}.reviewTypes.executive_summary`),
        },
        metrics: {
          pending: t(`${p}.metrics.pending`),
          failed: t(`${p}.metrics.failed`),
          applied: t(`${p}.metrics.applied`),
          validationFindings: t(`${p}.metrics.validationFindings`),
          driftEvents: t(`${p}.metrics.driftEvents`),
          consistency: t(`${p}.metrics.consistency`),
          successRate: t(`${p}.metrics.successRate`),
          confidence: t(`${p}.metrics.confidence`),
        },
      }}
    />
  );
}
