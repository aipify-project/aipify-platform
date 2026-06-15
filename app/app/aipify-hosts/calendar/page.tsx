import { AipifyHostsCalendarCenterDashboardPanel } from "@/components/app/aipify-hosts-calendar-center";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AipifyHostsCalendarPage() {
  const dict = await getDictionary(await getLocale(), ["hosts"]);
  const t = createTranslator(dict);
  const p = "hosts.calendar";
  const c = "hosts.common";

  const sectionKeys = ["master_calendar", "property_calendars", "occupancy_overview", "availability_management", "calendar_settings"] as const;
  const viewKeys = ["day", "week", "month", "agenda"] as const;
  const etypeKeys = ["reservation", "cleaning", "maintenance", "inspection", "owner_block", "operational_block"] as const;
  const estatusKeys = ["pending", "confirmed", "blocked", "completed", "cancelled"] as const;
  const occKeys = ["available", "occupied", "arrival_today", "departure_today", "maintenance_blocked", "inspection_blocked", "unavailable"] as const;

  const labels: Record<string, string> = {
    loading: t(`${p}.loading`),
    errorTitle: t(`${p}.errorTitle`),
    errorMessage: t(`${p}.errorMessage`),
    retry: t(`${c}.retry`),
    backToHosts: t(`${c}.backToHosts`),
    save: t(`${c}.save`),
    governanceNote: t(`${p}.governanceNote`),
    occupancyRate: t(`${p}.occupancyRate`),
    availableNights: t(`${p}.availableNights`),
    blockedNights: t(`${p}.blockedNights`),
    upcomingArrivals: t(`${p}.upcomingArrivals`),
    upcomingDepartures: t(`${p}.upcomingDepartures`),
    filters: t(`${p}.filters`),
    allProperties: t(`${p}.allProperties`),
    allTeamMembers: t(`${p}.allTeamMembers`),
    allEventTypes: t(`${p}.allEventTypes`),
    applyFilters: t(`${p}.applyFilters`),
    dateRange: t(`${p}.dateRange`),
    eventTitle: t(`${p}.eventTitle`),
    eventType: t(`${p}.eventType`),
    property: t(`${p}.property`),
    startDate: t(`${p}.startDate`),
    endDate: t(`${p}.endDate`),
    status: t(`${p}.status`),
    assignedUsers: t(`${p}.assignedUsers`),
    notes: t(`${p}.notes`),
    actions: t(`${p}.actions`),
    blockDates: t(`${p}.blockDates`),
    unblockDates: t(`${p}.unblockDates`),
    createOperationalHold: t(`${p}.createOperationalHold`),
    blockReason: t(`${p}.blockReason`),
    blockReasonPlaceholder: t(`${p}.blockReasonPlaceholder`),
    selectProperty: t(`${p}.selectProperty`),
    createEvent: t(`${p}.createEvent`),
    eventTitlePlaceholder: t(`${p}.eventTitlePlaceholder`),
    assignedUsersPlaceholder: t(`${p}.assignedUsersPlaceholder`),
    calendarSettingsTitle: t(`${p}.calendarSettingsTitle`),
    defaultViewLabel: t(`${p}.defaultViewLabel`),
    emptyEventsTitle: t(`${p}.emptyEventsTitle`),
    emptyEventsMessage: t(`${p}.emptyEventsMessage`),
    emptyOccupancyTitle: t(`${p}.emptyOccupancyTitle`),
    emptyOccupancyMessage: t(`${p}.emptyOccupancyMessage`),
    emptyBlocksTitle: t(`${p}.emptyBlocksTitle`),
    emptyBlocksMessage: t(`${p}.emptyBlocksMessage`),
    actionRecorded: t(`${c}.actionRecorded`),
    actionFailed: t(`${c}.actionFailed`),
  };

  for (const key of sectionKeys) labels[`section_${key}`] = t(`${p}.sections.${key}`);
  for (const key of viewKeys) labels[`view_${key}`] = t(`${p}.views.${key}`);
  for (const key of etypeKeys) labels[`etype_${key}`] = t(`${p}.eventTypes.${key}`);
  for (const key of estatusKeys) labels[`estatus_${key}`] = t(`${p}.eventStatuses.${key}`);
  for (const key of occKeys) labels[`occ_${key}`] = t(`${p}.occupancyStatuses.${key}`);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <AipifyHostsCalendarCenterDashboardPanel labels={labels} />
    </div>
  );
}
