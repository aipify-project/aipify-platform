export type PresenceState =
  | "standby"
  | "analysing"
  | "working"
  | "learning"
  | "self_healing"
  | "human_approval_required"
  | "critical_attention";

export type PresenceAnimationIntensity = "subtle" | "normal" | "enhanced";

export type PresenceActivity = {
  title: string;
  status: string;
  eta_seconds: number | null;
  risk_level: string;
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
};

export type PresenceRecommendation = {
  id: string;
  message: string;
  confidence: number;
};

export type PresenceSettings = {
  animation_intensity: PresenceAnimationIntensity;
  presence_visible: boolean;
  executive_summaries: boolean;
  self_healing_notifications: boolean;
  approval_notifications: boolean;
  sound_enabled: boolean;
};

export type PresenceCenterBundle = {
  state: PresenceState;
  activity: PresenceActivity;
  metrics: PresenceMetrics;
  history: PresenceEvent[];
  recommendations: PresenceRecommendation[];
  executive_summary: string;
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

const EMPTY_BUNDLE: PresenceCenterBundle = {
  state: "standby",
  activity: { title: "", status: "completed", eta_seconds: null, risk_level: "low" },
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
  settings: {
    animation_intensity: "normal",
    presence_visible: true,
    executive_summaries: true,
    self_healing_notifications: true,
    approval_notifications: true,
    sound_enabled: false,
  },
};

export function getPresenceAnimationClass(state: PresenceState): string {
  return STATE_ANIMATION[state] ?? STATE_ANIMATION.standby;
}

export function getPresenceGlowClass(state: PresenceState): string {
  return STATE_GLOW[state] ?? STATE_GLOW.standby;
}

export function parsePresenceCenterBundle(data: unknown): PresenceCenterBundle {
  const raw = (data ?? {}) as Record<string, unknown>;
  const metrics = (raw.metrics ?? {}) as Record<string, number>;
  const activity = (raw.activity ?? {}) as Record<string, unknown>;
  const settings = (raw.settings ?? {}) as Record<string, unknown>;

  return {
    state: (raw.state as PresenceState) ?? "standby",
    activity: {
      title: (activity.title as string) ?? "",
      status: (activity.status as string) ?? "completed",
      eta_seconds: (activity.eta_seconds as number | null) ?? null,
      risk_level: (activity.risk_level as string) ?? "low",
    },
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
      sound_enabled: settings.sound_enabled === true,
    },
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
