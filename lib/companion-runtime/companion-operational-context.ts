import {
  buildCommandBriefActivityFeed,
} from "@/lib/command-center/command-brief-overview";
import { buildCommandBriefAttentionItemsFromCenter } from "@/lib/command-center/command-brief-attention";
import { buildCommandBriefNextAction } from "@/lib/command-center/command-brief-next-action";
import {
  buildSinceLastLoginDataset,
  groupSinceLastLoginEvents,
  type SinceLastLoginEvent,
} from "@/lib/command-center/since-last-login";
import { isSyntheticEccRecord } from "@/lib/command-center/ecc-tab-datasets";
import { isPresentableOperationalRecord } from "@/lib/integration-intelligence/operational/source-classification";
import type { OperationalSourceMetadata } from "@/lib/integration-intelligence/operational/source-classification";
import type { ActivityEvent } from "@/lib/activity-operations/types";
import type { CompanionContextBriefing } from "@/lib/aipify/briefing/types";
import { parseExecutiveCommandCenter, type ExecutiveCommandCenter } from "@/lib/executive-command-center-engine/parse";
import type { ActivityOperationsCenter } from "@/lib/activity-operations/types";
import { parseActivityOperationsCenter } from "@/lib/activity-operations/parse";
import { parseCompanionContextBriefing } from "@/lib/aipify/briefing/parse";

export type CompanionOperationalFreshness = "fresh" | "stale" | "unknown";
export type CompanionOperationalCompleteness = "complete" | "partial" | "missing";

export type CompanionOperationalItem = {
  id: string;
  title: string;
  summary?: string;
  event_number?: string;
  category: string;
  priority?: string;
  occurred_at?: string;
  source_module?: string;
  href?: string;
  data_classification?: string;
  source_verified?: boolean;
  readiness?: string;
  freshness?: string;
  source_reference?: string;
};

export type CompanionOperationalNextAction = {
  title: string;
  category: string;
  href?: string;
};

export type CompanionOperationalContext = {
  since: string | null;
  generated_at: string | null;
  completed_items: CompanionOperationalItem[];
  attention_items: CompanionOperationalItem[];
  important_changes: CompanionOperationalItem[];
  operational_events: CompanionOperationalItem[];
  recommended_next_actions: CompanionOperationalNextAction[];
  source_modules: string[];
  freshness: CompanionOperationalFreshness;
  completeness: CompanionOperationalCompleteness;
  warnings: string[];
};

const FRESH_MS = 60 * 60 * 1000;
const STALE_MS = 24 * 60 * 60 * 1000;

const SENSITIVE_FIELD_KEYS = new Set([
  "email",
  "password",
  "token",
  "secret",
  "api_key",
  "authorization",
  "chat_content",
  "payment_instrument",
]);

export function hasOperationalPermission(
  effectivePermissions: readonly string[],
  permissionKey: string,
): boolean {
  if (effectivePermissions.includes(permissionKey)) return true;
  const alt = permissionKey.replace(/\./g, "_");
  return effectivePermissions.includes(alt);
}

export function canAccessCommandBrief(effectivePermissions: readonly string[]): boolean {
  return hasOperationalPermission(effectivePermissions, "executive.view");
}

export function canAccessSinceLastLogin(effectivePermissions: readonly string[]): boolean {
  return (
    hasOperationalPermission(effectivePermissions, "activity_history.view") ||
    hasOperationalPermission(effectivePermissions, "activity_history.manage")
  );
}

export function isOperationalAppSuspended(subscriptionStatus: string | null): boolean {
  if (!subscriptionStatus) return false;
  const normalized = subscriptionStatus.toLowerCase();
  return ["paused", "cancelled", "suspended", "inactive"].includes(normalized);
}

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function mapSinceLastLoginEvent(event: SinceLastLoginEvent): CompanionOperationalItem {
  return {
    id: event.id,
    title: event.title,
    summary: event.explanation || undefined,
    category: event.category,
    priority: event.severity ?? undefined,
    occurred_at: event.occurredAt,
    source_module: event.eventType,
    href: event.href,
  };
}

