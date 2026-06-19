import type { Translator } from "@/lib/i18n/translate";

export type CalendarManagementLabels = {
  title: string;
  subtitle: string;
  myCalendar: string;
  teamCalendar: string;
  departmentCalendar: string;
  resourceCalendar: string;
  bookings: string;
  approvals: string;
  schedules: string;
  reports: string;
  accessDenied: string;
  createEvent: string;
  eventTitle: string;
  eventDescription: string;
  startsAt: string;
  endsAt: string;
  location: string;
  save: string;
  approve: string;
  reject: string;
  cancel: string;
  bookResource: string;
  upcoming: string;
  conflicts: string;
  pendingApprovals: string;
  leavePending: string;
  noEvents: string;
  noEventsHint: string;
  viewDay: string;
  viewWeek: string;
  viewMonth: string;
  viewAgenda: string;
  resource: string;
  pack: string;
  status: string;
  syncPending: string;
  personalCalendarLink: string;
  statusScheduled: string;
  statusInformation: string;
  statusPending: string;
  statusConfirmed: string;
  statusCancelled: string;
  statusAwaitingApproval: string;
  frequency: string;
  leave: string;
  managerDashboard: string;
};

export function buildCalendarManagementLabels(t: Translator): CalendarManagementLabels {
  const p = "customerApp.calendarManagement";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    myCalendar: t(`${p}.myCalendar`),
    teamCalendar: t(`${p}.teamCalendar`),
    departmentCalendar: t(`${p}.departmentCalendar`),
    resourceCalendar: t(`${p}.resourceCalendar`),
    bookings: t(`${p}.bookings`),
    approvals: t(`${p}.approvals`),
    schedules: t(`${p}.schedules`),
    reports: t(`${p}.reports`),
    accessDenied: t(`${p}.accessDenied`),
    createEvent: t(`${p}.createEvent`),
    eventTitle: t(`${p}.eventTitle`),
    eventDescription: t(`${p}.eventDescription`),
    startsAt: t(`${p}.startsAt`),
    endsAt: t(`${p}.endsAt`),
    location: t(`${p}.location`),
    save: t(`${p}.save`),
    approve: t(`${p}.approve`),
    reject: t(`${p}.reject`),
    cancel: t(`${p}.cancel`),
    bookResource: t(`${p}.bookResource`),
    upcoming: t(`${p}.upcoming`),
    conflicts: t(`${p}.conflicts`),
    pendingApprovals: t(`${p}.pendingApprovals`),
    leavePending: t(`${p}.leavePending`),
    noEvents: t(`${p}.noEvents`),
    noEventsHint: t(`${p}.noEventsHint`),
    viewDay: t(`${p}.viewDay`),
    viewWeek: t(`${p}.viewWeek`),
    viewMonth: t(`${p}.viewMonth`),
    viewAgenda: t(`${p}.viewAgenda`),
    resource: t(`${p}.resource`),
    pack: t(`${p}.pack`),
    status: t(`${p}.status`),
    syncPending: t(`${p}.syncPending`),
    personalCalendarLink: t(`${p}.personalCalendarLink`),
    statusScheduled: t(`${p}.statusScheduled`),
    statusInformation: t(`${p}.statusInformation`),
    statusPending: t(`${p}.statusPending`),
    statusConfirmed: t(`${p}.statusConfirmed`),
    statusCancelled: t(`${p}.statusCancelled`),
    statusAwaitingApproval: t(`${p}.statusAwaitingApproval`),
    frequency: t(`${p}.frequency`),
    leave: t(`${p}.leave`),
    managerDashboard: t(`${p}.managerDashboard`),
  };
}

export function statusLabel(labels: CalendarManagementLabels, status: string): string {
  switch (status) {
    case "scheduled": return labels.statusScheduled;
    case "information": return labels.statusInformation;
    case "pending": return labels.statusPending;
    case "confirmed": return labels.statusConfirmed;
    case "cancelled": return labels.statusCancelled;
    case "awaiting_approval": return labels.statusAwaitingApproval;
    default: return status;
  }
}

export function formatEventTime(startsAt: string, endsAt: string): string {
  try {
    const start = new Date(startsAt);
    const end = new Date(endsAt);
    return `${start.toLocaleString()} – ${end.toLocaleTimeString()}`;
  } catch {
    return `${startsAt} – ${endsAt}`;
  }
}
