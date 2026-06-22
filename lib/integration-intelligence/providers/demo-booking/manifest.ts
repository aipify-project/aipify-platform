import type { IntegrationProviderManifest } from "../../types";

/** Test-only manifest — validates generic pipeline without shipping fake production data. */
export const DEMO_BOOKING_PROVIDER_MANIFEST: IntegrationProviderManifest = {
  provider: "demo_booking_provider",
  displayName: "Demo Booking Provider",
  capabilities: [
    {
      key: "platform_snapshot",
      description: "Returns safe live booking platform metadata",
      fields: ["status", "environment", "version", "supported_locales", "active_modules", "checked_at"],
    },
  ],
  entities: [
    {
      type: "module",
      key: "booking",
      displayNames: {
        en: "Booking",
        no: "Booking",
      },
      aliases: {
        en: ["booking", "bookings"],
        no: ["booking", "bookinger"],
      },
    },
    {
      type: "module",
      key: "appointments",
      displayNames: {
        en: "Appointments",
        no: "Avtaler",
      },
      aliases: {
        en: ["appointments", "appointment"],
        no: ["avtaler", "timebestilling"],
      },
    },
    {
      type: "module",
      key: "availability",
      displayNames: {
        en: "Availability",
        no: "Tilgjengelighet",
      },
      aliases: {
        en: ["availability"],
        no: ["tilgjengelighet"],
      },
    },
    {
      type: "module",
      key: "staff_calendar",
      displayNames: {
        en: "Staff calendar",
        no: "Personalkalender",
      },
      aliases: {
        en: ["staff calendar", "staff calendars"],
        no: ["personalkalender"],
      },
    },
  ],
};

export const DEMO_BOOKING_MOCK_SNAPSHOT = {
  availability: "available" as const,
  environment: "production",
  version: "demo-1.0.0",
  supportedLocales: ["no", "en"],
  activeModules: [
    { key: "booking", active: true },
    { key: "appointments", active: true },
    { key: "availability", active: true },
    { key: "staff_calendar", active: false },
  ],
  checkedAt: "2026-06-22T12:00:00.000Z",
};
