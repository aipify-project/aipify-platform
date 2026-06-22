import { normalizeIntegrationQuery, phraseMatchesQuery } from "@/lib/integration-intelligence/normalize-text";
import type { CompanionTenantContext } from "./companion-tenant-context";

export type CompanionOperationalQueryKind =
  | "since_last"
  | "completed"
  | "attention"
  | "changes"
  | "next_action"
  | "overview";

export type CompanionOperationalQueryMatch = {
  kind: CompanionOperationalQueryKind;
  score: number;
};

const OPERATIONAL_HINTS: Array<{ kind: CompanionOperationalQueryKind; phrases: string[] }> = [
  {
    kind: "since_last",
    phrases: [
      "since last",
      "since i logged",
      "siden sist",
      "siden jeg logget",
      "sedan senast",
      "sedan jag loggade",
      "siden sidst",
      "desde la ultima",
      "od ostatniego",
      "vid ostannoho",
      "what happened",
      "hva har skjedd",
      "vad har hänt",
    ],
  },
  {
    kind: "completed",
    phrases: [
      "completed",
      "finished",
      "fullført",
      "ferdig",
      "klart",
      "utfört",
      "afsluttet",
      "completado",
      "zakonczone",
      "zaversheno",
      "prepared by aipify",
      "aipify completed",
      "aipify complete",
      "aipify fullførte",
    ],
  },
  {
    kind: "attention",
    phrases: [
      "attention",
      "requires attention",
      "krever oppmerksomhet",
      "behöver uppmärksamhet",
      "kræver opmærksomhed",
      "requiere atencion",
      "wymaga uwagi",
      "potребує уваги",
      "critical",
      "urgent",
      "pending approval",
      "venter godkjenning",
    ],
  },
  {
    kind: "changes",
    phrases: [
      "important changes",
      "key changes",
      "viktige endringer",
      "viktiga förändringar",
      "vigtige ændringer",
      "cambios importantes",
      "wazne zmiany",
      "vazhlyvi zminy",
      "what changed",
      "endringer",
    ],
  },
  {
    kind: "next_action",
    phrases: [
      "next action",
      "what should i do",
      "recommended next",
      "neste handling",
      "anbefalt neste",
      "nästa steg",
      "næste skridt",
      "siguiente paso",
      "nastepne dzialanie",
      "nastupna diia",
      "what now",
    ],
  },
  {
    kind: "overview",
    phrases: [
      "command brief",
      "brief summary",
      "operational summary",
      "kommandobrief",
      "kommandocenter",
      "driftsstatus",
      "oversikt",
      "overview",
      "resumen operativo",
      "podsumowanie operacyjne",
    ],
  },
];

function detectOperationalKind(query: string): CompanionOperationalQueryMatch | null {
  const normalized = normalizeIntegrationQuery(query);
  let best: CompanionOperationalQueryMatch | null = null;

  for (const hint of OPERATIONAL_HINTS) {
    for (const phrase of hint.phrases) {
      if (phraseMatchesQuery(normalized, phrase) || normalized.includes(phrase)) {
        const score = phrase.length + (normalized.startsWith(phrase) ? 10 : 0);
        if (!best || score > best.score) {
          best = { kind: hint.kind, score };
        }
      }
    }
  }

  return best;
}

export function matchOperationalQuery(
  query: string,
  tenantContext: CompanionTenantContext,
): CompanionOperationalQueryMatch | null {
  const match = detectOperationalKind(query);
  if (!match) return null;

  if (match.kind === "since_last" && !tenantContext.sinceLastLoginAvailable) {
    if (!tenantContext.commandBriefAvailable) return null;
  }

  if (
    (match.kind === "completed" ||
      match.kind === "attention" ||
      match.kind === "changes" ||
      match.kind === "next_action" ||
      match.kind === "overview") &&
    !tenantContext.commandBriefAvailable &&
    !tenantContext.sinceLastLoginAvailable
  ) {
    return null;
  }

  return match;
}
