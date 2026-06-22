import type { CompanionProactiveSignal } from "./companion-proactive-context";
import {
  getCommandBriefCatalogEntry,
  resolveCommandBriefFreshness,
  type CommandBriefSignal,
  type CommandBriefSourceTier,
} from "@/lib/integration-intelligence/command-brief";

function mapProactiveStatus(status: CompanionProactiveSignal["status"]): CommandBriefSignal["status"] {
  switch (status) {
    case "new":
      return "new";
    case "resolved":
      return "completed";
    case "reviewed":
      return "acknowledged";
    case "active":
      return "unresolved";
    default:
      return "unresolved";
  }
}

function inferSourceTier(signal: CompanionProactiveSignal): CommandBriefSourceTier {
  if (signal.source_module === "proactive_insights_engine") return "compatible_live";
  if (signal.source_module === "companion_recommendation_engine") return "compatible_live";
  if (signal.source_module === "proactive_organization_center") return "compatible_live";
  if (signal.source_module === "command_brief_operational") return "compatible_live";
  if (getCommandBriefCatalogEntry(signal.source_reference)) return "compatible_live";
  return "compatible_live";
}

export function normalizeProactiveSignalToCommandBrief(input: {
  organization_id: string;
  signal: CompanionProactiveSignal;
  panel?: CommandBriefSignal["panel"];
}): CommandBriefSignal | null {
  const catalog = getCommandBriefCatalogEntry(input.signal.source_reference);
  const sourceTier = inferSourceTier(input.signal);

  const titleKey = catalog?.title_key ?? "customerApp.companionPlatformKnowledge.commandBriefCore.signals.generic.title";
  const summaryKey =
    catalog?.summary_key ?? "customerApp.companionPlatformKnowledge.commandBriefCore.signals.generic.summary";

  const action = catalog?.related_action
    ? { ...catalog.related_action, executable: sourceTier !== "source_missing" && sourceTier !== "partial_proxy" }
    : input.signal.recommended_action
      ? {
          kind: "view_details" as const,
          label_key: "customerApp.companionPlatformKnowledge.commandBriefCore.actions.viewDetails",
          href: null,
          capability_key: input.signal.required_capability,
          executable: false,
        }
      : null;

  const countMatch = input.signal.summary.match(/^\d+$/);
  const count = countMatch ? Number.parseInt(countMatch[0], 10) : null;

  return {
    signal_id: input.signal.signal_id,
    signal_type: input.signal.signal_type,
    category: catalog?.category ?? input.signal.source_module,
    title_key: titleKey,
    summary_key: summaryKey,
    severity: input.signal.severity,
    priority: 0,
    status: mapProactiveStatus(input.signal.status),
    source_module: input.signal.source_module,
    source_provider: input.signal.source_module,
    source_reference: input.signal.source_reference,
    source_tier: sourceTier,
    detected_at: input.signal.detected_at,
    relevant_since: input.signal.detected_at,
    freshness: input.signal.freshness ?? resolveCommandBriefFreshness(input.signal.detected_at),
    completeness: catalog ? "partial" : "partial",
    confidence: input.signal.confidence,
    required_permission: input.signal.required_permission,
    required_entitlement: null,
    related_capability: input.signal.required_capability ?? catalog?.related_capability ?? null,
    related_action: action,
    organization_id: input.organization_id,
    dedupe_key: `${input.organization_id}:${input.signal.source_module}:${input.signal.source_reference}:${input.signal.signal_id}`,
    warnings: [],
    count,
    panel: input.panel ?? "app",
    since_last_bucket: "none",
  };
}

export function collectProactiveCommandBriefSignals(input: {
  organization_id: string;
  signals: readonly CompanionProactiveSignal[];
  panel?: CommandBriefSignal["panel"];
}): CommandBriefSignal[] {
  return input.signals
    .map((signal) =>
      normalizeProactiveSignalToCommandBrief({
        organization_id: input.organization_id,
        signal,
        panel: input.panel,
      }),
    )
    .filter((signal): signal is CommandBriefSignal => signal !== null);
}
