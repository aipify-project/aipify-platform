import { AipifyHostsCheckinCenterDashboardPanel } from "@/components/app/aipify-hosts-checkin-center";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AipifyHostsCheckInPage() {
  const dict = await getDictionary(await getLocale(), ["hosts"]);
  const t = createTranslator(dict);
  const p = "hosts.checkIn";
  const c = "hosts.common";

  const sectionKeys = ["upcoming_check_ins", "active_stays", "upcoming_check_outs", "readiness_status", "checkout_reviews"] as const;
  const cistatusKeys = ["scheduled", "preparing", "ready", "guest_arrived", "completed"] as const;
  const costatusKeys = ["scheduled", "guest_departed", "inspection_pending", "cleaning_pending", "completed"] as const;
  const readyindKeys = ["ready", "attention_required", "not_ready"] as const;
  const outcomeKeys = ["standard_departure", "follow_up_required", "incident_opened"] as const;

  const labels: Record<string, string> = {
    loading: t(`${p}.loading`),
    errorTitle: t(`${p}.errorTitle`),
    errorMessage: t(`${p}.errorMessage`),
    retry: t(`${c}.retry`),
    backToHosts: t(`${c}.backToHosts`),
    governanceNote: t(`${p}.governanceNote`),
    todaysCheckIns: t(`${p}.todaysCheckIns`),
    todaysCheckOuts: t(`${p}.todaysCheckOuts`),
    propertiesAttention: t(`${p}.propertiesAttention`),
    activeStays: t(`${p}.activeStays`),
    readinessOverview: t(`${p}.readinessOverview`),
    readyCount: t(`${p}.readyCount`),
    attentionCount: t(`${p}.attentionCount`),
    notReadyCount: t(`${p}.notReadyCount`),
    arrivalTasks: t(`${p}.arrivalTasks`),
    departureTasks: t(`${p}.departureTasks`),
    inspectionTasks: t(`${p}.inspectionTasks`),
    cleaningTasks: t(`${p}.cleaningTasks`),
    guestName: t(`${p}.guestName`),
    property: t(`${p}.property`),
    checkInDate: t(`${p}.checkInDate`),
    checkOutDate: t(`${p}.checkOutDate`),
    checkoutDate: t(`${p}.checkoutDate`),
    status: t(`${p}.status`),
    readyScore: t(`${p}.readyScore`),
    readiness: t(`${p}.readiness`),
    actions: t(`${p}.actions`),
    viewGuestInfo: t(`${p}.viewGuestInfo`),
    viewAccess: t(`${p}.viewAccess`),
    confirmReady: t(`${p}.confirmReady`),
    assignTasks: t(`${p}.assignTasks`),
    guestArrived: t(`${p}.guestArrived`),
    scheduleCleaning: t(`${p}.scheduleCleaning`),
    scheduleInspection: t(`${p}.scheduleInspection`),
    recordStatus: t(`${p}.recordStatus`),
    reportIssues: t(`${p}.reportIssues`),
    departureOutcome: t(`${p}.departureOutcome`),
    emptyCheckinsTitle: t(`${p}.emptyCheckinsTitle`),
    emptyCheckinsMessage: t(`${p}.emptyCheckinsMessage`),
    emptyCheckoutsTitle: t(`${p}.emptyCheckoutsTitle`),
    emptyCheckoutsMessage: t(`${p}.emptyCheckoutsMessage`),
    flag_cleaning: t(`${p}.flags.cleaning`),
    flag_inspection: t(`${p}.flags.inspection`),
    flag_supplies: t(`${p}.flags.supplies`),
    flag_access: t(`${p}.flags.access`),
    flag_team: t(`${p}.flags.team`),
    actionRecorded: t(`${c}.actionRecorded`),
    actionFailed: t(`${c}.actionFailed`),
  };

  for (const key of sectionKeys) labels[`section_${key}`] = t(`${p}.sections.${key}`);
  for (const key of cistatusKeys) labels[`cistatus_${key}`] = t(`${p}.checkinStatuses.${key}`);
  for (const key of costatusKeys) labels[`costatus_${key}`] = t(`${p}.checkoutStatuses.${key}`);
  for (const key of readyindKeys) labels[`readyind_${key}`] = t(`${p}.readinessIndicators.${key}`);
  for (const key of outcomeKeys) labels[`outcome_${key}`] = t(`${p}.departureOutcomes.${key}`);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <AipifyHostsCheckinCenterDashboardPanel labels={labels} />
    </div>
  );
}
