import { CompanionBriefingPageIntro } from "@/components/app/briefing";
import { AipifyWarehouseOperationsDashboardPanel } from "@/components/app/aipify-warehouse-operations";
import { buildCompanionBriefingLabels } from "@/lib/app/companion-briefing-labels";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AipifyWarehouseOperationsPage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.aipifyWarehouseOperations";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <CompanionBriefingPageIntro
        title={t(`${p}.title`)}
        subtitle={t(`${p}.subtitle`)}
        context="commerce"
        labels={buildCompanionBriefingLabels(t)}
      />
      <AipifyWarehouseOperationsDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          warehousePack: t(`${p}.warehousePack`),
          marketplace: t(`${p}.marketplace`),
          approvals: t(`${p}.approvals`),
          ordersAwaiting: t(`${p}.ordersAwaiting`),
          delayedShipments: t(`${p}.delayedShipments`),
          inventoryShortages: t(`${p}.inventoryShortages`),
          pickupsScheduled: t(`${p}.pickupsScheduled`),
          picksToday: t(`${p}.picksToday`),
          inventorySearch: t(`${p}.inventorySearch`),
          inventorySearchHint: t(`${p}.inventorySearchHint`),
          searchPlaceholder: t(`${p}.searchPlaceholder`),
          search: t(`${p}.search`),
          exampleQuery: t(`${p}.exampleQuery`),
          searching: t(`${p}.searching`),
          location: t(`${p}.location`),
          quantity: t(`${p}.quantity`),
          reserved: t(`${p}.reserved`),
          available: t(`${p}.available`),
          price: t(`${p}.price`),
          reorderThreshold: t(`${p}.reorderThreshold`),
          voiceInteraction: t(`${p}.voiceInteraction`),
          ordersAwaitingList: t(`${p}.ordersAwaitingList`),
          noOrders: t(`${p}.noOrders`),
          packaging: t(`${p}.packaging`),
          shipping: t(`${p}.shipping`),
          generatePickingList: t(`${p}.generatePickingList`),
          pickingTasks: t(`${p}.pickingTasks`),
          noPickingTasks: t(`${p}.noPickingTasks`),
          pickAt: t(`${p}.pickAt`),
          markPicked: t(`${p}.markPicked`),
          pickupSchedules: t(`${p}.pickupSchedules`),
          noPickups: t(`${p}.noPickups`),
          printJobs: t(`${p}.printJobs`),
          noPrintJobs: t(`${p}.noPrintJobs`),
          printShippingLabel: t(`${p}.printShippingLabel`),
          pendingApprovals: t(`${p}.pendingApprovals`),
          approvalRulesNote: t(`${p}.approvalRulesNote`),
          noApprovals: t(`${p}.noApprovals`),
          integrations: t(`${p}.integrations`),
          successCriteria: t(`${p}.successCriteria`),
          actionFailed: t(`${p}.actionFailed`),
        }}
      />
    </div>
  );
}
