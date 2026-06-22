import type { CustomerActiveLocale } from "@/lib/i18n/customer-active-locale-registry";
import type { CompanionLiveRoutingResult } from "@/lib/companion-platform-knowledge/live-routing";
import { resolveEntityKeysFromQuery } from "@/lib/integration-intelligence/entity-resolution";
import { humanizeEntityKey, normalizeIntegrationQuery, phraseMatchesQuery } from "@/lib/integration-intelligence/normalize-text";
import type { CompanionTenantContext } from "./companion-tenant-context";
import { capabilityIdForCompanionLiveTool } from "./companion-tool-definition";
import { selectToolByCapabilityId } from "./companion-tool-definition";

export type CompanionMetricKind =
  | "count"
  | "total"
  | "status"
  | "list"
  | "grouped_count"
  | "latest"
  | "trend";

export type CompanionLiveQueryMatch = {
  capability_id: string;
  provider_key: string;
  entity: string | null;
  field: string | null;
  operation: "read";
  metric_kind: CompanionMetricKind | null;
  score: number;
};

const METRIC_HINTS: Array<{ kind: CompanionMetricKind; phrases: string[] }> = [
  { kind: "count", phrases: ["how many", "count", "antall", "hvor mange", "antal", "cuantos", "ile", "skilki"] },
  { kind: "total", phrases: ["total", "sum", "totalt", "summa", "totalen", "suma"] },
  { kind: "status", phrases: ["status", "available", "availability", "tilgjengelig", "tillganglig", "disponible"] },
  { kind: "list", phrases: ["list", "which", "hvilke", "vilka", "hvilke", "cuales", "ktore", "yaki"] },
  { kind: "latest", phrases: ["latest", "last", "siste", "senaste", "sidste", "ultimo", "ostatni", "ostannii"] },
  { kind: "trend", phrases: ["trend", "over time", "over tid", "tendens", "tendencia", "trend"] },
  { kind: "grouped_count", phrases: ["by group", "grouped", "gruppert", "grupperad", "gruppert", "agrupado"] },
];

function detectMetricKind(query: string): CompanionMetricKind | null {
  const normalized = normalizeIntegrationQuery(query);
  for (const hint of METRIC_HINTS) {
    if (hint.phrases.some((phrase) => phraseMatchesQuery(normalized, phrase) || normalized.includes(phrase))) {
      return hint.kind;
    }
  }
  return null;
}

function resolveProviderFromRouting(
  liveRouting: CompanionLiveRoutingResult,
  integrationContext: string | null,
): string | null {
  if (integrationContext) return integrationContext;
  return (
    liveRouting.platformSnapshotIntent?.providerKey ??
    liveRouting.integrationStatusIntent?.providerKey ??
    liveRouting.genericIntent?.providerKey ??
    null
  );
}

function resolveCapabilityFromRouting(
  providerKey: string,
  liveRouting: CompanionLiveRoutingResult,
): string | null {
  if (liveRouting.tool === "get_platform_snapshot") {
    return capabilityIdForCompanionLiveTool(providerKey, "get_platform_snapshot");
  }
  if (liveRouting.tool === "get_connection_status") {
    return capabilityIdForCompanionLiveTool(providerKey, "get_connection_status");
  }
  return null;
}

function matchEntityAndField(
  query: string,
  tenantContext: CompanionTenantContext,
  providerKey: string | null,
  locale: CustomerActiveLocale,
): { entity: string | null; field: string | null; score: number } {
  let bestEntity: string | null = null;
  let bestField: string | null = null;
  let bestScore = 0;

  for (const schemaEntity of tenantContext.schemaContext.entities) {
    let score = 0;
    const entityKey = schemaEntity.entity_key;
    const displayName = schemaEntity.display_name || humanizeEntityKey(entityKey);

    if (phraseMatchesQuery(query, entityKey.replace(/_/g, " "))) score += 40;
    if (phraseMatchesQuery(query, displayName)) score += 35;

    for (const field of schemaEntity.fields) {
      if (phraseMatchesQuery(query, field.replace(/_/g, " "))) {
        score += 25;
        bestField = field;
      }
    }

    if (providerKey && schemaEntity.source_provider === providerKey) score += 10;
    if (score > bestScore) {
      bestScore = score;
      bestEntity = entityKey;
    }
  }

  if (providerKey) {
    for (const entityKey of resolveEntityKeysFromQuery(query, providerKey, locale)) {
      if (tenantContext.schemaContext.availableEntities.includes(entityKey)) {
        const score = 45;
        if (score > bestScore) {
          bestScore = score;
          bestEntity = entityKey;
        }
      }
    }
  }

  for (const capability of tenantContext.entitledCapabilities) {
    if (phraseMatchesQuery(query, capability.entity.replace(/_/g, " "))) {
      const score = 30;
      if (score > bestScore) {
        bestScore = score;
        bestEntity = capability.entity;
        bestField = capability.capability_id.split(".").slice(1).join(".") || null;
      }
    }
  }

  return { entity: bestEntity, field: bestField, score: bestScore };
}

export function matchLiveQuery(input: {
  query: string;
  tenantContext: CompanionTenantContext;
  integrationContext: string | null;
  locale: CustomerActiveLocale;
  liveRouting: CompanionLiveRoutingResult;
}): CompanionLiveQueryMatch | null {
  const providerKey = resolveProviderFromRouting(input.liveRouting, input.integrationContext);
  const capabilityId = providerKey
    ? resolveCapabilityFromRouting(providerKey, input.liveRouting)
    : null;

  if (
    input.liveRouting.tool === "none" ||
    input.liveRouting.tool === "forbidden_data_denied" ||
    input.liveRouting.tool === "unsupported_live_metric"
  ) {
    return null;
  }

  if (!providerKey || !capabilityId) return null;

  const tool = selectToolByCapabilityId(input.tenantContext.toolRegistry, capabilityId);
  if (!tool) return null;

  const entityMatch = matchEntityAndField(
    input.query,
    input.tenantContext,
    providerKey,
    input.locale,
  );
  const metricKind = detectMetricKind(input.query);

  return {
    capability_id: capabilityId,
    provider_key: providerKey,
    entity: entityMatch.entity,
    field: entityMatch.field,
    operation: "read",
    metric_kind: metricKind,
    score: entityMatch.score + (tool.enabled ? 20 : 0),
  };
}

export function matchCapabilityInQuery(
  query: string,
  tenantContext: CompanionTenantContext,
): CompanionLiveQueryMatch | null {
  const normalized = normalizeIntegrationQuery(query);
  let best: CompanionLiveQueryMatch | null = null;

  for (const tool of tenantContext.toolRegistry.enabledTools) {
    const parts = tool.capability_id.split(".").filter(Boolean);
    const tail = parts.slice(-3).join(" ");
    if (!normalized.includes(parts[0]?.replace(/_/g, " ") ?? "")) continue;
    if (parts.some((part) => part.length > 2 && normalized.includes(part.replace(/_/g, " ")))) {
      const candidate: CompanionLiveQueryMatch = {
        capability_id: tool.capability_id,
        provider_key: tool.provider_key,
        entity: null,
        field: null,
        operation: "read",
        metric_kind: detectMetricKind(query),
        score: 15,
      };
      if (!best || candidate.score > best.score) best = candidate;
    }
  }

  return best;
}
