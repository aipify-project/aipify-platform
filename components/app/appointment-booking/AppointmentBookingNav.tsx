"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  APPOINTMENT_BOOKING_SECTIONS,
  getAppointmentBookingActiveSection,
  type AppointmentBookingSection,
} from "@/lib/appointment-booking-engine/config";

type Props = {
  labels: Record<AppointmentBookingSection, string>;
};

export function AppointmentBookingNav({ labels }: Props) {
  const pathname = usePathname();
  const active = getAppointmentBookingActiveSection(pathname);

  return (
    <nav
      aria-label="Appointment Booking"
      className="flex flex-wrap gap-2 border-b border-zinc-200 pb-4"
    >
      {APPOINTMENT_BOOKING_SECTIONS.map((item) => {
        const isActive = active === item.key;
        return (
          <Link
            key={item.key}
            href={item.href}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "bg-indigo-700 text-white"
                : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
            }`}
          >
            {labels[item.key]}
          </Link>
        );
      })}
    </nav>
  );
}
