import type { DailyBriefing } from "./daily-briefing";

export type PresenceState =
  | "standby"
  | "analysing"
  | "working"
  | "learning"
  | "self_healing"
  | "human_approval_required"
  | "critical_attention";

export type PresenceMode =
  | "normal"
  | "learning"
  | "healing"
  | "approval_required"
  | "attention_required";

export type PresenceAnimationIntensity = "subtle" | "normal" | "enhanced";
export type PresenceSoundMode = "off" | "minimal" | "enabled";
export type PresenceViewMode = "executive" | "operations";
export type RecommendationImpactLevel = "low" | "medium" | "high" | "critical";

export type PresenceActivity = {
  title: string;
  status: string;
  eta_seconds: number | null;
  risk_level: string;
};

export type PresenceSnapshot = {
  environments_monitored: number;
  learning_events_today: number;
  healing_completed_today: number;
  recommendations_pending: number;
};

export type PresenceHealthTrend = {
  score: number;
  delta_week: number;
  contributors: string[];
};

export type PresenceApprovalContext = {
  risk_level: string;
  reasons: string[];
};

export type PresenceEventMetadata = {
  trigger?: string;
  actions?: string[];
  outcome?: string;
};

export type PresenceMetrics = {
  automations_running: number;
  learning_events_today: number;
  healing_events_today: number;
  pending_approvals: number;
  system_health_score: number;
};

export type PresenceEvent = {
  id: string;
  surface: string;
  event_type: string;
  title: string;
  detail: string | null;
  status: string;
  risk_level: string | null;
  succeeded: boolean | null;
  required_approval: boolean;
  created_at: string;
  metadata?: PresenceEventMetadata | Record<string, unknown>;
};

export type PresenceRecommendation = {
  id: string;
  message: string;
  confidence: number;
  impact_level?: RecommendationImpactLevel;
  what_happened?: string;
  why_matters?: string;
  suggested_action?: string;
  if_ignored?: string;
};

export type PresenceSettings = {
  animation_intensity: PresenceAnimationIntensity;
  presence_visible: boolean;
  executive_summaries: boolean;
  self_healing_notifications: boolean;
  approval_notifications: boolean;
  learning_notifications: boolean;
  sound_enabled: boolean;
  sound_mode: PresenceSoundMode;
  view_mode: PresenceViewMode;
  briefing_morning_enabled: boolean;
  briefing_evening_enabled: boolean;
  briefing_weekend_enabled: boolean;
  briefing_positive_enabled: boolean;
  briefing_attention_enabled: boolean;
  briefing_critical_enabled: boolean;
};

export type PresenceCenterBundle = {
  state: PresenceState;
  activity: PresenceActivity;
  snapshot: PresenceSnapshot;
  health_trend: PresenceHealthTrend;
  approval_context: PresenceApprovalContext | null;
  metrics: PresenceMetrics;
  history: PresenceEvent[];
  recommendations: PresenceRecommendation[];
  executive_summary: string;
  daily_briefing: DailyBriefing | null;
  settings: PresenceSettings;
};

const STATE_ANIMATION: Record<PresenceState, string> = {
  standby: "animate-presence-standby",
  analysing: "animate-presence-analysing",
  working: "animate-presence-working",
  learning: "animate-presence-learning",
  self_healing: "animate-presence-healing",
  human_approval_required: "animate-presence-approval",
  critical_attention: "animate-presence-critical",
};

const STATE_GLOW: Record<PresenceState, string> = {
  standby: "from-violet-400/20 to-indigo-400/20",
  analysing: "from-violet-400/35 to-indigo-400/30",
  working: "from-violet-400/30 to-sky-400/25",
  learning: "from-violet-400/35 to-fuchsia-400/25",
  self_healing: "from-emerald-400/30 to-violet-400/25",
  human_approval_required: "from-amber-400/35 to-orange-300/25",
  critical_attention: "from-rose-400/35 to-violet-400/30",
};

const STATE_TO_MODE: Record<PresenceState, PresenceMode> = {
  standby: "normal",
  analysing: "normal",
  working: "normal",
  learning: "learning",
  self_healing: "healing",
  human_approval_required: "approval_required",
  critical_attention: "attention_required",
};

const IMPACT_STYLES: Record<RecommendationImpactLevel, string> = {
  low: "bg-gray-50 text-gray-700 ring-gray-100",
  medium: "bg-sky-50 text-sky-700 ring-sky-100",
  high: "bg-amber-50 text-amber-800 ring-amber-100",
  critical: "bg-rose-50 text-rose-700 ring-rose-100",
};

const EMPTY_BUNDLE: PresenceCenterBundle = {
  state: "standby",
  activity: { title: "", status: "completed", eta_seconds: null, risk_level: "low" },
  snapshot: {
    environments_monitored: 0,
    learning_events_today: 0,
    healing_completed_today: 0,
    recommendations_pending: 0,
  },
  health_trend: { score: 90, delta_week: 0, contributors: [] },
  approval_context: null,
  metrics: {
    automations_running: 0,
    learning_events_today: 0,
    healing_events_today: 0,
    pending_approvals: 0,
    system_health_score: 90,
  },
  history: [],
  recommendations: [],
  executive_summary: "",
  daily_briefing: null,
  settings: {
    animation_intensity: "normal",
    presence_visible: true,
    executive_summaries: true,
    self_healing_notifications: true,
    approval_notifications: true,
    learning_notifications: true,
    sound_enabled: false,
    sound_mode: "off",
    view_mode: "operations",
    briefing_morning_enabled: true,
    briefing_evening_enabled: true,
    briefing_weekend_enabled: true,
    briefing_positive_enabled: true,
    briefing_attention_enabled: true,
    briefing_critical_enabled: true,
  },
};

