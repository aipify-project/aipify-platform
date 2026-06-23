import { normalizeIntegrationQuery, phraseMatchesQuery } from "@/lib/integration-intelligence/normalize-text";

export type OrganizationIntelligenceQueryKind =
  | "member_count"
  | "member_active_list"
  | "member_pending_verification"
  | "member_verification_status"
  | "support_sla"
  | "prioritize_today";

export type OrganizationIntelligenceIntent = {
  kind: OrganizationIntelligenceQueryKind;
  member_reference: string | null;
  score: number;
};

const INTENT_HINTS: Array<{
  kind: OrganizationIntelligenceQueryKind;
  phrases: string[];
  baseScore?: number;
}> = [
  {
    kind: "prioritize_today",
    phrases: [
      "prioritere i dag",
      "prioritize today",
      "hva bør jeg prioritere",
      "what should i prioritize",
      "vad bör jag prioritera",
      "hvad skal jeg prioritere",
      "co powinienem priorytetyzowac",
      "shcho maiu prioritetyzuvaty",
    ],
    baseScore: 50,
  },
  {
    kind: "support_sla",
    phrases: [
      "nærmer seg sla",
      "har brutt sla",
      "breached sla",
      "sla at risk",
      "supportsaker nærmer",
      "support cases approaching",
      "supportärenden sla",
      "supportsager sla",
    ],
    baseScore: 35,
  },
  {
    kind: "member_pending_verification",
    phrases: [
      "venter på verifisering",
      "pending verification",
      "waiting for verification",
      "medlemmer venter",
      "members waiting for verification",
      "ubehandlet verifisering",
    ],
    baseScore: 30,
  },
  {
    kind: "member_active_list",
    phrases: [
      "vis aktive medlemmer",
      "show active members",
      "aktive medlemmer",
      "active members",
      "lista aktiva medlemmar",
      "vis aktive medlemmer",
    ],
    baseScore: 28,
  },
  {
    kind: "member_count",
    phrases: [
      "hvor mange medlemmer",
      "how many members",
      "antall medlemmer",
      "member count",
      "medlemmer er registrert",
      "members registered",
      "registered members",
      "ile czlonkow",
    ],
    baseScore: 28,
  },
];

function extractMemberReference(originalQuery: string, normalized: string): string | null {
  const bracket = originalQuery.match(/\[([^\]]{2,60})\]/);
  if (bracket?.[1]) return bracket[1].trim();

  const erMedlem = normalized.match(/\ber medlem(?:et)?\s+([a-z0-9_@.-]{2,60})/i);
  if (erMedlem?.[1]) return erMedlem[1].trim();

  const isMember = normalized.match(/\bis member\s+([a-z0-9_@.-]{2,60})/i);
  if (isMember?.[1]) return isMember[1].trim();

  return null;
}

function isMemberVerificationStatusQuery(originalQuery: string, normalized: string): boolean {
  const reference = extractMemberReference(originalQuery, normalized);
  if (reference && /\b(verifisert|verified|verification)\b/i.test(normalized)) {
    return true;
  }
  return (
    /\b(er medlem|is member)\b/i.test(normalized) &&
    /\b(verifisert|verified|verification)\b/i.test(normalized)
  );
}

function scoreHint(normalized: string, phrase: string, baseScore = 0): number {
  if (!phraseMatchesQuery(normalized, phrase) && !normalized.includes(phrase)) return 0;
  return baseScore + phrase.length + (normalized.startsWith(phrase) ? 10 : 0);
}

export function resolveOrganizationIntelligenceIntent(query: string): OrganizationIntelligenceIntent | null {
  const normalized = normalizeIntegrationQuery(query);
  if (!normalized.trim()) return null;

  let best: OrganizationIntelligenceIntent | null = null;

  for (const hint of INTENT_HINTS) {
    for (const phrase of hint.phrases) {
      const score = scoreHint(normalized, phrase, hint.baseScore ?? 0);
      if (score > 0 && (!best || score > best.score)) {
        best = {
          kind: hint.kind,
          member_reference: extractMemberReference(query, normalized),
          score,
        };
      }
    }
  }

  if (isMemberVerificationStatusQuery(query, normalized)) {
    const reference = extractMemberReference(query, normalized);
    const score = 42 + (reference?.length ?? 0);
    if (!best || (best.kind !== "prioritize_today" && score >= best.score)) {
      best = { kind: "member_verification_status", member_reference: reference, score };
    }
  }

  if (best?.kind === "support_sla") {
    const hasSupport = /\b(support|sak|case|ticket|ärende|sag|zgłoszen|zvernen)\b/i.test(normalized);
    const hasSla = /\b(sla|nærmer|breach|brudd|risiko|risk|deadline|termin)\b/i.test(normalized);
    if (!hasSupport && !hasSla) {
      best = null;
    }
  }

  return best && best.score >= 15 ? best : null;
}

export function isOrganizationIntelligenceQuery(query: string): boolean {
  return resolveOrganizationIntelligenceIntent(query) !== null;
}
