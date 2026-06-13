import type { ModerationDashboard, ModerationResultItem } from "./types";
import { MODERATION_QUEUE_TABS } from "./types";

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function asBool(value: unknown, fallback = false): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function parseItem(raw: unknown): ModerationResultItem | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const id = asString(r.id);
  if (!id) return null;
  return {
    id,
    source_system: asString(r.source_system) || "aipify",
    source_type: asString(r.source_type) as ModerationResultItem["source_type"],
    source_id: asString(r.source_id) || null,
    user_id: asString(r.user_id) || null,
    image_url: asString(r.image_url),
    decision: asString(r.decision) as ModerationResultItem["decision"],
    confidence: asNumber(r.confidence),
    categories: asStringArray(r.categories),
    risk_flags: asStringArray(r.risk_flags),
    policy_version: asNumber(r.policy_version, 1),
    reason_summary: asString(r.reason_summary),
    suggested_action: (asString(r.suggested_action) || null) as ModerationResultItem["suggested_action"],
    is_high_risk: asBool(r.is_high_risk),
    is_reported: asBool(r.is_reported),
    priority: asString(r.priority) || "normal",
    status: asString(r.status) || "pending",
    reviewed_by: asString(r.reviewed_by) || null,
    reviewed_at: asString(r.reviewed_at) || null,
    final_decision: asString(r.final_decision) || null,
    review_reason: asString(r.review_reason) || null,
    created_at: asString(r.created_at),
  };
}

export function parseModerationDashboard(data: unknown): ModerationDashboard {
  const d = (data && typeof data === "object" ? data : {}) as Record<string, unknown>;
  const tabRaw = asString(d.tab);
  const tab = (MODERATION_QUEUE_TABS as readonly string[]).includes(tabRaw)
    ? (tabRaw as ModerationDashboard["tab"])
    : "needs_review";
  const settingsRaw = (d.settings && typeof d.settings === "object" ? d.settings : {}) as Record<string, unknown>;
  const policyRaw = (d.policy && typeof d.policy === "object" ? d.policy : {}) as Record<string, unknown>;
  const metricsRaw = (d.metrics && typeof d.metrics === "object" ? d.metrics : {}) as Record<string, unknown>;
  const items = Array.isArray(d.items)
    ? d.items.map(parseItem).filter((item): item is ModerationResultItem => item !== null)
    : [];
  const learning = Array.isArray(d.learning_insights)
    ? d.learning_insights
        .filter((x): x is Record<string, unknown> => !!x && typeof x === "object")
        .map((x) => ({
          pattern: asString(x.pattern),
          count: asNumber(x.count),
          message: asString(x.message),
        }))
    : [];

  return {
    tab,
    settings: {
      suggest_only_mode: asBool(settingsRaw.suggest_only_mode, true),
      auto_approve_enabled: asBool(settingsRaw.auto_approve_enabled),
      auto_reject_enabled: asBool(settingsRaw.auto_reject_enabled, true),
      auto_approve_threshold: asNumber(settingsRaw.auto_approve_threshold, 90),
      auto_reject_threshold: asNumber(settingsRaw.auto_reject_threshold, 90),
    },
    policy: {
      version: asNumber(policyRaw.version, 1),
      label: asString(policyRaw.label) || "Default moderation policy",
      platform_profile: asString(policyRaw.platform_profile) || "community",
    },
    metrics: {
      total_reviewed: asNumber(metricsRaw.total_reviewed),
      pending_review: asNumber(metricsRaw.pending_review),
      auto_approved: asNumber(metricsRaw.auto_approved),
      auto_rejected: asNumber(metricsRaw.auto_rejected),
      high_risk_pending: asNumber(metricsRaw.high_risk_pending),
      admin_overrides: asNumber(metricsRaw.admin_overrides),
      queue_reduction_pct: asNumber(metricsRaw.queue_reduction_pct),
    },
    learning_insights: learning,
    items,
    privacy_note: asString(d.privacy_note),
  };
}

export function parseModerationSubmitResponse(data: unknown): Record<string, unknown> {
  if (!data || typeof data !== "object") return {};
  return data as Record<string, unknown>;
}
