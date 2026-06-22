import type { CustomerActiveLocale } from "@/lib/i18n/customer-active-locale-registry";
import { normalizeIntegrationQuery, phraseMatchesQuery } from "@/lib/integration-intelligence/normalize-text";
import type {
  CompanionSemanticCapabilityDescriptor,
  CompanionSemanticIntent,
  CompanionSemanticMetric,
  CompanionSemanticOperation,
  CompanionSemanticTimeScope,
} from "@/lib/integration-intelligence/semantic/types";
import type { CommunityProviderManifest } from "@/lib/integration-intelligence/community/types";
import {
  COMPANION_SEMANTIC_FALLBACK_ORDER,
  COMPANION_SEMANTIC_LITERAL_TEXT_MATCH_ROLE,
  COMPANION_SEMANTIC_PRIMARY_MECHANISM,
} from "./companion-semantic-policy";

const OPERATION_HINTS: Array<{ operation: CompanionSemanticOperation; phrases: string[] }> = [
  {
    operation: "count",
    phrases: ["how many", "count", "antall", "hvor mange", "antal", "cuantos", "ile", "skilki"],
  },
  {
    operation: "compare",
    phrases: ["compare", "versus", "vs", "sammenlign", "jamfor", "sammenligne", "porownaj"],
  },
  {
    operation: "trend",
    phrases: ["trend", "over time", "over tid", "tendens", "tendencia", "trending", "vekst"],
  },
  {
    operation: "list",
    phrases: ["list", "which", "hvilke", "vilka", "cuales", "ktore", "yaki", "show all"],
  },
  {
    operation: "status",
    phrases: ["status", "waiting", "venter", "pending", "queue", "kø", "ko"],
  },
  {
    operation: "read",
    phrases: ["what", "who", "show", "summary", "oversikt", "hva", "har vi"],
  },
];

const METRIC_HINTS: Array<{ metric: CompanionSemanticMetric; phrases: string[] }> = [
  { metric: "new", phrases: ["new", "nye", "nueva", "ny", "nowe", "novi"] },
  { metric: "growth", phrases: ["growth", "vekst", "tilvekst", "increase", "okning"] },
  { metric: "pending", phrases: ["pending", "waiting", "venter", "queue", "kø", "ko", "backlog"] },
  { metric: "total", phrases: ["total", "altogether", "totalt", "sum", "overall"] },
  { metric: "latest", phrases: ["latest", "last", "siste", "senaste", "sidste"] },
];

const TIME_SCOPE_HINTS: Array<{ scope: CompanionSemanticTimeScope; phrases: string[] }> = [
  { scope: "since_last", phrases: ["since last", "siden sist", "since login", "siden forrige"] },
  { scope: "current", phrases: ["now", "currently", "right now", "nå", "na", "just now"] },
  { scope: "period", phrases: ["this week", "this month", "denne uken", "denne maneden"] },
];

function detectSemanticOperation(normalized: string): CompanionSemanticOperation | null {
  for (const hint of OPERATION_HINTS) {
    if (hint.phrases.some((phrase) => phraseMatchesQuery(normalized, phrase) || normalized.includes(phrase))) {
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
    if (hint.phrases.some((phrase) => phraseMatchesQuery(normalized, phrase) || normalized.includes(phrase))) {
      return hint.metric;
    }
  }
  if (operation === "count") return "total";
  if (operation === "status") return "pending";
  return null;
}

function detectSemanticTimeScope(normalized: string): CompanionSemanticTimeScope | null {
  for (const hint of TIME_SCOPE_HINTS) {
    if (hint.phrases.some((phrase) => phraseMatchesQuery(normalized, phrase) || normalized.includes(phrase))) {
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
}): number {
  let score = 0;
  const aliases = collectDescriptorAliases(input.descriptor, input.locale);

  for (const alias of aliases) {
    if (phraseMatchesQuery(input.normalized, alias)) {
      score += 40 + Math.min(alias.length, 20);
    } else if (input.normalized.includes(normalizeIntegrationQuery(alias))) {
      score += 20;
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
      metrics: capability.semantic!.metrics,
      operations: capability.semantic!.operations,
      time_scopes: capability.semantic!.time_scopes,
      entity_aliases: capability.semantic!.entity_aliases,
    }));
}

export function semanticDescriptorMatchesQuery(
  query: string,
  descriptors: readonly CompanionSemanticCapabilityDescriptor[],
  locale: CustomerActiveLocale = "en",
): boolean {
  if (descriptors.length === 0) return false;
  const intent = resolveCompanionSemanticIntent({ query, descriptors, locale });
  return intent.capability_candidates.length > 0 && intent.confidence !== "low";
}

/** Manifest- and schema-driven semantic resolution — literal text match is fallback-only. */
export function resolveCompanionSemanticIntent(input: {
  query: string;
  descriptors: readonly CompanionSemanticCapabilityDescriptor[];
  locale: CustomerActiveLocale;
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

export function companionSemanticPolicyMetadata() {
  return {
    primary_mechanism: COMPANION_SEMANTIC_PRIMARY_MECHANISM,
    literal_text_match_role: COMPANION_SEMANTIC_LITERAL_TEXT_MATCH_ROLE,
    fallback_order: COMPANION_SEMANTIC_FALLBACK_ORDER,
  };
}
