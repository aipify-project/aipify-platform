import { normalizeIntegrationQuery, phraseMatchesQuery } from "@/lib/integration-intelligence/normalize-text";
import type { CustomerActiveLocale } from "@/lib/i18n/customer-active-locale-registry";
import type {
  CompanionSemanticCapabilityDescriptor,
  CompanionSemanticIntent,
  CompanionSemanticMetric,
  CompanionSemanticMetricMapping,
  CompanionSemanticOperation,
  CompanionSemanticTimeScope,
} from "@/lib/integration-intelligence/semantic/types";
import type { CommunityProviderManifest } from "@/lib/integration-intelligence/community/types";
import {
  COMPANION_SEMANTIC_FALLBACK_ORDER,
  COMPANION_SEMANTIC_LITERAL_TEXT_MATCH_ROLE,
  COMPANION_SEMANTIC_PRIMARY_MECHANISM,
} from "./companion-semantic-policy";

export {
  COMPANION_SEMANTIC_FALLBACK_ORDER,
  COMPANION_SEMANTIC_LITERAL_TEXT_MATCH_ROLE,
  COMPANION_SEMANTIC_PRIMARY_MECHANISM,
};

const OPERATION_HINTS: Array<{ operation: CompanionSemanticOperation; phrases: string[] }> = [
  {
    operation: "count",
    phrases: [
      "how many",
      "count",
      "antall",
      "hvor mange",
      "hvor mangen",
      "hvor stor",
      "antal",
      "cuantos",
      "ile",
      "skilki",
      "number of",
    ],
  },
  {
    operation: "compare",
    phrases: ["compare", "versus", "vs", "sammenlign", "jamfor", "sammenligne", "porownaj"],
  },
  {
    operation: "trend",
    phrases: [
      "trend",
      "over time",
      "over tid",
      "tendens",
      "tendencia",
      "trending",
      "vekst",
      "utvikler",
      "utvikling",
      "growth",
      "development",
    ],
  },
  {
    operation: "list",
    phrases: [
      "list",
      "which",
      "hvilke",
      "vilka",
      "cuales",
      "ktore",
      "yaki",
      "show all",
      "who are",
      "hvem er",
    ],
  },
  {
    operation: "status",
    phrases: ["status", "waiting", "venter", "pending", "queue", "kø", "ko", "backlog"],
  },
  {
    operation: "read",
    phrases: ["what", "who", "show", "summary", "oversikt", "hva", "har vi", "do we have"],
  },
];

const METRIC_HINTS: Array<{ metric: CompanionSemanticMetric; phrases: string[] }> = [
  { metric: "new", phrases: ["new", "nye", "nueva", "ny", "nowe", "novi", "fått noen", "kom til"] },
  { metric: "growth", phrases: ["growth", "vekst", "tilvekst", "increase", "okning", "utvikler"] },
  { metric: "pending", phrases: ["pending", "waiting", "venter", "queue", "kø", "ko", "backlog"] },
  {
    metric: "total",
    phrases: ["total", "altogether", "totalt", "sum", "overall", "registrert", "registered", "now", "nå", "na"],
  },
  { metric: "latest", phrases: ["latest", "last", "siste", "senaste", "sidste"] },
  { metric: "active", phrases: ["active", "aktive", "aktiv", "online", "engaged"] },
  { metric: "list", phrases: ["list", "names", "navn", "who", "hvem"] },
];

const TIME_SCOPE_HINTS: Array<{ scope: CompanionSemanticTimeScope; phrases: string[] }> = [
  {
    scope: "since_last",
    phrases: ["since last", "siden sist", "since login", "siden forrige", "since then", "siden da"],
  },
  { scope: "current", phrases: ["now", "currently", "right now", "nå", "na", "just now", "i dag", "today"] },
  {
    scope: "period",
    phrases: ["this week", "this month", "denne uken", "denne maneden", "last 7", "last 30", "siste 7", "siste 30"],
  },
];

function levenshteinDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = Array.from({ length: a.length + 1 }, () => new Array<number>(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i += 1) matrix[i]![0] = i;
  for (let j = 0; j <= b.length; j += 1) matrix[0]![j] = j;
  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i]![j] = Math.min(
        matrix[i - 1]![j]! + 1,
        matrix[i]![j - 1]! + 1,
        matrix[i - 1]![j - 1]! + cost,
      );
    }
  }
  return matrix[a.length]![b.length]!;
}

function fuzzyTokenMatch(token: string, candidate: string): boolean {
  if (token.length < 4 || candidate.length < 4) return false;
  return levenshteinDistance(token, candidate) <= 1;
}

function aliasMatchesNormalized(alias: string, normalized: string): boolean {
  const normalizedAlias = normalizeIntegrationQuery(alias);
  if (!normalizedAlias) return false;
  if (phraseMatchesQuery(normalized, alias)) return true;
  if (normalized.includes(normalizedAlias)) return true;

  const aliasTokens = normalizedAlias.split(" ").filter(Boolean);
  const queryTokens = normalized.split(" ").filter(Boolean);
  for (const aliasToken of aliasTokens) {
    for (const queryToken of queryTokens) {
      if (fuzzyTokenMatch(aliasToken, queryToken)) return true;
    }
  }
  return false;
}

