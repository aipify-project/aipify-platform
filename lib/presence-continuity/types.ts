import type { PRESENCE_STATES } from "./constants";

export type PresenceState = (typeof PRESENCE_STATES)[number];

export type PresenceContinuitySettings = {
  presence_state: PresenceState | string;
  greeting_style: string;
  briefing_frequency: string;
  presence_level: string;
  focus_mode_behavior: string;
  since_last_session_detail: string;
  notification_channels: unknown;
};

export type ContinuityContextItem = {
  context_key: string;
  context_type: string;
  title: string;
  status: string;
  last_activity_at: string | null;
};

export type SinceLastSessionSummary = {
  session_key: string;
  display_mode: string;
  summary_items: Array<{ label: string; value?: string | number }>;
  completed_actions: number | null;
  pending_approvals: number | null;
  emerging_risks: number | null;
  greeting: string | null;
};

export type PresenceInsight = {
  insight_key: string;
  message: string;
  insight_type: string;
  status: string;
};

export type PresenceContinuityCenter = {
  settings: PresenceContinuitySettings | null;
  presence_status: string;
  continuity_context: ContinuityContextItem[];
  resume_experience: SinceLastSessionSummary | null;
  since_last_session: SinceLastSessionSummary | null;
  pending_priorities: Array<{ key: string; title: string; urgency: string }>;
  active_initiatives: ContinuityContextItem[];
  presence_insights: PresenceInsight[];
  executive_widgets: Record<string, unknown> | null;
  blueprint: Record<string, unknown> | null;
  links: Record<string, string> | null;
  can_manage: boolean;
  can_record: boolean;
  privacy_note: string | null;
};