function mapActivityEvent(event: ActivityEvent): CompanionOperationalItem | null {
  const item: CompanionOperationalItem = {
    id: event.id,
    title: event.title,
    summary: event.summary,
    event_number: event.event_number,
    category: event.category,
    priority: event.priority,
    occurred_at: event.occurred_at,
    source_module: event.business_pack_key ?? event.category,
    href: event.record_href,
    data_classification: event.data_classification,
    source_verified: event.source_verified,
    readiness: event.readiness,
    freshness: event.freshness,
    source_reference: event.source_reference,
  };
  if (!isPresentableOperationalRecord(item)) return null;
  return item;
}

function mapSinceLastLoginEventSafe(event: SinceLastLoginEvent): CompanionOperationalItem | null {
  const item = mapSinceLastLoginEvent(event);
  if (!isPresentableOperationalRecord(item)) return null;
  return item;
}

const GENERIC_SOURCE_MODULES = new Set([
  "activity_operations",
  "command_center",
  "command_brief",
  "executive_command_center",
  "companion",
  "core",
  "approvals",
  "support",
  "billing",
  "install",
]);

function isModuleEnabled(
  sourceModule: string | undefined,
  enabledModules: readonly string[],
  activeBusinessPacks: readonly string[],
): boolean {
  if (!sourceModule) return true;
  const normalized = sourceModule.toLowerCase();
  if (GENERIC_SOURCE_MODULES.has(normalized)) return true;

  if (activeBusinessPacks.length > 0) {
    const packMatch = activeBusinessPacks.some((pack) => normalized.includes(pack.toLowerCase()));
    if (packMatch) return true;
    if (normalized.includes("pack") || normalized.includes("business_")) return false;
  }

  if (enabledModules.length === 0) return true;
  return enabledModules.some(
    (module) =>
      normalized.includes(module.toLowerCase()) || module.toLowerCase().includes(normalized),
  );
}

function filterByEnabledModules(
  items: CompanionOperationalItem[],
  enabledModules: readonly string[],
  activeBusinessPacks: readonly string[],
): CompanionOperationalItem[] {
  return items.filter((item) => isModuleEnabled(item.source_module, enabledModules, activeBusinessPacks));
}

function sanitizeOperationalText(value: string | undefined): string | undefined {
  if (!value) return undefined;
  let sanitized = value;
  for (const key of SENSITIVE_FIELD_KEYS) {
    const pattern = new RegExp(`${key}\\s*[:=]\\s*\\S+`, "gi");
    sanitized = sanitized.replace(pattern, `${key}: [filtered]`);
  }
  return sanitized;
}

function sanitizeOperationalItem(item: CompanionOperationalItem): CompanionOperationalItem {
  return {
    ...item,
    title: sanitizeOperationalText(item.title) ?? item.title,
    summary: sanitizeOperationalText(item.summary),
  };
}

function resolveFreshness(generatedAt: string | null): CompanionOperationalFreshness {
  if (!generatedAt) return "unknown";
  const parsed = Date.parse(generatedAt);
  if (!Number.isFinite(parsed)) return "unknown";
  const age = Date.now() - parsed;
  if (age <= FRESH_MS) return "fresh";
  if (age <= STALE_MS) return "stale";
  return "stale";
}

function resolveCompleteness(context: Pick<
  CompanionOperationalContext,
  "operational_events" | "attention_items" | "completed_items" | "important_changes"
>): CompanionOperationalCompleteness {
  const total =
    context.operational_events.length +
    context.attention_items.length +
    context.completed_items.length +
    context.important_changes.length;
  if (total === 0) return "missing";
  if (context.operational_events.length > 0 && context.attention_items.length + context.completed_items.length > 0) {
    return "complete";
  }
  return "partial";
}

function collectSourceModules(items: CompanionOperationalItem[]): string[] {
  const modules = new Set<string>();
  for (const item of items) {
    if (item.source_module) modules.add(item.source_module);
  }
  return [...modules].slice(0, 12);
}

function latestTimestamp(values: Array<string | undefined | null>): string | null {
  let latest: number | null = null;
  let latestValue: string | null = null;
  for (const value of values) {
    if (!value) continue;
    const parsed = Date.parse(value);
    if (!Number.isFinite(parsed)) continue;
    if (latest === null || parsed > latest) {
      latest = parsed;
      latestValue = value;
    }
  }
  return latestValue;
}

