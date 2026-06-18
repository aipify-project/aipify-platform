import type {
  AipifyOperationsCenter,
  BusinessPackEvent,
  OperationsAlert,
  OperationsCenterItem,
  OperationsRecommendation,
  OperationsTask,
  OperationsTimelineEntry,
  SinceLastLoginGroup,
} from "./types";
import type { OperationsStatusKey } from "./status-standard";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function asStatus(value: unknown): OperationsStatusKey {
  const key = asString(value, "information");
  const allowed: OperationsStatusKey[] = [
    "completed",
    "not_allowed",
    "requires_attention",
    "information",
    "restricted",
    "verified",
    "waiting",
  ];
  return allowed.includes(key as OperationsStatusKey) ? (key as OperationsStatusKey) : "information";
}

function parseItem(raw: unknown): OperationsCenterItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id),
    title: asString(d.title),
    summary: asString(d.summary ?? d.description),
    statusKey: asStatus(d.status_key ?? d.statusKey),
    sourceModule: asString(d.source_module ?? d.sourceModule) || undefined,
    routePath: asString(d.route_path ?? d.routePath) || undefined,
    updatedAt: asString(d.updated_at ?? d.updatedAt) || undefined,
    kind: asString(d.kind) || undefined,
    alertType: asString(d.alert_type ?? d.alertType) || undefined,
    packKey: asString(d.pack_key ?? d.packKey) || undefined,
  };
}

function parseSinceGroup(raw: unknown): SinceLastLoginGroup[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = asRecord(item);
    return {
      id: asString(d.id),
      category: asString(d.category),
      title: asString(d.title),
      summary: asString(d.summary),
      occurredAt: asString(d.occurred_at ?? d.occurredAt),
    };
  });
}

function parseTasks(raw: unknown): OperationsTask[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => parseItem(item));
}

function parseAlerts(raw: unknown): OperationsAlert[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const base = parseItem(item);
    const d = asRecord(item);
    return {
      ...base,
      alertType: asString(d.alert_type ?? d.alertType),
      createdAt: asString(d.created_at ?? d.createdAt) || undefined,
    };
  });
}

function parseRecommendations(raw: unknown): OperationsRecommendation[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = asRecord(item);
    return {
      id: asString(d.id),
      category: asString(d.category),
      title: asString(d.title),
      why: asString(d.why ?? d.explanation),
      expectedBenefit: asString(d.expected_benefit ?? d.expectedBenefit) || null,
      confidenceLevel: asString(d.confidence_level ?? d.confidenceLevel, "medium"),
      riskLevel: asString(d.risk_level ?? d.riskLevel, "low"),
      status: asString(d.status, "pending"),
      createdAt: asString(d.created_at ?? d.createdAt) || undefined,
    };
  });
}

function parseTimeline(raw: unknown): OperationsTimelineEntry[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = asRecord(item);
    return {
      id: asString(d.id),
      actorType: asString(d.actor_type ?? d.actorType, "system"),
      actorLabel: asString(d.actor_label ?? d.actorLabel),
      actionLabel: asString(d.action_label ?? d.actionLabel),
      systemLabel: asString(d.system_label ?? d.systemLabel),
      resultLabel: asString(d.result_label ?? d.resultLabel),
      sourceModule: asString(d.source_module ?? d.sourceModule),
      businessPackKey: asString(d.business_pack_key ?? d.businessPackKey) || null,
      occurredAt: asString(d.occurred_at ?? d.occurredAt),
    };
  });
}

function parseBusinessPackEvents(raw: unknown): BusinessPackEvent[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = asRecord(item);
    return {
      id: asString(d.id),
      packKey: asString(d.pack_key ?? d.packKey),
      statusKey: asStatus(d.status_key ?? d.statusKey),
      title: asString(d.title),
      summary: asString(d.summary),
      routePath: asString(d.route_path ?? d.routePath),
      createdAt: asString(d.created_at ?? d.createdAt) || undefined,
    };
  });
}

export function parseAipifyOperationsCenter(raw: unknown): AipifyOperationsCenter {
  const d = asRecord(raw);
  const sections = asRecord(d.sections);
  const since = asRecord(d.since_last_login ?? d.sinceLastLogin);
  const sinceGroups = asRecord(since.groups);
  const tasks = asRecord(d.tasks);
  const exec = asRecord(d.executive_summary ?? d.executiveSummary);
  const stats = asRecord(d.statistics);
  const counts = asRecord(since.activity_counts ?? since.activityCounts);

  return {
    hasCustomer: Boolean(d.has_customer ?? d.hasCustomer),
    philosophy: asString(d.philosophy) || undefined,
    humanOversightRequired: Boolean(d.human_oversight_required ?? d.humanOversightRequired),
    lastLoginAt: asString(d.last_login_at ?? d.lastLoginAt) || null,
    periodStart: asString(d.period_start ?? d.periodStart ?? since.period_start) || null,
    sections: {
      completed: Array.isArray(sections.completed) ? sections.completed.map(parseItem) : [],
      requiresAttention: Array.isArray(sections.requires_attention ?? sections.requiresAttention)
        ? ((sections.requires_attention ?? sections.requiresAttention) as unknown[]).map(parseItem)
        : [],
      waiting: Array.isArray(sections.waiting) ? sections.waiting.map(parseItem) : [],
      information: Array.isArray(sections.information) ? sections.information.map(parseItem) : [],
    },
    sinceLastLogin: {
      periodStart: asString(since.period_start ?? since.periodStart) || null,
      groups: {
        today: parseSinceGroup(sinceGroups.today),
        yesterday: parseSinceGroup(sinceGroups.yesterday),
        thisWeek: parseSinceGroup(sinceGroups.this_week ?? sinceGroups.thisWeek),
      },
      activityCounts: {
        activities: asNumber(counts.activities),
        alerts: asNumber(counts.alerts),
        recommendations: asNumber(counts.recommendations),
        supportSignals: asNumber(counts.support_signals ?? counts.supportSignals),
      },
    },
    executiveSummary: {
      headline: asString(exec.headline, "What changed since your last login"),
      bullets: Array.isArray(exec.bullets) ? exec.bullets.map(String) : [],
      revenueTrend: asString(exec.revenue_trend ?? exec.revenueTrend) || undefined,
    },
    tasks: {
      myTasks: parseTasks(tasks.my_tasks ?? tasks.myTasks),
      teamTasks: parseTasks(tasks.team_tasks ?? tasks.teamTasks),
      automationTasks: parseTasks(tasks.automation_tasks ?? tasks.automationTasks),
    },
    alerts: parseAlerts(d.alerts),
    recommendations: parseRecommendations(d.recommendations),
    timeline: parseTimeline(d.timeline),
    businessPackEvents: parseBusinessPackEvents(d.business_pack_events ?? d.businessPackEvents),
    statistics: {
      requiresAttention: asNumber(stats.requires_attention ?? stats.requiresAttention),
      waiting: asNumber(stats.waiting),
      completed: asNumber(stats.completed),
      openRecommendations: asNumber(stats.open_recommendations ?? stats.openRecommendations),
    },
    privacyNote: asString(d.privacy_note ?? d.privacyNote) || undefined,
    error: asString(d.error) || undefined,
  };
}
