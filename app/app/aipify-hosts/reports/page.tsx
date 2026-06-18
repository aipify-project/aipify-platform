import { AipifyHostsReportsDashboardPanel } from "@/components/app/aipify-hosts-reports";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AipifyHostsReportsPage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "aipifyHostsReports");
  const t = createTranslator(dict);
  const p = "customerApp.aipifyHostsReports";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <AipifyHostsReportsDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          errorTitle: t(`${p}.errorTitle`),
          errorMessage: t(`${p}.errorMessage`),
          retry: t(`${p}.retry`),
          backToHosts: t(`${p}.backToHosts`),
          exploreReportingGuidance: t(`${p}.exploreReportingGuidance`),
          governanceNote: t(`${p}.governanceNote`),
          reportFilters: t(`${p}.reportFilters`),
          executiveMetrics: t(`${p}.executiveMetrics`),
          occupancyRate: t(`${p}.occupancyRate`),
          revenueThisMonth: t(`${p}.revenueThisMonth`),
          revenueYtd: t(`${p}.revenueYtd`),
          averageLengthOfStay: t(`${p}.averageLengthOfStay`),
          nights: t(`${p}.nights`),
          guestSatisfaction: t(`${p}.guestSatisfaction`),
          activeIncidents: t(`${p}.activeIncidents`),
          openMaintenanceTasks: t(`${p}.openMaintenanceTasks`),
          teamCompletionRate: t(`${p}.teamCompletionRate`),
          emptyMetricsTitle: t(`${p}.emptyMetricsTitle`),
          emptyMetricsMessage: t(`${p}.emptyMetricsMessage`),
          executiveSummary: t(`${p}.executiveSummary`),
          operationalHighlights: t(`${p}.operationalHighlights`),
          areasRequiringAttention: t(`${p}.areasRequiringAttention`),
          improvementOpportunities: t(`${p}.improvementOpportunities`),
          topPerformingProperties: t(`${p}.topPerformingProperties`),
          propertiesRequiringAttention: t(`${p}.propertiesRequiringAttention`),
          emptyWidgetsMessage: t(`${p}.emptyWidgetsMessage`),
          revenueTrends: t(`${p}.revenueTrends`),
          occupancyTrends: t(`${p}.occupancyTrends`),
          emptyTrendTitle: t(`${p}.emptyTrendTitle`),
          emptyTrendMessage: t(`${p}.emptyTrendMessage`),
          teamProductivity: t(`${p}.teamProductivity`),
          tasksCompleted: t(`${p}.tasksCompleted`),
          propertyComparison: t(`${p}.propertyComparison`),
          propertyComparisonDescription: t(`${p}.propertyComparisonDescription`),
          property: t(`${p}.property`),
          revenue: t(`${p}.revenue`),
          occupancy: t(`${p}.occupancy`),
          incidents: t(`${p}.incidents`),
          maintenanceBurden: t(`${p}.maintenanceBurden`),
          emptyComparisonTitle: t(`${p}.emptyComparisonTitle`),
          emptyComparisonMessage: t(`${p}.emptyComparisonMessage`),
          reportCategories: t(`${p}.reportCategories`),
          exportReport: t(`${p}.exportReport`),
          exportDescription: t(`${p}.exportDescription`),
          reportCategory: t(`${p}.reportCategory`),
          exportFormat: t(`${p}.exportFormat`),
          exportAction: t(`${p}.exportAction`),
          exporting: t(`${p}.exporting`),
          exportSuccess: t(`${p}.exportSuccess`),
          exportFailed: t(`${p}.exportFailed`),
          scheduleReport: t(`${p}.scheduleReport`),
          scheduleDescription: t(`${p}.scheduleDescription`),
          cadence: t(`${p}.cadence`),
          deliveryMethod: t(`${p}.deliveryMethod`),
          scheduleAction: t(`${p}.scheduleAction`),
          scheduling: t(`${p}.scheduling`),
          scheduleSuccess: t(`${p}.scheduleSuccess`),
          scheduleFailed: t(`${p}.scheduleFailed`),
          scheduledReports: t(`${p}.scheduledReports`),
          emptyScheduledTitle: t(`${p}.emptyScheduledTitle`),
          emptyScheduledMessage: t(`${p}.emptyScheduledMessage`),
        }}
      />
    </div>
  );
}
