import type { CustomerActiveLocale } from "@/lib/i18n/customer-active-locale-registry";
import type { HostsCapabilityKey } from "@/lib/integration-intelligence/hosts/types";
import { normalizeIntegrationQuery } from "@/lib/integration-intelligence/normalize-text";

export type HostsSemanticDescriptor = {
  capability_key: HostsCapabilityKey;
  entity:
    | "property"
    | "reservation"
    | "guest"
    | "arrival"
    | "departure"
    | "cleaning"
    | "maintenance"
    | "payout"
    | "expense"
    | "forecast";
  metrics: readonly string[];
  aliases: Partial<Record<CustomerActiveLocale | "en", readonly string[]>>;
};

export type HostsSemanticIntent = {
  capability_key: HostsCapabilityKey;
  entity: HostsSemanticDescriptor["entity"];
  operation: "count" | "list" | "inspect" | "compare" | "forecast" | "draft" | "create_task";
  metric: string | null;
  entity_id: string | null;
  confirmed: boolean;
  confidence: "high" | "moderate" | "low";
  ambiguous: boolean;
};

function extractReservationId(normalized: string): string | null {
  const explicit = normalized.match(
    /\b(?:reservation|booking|reservasjon|bokning|reserva)\s*(?:id|nr|#)?\s*[:#]?\s*([a-z0-9_-]{4,})\b/i,
  );
  if (explicit?.[1]) return explicit[1].trim();
  const bare = normalized.match(/\b(res_[a-z0-9_-]{3,}|bkg_[a-z0-9_-]{3,})\b/i);
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

export const HOSTS_SEMANTIC_DESCRIPTORS: readonly HostsSemanticDescriptor[] = [
  {
    capability_key: "arrival.read",
    entity: "arrival",
    metrics: ["arrivals_today", "upcoming_reservations"],
    aliases: {
      en: ["arrivals today", "check in", "who is arriving"],
      no: ["ankomster i dag", "innsjekk", "hvem kommer"],
      sv: ["ankomster idag", "incheckning", "vem kommer"],
      da: ["ankomster i dag", "indtjekning", "hvem kommer"],
      es: ["llegadas hoy", "check in", "quien llega"],
      pl: ["przyjazdy dzisiaj", "zameldowanie", "kto przyjeżdża"],
      uk: ["прибуття сьогодні", "заїзд", "хто приїжджає"],
    },
  },
  {
    capability_key: "departure.read",
    entity: "departure",
    metrics: ["departures_today"],
    aliases: {
      en: ["departures", "check out", "checking out"],
      no: ["avreiser", "utsjekk", "sjekker ut"],
      sv: ["avresor", "utcheckning"],
      da: ["afrejser", "udtjekning"],
      es: ["salidas", "check out"],
      pl: ["wyjazdy", "wymeldowanie"],
      uk: ["виїзди", "виїзд"],
    },
  },
  {
    capability_key: "cleaning.read",
    entity: "cleaning",
    metrics: ["cleaning_due"],
    aliases: {
      en: ["cleaning tasks", "turnover", "housekeeping"],
      no: ["rengjøring", "rengjøringsoppgaver", "vask"],
      sv: ["städning", "städuppgifter"],
      da: ["rengøring", "rengøringsopgaver"],
      es: ["limpieza", "tareas de limpieza"],
      pl: ["sprzątanie", "zadania sprzątania"],
      uk: ["прибирання", "завдання прибирання"],
    },
  },
  {
    capability_key: "maintenance.read",
    entity: "maintenance",
    metrics: ["maintenance_open"],
    aliases: {
      en: ["maintenance", "repairs", "open maintenance"],
      no: ["vedlikehold", "vedlikeholdssaker"],
      sv: ["underhåll", "underhållsärenden"],
      da: ["vedligehold", "vedligeholdssager"],
      es: ["mantenimiento", "reparaciones"],
      pl: ["konserwacja", "naprawy"],
      uk: ["обслуговування", "ремонт"],
    },
  },
  {
    capability_key: "host_revenue.read",
    entity: "expense",
    metrics: ["revenue"],
    aliases: {
      en: ["revenue", "earned this month", "how much earned"],
      no: ["inntekt", "tjent denne måneden", "hvor mye har vi tjent"],
      sv: ["intäkter", "tjänat denna månad"],
      da: ["indtægt", "tjent denne måned"],
      es: ["ingresos", "cuanto ganamos"],
      pl: ["przychód", "ile zarobiliśmy"],
      uk: ["дохід", "скільки заробили"],
    },
  },
  {
    capability_key: "host_payout.read",
    entity: "payout",
    metrics: ["payouts_due", "overdue_payouts"],
    aliases: {
      en: ["payouts", "missing payouts", "payout due"],
      no: ["utbetalinger", "mangler utbetalinger"],
      sv: ["utbetalningar", "saknade utbetalningar"],
      da: ["udbetalinger", "manglende udbetalinger"],
      es: ["pagos", "pagos pendientes"],
      pl: ["wypłaty", "brakujące wypłaty"],
      uk: ["виплати", "відсутні виплати"],
    },
  },
  {
    capability_key: "host_forecast.read",
    entity: "forecast",
    metrics: ["forecast", "occupancy"],
    aliases: {
      en: ["forecast", "occupancy next month", "occupancy"],
      no: ["prognose", "belegg neste måned", "belegg"],
      sv: ["prognos", "beläggning nästa månad"],
      da: ["prognose", "belægning næste måned"],
      es: ["previsión", "ocupación"],
      pl: ["prognoza", "obłożenie"],
      uk: ["прогноз", "завантаженість"],
    },
  },
  {
    capability_key: "guest_response.draft",
    entity: "guest",
    metrics: [],
    aliases: {
      en: ["draft message", "reply to guest", "guest response"],
      no: ["svarutkast", "svar til gjest", "gjestemelding"],
      sv: ["svarsutkast", "svar till gäst"],
      da: ["svarudkast", "svar til gæst"],
      es: ["borrador mensaje", "responder al huésped"],
      pl: ["szkic wiadomości", "odpowiedź gościowi"],
      uk: ["чернетка повідомлення", "відповідь гостю"],
    },
  },
];

export function resolveHostsSemanticIntent(input: {
  query: string;
  locale: CustomerActiveLocale;
  descriptors?: readonly HostsSemanticDescriptor[];
}): HostsSemanticIntent {
  const normalized = normalizeIntegrationQuery(input.query);
  const entityId = extractReservationId(normalized);
  const confirmed = /\b(bekreft|confirm|godkjen|approve|ja|yes)\b/i.test(normalized);
  const descriptors = input.descriptors ?? HOSTS_SEMANTIC_DESCRIPTORS;

  if (entityId && /\b(utkast|svarutkast|draft|borrador|szkic|чернетк)\b/i.test(normalized)) {
    return {
      capability_key: "guest_response.draft",
      entity: "guest",
      operation: "draft",
      metric: null,
      entity_id: entityId,
      confirmed,
      confidence: "high",
      ambiguous: false,
    };
  }

  if (entityId) {
    return {
      capability_key: "reservation.read",
      entity: "reservation",
      operation: "inspect",
      metric: null,
      entity_id: entityId,
      confirmed,
      confidence: "high",
      ambiguous: false,
    };
  }

  const scored = descriptors
    .map((descriptor) => ({
      descriptor,
      score: Math.max(
        scoreAlias(normalized, descriptor.aliases[input.locale]),
        scoreAlias(normalized, descriptor.aliases.en),
      ),
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);

  const top = scored[0] ?? null;

  let metric: string | null = null;
  if (/\b(i dag|today|idag|i dag|dzisiaj|сьогодні)\b/i.test(normalized) && /ankom|arrival|llegad|przyjazd|прибут/i.test(normalized)) {
    metric = "arrivals_today";
  } else if (/i morgen|tomorrow|imorgon|mañana|jutro|завтра/i.test(normalized) && /utsjekk|departure|salida|wyjazd|виїзд/i.test(normalized)) {
    metric = "departures_today";
  } else if (/rengj|clean|städ|limpiez|sprząt|прибир/i.test(normalized)) {
    metric = "cleaning_due";
  } else if (/vedlikehold|maintenance|underhåll|mantenimiento|konserwacja|обслугов/i.test(normalized)) {
    metric = "maintenance_open";
  } else if (/tjent|earned|inntekt|revenue|ingresos|przychód|дохід/i.test(normalized)) {
    metric = "revenue";
  } else if (/utbetaling|payout|utbetalning|udbetaling|wypłat|виплат/i.test(normalized)) {
    metric = "payouts_due";
  } else if (/prognose|forecast|belegg|beläggning|belægning|ocupaci|obłoż|завантаж/i.test(normalized)) {
    metric = "forecast";
  } else if (/følge opp|follow up|prioriter/i.test(normalized)) {
    metric = "arrivals_today";
  }

  if (
    !metric &&
    top?.descriptor.entity === "arrival" &&
    /\b(i dag|today|idag|dzisiaj|сьогодні)\b/i.test(normalized)
  ) {
    metric = "arrivals_today";
  }

  const wantsDraft = /\b(utkast|svarutkast|draft|borrador|szkic|чернетк)\b/i.test(normalized);

  let capability_key = top?.descriptor.capability_key ?? "property.read";
  let entity = top?.descriptor.entity ?? "property";
  let operation: HostsSemanticIntent["operation"] = metric ? "count" : "list";

  if (wantsDraft) {
    capability_key = "guest_response.draft";
    entity = "guest";
    operation = "draft";
  } else if (metric === "forecast") {
    operation = "forecast";
  }

  return {
    capability_key,
    entity,
    operation,
    metric,
    entity_id: null,
    confirmed,
    confidence: top ? (top.score >= 20 ? "high" : "moderate") : metric ? "moderate" : "low",
    ambiguous: scored.length > 1 && scored[0]?.score === scored[1]?.score,
  };
}
