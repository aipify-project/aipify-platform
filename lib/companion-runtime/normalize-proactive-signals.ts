import type { CompanionOperationalContext, CompanionOperationalItem } from "./companion-operational-context";
import type {
  CompanionProactiveBusinessImpact,
  CompanionProactiveConfidence,
  CompanionProactiveSignal,
  CompanionProactiveSignalFreshness,
  CompanionProactiveSignalSeverity,
  CompanionProactiveSignalStatus,
  CompanionProactiveSignalType,
} from "./companion-proactive-context";

const FRESH_MS = 60 * 60 * 1000;
const STALE_MS = 24 * 60 * 60 * 1000;

const SEVERITY_WEIGHT: Record<CompanionProactiveSignalSeverity, number> = {
  critical: 5,
  high: 4,
  medium: 3,
  low: 2,
  informational: 1,
};

const FRESHNESS_WEIGHT: Record<CompanionProactiveSignalFreshness, number> = {
  fresh: 3,
  stale: 1,
  unknown: 0,
};

const CONFIDENCE_WEIGHT: Record<NonNullable<CompanionProactiveConfidence>, number> = {
  high: 3,
  moderate: 2,
  low: 1,
};

const IMPACT_WEIGHT: Record<NonNullable<CompanionProactiveBusinessImpact>, number> = {
  very_high: 4,
  high: 3,
  medium: 2,
  low: 1,
};

