import type { CustomerActiveLocale } from "@/lib/i18n/customer-active-locale-registry";
import type { BookingCapabilityKey } from "@/lib/integration-intelligence/booking/types";
import type { BookingProviderManifest } from "@/lib/integration-intelligence/booking/types";
import { normalizeIntegrationQuery } from "@/lib/integration-intelligence/normalize-text";

export type BookingSemanticDescriptor = {
  capability_key: BookingCapabilityKey;
  entity: "service" | "employee" | "resource" | "booking" | "availability" | "schedule" | "absence";
  metrics: readonly string[];
  aliases: Partial<Record<CustomerActiveLocale | "en", readonly string[]>>;
};

export type BookingSemanticIntent = {
  capability_key: BookingCapabilityKey;
  entity: BookingSemanticDescriptor["entity"];
  operation: "find" | "list" | "check" | "create" | "update" | "cancel";
  metric: string | null;
  booking_id: string | null;
  service_id: string | null;
  resource_name: string | null;
  date_hint: string | null;
  confirmed: boolean;
  confidence: "high" | "moderate" | "low";
  ambiguous: boolean;
};

function extractBookingId(normalized: string): string | null {
  const explicit = normalized.match(
    /\b(?:booking|appointment|avtale|tid|termin|bokning|reserva)\s*(?:id|nr|#)?\s*[:#]?\s*([a-z0-9_-]{4,})\b/i,
  );
  if (explicit?.[1]) return explicit[1].trim();
  const bare = normalized.match(/\b(apt_[a-z0-9_-]{3,}|booking_[a-z0-9_-]{3,})\b/i);
  return bare?.[1]?.trim() ?? null;
}

function scoreAlias(normalized: string, aliases: readonly string[] | undefined): number {
  if (!aliases?.length) return 0;
  let score = 0;
  for (const alias of aliases) {
    const token = alias.trim().toLowerCase();
    if (!token) continue;
    if (normalized.includes(token)) score += token.length >= 8 ? 30 : 18;
  }
  return score;
}

export function resolveBookingSemanticIntent(input: {
  query: string;
  locale: CustomerActiveLocale;
  descriptors: readonly BookingSemanticDescriptor[];
}): BookingSemanticIntent {
  const normalized = normalizeIntegrationQuery(input.query);
  const bookingId = extractBookingId(normalized);
  const confirmed = /\b(bekreft|confirm|godkjen|approve|ja|yes)\b/i.test(normalized);

  if (bookingId) {
    return {
      capability_key: "booking.read",
      entity: "booking",
      operation: "find",
      metric: null,
      booking_id: bookingId,
      service_id: null,
      resource_name: null,
      date_hint: null,
      confirmed,
      confidence: "high",
      ambiguous: false,
    };
  }

  const wantsCancel = /\b(avbestill|cancel|kansell|annull|anuluj|скасув)\b/i.test(normalized);
  const wantsMove = /\b(flytt|move|reschedule|endre tid|byt tid|zmień termin)\b/i.test(normalized);
  const wantsCreate = /\b(bestill|book|boka|bok|schedule|opprett time|zarezerwuj|забронюй)\b/i.test(normalized);

  if (wantsCancel) {
    return {
      capability_key: "booking.cancel",
      entity: "booking",
      operation: "cancel",
      metric: null,
      booking_id: null,
      service_id: null,
      resource_name: null,
      date_hint: null,
      confirmed,
      confidence: confirmed ? "high" : "moderate",
      ambiguous: !confirmed,
    };
  }

  if (wantsMove) {
    return {
      capability_key: "booking.update",
      entity: "booking",
      operation: "update",
      metric: null,
      booking_id: null,
      service_id: null,
      resource_name: null,
      date_hint: null,
      confirmed,
      confidence: confirmed ? "high" : "moderate",
      ambiguous: !confirmed,
    };
  }

  if (wantsCreate) {
    return {
      capability_key: "booking.create",
      entity: "booking",
      operation: "create",
      metric: null,
      booking_id: null,
      service_id: null,
      resource_name: null,
      date_hint: null,
      confirmed,
      confidence: confirmed ? "high" : "moderate",
      ambiguous: !confirmed,
    };
  }

  const scored = input.descriptors
    .map((descriptor) => ({
      descriptor,
      score:
        Math.max(
          scoreAlias(normalized, descriptor.aliases[input.locale]),
          scoreAlias(normalized, descriptor.aliases.en),
        ) +
        (descriptor.capability_key === "availability.read" &&
        /ledig|available|availability|tilgjengelig|disponib|dostęp|доступн/i.test(normalized)
          ? 35
          : 0),
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);

  const top = scored[0] ?? null;

  let metric: string | null = null;
  if (/\b(neste|next|nästa|næste|siguiente|następny|наступн)\b/i.test(normalized)) {
    metric = "next_available";
  } else if (/\b(varer|duration|lenge|how long|varaktighet|varighed|duración|czas trwania|тривалість)\b/i.test(normalized)) {
    metric = "duration";
  } else if (/\b(i morgen|tomorrow|imorgon|i morgen|mañana|jutro|завтра)\b/i.test(normalized)) {
    metric = "schedule_tomorrow";
  } else if (/\b(etter ferie|etter ferien|after vacation|post vacation|efter semester|po urlopie|після відпустки)\b/i.test(normalized)) {
    metric = "post_vacation_availability";
  }

  const resourceMatch = normalized.match(/\b(?:har|has|kan|can)\s+([a-zæøåäöéíóúçłźśńа-я]{2,})\b/i);
  const resourceName = resourceMatch?.[1] ?? null;

  const dateHint =
    normalized.match(/\b(fredag|friday|fredag|fredag|viernes|piątek|пʼятниця|monday|mandag|måndag)\b/i)?.[0] ??
    null;

  return {
    capability_key: top?.descriptor.capability_key ?? "availability.read",
    entity: top?.descriptor.entity ?? "availability",
    operation: metric === "next_available" ? "check" : "list",
    metric,
    booking_id: null,
    service_id: null,
    resource_name: resourceName,
    date_hint: dateHint,
    confirmed,
    confidence: top && top.score >= 30 ? "high" : top ? "moderate" : "low",
    ambiguous: !top,
  };
}

export function collectBookingDescriptorsFromManifests(
  manifests: readonly BookingProviderManifest[],
): BookingSemanticDescriptor[] {
  const descriptors: BookingSemanticDescriptor[] = [];
  for (const manifest of manifests) {
    for (const capability of manifest.capabilities) {
      if (!capability.semantic) continue;
      descriptors.push({
        capability_key: capability.capability_key,
        entity: capability.semantic.entity as BookingSemanticDescriptor["entity"],
        metrics: capability.semantic.metrics ?? [],
        aliases: capability.semantic.entity_aliases ?? {},
      });
    }
  }
  return descriptors;
}
