import { AipifyHostsOperationsDashboardPanel } from "@/components/app/aipify-hosts-operations";
import { AipifyHostsUpgradeSignalsBanner } from "@/components/app/aipify-hosts-upgrade-signals";
import { buildHostsUpgradeSignalsBannerLabels } from "@/lib/aipify/aipify-hosts-upgrade-signals";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AipifyHostsOperationsPage() {
  const dict = {
    ...(await getCustomerAppDictionaryForSplits(await getLocale(), ["dashboard"])),
    ...(await getDictionary(await getLocale(), ["hosts"])),
  };
  const t = createTranslator(dict);
  const p = "customerApp.aipifyHostsOperations";
  const bannerLabels = buildHostsUpgradeSignalsBannerLabels(t);

  const statusKeys = [
    "scheduled", "ready", "attention_required", "completed",
    "not_started", "in_progress", "requires_review",
    "new", "assigned", "awaiting_response", "resolved",
    "pending", "awaiting_review", "open", "under_review",
    "low", "medium", "high", "critical", "moderate",
  ] as const;

  const labels: Record<string, string> = {
    loading: t(`${p}.loading`),
    errorTitle: t(`${p}.errorTitle`),
    errorMessage: t(`${p}.errorMessage`),
    retry: t(`${p}.retry`),
    backToHosts: t(`${p}.backToHosts`),
    governanceNote: t(`${p}.governanceNote`),
    filterProperty: t(`${p}.filterProperty`),
    allPropertiesOption: t(`${p}.allPropertiesOption`),
    arrivalsToday: t(`${p}.arrivalsToday`),
    departuresToday: t(`${p}.departuresToday`),
    openGuestRequests: t(`${p}.openGuestRequests`),
    pendingApprovals: t(`${p}.pendingApprovals`),
    cleaningStatus: t(`${p}.cleaningStatus`),
    maintenanceStatus: t(`${p}.maintenanceStatus`),
    activeIncidents: t(`${p}.activeIncidents`),
    emptyTodayTitle: t(`${p}.emptyTodayTitle`),
    emptyTodayMessage: t(`${p}.emptyTodayMessage`),
    guestName: t(`${p}.guestName`),
    property: t(`${p}.property`),
    arrivalTime: t(`${p}.arrivalTime`),
    checkInStatus: t(`${p}.checkInStatus`),
    cleaningStatusCol: t(`${p}.cleaningStatusCol`),
    propertyReadiness: t(`${p}.propertyReadiness`),
    emptyArrivalsTitle: t(`${p}.emptyArrivalsTitle`),
    emptyArrivalsMessage: t(`${p}.emptyArrivalsMessage`),
    departureTime: t(`${p}.departureTime`),
    checkoutStatus: t(`${p}.checkoutStatus`),
    inspectionStatus: t(`${p}.inspectionStatus`),
    cleaningAssigned: t(`${p}.cleaningAssigned`),
    emptyDeparturesTitle: t(`${p}.emptyDeparturesTitle`),
    emptyDeparturesMessage: t(`${p}.emptyDeparturesMessage`),
    assignedCleaner: t(`${p}.assignedCleaner`),
    scheduledTime: t(`${p}.scheduledTime`),
    completionStatus: t(`${p}.completionStatus`),
    reportedIssues: t(`${p}.reportedIssues`),
    markCompleted: t(`${p}.markCompleted`),
    emptyCleaningTitle: t(`${p}.emptyCleaningTitle`),
    emptyCleaningMessage: t(`${p}.emptyCleaningMessage`),
    issueSummary: t(`${p}.issueSummary`),
    priority: t(`${p}.priority`),
    assignedTo: t(`${p}.assignedTo`),
    dueDate: t(`${p}.dueDate`),
    assignTask: t(`${p}.assignTask`),
    unassigned: t(`${p}.unassigned`),
    emptyMaintenanceTitle: t(`${p}.emptyMaintenanceTitle`),
    emptyMaintenanceMessage: t(`${p}.emptyMaintenanceMessage`),
    requestType: t(`${p}.requestType`),
    submittedTime: t(`${p}.submittedTime`),
    statusColumn: t(`${p}.statusColumn`),
    emptyGuestRequestsTitle: t(`${p}.emptyGuestRequestsTitle`),
    emptyGuestRequestsMessage: t(`${p}.emptyGuestRequestsMessage`),
    incidentType: t(`${p}.incidentType`),
    severity: t(`${p}.severity`),
    owner: t(`${p}.owner`),
    emptyIncidentsTitle: t(`${p}.emptyIncidentsTitle`),
    emptyIncidentsMessage: t(`${p}.emptyIncidentsMessage`),
    submittedBy: t(`${p}.submittedBy`),
    waitingSince: t(`${p}.waitingSince`),
    approvalStatus: t(`${p}.approvalStatus`),
    approve: t(`${p}.approve`),
    decline: t(`${p}.decline`),
    emptyApprovalsTitle: t(`${p}.emptyApprovalsTitle`),
    emptyApprovalsMessage: t(`${p}.emptyApprovalsMessage`),
    actions: t(`${p}.actions`),
    actionRecorded: t(`${p}.actionRecorded`),
    actionFailed: t(`${p}.actionFailed`),
  };

  for (const key of statusKeys) {
    labels[`status_${key}`] = t(`${p}.status.${key}`);
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <AipifyHostsUpgradeSignalsBanner labels={bannerLabels} surface="operations_center" />
      <AipifyHostsOperationsDashboardPanel labels={labels} />
    </div>
  );
}