const STATUS_WEIGHT: Record<CompanionProactiveSignalStatus, number> = {
  unresolved: 3,
  new: 2,
  active: 2,
  reviewed: 1,
  resolved: 0,
};

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function readCount(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function resolveFreshness(detectedAt: string | null): CompanionProactiveSignalFreshness {
  if (!detectedAt) return "unknown";
  const parsed = Date.parse(detectedAt);
  if (!Number.isFinite(parsed)) return "unknown";
  const age = Date.now() - parsed;
  if (age <= FRESH_MS) return "fresh";
  if (age <= STALE_MS) return "stale";
  return "stale";
}

function humanizeSignalKey(signalKey: string): string {
  return signalKey.replace(/_/g, " ");
}

function inferSignalType(signalKey: string): CompanionProactiveSignalType {
  const key = signalKey.toLowerCase();
  if (key.includes("forecast") || key.includes("deviation")) return "forecast_warning";
  if (key.includes("health")) return "health_score";
  if (key.includes("follow_up") || key.includes("follow-up")) return "follow_up";
  if (key.includes("churn") || key.includes("risk") || key.includes("anomaly")) return "risk";
  if (key.includes("recommend")) return "recommendation";
  if (key.includes("opportunity") || key.includes("new_lead") || key.includes("milestone")) {
    return "opportunity";
  }
  if (key.includes("incident") || key.includes("alert")) return "alert";
  if (key.includes("anomaly")) return "anomaly";
  return "attention";
}

function mapPriorityToSeverity(priority: string | null): CompanionProactiveSignalSeverity {
  switch ((priority ?? "").toLowerCase()) {
    case "critical":
      return "critical";
    case "high":
      return "high";
    case "medium":
      return "medium";
    case "low":
      return "low";
    default:
      return "informational";
  }
}

function mapConfidence(value: string | null): CompanionProactiveConfidence {
  switch ((value ?? "").toLowerCase()) {
    case "high":
    case "very_high":
      return "high";
    case "moderate":
    case "medium":
      return "moderate";
    case "low":
      return "low";
    default:
      return null;
  }
}

function mapImpact(value: string | null): CompanionProactiveBusinessImpact {
  switch ((value ?? "").toLowerCase()) {
    case "very_high":
      return "very_high";
    case "high":
    case "major":
      return "high";
    case "medium":
    case "moderate":
      return "medium";
    case "low":
    case "minor":
      return "low";
    default:
      return null;
  }
}

function mapRecordStatus(value: string | null): CompanionProactiveSignalStatus {
  switch ((value ?? "").toLowerCase()) {
    case "new":
      return "new";
    case "reviewed":
      return "reviewed";
    case "active":
      return "active";
    case "resolved":
    case "accepted":
    case "dismissed":
      return "resolved";
    default:
      return "unresolved";
  }
}

function sanitizeText(value: string): string {
  return value
    .replace(/email\s*[:=]\s*\S+/gi, "email: [filtered]")
    .replace(/token\s*[:=]\s*\S+/gi, "token: [filtered]")
    .replace(/password\s*[:=]\s*\S+/gi, "password: [filtered]");
}

export type DomainCommandBriefSignal = {
  signal_key: string;
  count: number | null;
};

export type DomainSignalSource = {
  source_module: string;
  signals: readonly DomainCommandBriefSignal[];
  required_permission?: string | null;
  required_capability?: string | null;
};

function buildDomainSignal(input: {
  source_module: string;
  signal_key: string;
  count: number | null;
  required_permission?: string | null;
  required_capability?: string | null;
}): CompanionProactiveSignal | null {
  if (input.count === null || input.count <= 0) return null;

  const signalType = inferSignalType(input.signal_key);
  const severity =
    input.count >= 10 ? "high" : input.count >= 3 ? "medium" : "low";

  return {
    signal_id: `${input.source_module}:${input.signal_key}`,
    signal_type: signalType,
    severity,
    source_module: input.source_module,
    source_reference: input.signal_key,
    detected_at: null,
    freshness: "unknown",
    title: humanizeSignalKey(input.signal_key),
    summary: `${input.count}`,
    recommended_action: null,
    required_capability: input.required_capability ?? "signal.read",
    required_permission: input.required_permission ?? "executive.view",
    confidence: null,
    status: "unresolved",
    business_impact: severity === "high" ? "high" : "medium",
  };
}

export function collectDomainProactiveSignals(
  sources: readonly DomainSignalSource[],
): CompanionProactiveSignal[] {
  const signals: CompanionProactiveSignal[] = [];
  for (const source of sources) {
    for (const entry of source.signals) {
      const signal = buildDomainSignal({
        source_module: source.source_module,
        signal_key: entry.signal_key,
        count: entry.count,
        required_permission: source.required_permission,
        required_capability: source.required_capability,
      });
      if (signal) signals.push(signal);
    }
  }
  return signals;
}

function mapOperationalItemToSignal(item: CompanionOperationalItem): CompanionProactiveSignal | null {
  if (!item.title?.trim()) return null;

  const category = item.category.toLowerCase();
  let signalType: CompanionProactiveSignalType = "attention";
  if (category.includes("risk") || category.includes("requires_attention")) signalType = "risk";
  if (category.includes("recommended")) signalType = "recommendation";
  if (category.includes("summary")) signalType = "alert";

  const severity = mapPriorityToSeverity(item.priority ?? null);

  return {
    signal_id: `command_brief:${item.id}`,
    signal_type: signalType,
    severity,
    source_module: item.source_module ?? "command_brief_operational",
    source_reference: item.id,
    detected_at: item.occurred_at ?? null,
    freshness: resolveFreshness(item.occurred_at ?? null),
    title: sanitizeText(item.title),
    summary: item.summary ? sanitizeText(item.summary) : "",
    recommended_action: null,
    required_capability: "attention_item.read",
    required_permission: "executive.view",
    confidence: null,
    status: "unresolved",
    business_impact: severity === "critical" || severity === "high" ? "high" : "medium",
  };
}

export function collectOperationalProactiveSignals(
  operationalContext: CompanionOperationalContext,
): CompanionProactiveSignal[] {
  const items = [
    ...operationalContext.attention_items,
    ...operationalContext.important_changes.slice(0, 5),
  ];
  return items
    .map(mapOperationalItemToSignal)
    .filter((signal): signal is CompanionProactiveSignal => signal !== null);
}

function mapInsightRecord(record: Record<string, unknown>): CompanionProactiveSignal | null {
  const title = str(record.title);
  if (!title) return null;

  const id = str(record.id) || title;
  const priority = str(record.priority);
  const patternType = str(record.pattern_type).toLowerCase();
  const signalType: CompanionProactiveSignalType =
    patternType.includes("anomaly") || patternType.includes("repeated")
      ? "anomaly"
      : patternType.includes("risk")
        ? "risk"
        : "alert";

  const detectedAt = str(record.created_at) || null;

  return {
    signal_id: `proactive_insights:${id}`,
    signal_type: signalType,
    severity: mapPriorityToSeverity(priority),
    source_module: "proactive_insights_engine",
    source_reference: id,
    detected_at: detectedAt,
    freshness: resolveFreshness(detectedAt),
    title: sanitizeText(title),
    summary: sanitizeText(str(record.observation) || str(record.why_it_matters)),
    recommended_action: str(record.suggested_review) || null,
    required_capability: "signal.read",
    required_permission: "insights.view",
    confidence: mapConfidence(str(record.confidence)),
    status: mapRecordStatus(str(record.status)),
    business_impact: mapImpact(str(record.impact_level)),
  };
}

export function extractInsightProactiveSignals(payload: unknown): CompanionProactiveSignal[] {
  if (!payload || typeof payload !== "object") return [];
  const record = payload as Record<string, unknown>;
  if (record.found === false) return [];

  const insights = Array.isArray(record.insights) ? record.insights : [];
  return insights
    .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object")
    .map(mapInsightRecord)
    .filter((signal): signal is CompanionProactiveSignal => signal !== null);
}

function mapRecommendationRecord(record: Record<string, unknown>): CompanionProactiveSignal | null {
  const title = str(record.title);
  if (!title) return null;

  const id = str(record.id) || title;
  const priority = str(record.priority);
  const status = str(record.status).toLowerCase();
  if (status === "dismissed") return null;

  const detectedAt = str(record.created_at) || null;

  return {
    signal_id: `recommendations:${id}`,
    signal_type: "recommendation",
    severity: mapPriorityToSeverity(priority),
    source_module: "companion_recommendation_engine",
    source_reference: id,
    detected_at: detectedAt,
    freshness: resolveFreshness(detectedAt),
    title: sanitizeText(title),
    summary: sanitizeText(str(record.description) || str(record.reason)),
    recommended_action: str(record.suggested_action) || null,
    required_capability: "recommendation.read",
    required_permission: "recommendations.view",
    confidence: mapConfidence(str(record.confidence)),
    status: mapRecordStatus(status),
    business_impact: mapImpact(priority === "critical" ? "very_high" : priority),
  };
}

export function extractRecommendationProactiveSignals(payload: unknown): CompanionProactiveSignal[] {
  if (!payload || typeof payload !== "object") return [];
  const record = payload as Record<string, unknown>;
  if (record.found === false) return [];
  if (record.has_recommendations === false && readCount(record.active_recommendations_count) === 0) {
    return [];
  }

  const recommendations = Array.isArray(record.recommendations) ? record.recommendations : [];
  return recommendations
    .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object")
    .map(mapRecommendationRecord)
    .filter((signal): signal is CompanionProactiveSignal => signal !== null);
}

export function extractProactiveCenterSignals(payload: unknown): CompanionProactiveSignal[] {
  if (!payload || typeof payload !== "object") return [];
  const record = payload as Record<string, unknown>;
  if (record.found === false) return [];

  const signals: CompanionProactiveSignal[] = [];
  const overview =
    record.overview && typeof record.overview === "object"
      ? (record.overview as Record<string, unknown>)
      : record;

  const attentionCount = readCount(overview.attention_items_count ?? overview.requires_attention);
  if (attentionCount !== null && attentionCount > 0) {
    signals.push({
      signal_id: "proactive_organization:attention",
      signal_type: "attention",
      severity: attentionCount >= 5 ? "high" : "medium",
      source_module: "proactive_organization_center",
      source_reference: "attention_items",
      detected_at: str(overview.generated_at) || null,
      freshness: resolveFreshness(str(overview.generated_at) || null),
      title: "organization attention items",
      summary: `${attentionCount}`,
      recommended_action: null,
      required_capability: "attention_item.read",
      required_permission: "executive.view",
      confidence: null,
      status: "unresolved",
      business_impact: "high",
    });
  }

  const followUpCount = readCount(overview.follow_up_count ?? overview.pending_follow_ups);
  if (followUpCount !== null && followUpCount > 0) {
    signals.push({
      signal_id: "proactive_organization:follow_up",
      signal_type: "follow_up",
      severity: "medium",
      source_module: "proactive_organization_center",
      source_reference: "follow_up",
      detected_at: str(overview.generated_at) || null,
      freshness: resolveFreshness(str(overview.generated_at) || null),
      title: "pending follow-ups",
      summary: `${followUpCount}`,
      recommended_action: null,
      required_capability: "follow_up.read",
      required_permission: "executive.view",
      confidence: null,
      status: "unresolved",
      business_impact: "medium",
    });
  }

  return signals;
}

export function proactiveSignalPriorityScore(signal: CompanionProactiveSignal): number {
  return (
    SEVERITY_WEIGHT[signal.severity] * 10 +
    FRESHNESS_WEIGHT[signal.freshness] * 5 +
    (signal.confidence ? CONFIDENCE_WEIGHT[signal.confidence] * 3 : 0) +
    (signal.business_impact ? IMPACT_WEIGHT[signal.business_impact] * 4 : 0) +
    STATUS_WEIGHT[signal.status] * 2
  );
}

export function dedupeProactiveSignals(
  signals: readonly CompanionProactiveSignal[],
): CompanionProactiveSignal[] {
  const seen = new Set<string>();
  const result: CompanionProactiveSignal[] = [];

  for (const signal of signals) {
    const key = `${signal.signal_type}:${signal.source_module}:${signal.source_reference}:${signal.title.toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(signal);
  }

  return result;
}

export function prioritizeProactiveSignals(
  signals: readonly CompanionProactiveSignal[],
): CompanionProactiveSignal[] {
  return [...dedupeProactiveSignals(signals)]
    .sort((left, right) => proactiveSignalPriorityScore(right) - proactiveSignalPriorityScore(left))
    .slice(0, 30);
}

export function filterProactiveSignalsForPermission(
  signals: readonly CompanionProactiveSignal[],
  effectivePermissions: readonly string[],
): CompanionProactiveSignal[] {
  return signals.filter((signal) => {
    if (!signal.required_permission) return true;
    if (effectivePermissions.includes(signal.required_permission)) return true;
    const alt = signal.required_permission.replace(/\./g, "_");
    return effectivePermissions.includes(alt);
  });
}

export function mergeProactiveSignalsIntoOperationalContext(
  operationalContext: CompanionOperationalContext,
  signals: readonly CompanionProactiveSignal[],
): CompanionOperationalContext {
  if (signals.length === 0) return operationalContext;

  const attentionFromSignals = signals
    .filter(
      (signal) =>
        signal.signal_type === "attention" ||
        signal.signal_type === "risk" ||
        signal.signal_type === "alert" ||
        signal.signal_type === "anomaly",
    )
    .slice(0, 6)
    .map(
      (signal): CompanionOperationalItem => ({
        id: signal.signal_id,
        title: signal.title,
        summary: signal.summary || undefined,
        category: "requires_attention",
        priority: signal.severity,
        occurred_at: signal.detected_at ?? undefined,
        source_module: signal.source_module,
      }),
    );

  const recommendedFromSignals = signals
    .filter((signal) => signal.recommended_action)
    .slice(0, 3)
    .map((signal) => ({
      title: signal.recommended_action!,
      category: "recommended",
    }));

  const existingAttentionKeys = new Set(
    operationalContext.attention_items.map((item) => `${item.id}:${item.title}`),
  );
  const mergedAttention = [...operationalContext.attention_items];
  for (const item of attentionFromSignals) {
    const key = `${item.id}:${item.title}`;
    if (existingAttentionKeys.has(key)) continue;
    existingAttentionKeys.add(key);
    mergedAttention.push(item);
  }

  const existingNextKeys = new Set(
    operationalContext.recommended_next_actions.map((item) => item.title),
  );
  const mergedNext = [...operationalContext.recommended_next_actions];
  for (const item of recommendedFromSignals) {
    if (existingNextKeys.has(item.title)) continue;
    existingNextKeys.add(item.title);
    mergedNext.push(item);
  }

  return {
    ...operationalContext,
    attention_items: mergedAttention.slice(0, 20),
    recommended_next_actions: mergedNext.slice(0, 5),
    source_modules: [
      ...new Set([
        ...operationalContext.source_modules,
        ...signals.map((signal) => signal.source_module),
      ]),
    ].slice(0, 12),
    completeness:
      mergedAttention.length > 0 || operationalContext.operational_events.length > 0
        ? "partial"
        : operationalContext.completeness,
  };
}
