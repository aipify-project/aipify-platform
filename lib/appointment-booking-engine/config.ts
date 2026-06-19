export const APPOINTMENT_BOOKING_SECTIONS = [
  { key: "overview", href: "/app/appointments" },
  { key: "calendar", href: "/app/appointments/calendar" },
  { key: "appointments", href: "/app/appointments/appointments" },
  { key: "customers", href: "/app/appointments/customers" },
  { key: "services", href: "/app/appointments/services" },
  { key: "employees", href: "/app/appointments/employees" },
  { key: "locations", href: "/app/appointments/locations" },
  { key: "resources", href: "/app/appointments/resources" },
  { key: "availability", href: "/app/appointments/availability" },
  { key: "waiting_list", href: "/app/appointments/waiting-list" },
  { key: "payments", href: "/app/appointments/payments" },
  { key: "vacation_coverage", href: "/app/appointments/vacation-coverage" },
  { key: "policies", href: "/app/appointments/policies" },
  { key: "reports", href: "/app/appointments/reports" },
] as const;

export type AppointmentBookingSection =
  (typeof APPOINTMENT_BOOKING_SECTIONS)[number]["key"];

export function getAppointmentBookingActiveSection(
  pathname: string
): AppointmentBookingSection {
  if (pathname === "/app/appointments" || pathname === "/app/appointments/") {
    return "overview";
  }
  const match = APPOINTMENT_BOOKING_SECTIONS.find(
    (s) => s.key !== "overview" && pathname.startsWith(s.href)
  );
  return match?.key ?? "overview";
}
