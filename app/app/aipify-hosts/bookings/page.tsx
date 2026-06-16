import { AipifyHostsBookingCenterDashboardPanel } from "@/components/app/aipify-hosts-booking-center";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AipifyHostsBookingsPage() {
  const dict = await getDictionary(await getLocale(), ["hosts"]);
  const t = createTranslator(dict);
  const p = "hosts.booking";
  const c = "hosts.common";

  const sectionKeys = ["upcoming_bookings", "active_stays", "past_bookings", "cancellations", "booking_reports"] as const;
  const bookingStatusKeys = ["inquiry", "pending", "confirmed", "checked_in", "checked_out", "cancelled"] as const;
  const timelineKeys = ["reservation_created", "reservation_confirmed", "guest_checked_in", "guest_checked_out", "reservation_closed"] as const;

  const labels: Record<string, string> = {
    loading: t(`${p}.loading`),
    errorTitle: t(`${p}.errorTitle`),
    errorMessage: t(`${p}.errorMessage`),
    retry: t(`${c}.retry`),
    backToHosts: t(`${c}.backToHosts`),
    viewKnowledge: t(`${p}.viewKnowledge`),
    governanceNote: t(`${p}.governanceNote`),
    arrivalsToday: t(`${p}.arrivalsToday`),
    departuresToday: t(`${p}.departuresToday`),
    upcomingReservations: t(`${p}.upcomingReservations`),
    recentCancellations: t(`${p}.recentCancellations`),
    last30Days: t(`${p}.last30Days`),
    filterProperty: t(`${p}.filterProperty`),
    allProperties: t(`${p}.allProperties`),
    filterStatus: t(`${p}.filterStatus`),
    allStatuses: t(`${p}.allStatuses`),
    filterGuest: t(`${p}.filterGuest`),
    guestNamePlaceholder: t(`${p}.guestNamePlaceholder`),
    reference: t(`${p}.reference`),
    guestName: t(`${p}.guestName`),
    property: t(`${p}.property`),
    checkIn: t(`${p}.checkIn`),
    checkOut: t(`${p}.checkOut`),
    guests: t(`${p}.guests`),
    status: t(`${p}.status`),
    actions: t(`${p}.actions`),
    arrivalToday: t(`${p}.arrivalToday`),
    departureToday: t(`${p}.departureToday`),
    viewProperty: t(`${p}.viewProperty`),
    openGuestProfile: t(`${p}.openGuestProfile`),
    openCheckIn: t(`${p}.openCheckIn`),
    confirmReservation: t(`${p}.confirmReservation`),
    checkInGuest: t(`${p}.checkInGuest`),
    checkOutGuest: t(`${p}.checkOutGuest`),
    updateNotes: t(`${p}.updateNotes`),
    validateAvailability: t(`${p}.validateAvailability`),
    defaultNote: t(`${p}.defaultNote`),
    cancellationDate: t(`${p}.cancellationDate`),
    reason: t(`${p}.reason`),
    bookingTimeline: t(`${p}.bookingTimeline`),
    emptyReservationsTitle: t(`${p}.emptyReservationsTitle`),
    emptyReservationsMessage: t(`${p}.emptyReservationsMessage`),
    emptyCancellationsTitle: t(`${p}.emptyCancellationsTitle`),
    emptyCancellationsMessage: t(`${p}.emptyCancellationsMessage`),
    emptyReportsTitle: t(`${p}.emptyReportsTitle`),
    emptyReportsMessage: t(`${p}.emptyReportsMessage`),
    reportSummary: t(`${p}.reportSummary`),
    totalReservations: t(`${p}.totalReservations`),
    avgNights: t(`${p}.avgNights`),
    avgGuests: t(`${p}.avgGuests`),
    byStatus: t(`${p}.byStatus`),
    byChannel: t(`${p}.byChannel`),
    actionRecorded: t(`${c}.actionRecorded`),
    actionFailed: t(`${c}.actionFailed`),
  };

  for (const key of sectionKeys) labels[`section_${key}`] = t(`${p}.sections.${key}`);
  for (const key of bookingStatusKeys) labels[`bookingStatus_${key}`] = t(`${p}.bookingStatuses.${key}`);
  for (const key of timelineKeys) labels[`timelineEvent_${key}`] = t(`${p}.timelineEvents.${key}`);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.pageTitle`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <AipifyHostsBookingCenterDashboardPanel labels={labels} />
    </div>
  );
}