export function createEmptyCompanionOperationalContext(
  overrides?: Partial<CompanionOperationalContext>,
): CompanionOperationalContext {
  return {
    since: null,
    generated_at: null,
    completed_items: [],
    attention_items: [],
    important_changes: [],
    operational_events: [],
    recommended_next_actions: [],
    source_modules: [],
    freshness: "unknown",
    completeness: "missing",
    warnings: [],
    ...overrides,
  };
}

export type NormalizeOperationalInput = {
  executiveCenter: ExecutiveCommandCenter | null;
  activityCenter: ActivityOperationsCenter | null;
  commandBriefing: CompanionContextBriefing | null;
  enabledModules: readonly string[];
  activeBusinessPacks: readonly string[];
  permissionDenied?: boolean;
  appSuspended?: boolean;
};

export function normalizeCompanionOperationalContext(
  input: NormalizeOperationalInput,
): CompanionOperationalContext {
  if (input.appSuspended) {
    return createEmptyCompanionOperationalContext({
      warnings: ["app_suspended"],
      completeness: "missing",
    });
  }

  if (input.permissionDenied) {
    return createEmptyCompanionOperationalContext({
      warnings: ["permission_denied"],
      completeness: "missing",
    });
  }

  const warnings: string[] = [];
  const completedItems: CompanionOperationalItem[] = [];
  const attentionItems: CompanionOperationalItem[] = [];
  const importantChanges: CompanionOperationalItem[] = [];
  const operationalEvents: CompanionOperationalItem[] = [];
  const recommendedNextActions: CompanionOperationalNextAction[] = [];
  let since: string | null = null;
  let nonLiveFilteredCount = 0;

  if (input.activityCenter?.since_last_login) {
    const summary = input.activityCenter.since_last_login;
    since = summary.since ?? since;

    for (const line of summary.summary_lines ?? []) {
      if (!line.text) continue;
      importantChanges.push({
        id: `summary-line:${line.text.slice(0, 40)}`,
        title: line.text,
        category: "summary_line",
        priority: line.priority,
        source_module: "activity_operations",
      });
    }

    for (const event of summary.top_changes ?? []) {
      const mapped = mapActivityEvent(event);
      if (!mapped && event.id) nonLiveFilteredCount += 1;
      if (mapped) importantChanges.push(mapped);
    }

    for (const event of summary.top_risks ?? []) {
      const mapped = mapActivityEvent(event);
      if (!mapped && event.id) nonLiveFilteredCount += 1;
      if (mapped) {
        attentionItems.push({
          ...mapped,
          category: "requires_attention",
        });
      }
    }

    for (const action of summary.recommended_actions ?? []) {
      recommendedNextActions.push({
        title: action.title,
        category: "recommended",
        href: action.href,
      });
    }
  }

  if (input.executiveCenter?.found) {
    const center = input.executiveCenter;
    const activityFeed = buildCommandBriefActivityFeed(center);
    operationalEvents.push(
      ...activityFeed.items
        .map(mapSinceLastLoginEventSafe)
        .filter((item): item is CompanionOperationalItem => item !== null),
    );

    const attention = buildCommandBriefAttentionItemsFromCenter(center);
    attentionItems.push(
      ...attention.items
        .filter((item) =>
          isPresentableOperationalRecord(item as OperationalSourceMetadata),
        )
        .map((item) => ({
          id: item.dedupeKey,
          title: item.title,
          summary: item.description,
          category: "requires_attention",
          priority: item.primaryBadge.value,
          occurred_at: item.dueAt,
          source_module: item.moduleArea,
          href: item.detailHref,
        })),
    );

    const events = buildSinceLastLoginDataset({
      eccItems: (center.since_last_login ?? []).filter((item) => !isSyntheticEccRecord(item)),
      activitySinceLogin: center.activity_since_login,
      timeline: center.timeline,
    });
    const grouped = groupSinceLastLoginEvents(events);
    completedItems.push(...grouped.completedByAipify.map(mapSinceLastLoginEvent));
    importantChanges.push(...grouped.otherChanges.map(mapSinceLastLoginEvent));

    const nextAction = buildCommandBriefNextAction(center);
    if (nextAction) {
      recommendedNextActions.push({
        title: nextAction.title,
        category: nextAction.itemType ?? "operational",
        href: nextAction.href,
      });
    }
  } else if (input.executiveCenter && !input.executiveCenter.found) {
    warnings.push("command_brief_unavailable");
  }

  if (input.commandBriefing?.has_customer && input.commandBriefing.enabled !== false) {
    for (const item of input.commandBriefing.key_items ?? []) {
      const mapped: CompanionOperationalItem = {
        id: item.id ?? item.title,
        title: item.title,
        summary: item.summary ?? undefined,
        category: item.requires_action ? "requires_attention" : "important_change",
        priority: item.severity,
        source_module: item.source_module,
        href: item.action_url ?? undefined,
      };
      if (isPresentableOperationalRecord(mapped)) {
        if (item.requires_action) attentionItems.push(mapped);
        else importantChanges.push(mapped);
      } else if (mapped.id) {
        nonLiveFilteredCount += 1;
      }
    }
  }

  if (nonLiveFilteredCount > 0) {
    warnings.push("non_live_source_filtered");
  }

  const filteredCompleted = filterByEnabledModules(
    completedItems.map(sanitizeOperationalItem),
    input.enabledModules,
    input.activeBusinessPacks,
  );
  const filteredAttention = filterByEnabledModules(
    attentionItems.map(sanitizeOperationalItem),
    input.enabledModules,
    input.activeBusinessPacks,
  );
  const filteredChanges = filterByEnabledModules(
    importantChanges.map(sanitizeOperationalItem),
    input.enabledModules,
    input.activeBusinessPacks,
  );
  const filteredEvents = filterByEnabledModules(
    operationalEvents.map(sanitizeOperationalItem),
    input.enabledModules,
    input.activeBusinessPacks,
  );

  const generatedAt = latestTimestamp([
    since,
    input.activityCenter?.audit_recent?.[0]?.created_at,
    input.executiveCenter?.audit_recent?.[0]?.created_at as string | undefined,
  ]);

  const context: CompanionOperationalContext = {
    since,
    generated_at: generatedAt,
    completed_items: dedupeOperationalItems(filteredCompleted),
    attention_items: dedupeOperationalItems(filteredAttention),
    important_changes: dedupeOperationalItems(filteredChanges),
    operational_events: dedupeOperationalItems(filteredEvents),
    recommended_next_actions: dedupeNextActions(recommendedNextActions),
    source_modules: collectSourceModules([
      ...filteredCompleted,
      ...filteredAttention,
      ...filteredChanges,
      ...filteredEvents,
    ]),
    freshness: resolveFreshness(generatedAt),
    completeness: "missing",
    warnings,
  };

  context.completeness = resolveCompleteness(context);
  if (context.freshness === "stale") warnings.push("stale");
  if (context.completeness === "partial") warnings.push("partial");
  if (context.completeness === "missing") warnings.push("empty");

  return { ...context, warnings: [...new Set(warnings)] };
}

