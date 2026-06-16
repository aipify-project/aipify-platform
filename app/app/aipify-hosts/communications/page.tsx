import { AipifyHostsCommunicationCenterDashboardPanel } from "@/components/app/aipify-hosts-communication-center";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AipifyHostsCommunicationsPage() {
  const dict = await getDictionary(await getLocale(), ["hosts"]);
  const t = createTranslator(dict);
  const p = "hosts.communication";
  const c = "hosts.common";

  const sectionKeys = ["guest_communications", "team_communications", "templates", "announcements", "communication_history"] as const;
  const msgTypeKeys = ["arrival_information", "departure_information", "property_updates", "maintenance_notices", "welcome_messages", "follow_up_messages", "internal_team_messages"] as const;
  const commStatusKeys = ["draft", "scheduled", "sent", "delivered", "failed"] as const;
  const tplTypeKeys = ["welcome_template", "check_in_instructions", "checkout_reminder", "thank_you_message", "maintenance_notification", "emergency_notice"] as const;
  const annTypeKeys = ["property_wide", "team_announcement", "operational_notice"] as const;

  const labels: Record<string, string> = {
    loading: t(`${p}.loading`),
    errorTitle: t(`${p}.errorTitle`),
    errorMessage: t(`${p}.errorMessage`),
    retry: t(`${c}.retry`),
    backToHosts: t(`${c}.backToHosts`),
    governanceNote: t(`${p}.governanceNote`),
    guestMessages30d: t(`${p}.guestMessages30d`),
    scheduledCount: t(`${p}.scheduledCount`),
    failedCount: t(`${p}.failedCount`),
    activeTemplates: t(`${p}.activeTemplates`),
    needsAttention: t(`${p}.needsAttention`),
    criticalPending: t(`${p}.criticalPending`),
    filterStatus: t(`${p}.filterStatus`),
    allStatuses: t(`${p}.allStatuses`),
    guestName: t(`${p}.guestName`),
    property: t(`${p}.property`),
    messageType: t(`${p}.messageType`),
    channel: t(`${p}.channel`),
    status: t(`${p}.status`),
    sentDate: t(`${p}.sentDate`),
    actions: t(`${p}.actions`),
    sendNow: t(`${p}.sendNow`),
    markDelivered: t(`${p}.markDelivered`),
    retryFailed: t(`${p}.retryFailed`),
    recipient: t(`${p}.recipient`),
    subject: t(`${p}.subject`),
    category: t(`${p}.category`),
    useTemplate: t(`${p}.useTemplate`),
    title: t(`${p}.title`),
    announcementType: t(`${p}.announcementType`),
    publish: t(`${p}.publish`),
    critical: t(`${p}.critical`),
    sender: t(`${p}.sender`),
    emptyGuestTitle: t(`${p}.emptyGuestTitle`),
    emptyGuestMessage: t(`${p}.emptyGuestMessage`),
    emptyTeamTitle: t(`${p}.emptyTeamTitle`),
    emptyTeamMessage: t(`${p}.emptyTeamMessage`),
    emptyTemplatesTitle: t(`${p}.emptyTemplatesTitle`),
    emptyTemplatesMessage: t(`${p}.emptyTemplatesMessage`),
    emptyAnnouncementsTitle: t(`${p}.emptyAnnouncementsTitle`),
    emptyAnnouncementsMessage: t(`${p}.emptyAnnouncementsMessage`),
    emptyHistoryTitle: t(`${p}.emptyHistoryTitle`),
    emptyHistoryMessage: t(`${p}.emptyHistoryMessage`),
    actionRecorded: t(`${c}.actionRecorded`),
    actionFailed: t(`${c}.actionFailed`),
  };

  for (const key of sectionKeys) labels[`section_${key}`] = t(`${p}.sections.${key}`);
  for (const key of msgTypeKeys) labels[`msgType_${key}`] = t(`${p}.messageTypes.${key}`);
  for (const key of commStatusKeys) labels[`commStatus_${key}`] = t(`${p}.communicationStatuses.${key}`);
  for (const key of tplTypeKeys) labels[`tplType_${key}`] = t(`${p}.templateTypes.${key}`);
  for (const key of annTypeKeys) labels[`annType_${key}`] = t(`${p}.announcementTypes.${key}`);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.pageTitle`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <AipifyHostsCommunicationCenterDashboardPanel labels={labels} />
    </div>
  );
}
