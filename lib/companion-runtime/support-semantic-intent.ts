import type { CustomerActiveLocale } from "@/lib/i18n/customer-active-locale-registry";
import type { SupportCapabilityKey } from "@/lib/integration-intelligence/support/types";
import { normalizeIntegrationQuery } from "@/lib/integration-intelligence/normalize-text";

export type SupportSemanticDescriptor = {
  capability_key: SupportCapabilityKey;
  entity: "support_queue" | "support_case" | "customer" | "sla" | "escalation" | "response";
  metrics: readonly string[];
  aliases: Partial<Record<CustomerActiveLocale | "en", readonly string[]>>;
};

export type SupportSemanticIntent = {
  capability_key: SupportCapabilityKey;
  entity: SupportSemanticDescriptor["entity"];
  operation: "count" | "list" | "inspect" | "status" | "assign" | "escalate" | "draft";
  metric: string | null;
  case_id: string | null;
  confirmed: boolean;
  confidence: "high" | "moderate" | "low";
  ambiguous: boolean;
};

function extractCaseId(normalized: string): string | null {
  const explicit = normalized.match(
    /\b(?:case|sak|ärende|sag|ticket|caso|sprawa|sprava)\s*(?:id|nr|#)?\s*[:#]?\s*([a-z0-9_-]{4,})\b/i,
  );
  if (explicit?.[1]) return explicit[1].trim();
  const bare = normalized.match(/\b([a-f0-9-]{8,})\b/i);
  return bare?.[1]?.trim() ?? null;
}

function wantsSupportQueueInquiry(normalized: string): boolean {
  if (/\bhenvendelser?\b/i.test(normalized)) return true;
  if (/\b(nye henvendelser|ny henvendelse|new inquiries|new tickets)\b/i.test(normalized)) {
    return true;
  }
  return (
    /\b(er det (noen|nye)|any new|are there any)\b/i.test(normalized) &&
    /\b(henvend|inquir|ticket|supportsak)\b/i.test(normalized)
  );
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

export const SUPPORT_SEMANTIC_DESCRIPTORS: readonly SupportSemanticDescriptor[] = [
  {
    capability_key: "support_queue.read",
    entity: "support_queue",
    metrics: [
      "open_cases",
      "unassigned_cases",
      "urgent_cases",
      "overdue_cases",
      "sla_at_risk",
      "breached_sla",
      "oldest_open_case",
    ],
    aliases: {
      en: ["support queue", "open cases", "support tickets", "inquiries", "new inquiries", "unassigned cases"],
      no: [
        "supportkø",
        "åpne saker",
        "supportsaker",
        "henvendelse",
        "henvendelser",
        "nye henvendelser",
        "uten ansvarlig",
      ],
      sv: ["supportkö", "öppna ärenden", "supportärenden"],
      da: ["supportkø", "åbne sager", "supportsager"],
      es: ["cola de soporte", "casos abiertos", "tickets de soporte"],
      pl: ["kolejka wsparcia", "otwarte zgłoszenia", "sprawy wsparcia"],
      uk: ["черга підтримки", "відкриті звернення", "заявки підтримки"],
    },
  },
  {
    capability_key: "support_case.read",
    entity: "support_case",
    metrics: ["open_cases", "oldest_open_case"],
    aliases: {
      en: ["support case", "find case", "ticket lookup"],
      no: ["supportsak", "finn sak", "saksnummer"],
      sv: ["supportärende", "hitta ärende"],
      da: ["supportsag", "find sag"],
      es: ["caso de soporte", "buscar caso"],
      pl: ["sprawa wsparcia", "znajdź sprawę"],
      uk: ["звернення підтримки", "знайти справу"],
    },
  },
  {
    capability_key: "support_sla.read",
    entity: "sla",
    metrics: ["sla_at_risk", "breached_sla"],
    aliases: {
      en: ["sla", "sla risk", "breach sla", "service level"],
      no: ["sla", "sla risiko", "bryte sla"],
      sv: ["sla", "sla-risk"],
      da: ["sla", "sla risiko"],
      es: ["sla", "riesgo sla"],
      pl: ["sla", "ryzyko sla"],
      uk: ["sla", "ризик sla"],
    },
  },
  {
    capability_key: "support_response.draft",
    entity: "response",
    metrics: [],
    aliases: {
      en: ["draft response", "reply draft", "prepare response"],
      no: ["svarutkast", "utkast svar", "lag utkast"],
      sv: ["svarsutkast", "förbered svar"],
      da: ["svarudkast", "forbered svar"],
      es: ["borrador de respuesta", "preparar respuesta"],
      pl: ["szkic odpowiedzi", "przygotuj odpowiedź"],
      uk: ["чернетка відповіді", "підготувати відповідь"],
    },
  },
  {
    capability_key: "support_case.assign",
    entity: "support_case",
    metrics: ["unassigned_cases"],
    aliases: {
      en: ["assign case", "who should get", "assign support"],
      no: ["tildele sak", "hvem bør få", "tildeling"],
      sv: ["tilldela ärende", "vem ska få"],
      da: ["tildel sag", "hvem skal have"],
      es: ["asignar caso", "quién debe recibir"],
      pl: ["przypisz sprawę", "kto powinien dostać"],
      uk: ["призначити справу", "кому передати"],
    },
  },
  {
    capability_key: "support_case.escalate",
    entity: "escalation",
    metrics: [],
    aliases: {
      en: ["escalate case", "escalation required"],
      no: ["eskalere sak", "eskalering"],
      sv: ["eskalera ärende"],
      da: ["eskaler sag"],
      es: ["escalar caso"],
      pl: ["eskaluj sprawę"],
      uk: ["ескалувати справу"],
    },
  },
];

export function resolveSupportSemanticIntent(input: {
  query: string;
  locale: CustomerActiveLocale;
  descriptors?: readonly SupportSemanticDescriptor[];
}): SupportSemanticIntent {
  const normalized = normalizeIntegrationQuery(input.query);
  const caseId = extractCaseId(normalized);
  const confirmed = /\b(bekreft|confirm|godkjen|approve|ja|yes)\b/i.test(normalized);
  const descriptors = input.descriptors ?? SUPPORT_SEMANTIC_DESCRIPTORS;

  if (caseId && /\b(utkast|svarutkast|draft|svarsutkast|borrador|szkic|чернетк)\b/i.test(normalized)) {
    return {
      capability_key: "support_response.draft",
      entity: "response",
      operation: "draft",
      metric: null,
      case_id: caseId,
      confirmed,
      confidence: "high",
      ambiguous: false,
    };
  }

  if (caseId) {
    return {
      capability_key: "support_case.read",
      entity: "support_case",
      operation: "inspect",
      metric: null,
      case_id: caseId,
      confirmed,
      confidence: "high",
      ambiguous: false,
    };
  }

  if (wantsSupportQueueInquiry(normalized)) {
    return {
      capability_key: "support_queue.read",
      entity: "support_queue",
      operation: "status",
      metric: "open_cases",
      case_id: null,
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
  if (
    /\b(ubesatt|unassigned|sin asignar|nieprzypisan)\b/i.test(normalized) ||
    /uten ansvarlig|utan ansvarlig|sin responsable|bez przypisania/i.test(normalized)
  ) {
    metric = "unassigned_cases";
  } else if (/\b(haster|urgent|prioritet|priority|pilne|терміново)\b/i.test(normalized)) {
    metric = "urgent_cases";
  } else if (/\b(sla|risikerer|at risk|breach|brudd)\b/i.test(normalized)) {
    metric = "sla_at_risk";
  } else if (/\b(lengst|oldest|eldst|najdłużej|найдовше)\b/i.test(normalized)) {
    metric = "oldest_open_case";
  } else if (/\b(hvor mange|how many|count|antall|antal|ile|скільки)\b/i.test(normalized)) {
    metric = "open_cases";
  } else if (/\b(nye|new)\b/i.test(normalized) && /\b(henvend|inquir|ticket|sak|case)\b/i.test(normalized)) {
    metric = "open_cases";
  } else if (/\b(venter på kunde|waiting for customer|esperando cliente)\b/i.test(normalized)) {
    metric = "waiting_for_customer";
  } else if (/\b(følge opp|follow up|follow-up|prioriter)\b/i.test(normalized)) {
    metric = "open_cases";
  }

  const wantsDraft = /\b(utkast|draft|svarutkast|borrador|szkic|чернетк)\b/i.test(normalized);
  const wantsAssign = /\b(tildele|assign|tilldela|asignar|przypisz|признач)\b/i.test(normalized);
  const wantsEscalate = /\b(eskal|escalat)\b/i.test(normalized);

  let capability_key = top?.descriptor.capability_key ?? "support_queue.read";
  let entity = top?.descriptor.entity ?? "support_queue";
  let operation: SupportSemanticIntent["operation"] = metric ? "count" : "status";

  if (wantsDraft) {
    capability_key = "support_response.draft";
    entity = "response";
    operation = "draft";
  } else if (wantsEscalate) {
    capability_key = "support_case.escalate";
    entity = "escalation";
    operation = "escalate";
  } else if (wantsAssign) {
    capability_key = "support_case.assign";
    entity = "support_case";
    operation = "assign";
  } else if (/\b(vis|show|list|liste|lista|pokaż|покаж)\b/i.test(normalized)) {
    operation = "list";
  }

  return {
    capability_key,
    entity,
    operation,
    metric,
    case_id: null,
    confirmed,
    confidence: top ? (top.score >= 20 ? "high" : "moderate") : metric ? "moderate" : "low",
    ambiguous: scored.length > 1 && scored[0]?.score === scored[1]?.score,
  };
}
