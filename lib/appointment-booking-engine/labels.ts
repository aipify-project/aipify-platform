import type { Translator } from "@/lib/i18n/translate";
import type { AppointmentBookingSection } from "./config";

export type AppointmentBookingLabels = {
  title: string;
  subtitle: string;
  loading: string;
  empty: string;
  refresh: string;
  principle: string;
  privacyNote: string;
  vacationMessage: string;
  noRecords: string;
  sections: Record<AppointmentBookingSection, string>;
  stats: {
    appointments: string;
    waitingList: string;
    services: string;
    calendarRevenue: string;
    activeHolds: string;
  };
  companionRecommendations: string;
  bookingStatuses: string;
  auditRecent: string;
};

export function buildAppointmentBookingLabels(t: Translator): AppointmentBookingLabels {
  const p = "customerApp.appointmentBooking";

  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    loading: t(`${p}.loading`),
    empty: t(`${p}.empty`),
    refresh: t(`${p}.refresh`),
    principle: t(`${p}.principle`),
    privacyNote: t(`${p}.privacyNote`),
    vacationMessage: t(`${p}.vacationMessage`),
    noRecords: t(`${p}.noRecords`),
    sections: {
      overview: t(`${p}.sections.overview`),
      calendar: t(`${p}.sections.calendar`),
      appointments: t(`${p}.sections.appointments`),
      customers: t(`${p}.sections.customers`),
      services: t(`${p}.sections.services`),
      employees: t(`${p}.sections.employees`),
      locations: t(`${p}.sections.locations`),
      resources: t(`${p}.sections.resources`),
      availability: t(`${p}.sections.availability`),
      waiting_list: t(`${p}.sections.waitingList`),
      payments: t(`${p}.sections.payments`),
      vacation_coverage: t(`${p}.sections.vacationCoverage`),
      policies: t(`${p}.sections.policies`),
      reports: t(`${p}.sections.reports`),
    },
    stats: {
      appointments: t(`${p}.stats.appointments`),
      waitingList: t(`${p}.stats.waitingList`),
      services: t(`${p}.stats.services`),
      calendarRevenue: t(`${p}.stats.calendarRevenue`),
      activeHolds: t(`${p}.stats.activeHolds`),
    },
    companionRecommendations: t(`${p}.companionRecommendations`),
    bookingStatuses: t(`${p}.bookingStatuses`),
    auditRecent: t(`${p}.auditRecent`),
  };
}
