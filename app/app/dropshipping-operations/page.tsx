import { CompanionBriefingPageIntro } from "@/components/app/briefing";
import { DropshippingOperationsDashboardPanel } from "@/components/app/dropshipping-operations";
import { buildCompanionBriefingLabels } from "@/lib/app/companion-briefing-labels";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function DropshippingOperationsPage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.dropshippingOperations";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <CompanionBriefingPageIntro
        title={t(`${p}.title`)}
        subtitle={t(`${p}.subtitle`)}
        context="dropshipping"
        labels={buildCompanionBriefingLabels(t)}
      />
      <DropshippingOperationsDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          operationalHealth: t(`${p}.operationalHealth`),
          activeProducts: t(`${p}.activeProducts`),
          deliveryRisks: t(`${p}.deliveryRisks`),
          generateBriefing: t(`${p}.generateBriefing`),
          suppliersMonitored: t(`${p}.suppliersMonitored`),
          openAlerts: t(`${p}.openAlerts`),
          openEscalations: t(`${p}.openEscalations`),
          riskNotifications: t(`${p}.riskNotifications`),
          supplierInsights: t(`${p}.supplierInsights`),
          escalateSupplier: t(`${p}.escalateSupplier`),
          deliveryRiskIndicators: t(`${p}.deliveryRiskIndicators`),
          opportunityAlerts: t(`${p}.opportunityAlerts`),
          productWatchlists: t(`${p}.productWatchlists`),
          orderHealthInsights: t(`${p}.orderHealthInsights`),
          recommendationsCenter: t(`${p}.recommendationsCenter`),
          escalationActivity: t(`${p}.escalationActivity`),
          recentBriefings: t(`${p}.recentBriefings`),
          commerceIntelligence: t(`${p}.commerceIntelligence`),
          productAutomation: t(`${p}.productAutomation`),
          commercePerformance: t(`${p}.commercePerformance`),
          integrationEngine: t(`${p}.integrationEngine`),
          approvals: t(`${p}.approvals`),
          platformInstall: t(`${p}.platformInstall`),
          knowledgeCenter: t(`${p}.knowledgeCenter`),
          blueprintTitle: t(`${p}.blueprintTitle`),
          blueprintObjectives: t(`${p}.blueprintObjectives`),
          orderTrackingCenter: t(`${p}.orderTrackingCenter`),
          productLifecycle: t(`${p}.productLifecycle`),
          companionGuidance: t(`${p}.companionGuidance`),
          notGenericAi: t(`${p}.notGenericAi`),
          approvalPrinciples: t(`${p}.approvalPrinciples`),
          selfLoveConnection: t(`${p}.selfLoveConnection`),
          successCriteria: t(`${p}.successCriteria`),
          criterionMet: t(`${p}.criterionMet`),
          criterionPending: t(`${p}.criterionPending`),
        }}
      />
    </div>
  );
}