export function getPresenceAnimationClass(state: PresenceState): string {
  return STATE_ANIMATION[state] ?? STATE_ANIMATION.standby;
}

export function getPresenceGlowClass(state: PresenceState): string {
  return STATE_GLOW[state] ?? STATE_GLOW.standby;
}

export function getPresenceMode(state: PresenceState): PresenceMode {
  return STATE_TO_MODE[state] ?? "normal";
}

export function getImpactBadgeStyle(level: RecommendationImpactLevel): string {
  return IMPACT_STYLES[level] ?? IMPACT_STYLES.medium;
}

export function parsePresenceEventMetadata(event: PresenceEvent): PresenceEventMetadata {
  const raw = (event.metadata ?? {}) as Record<string, unknown>;
  return {
    trigger: typeof raw.trigger === "string" ? raw.trigger : undefined,
    actions: Array.isArray(raw.actions) ? (raw.actions as string[]) : undefined,
    outcome: typeof raw.outcome === "string" ? raw.outcome : undefined,
  };
}

export function parsePresenceCenterBundle(data: unknown): PresenceCenterBundle {
  const raw = (data ?? {}) as Record<string, unknown>;
  const metrics = (raw.metrics ?? {}) as Record<string, number>;
  const activity = (raw.activity ?? {}) as Record<string, unknown>;
  const settings = (raw.settings ?? {}) as Record<string, unknown>;
  const snapshot = (raw.snapshot ?? {}) as Record<string, number>;
  const health = (raw.health_trend ?? {}) as Record<string, unknown>;
  const approval = raw.approval_context as Record<string, unknown> | null;

  const soundMode = (settings.sound_mode as PresenceSoundMode) ?? "off";

  return {
    state: (raw.state as PresenceState) ?? "standby",
    activity: {
      title: (activity.title as string) ?? "",
      status: (activity.status as string) ?? "completed",
      eta_seconds: (activity.eta_seconds as number | null) ?? null,
      risk_level: (activity.risk_level as string) ?? "low",
    },
    snapshot: {
      environments_monitored: snapshot.environments_monitored ?? 0,
      learning_events_today: snapshot.learning_events_today ?? 0,
      healing_completed_today: snapshot.healing_completed_today ?? 0,
      recommendations_pending: snapshot.recommendations_pending ?? 0,
    },
    health_trend: {
      score: Number(health.score ?? metrics.system_health_score ?? 90),
      delta_week: Number(health.delta_week ?? 0),
      contributors: Array.isArray(health.contributors) ? (health.contributors as string[]) : [],
    },
    approval_context: approval
      ? {
          risk_level: String(approval.risk_level ?? "medium"),
          reasons: Array.isArray(approval.reasons) ? (approval.reasons as string[]) : [],
        }
      : null,
    metrics: {
      automations_running: metrics.automations_running ?? 0,
      learning_events_today: metrics.learning_events_today ?? 0,
      healing_events_today: metrics.healing_events_today ?? 0,
      pending_approvals: metrics.pending_approvals ?? 0,
      system_health_score: metrics.system_health_score ?? 90,
    },
    history: Array.isArray(raw.history) ? (raw.history as PresenceEvent[]) : [],
    recommendations: Array.isArray(raw.recommendations)
      ? (raw.recommendations as PresenceRecommendation[])
      : [],
    executive_summary: (raw.executive_summary as string) ?? "",
    settings: {
      animation_intensity:
        (settings.animation_intensity as PresenceAnimationIntensity) ?? "normal",
      presence_visible: settings.presence_visible !== false,
      executive_summaries: settings.executive_summaries !== false,
      self_healing_notifications: settings.self_healing_notifications !== false,
      approval_notifications: settings.approval_notifications !== false,
      learning_notifications: settings.learning_notifications !== false,
      sound_enabled: settings.sound_enabled === true || soundMode === "enabled",
      sound_mode: soundMode,
      view_mode: (settings.view_mode as PresenceViewMode) ?? "operations",
      briefing_morning_enabled: settings.briefing_morning_enabled !== false,
      briefing_evening_enabled: settings.briefing_evening_enabled !== false,
      briefing_weekend_enabled: settings.briefing_weekend_enabled !== false,
      briefing_positive_enabled: settings.briefing_positive_enabled !== false,
      briefing_attention_enabled: settings.briefing_attention_enabled !== false,
      briefing_critical_enabled: settings.briefing_critical_enabled !== false,
    },
    daily_briefing: null,
  };
}

export function getEmptyPresenceBundle(): PresenceCenterBundle {
  return EMPTY_BUNDLE;
}

export function formatPresenceTime(iso: string, locale: string): string {
  try {
    return new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit" }).format(
      new Date(iso)
    );
  } catch {
    return iso;
  }
}
