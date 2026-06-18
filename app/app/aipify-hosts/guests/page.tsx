import { AipifyHostsGuestCenterDashboardPanel } from "@/components/app/aipify-hosts-guest-center";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AipifyHostsGuestsPage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "aipifyHostsGuestCenter");
  const t = createTranslator(dict);
  const p = "customerApp.aipifyHostsGuestCenter";

  const stayKeys = ["upcoming", "checked_in", "checked_out", "cancelled"] as const;
  const tierKeys = ["first_stay", "returning", "frequent"] as const;
  const requestKeys = ["early_check_in", "late_check_out", "maintenance", "general_question"] as const;
  const reqStatusKeys = ["new", "assigned", "awaiting_response", "resolved", "closed"] as const;
  const timelineKeys = ["booking_created", "arrival", "request_submitted", "incident", "departure"] as const;

  const labels: Record<string, string> = {
    loading: t(`${p}.loading`),
    errorTitle: t(`${p}.errorTitle`),
    errorMessage: t(`${p}.errorMessage`),
    retry: t(`${p}.retry`),
    backToHosts: t(`${p}.backToHosts`),
    exploreGuidance: t(`${p}.exploreGuidance`),
    governanceNote: t(`${p}.governanceNote`),
    guestName: t(`${p}.guestName`),
    property: t(`${p}.property`),
    checkInDate: t(`${p}.checkInDate`),
    checkOutDate: t(`${p}.checkOutDate`),
    stayStatus: t(`${p}.stayStatus`),
    guestTier: t(`${p}.guestTier`),
    emptyGuestsTitle: t(`${p}.emptyGuestsTitle`),
    emptyGuestsMessage: t(`${p}.emptyGuestsMessage`),
    emptyGuestsCta: t(`${p}.emptyGuestsCta`),
    requestType: t(`${p}.requestType`),
    requestStatus: t(`${p}.requestStatus`),
    actions: t(`${p}.actions`),
    markResolved: t(`${p}.markResolved`),
    emptyRequestsTitle: t(`${p}.emptyRequestsTitle`),
    emptyRequestsMessage: t(`${p}.emptyRequestsMessage`),
    emptyRequestsCta: t(`${p}.emptyRequestsCta`),
    addNote: t(`${p}.addNote`),
    notePlaceholder: t(`${p}.notePlaceholder`),
    saveNote: t(`${p}.saveNote`),
    notesGovernance: t(`${p}.notesGovernance`),
    selectGuestForNoteTitle: t(`${p}.selectGuestForNoteTitle`),
    selectGuestForNote: t(`${p}.selectGuestForNote`),
    selectGuestCta: t(`${p}.selectGuestCta`),
    emptyNotesTitle: t(`${p}.emptyNotesTitle`),
    emptyNotesMessage: t(`${p}.emptyNotesMessage`),
    selectGuestForTimelineTitle: t(`${p}.selectGuestForTimelineTitle`),
    selectGuestForTimeline: t(`${p}.selectGuestForTimeline`),
    emptyTimelineTitle: t(`${p}.emptyTimelineTitle`),
    emptyTimelineMessage: t(`${p}.emptyTimelineMessage`),
    guestProfile: t(`${p}.guestProfile`),
    fullName: t(`${p}.fullName`),
    contactEmail: t(`${p}.contactEmail`),
    contactPhone: t(`${p}.contactPhone`),
    assignedProperty: t(`${p}.assignedProperty`),
    currentStayStatus: t(`${p}.currentStayStatus`),
    actionRecorded: t(`${p}.actionRecorded`),
    actionFailed: t(`${p}.actionFailed`),
  };

  for (const key of stayKeys) labels[`stay_${key}`] = t(`${p}.stay.${key}`);
  for (const key of tierKeys) labels[`tier_${key}`] = t(`${p}.tiers.${key}`);
  for (const key of requestKeys) labels[`request_${key}`] = t(`${p}.requests.${key}`);
  for (const key of reqStatusKeys) labels[`reqstatus_${key}`] = t(`${p}.requestStatusLabels.${key}`);
  for (const key of timelineKeys) labels[`timeline_${key}`] = t(`${p}.timeline.${key}`);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <AipifyHostsGuestCenterDashboardPanel labels={labels} />
    </div>
  );
}
