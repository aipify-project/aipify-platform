import { DropshippingOperationsDashboardPanel } from "@/components/app/dropshipping-operations";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function DropshippingOperationsPage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.dropshippingOperations";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
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
          platformInstall: t(`${p}.platformInstall`),
          knowledgeCenter: t(`${p}.knowledgeCenter`),
        }}
      />
    </div>
  );
}
