import type { BookingProviderManifest } from "@/lib/integration-intelligence/booking/types";
import { BOOKING_INDUSTRY_METADATA } from "@/lib/integration-intelligence/booking/industry-metadata";

function readCapability(
  capability_key: BookingProviderManifest["capabilities"][number]["capability_key"],
  entity: string,
  permission: string | null = "appointments.view",
  semantic?: BookingProviderManifest["capabilities"][number]["semantic"],
) {
  return {
    capability_key,
    operation: "read" as const,
    adapter_available: false,
    approval_required: false,
    reversible: true,
    risk_level: 1 as const,
    entity,
    required_permission: permission,
    privacy_sensitive: entity === "customer",
    semantic,
  };
}

function writeCapability(
  capability_key: BookingProviderManifest["capabilities"][number]["capability_key"],
  entity: string,
  permission: string | null = "appointments.manage",
) {
  return {
    capability_key,
    operation: "write" as const,
    adapter_available: false,
    approval_required: true,
    reversible: true,
    risk_level: 2 as const,
    entity,
    required_permission: permission,
    privacy_sensitive: true,
    semantic: {
      domain: "services" as const,
      entity,
      operations: ["create", "update", "cancel"] as const,
    },
  };
}

export const APPOINTMENT_BOOKING_PROVIDER_MANIFEST: BookingProviderManifest = {
  provider_key: "appointment_booking",
  display_name_key: "customerApp.companionPlatformKnowledge.services.providers.appointment_booking",
  source_engine: "appointment_booking",
  implementation_status: "partial",
  business_pack_key: "appointments_services",
  industry_metadata: [...BOOKING_INDUSTRY_METADATA],
  capabilities: [
    readCapability("service.read", "service", "appointments.view", {
      domain: "services",
      entity: "service",
      metrics: ["duration", "buffer"],
      operations: ["find", "list"],
      time_dimensions: ["duration"],
      entity_aliases: {
        en: ["service", "treatment", "appointment type"],
        no: ["tjeneste", "behandling", "time"],
      },
      industry_terms: ["hairdresser", "salon", "beauty"],
    }),
    readCapability("employee.read", "employee", "appointments.view", {
      domain: "services",
      entity: "employee",
      metrics: ["employee"],
      operations: ["find", "list"],
      entity_aliases: {
        en: ["employee", "staff", "stylist", "resource"],
        no: ["ansatt", "frisør", "medarbeider"],
      },
    }),
    readCapability("availability.read", "availability", "appointments.view", {
      domain: "services",
      entity: "availability",
      metrics: ["next_available", "availability"],
      operations: ["check", "list"],
      time_dimensions: ["date", "time", "next_available"],
      entity_aliases: {
        en: ["available", "availability", "open slot", "next slot"],
        no: ["ledig", "tilgjengelig", "neste time"],
      },
    }),
    readCapability("schedule.read", "schedule", "appointments.view", {
      domain: "services",
      entity: "schedule",
      metrics: ["schedule_tomorrow"],
      operations: ["list"],
      time_dimensions: ["date", "time"],
      entity_aliases: {
        en: ["schedule", "calendar", "booked"],
        no: ["timeplan", "kalender", "booket"],
      },
    }),
    readCapability("booking.read", "booking", "appointments.view", {
      domain: "services",
      entity: "booking",
      metrics: ["upcoming_bookings"],
      operations: ["find", "list"],
      time_dimensions: ["date", "time"],
      entity_aliases: {
        en: ["booking", "appointment", "reservation"],
        no: ["booking", "avtale", "time"],
      },
    }),
    readCapability("absence.read", "absence", "absence.view", {
      domain: "services",
      entity: "absence",
      operations: ["list"],
      entity_aliases: {
        en: ["absence", "away", "unavailable"],
        no: ["fravær", "utilgjengelig"],
      },
    }),
    readCapability("vacation_mode.read", "absence", "absence.view", {
      domain: "services",
      entity: "absence",
      metrics: ["vacation_return_schedule"],
      operations: ["check"],
      entity_aliases: {
        en: ["vacation mode", "vacation", "time away"],
        no: ["ferie", "feriemodus"],
      },
    }),
    readCapability("post_vacation_availability.read", "availability", "appointments.view", {
      domain: "services",
      entity: "availability",
      metrics: ["post_vacation_availability"],
      operations: ["check"],
      time_dimensions: ["next_available", "date"],
      entity_aliases: {
        en: ["after vacation", "post vacation", "return from vacation"],
        no: ["etter ferie", "tilbake fra ferie"],
      },
    }),
    writeCapability("booking.create", "booking"),
    writeCapability("booking.update", "booking"),
    writeCapability("booking.cancel", "booking"),
  ],
};

export const APPOINTMENT_BOOKING_PROVIDER_MANIFESTS = [APPOINTMENT_BOOKING_PROVIDER_MANIFEST] as const;
