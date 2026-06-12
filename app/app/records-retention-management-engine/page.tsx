import { RecordsRetentionManagementEngineDashboardPanel } from "@/components/app/records-retention-management-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function RecordsRetentionManagementEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.recordsRetentionManagementEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <RecordsRetentionManagementEngineDashboardPanel labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          distinctionNote: t(`${p}.distinctionNote`),
          summary: t(`${p}.summary`),
          compliance: t(`${p}.compliance`),
          integrationSummaries: t(`${p}.integrationSummaries`),
          policies: t(`${p}.policies`),
          archivedRecords: t(`${p}.archivedRecords`),
          disposalRequests: t(`${p}.disposalRequests`),
          noPolicies: t(`${p}.noPolicies`),
          noArchivedRecords: t(`${p}.noArchivedRecords`),
          noDisposalRequests: t(`${p}.noDisposalRequests`),
          activatePolicy: t(`${p}.activatePolicy`),
          activating: t(`${p}.activating`),
          activateFailed: t(`${p}.activateFailed`),
          restore: t(`${p}.restore`),
          restoring: t(`${p}.restoring`),
          restoreFailed: t(`${p}.restoreFailed`),
          requestDisposal: t(`${p}.requestDisposal`),
          requestingDisposal: t(`${p}.requestingDisposal`),
          disposeFailed: t(`${p}.disposeFailed`),
          approve: t(`${p}.approve`),
          approving: t(`${p}.approving`),
          approveFailed: t(`${p}.approveFailed`),
          reject: t(`${p}.reject`),
          completeDisposal: t(`${p}.completeDisposal`),
          completing: t(`${p}.completing`),
          completeFailed: t(`${p}.completeFailed`),
        }} />
    </div>
  );
}
