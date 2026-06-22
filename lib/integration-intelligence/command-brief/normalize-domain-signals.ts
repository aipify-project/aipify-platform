import { getCommandBriefCatalogEntry } from "./signal-catalog";
import type {
  CommandBriefDomainSignalSource,
  CommandBriefRawDomainSignal,
  CommandBriefSignal,
  CommandBriefSignalFreshness,
  CommandBriefSourceTier,
} from "./types";
import { isCommandBriefSourceDisplayable } from "./types";

const FRESH_MS = 60 * 60 * 1000;
const STALE_MS = 24 * 60 * 60 * 1000;

export function resolveCommandBriefFreshness(detectedAt: string | null): CommandBriefSignalFreshness {
  if (!detectedAt) return "unknown";
  const parsed = Date.parse(detectedAt);
  if (!Number.isFinite(parsed)) return "unknown";
  const age = Date.now() - parsed;
  if (age <= FRESH_MS) return "fresh";
  if (age <= STALE_MS) return "stale";
  return "stale";
}

function resolveSourceTier(raw: CommandBriefRawDomainSignal): CommandBriefSourceTier {
  if (raw.source_tier) return raw.source_tier;
  if (raw.source_exact === true) return "exact_live";
  if (raw.source_exact === false) return "partial_proxy";
  return "compatible_live";
}

function severityFromCount(count: number | null, fallback: CommandBriefSignal["severity"]): CommandBriefSignal["severity"] {
  if (count === null) return fallback;
  if (count >= 10) return "high";
  if (count >= 3) return "medium";
  return fallback === "critical" ? "critical" : "low";
}

export function normalizeDomainCommandBriefSignal(input: {
  organization_id: string;
  source: CommandBriefDomainSignalSource;
  raw: CommandBriefRawDomainSignal;
}): CommandBriefSignal | null {
  const catalog = getCommandBriefCatalogEntry(input.raw.signal_key);
  if (!catalog) return null;

  const count = input.raw.count;
  if (count === null || count <= 0) return null;

  const sourceTier = resolveSourceTier(input.raw);
  if (!isCommandBriefSourceDisplayable(sourceTier)) return null;

  const detectedAt = input.raw.detected_at ?? null;
  const panel = input.source.panel ?? "app";
  const permission = input.source.required_permission ?? catalog.required_permission;
  const action =
    sourceTier === "partial_proxy"
      ? catalog.related_action
        ? { ...catalog.related_action, executable: false }
        : null
      : catalog.related_action;

  return {
    signal_id: `${input.source.source_module}:${input.raw.signal_key}`,
    signal_type: catalog.signal_type,
    category: catalog.category,
    title_key: catalog.title_key,
    summary_key: catalog.summary_key,
    severity: severityFromCount(count, catalog.default_severity),
    priority: 0,
    status: "unresolved",
    source_module: input.source.source_module,
    source_provider: input.source.source_provider,
    source_reference: input.raw.source_reference ?? input.raw.signal_key,
    source_tier: sourceTier,
    detected_at: detectedAt,
    relevant_since: detectedAt,
    freshness: resolveCommandBriefFreshness(detectedAt),
    completeness: sourceTier === "exact_live" ? "complete" : "partial",
    confidence: sourceTier === "exact_live" ? "high" : "moderate",
    required_permission: permission,
    required_entitlement: input.source.required_entitlement ?? null,
    related_capability: input.source.related_capability ?? catalog.related_capability,
    related_action: action,
    organization_id: input.organization_id,
    dedupe_key: `${input.organization_id}:${input.source.source_module}:${input.raw.signal_key}:${input.raw.source_reference ?? input.raw.signal_key}`,
    warnings:
      sourceTier === "partial_proxy"
        ? ["customerApp.companionPlatformKnowledge.commandBriefCore.warnings.partialSource"]
        : [],
    count,
    panel,
    since_last_bucket: "none",
  };
}

export function collectDomainCommandBriefSignals(input: {
  organization_id: string;
  sources: readonly CommandBriefDomainSignalSource[];
}): CommandBriefSignal[] {
  const signals: CommandBriefSignal[] = [];
  for (const source of input.sources) {
    for (const raw of source.signals) {
      const normalized = normalizeDomainCommandBriefSignal({
        organization_id: input.organization_id,
        source,
        raw,
      });
      if (normalized) signals.push(normalized);
    }
  }
  return signals;
}