function detectSemanticOperation(normalized: string): CompanionSemanticOperation | null {
  for (const hint of OPERATION_HINTS) {
    if (hint.phrases.some((phrase) => aliasMatchesNormalized(phrase, normalized))) {
      return hint.operation;
    }
  }
  return null;
}

function detectSemanticMetric(
  normalized: string,
  operation: CompanionSemanticOperation | null,
): CompanionSemanticMetric | null {
  for (const hint of METRIC_HINTS) {
    if (hint.phrases.some((phrase) => aliasMatchesNormalized(phrase, normalized))) {
      return hint.metric;
    }
  }
  if (operation === "list") return "list";
  if (operation === "count") return "total";
  if (operation === "status") return "pending";
  if (operation === "trend") return "growth";
  return null;
}

function detectSemanticTimeScope(normalized: string): CompanionSemanticTimeScope | null {
  for (const hint of TIME_SCOPE_HINTS) {
    if (hint.phrases.some((phrase) => aliasMatchesNormalized(phrase, normalized))) {
      return hint.scope;
    }
  }
  return "current";
}

function collectDescriptorAliases(
  descriptor: CompanionSemanticCapabilityDescriptor,
  locale: CustomerActiveLocale,
): string[] {
  const aliases = descriptor.entity_aliases ?? {};
  const merged = [
    ...(aliases[locale] ?? []),
    ...(aliases.en ?? []),
    ...Object.values(aliases).flat(),
    descriptor.entity.replace(/_/g, " "),
    descriptor.capability_key.split(".")[0]?.replace(/_/g, " ") ?? "",
  ];
  return [...new Set(merged.filter(Boolean))];
}

function scoreDescriptorMatch(input: {
  normalized: string;
  descriptor: CompanionSemanticCapabilityDescriptor;
  locale: CustomerActiveLocale;
  operation: CompanionSemanticOperation | null;
  metric: CompanionSemanticMetric | null;
  timeScope: CompanionSemanticTimeScope | null;
  conversationEntity?: string | null;
}): number {
  let score = 0;
  const aliases = collectDescriptorAliases(input.descriptor, input.locale);

  for (const alias of aliases) {
    if (aliasMatchesNormalized(alias, input.normalized)) {
      score += 40 + Math.min(alias.length, 20);
    }
  }

  if (input.operation && input.descriptor.operations?.includes(input.operation)) {
    score += 15;
  }

  if (input.metric) {
    const metricToken = input.metric.replace(/_/g, " ");
    if (input.descriptor.metrics?.some((entry) => entry.includes(input.metric!) || entry.includes(metricToken))) {
      score += 12;
    }
  }

  if (input.timeScope && input.descriptor.time_scopes?.includes(input.timeScope)) {
    score += 8;
  }

  if (
    input.conversationEntity &&
    input.descriptor.entity === input.conversationEntity &&
    score === 0 &&
    (input.operation === "count" || input.operation === "read" || input.operation === "trend")
  ) {
    score += 35;
  }

  return score;
}

export function collectSemanticDescriptorsFromManifest(
  manifest: CommunityProviderManifest | null | undefined,
): CompanionSemanticCapabilityDescriptor[] {
  if (!manifest) return [];
  return manifest.capabilities
    .filter((capability) => capability.semantic)
    .map((capability) => ({
      capability_key: capability.capability_key,
      entity: capability.semantic!.entity,
      domain: capability.semantic!.domain,
      metrics: capability.semantic!.metrics,
      operations: capability.semantic!.operations,
      time_scopes: capability.semantic!.time_scopes,
      entity_aliases: capability.semantic!.entity_aliases,
      metric_mappings: capability.semantic!.metric_mappings as
        | readonly CompanionSemanticMetricMapping[]
        | undefined,
    }));
}

export function collectSemanticDescriptorsFromManifests(
  manifests: readonly CommunityProviderManifest[],
): CompanionSemanticCapabilityDescriptor[] {
  return manifests.flatMap((manifest) => collectSemanticDescriptorsFromManifest(manifest));
}

export function semanticDescriptorMatchesQuery(
  query: string,
  descriptors: readonly CompanionSemanticCapabilityDescriptor[],
  locale: CustomerActiveLocale = "en",
  conversationEntity?: string | null,
): boolean {
  if (descriptors.length === 0) return false;
  const intent = resolveCompanionSemanticIntent({ query, descriptors, locale, conversationEntity });
  return intent.capability_candidates.length > 0 && intent.confidence !== "low";
}