function dedupeOperationalItems(items: CompanionOperationalItem[]): CompanionOperationalItem[] {
  const seen = new Set<string>();
  const result: CompanionOperationalItem[] = [];
  for (const item of items) {
    const key = `${item.id}:${item.title}:${item.category}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(item);
  }
  return result.slice(0, 20);
}

function dedupeNextActions(items: CompanionOperationalNextAction[]): CompanionOperationalNextAction[] {
  const seen = new Set<string>();
  const result: CompanionOperationalNextAction[] = [];
  for (const item of items) {
    const key = `${item.title}:${item.category}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(item);
  }
  return result.slice(0, 5);
}

export function parseOperationalRpcPayloads(input: {
  executiveRaw: unknown;
  activityRaw: unknown;
  briefingRaw: unknown;
}): {
  executiveCenter: ExecutiveCommandCenter | null;
  activityCenter: ActivityOperationsCenter | null;
  commandBriefing: CompanionContextBriefing | null;
} {
  const executiveCenter =
    input.executiveRaw && typeof input.executiveRaw === "object"
      ? parseExecutiveCommandCenter(input.executiveRaw)
      : null;
  const activityCenter =
    input.activityRaw && typeof input.activityRaw === "object"
      ? parseActivityOperationsCenter(input.activityRaw as Record<string, unknown>)
      : null;
  const commandBriefing =
    input.briefingRaw && typeof input.briefingRaw === "object"
      ? parseCompanionContextBriefing(input.briefingRaw)
      : null;

  return { executiveCenter, activityCenter, commandBriefing };
}
