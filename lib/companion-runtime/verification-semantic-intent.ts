import type { CustomerActiveLocale } from "@/lib/i18n/customer-active-locale-registry";
import type { CommunityProviderManifest } from "@/lib/integration-intelligence/community/types";
import { normalizeIntegrationQuery } from "@/lib/integration-intelligence/normalize-text";
import type { VerificationCapabilityKey } from "@/lib/integration-intelligence/verification/types";

export type VerificationSemanticDescriptor = {
  capability_key: VerificationCapabilityKey;
  entity: "verification_queue" | "verification_case" | "verification_status" | "member";
  metrics: readonly string[];
  aliases: Partial<Record<CustomerActiveLocale | "en", readonly string[]>>;
};

export type VerificationSemanticIntent = {
  capability_key: VerificationCapabilityKey;
  entity: VerificationSemanticDescriptor["entity"];
  operation: "count" | "list" | "status" | "inspect";
  metric: string | null;
  case_id: string | null;
  filters: Partial<Record<"status" | "priority", string>>;
  confidence: "high" | "moderate" | "low";
  ambiguous: boolean;
};

function extractCaseId(normalized: string): string | null {
  const explicit = normalized.match(
    /\b(?:case|sak|ärende|sag|caso|sprawa|sprava)\s*(?:id|nr|#)?\s*[:#]?\s*([a-z0-9_-]{4,})\b/i,
  );
  if (explicit?.[1]) return explicit[1].trim();
  const bare = normalized.match(/\b([a-z]{2,}_[a-z0-9_-]{3,})\b/i);
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

export function resolveVerificationSemanticIntent(input: {
  query: string;
  locale: CustomerActiveLocale;
  descriptors: readonly VerificationSemanticDescriptor[];
}): VerificationSemanticIntent {
  const normalized = normalizeIntegrationQuery(input.query);
  const caseId = extractCaseId(normalized);

  if (caseId) {
    return {
      capability_key: "verification_case.read",
      entity: "verification_case",
      operation: "inspect",
      metric: null,
      case_id: caseId,
      filters: {},
      confidence: "high",
      ambiguous: false,
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
        (descriptor.capability_key === "verification_queue.read" &&
        /verifiseringsk|verification queue|verification_queue/i.test(normalized)
          ? 35
          : 0),
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);

  const top = scored[0] ?? null;
  const wantsOldest = /\b(oldest|longest|lengst|eldst|längst|najdłużej|najdłuższa|найдовше)\b/i.test(
    normalized,
  );
  const wantsNeedsInfo =
    /\b(mangler|missing|manglar|mangler|falt|felt|information|informasjon|información|informacja|інформаці)\b/i.test(
      normalized,
    );

  let metric: string | null = null;
  if (wantsOldest) metric = "oldest_pending";
  else if (wantsNeedsInfo) metric = "needs_information";
  else if (/\b(hoy|high|prioritet|priority|prioritet|priorytet|пріоритет)\b/i.test(normalized)) {
    metric = "high_priority";
  } else if (/\b(ubehandl|pending|venter|väntar|venter|oczekuj|очікую)\b/i.test(normalized)) {
    metric = "pending_verifications";
  } else if (/\b(hvor mange|how many|count|antall|antal|ile|скільки)\b/i.test(normalized)) {
    metric = "pending_verifications";
  }

  const capability_key = top?.descriptor.capability_key ?? "verification_queue.read";
  const entity = top?.descriptor.entity ?? "verification_queue";
  const operation: VerificationSemanticIntent["operation"] =
    /\b(vis|show|list|liste|lista|pokaż|покаж)\b/i.test(normalized)
      ? "list"
      : metric
        ? "count"
        : "status";

  return {
    capability_key,
    entity,
    operation,
    metric,
    case_id: null,
    filters: {},
    confidence: top ? (top.score >= 20 ? "high" : "moderate") : metric ? "moderate" : "low",
    ambiguous: scored.length > 1 && scored[0]?.score === scored[1]?.score,
  };
}

export function collectVerificationDescriptorsFromManifests(
  manifests: readonly CommunityProviderManifest[],
): VerificationSemanticDescriptor[] {
  const descriptors: VerificationSemanticDescriptor[] = [];
  for (const manifest of manifests) {
    for (const capability of manifest.capabilities) {
      if (!capability.semantic?.entity) continue;
      if (
        ![
          "verification_queue.read",
          "verification_case.read",
          "verification_status.read",
        ].includes(capability.capability_key)
      ) {
        continue;
      }
      descriptors.push({
        capability_key: capability.capability_key as VerificationCapabilityKey,
        entity: capability.semantic.entity as VerificationSemanticDescriptor["entity"],
        metrics: capability.semantic.metrics ?? [],
        aliases: capability.semantic.entity_aliases ?? {},
      });
    }
  }
  return descriptors;
}