/** Manifest- and schema-driven semantic resolution — literal text match is fallback-only. */
export function resolveCompanionSemanticIntent(input: {
  query: string;
  descriptors: readonly CompanionSemanticCapabilityDescriptor[];
  locale: CustomerActiveLocale;
  conversationEntity?: string | null;
}): CompanionSemanticIntent {
  const normalized = normalizeIntegrationQuery(input.query);
  const operation = detectSemanticOperation(normalized);
  const metric = detectSemanticMetric(normalized, operation);
  const time_scope = detectSemanticTimeScope(normalized);

  const scored = input.descriptors
    .map((descriptor) => ({
      descriptor,
      score: scoreDescriptorMatch({
        normalized,
        descriptor,
        locale: input.locale,
        operation,
        metric,
        timeScope: time_scope,
        conversationEntity: input.conversationEntity,
      }),
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);

  const top = scored[0] ?? null;
  const runnerUp = scored[1] ?? null;
  const ambiguous = Boolean(top && runnerUp && top.score - runnerUp.score < 12);

  const confidence: CompanionSemanticIntent["confidence"] = !top
    ? "low"
    : top.score >= 55
      ? "high"
      : top.score >= 30
        ? "moderate"
        : "low";

  return {
    entity: top?.descriptor.entity ?? null,
    operation,
    metric,
    time_scope,
    capability_candidates: scored.map((entry) => entry.descriptor.capability_key),
    confidence,
    ambiguous,
    ambiguity_reason: ambiguous
      ? `Multiple capability candidates scored within threshold (${top?.descriptor.capability_key}, ${runnerUp?.descriptor.capability_key})`
      : null,
  };
}

export function resolveRequestedMetricFromDescriptor(input: {
  descriptor: CompanionSemanticCapabilityDescriptor | null;
  intent: Pick<CompanionSemanticIntent, "metric" | "operation" | "time_scope">;
}): { requested_metric: string | null; period: string | null } {
  const mappings = [...(input.descriptor?.metric_mappings ?? [])].sort(
    (a, b) => mappingSpecificity(b) - mappingSpecificity(a),
  );
  if (mappings.length > 0) {
    for (const mapping of mappings) {
      const metricOk =
        mapping.when.metric == null || mapping.when.metric === input.intent.metric;
      const operationOk =
        mapping.when.operation == null || mapping.when.operation === input.intent.operation;
      const timeOk =
        mapping.when.time_scope == null || mapping.when.time_scope === input.intent.time_scope;
      if (metricOk && operationOk && timeOk) {
        return {
          requested_metric: mapping.requested_metric,
          period: mapping.period ?? input.intent.time_scope,
        };
      }
    }
  }
  return mapSemanticIntentToRequestedMetric({
    entity: input.descriptor?.entity ?? null,
    metric: input.intent.metric,
    timeScope: input.intent.time_scope,
  });
}

export function resolveSemanticCapabilityFromManifests(input: {
  query: string;
  manifests: readonly CommunityProviderManifest[];
  providerKey: string;
  locale: CustomerActiveLocale;
}): string | null {
  const manifest = input.manifests.find((entry) => entry.provider_key === input.providerKey) ?? null;
  const descriptors = collectSemanticDescriptorsFromManifest(manifest);
  const intent = resolveCompanionSemanticIntent({
    query: input.query,
    descriptors,
    locale: input.locale,
  });
  return intent.capability_candidates[0] ?? null;
}

/** Generic entity fallback when manifest metric mappings are absent. */
export function mapSemanticIntentToRequestedMetric(input: {
  entity: string | null;
  metric: CompanionSemanticMetric | null;
  timeScope: CompanionSemanticTimeScope | null;
}): { requested_metric: string | null; period: string | null } {
  if (!input.entity) {
    return { requested_metric: null, period: input.timeScope };
  }

  if (input.entity === "member") {
    if (input.metric === "list") {
      return { requested_metric: "member_list", period: input.timeScope ?? "current" };
    }
    if (input.metric === "active") {
      return { requested_metric: "active_members", period: input.timeScope ?? "current" };
    }
    if (input.metric === "new" || input.timeScope === "since_last") {
      return { requested_metric: "new_members", period: input.timeScope ?? "since_last" };
    }
    if (input.metric === "growth") {
      return { requested_metric: "member_growth", period: input.timeScope ?? "current" };
    }
    if (input.timeScope === "period") {
      return { requested_metric: "members_last_30_days", period: "period" };
    }
    return { requested_metric: "total_members", period: input.timeScope ?? "current" };
  }

  if (input.entity === "moderation_queue") {
    return { requested_metric: "pending_moderation", period: "current" };
  }

  if (input.entity === "report") {
    return { requested_metric: "reports_attention", period: "current" };
  }

  if (input.entity === "verification_status") {
    return { requested_metric: "pending_verification", period: "current" };
  }

  if (input.entity === "listing") {
    return { requested_metric: "pending_listing_count", period: "current" };
  }

  if (input.entity === "activity") {
    return {
      requested_metric: input.timeScope === "since_last" ? "activity_since_last" : "recent_activity",
      period: input.timeScope ?? "current",
    };
  }

  return { requested_metric: null, period: input.timeScope };
}

export function mappingSpecificity(mapping: CompanionSemanticMetricMapping): number {
  let score = 0;
  if (mapping.when.metric != null) score += 4;
  if (mapping.when.operation != null) score += 2;
  if (mapping.when.time_scope != null) score += 1;
  return score;
}
