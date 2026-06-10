export type BriefingMessageType =
  | "morning"
  | "evening"
  | "weekend"
  | "positive"
  | "attention"
  | "critical";

export type BriefingMessage = {
  id?: string;
  message_key?: string;
  message_type: BriefingMessageType;
  title: string;
  body: string;
  tone: string;
  severity: "info" | "attention" | "critical";
};

export type BriefingPreferences = {
  morning: boolean;
  evening: boolean;
  weekend: boolean;
  positive: boolean;
  attention: boolean;
  critical: boolean;
};

export type DailyBriefing = {
  primary: BriefingMessage;
  secondary: BriefingMessage[];
  promise: string;
  always_on: string;
  context: {
    pending_approvals: number;
    critical_events: number;
    healing_today: number;
    health_score: number;
  };
  preferences: BriefingPreferences;
};

const SEVERITY_STYLES: Record<string, string> = {
  info: "border-violet-100 bg-gradient-to-br from-violet-50/70 via-white to-indigo-50/40",
  attention: "border-amber-100 bg-gradient-to-br from-amber-50/50 via-white to-orange-50/30",
  critical: "border-rose-200 bg-gradient-to-br from-rose-50/60 via-white to-red-50/30",
};

const SEVERITY_TEXT: Record<string, string> = {
  info: "text-violet-900",
  attention: "text-amber-950",
  critical: "text-rose-950",
};

export function getBriefingSeverityStyle(severity: string): string {
  return SEVERITY_STYLES[severity] ?? SEVERITY_STYLES.info;
}

export function getBriefingSeverityText(severity: string): string {
  return SEVERITY_TEXT[severity] ?? SEVERITY_TEXT.info;
}

function parseMessage(raw: Record<string, unknown>): BriefingMessage {
  return {
    id: raw.id != null ? String(raw.id) : undefined,
    message_key: raw.message_key != null ? String(raw.message_key) : undefined,
    message_type: (raw.message_type as BriefingMessageType) ?? "morning",
    title: String(raw.title ?? ""),
    body: String(raw.body ?? ""),
    tone: String(raw.tone ?? "calm"),
    severity: (raw.severity as BriefingMessage["severity"]) ?? "info",
  };
}

export function parseDailyBriefing(data: unknown): DailyBriefing | null {
  if (!data || typeof data !== "object") return null;
  const raw = data as Record<string, unknown>;
  const primary = raw.primary as Record<string, unknown> | undefined;
  if (!primary) return null;

  const prefs = (raw.preferences ?? {}) as Record<string, boolean>;
  const context = (raw.context ?? {}) as Record<string, number>;

  return {
    primary: parseMessage(primary),
    secondary: Array.isArray(raw.secondary)
      ? (raw.secondary as Record<string, unknown>[]).map(parseMessage)
      : [],
    promise: String(raw.promise ?? ""),
    always_on: String(raw.always_on ?? ""),
    context: {
      pending_approvals: Number(context.pending_approvals ?? 0),
      critical_events: Number(context.critical_events ?? 0),
      healing_today: Number(context.healing_today ?? 0),
      health_score: Number(context.health_score ?? 90),
    },
    preferences: {
      morning: prefs.morning !== false,
      evening: prefs.evening !== false,
      weekend: prefs.weekend !== false,
      positive: prefs.positive !== false,
      attention: prefs.attention !== false,
      critical: prefs.critical !== false,
    },
  };
}

export const BRIEFING_PREFERENCE_KEYS = [
  "briefing_morning_enabled",
  "briefing_evening_enabled",
  "briefing_weekend_enabled",
  "briefing_positive_enabled",
  "briefing_attention_enabled",
  "briefing_critical_enabled",
] as const;

export type BriefingPreferenceKey = (typeof BRIEFING_PREFERENCE_KEYS)[number];
