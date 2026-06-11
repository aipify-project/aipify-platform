export type TagSettings = {
  focus_protection_enabled: boolean;
  proactivity_level: string;
  interruption_handling: string;
  energy_management_enabled: boolean;
  goal_alignment_enabled: boolean;
  meeting_protection_enabled: boolean;
  recovery_protection_enabled: boolean;
  daily_focus_briefing_enabled: boolean;
  end_of_day_review_enabled: boolean;
  attention_tracking_enabled: boolean;
  quiet_hours_start: string | null;
  quiet_hours_end: string | null;
  preferred_focus_period: string;
  protected_priorities: string[];
  privacy_settings: Record<string, unknown>;
};

export type FocusSession = {
  id: string;
  title: string;
  session_type: string;
  starts_at?: string;
  ends_at: string | null;
  status: string;
};

export type ProtectedBlock = {
  id: string;
  title: string;
  block_type: string;
  starts_at: string;
  ends_at: string;
  is_protected: boolean;
};

export type AttentionCenterBundle = {
  has_customer: boolean;
  settings?: TagSettings;
  attention_state?: string;
  overload_score?: number;
  active_focus_session?: FocusSession | null;
  focus_sessions?: FocusSession[];
  protected_blocks?: ProtectedBlock[];
  daily_focus_briefing?: Record<string, unknown> | null;
  end_of_day_review?: Record<string, unknown> | null;
  weekly_attention?: Record<string, number> | null;
  weekly_prompt?: string | null;
  meeting_analysis?: { today_count: number; week_count: number; alert: string | null };
  energy_insights?: string[];
  goal_alignment?: Array<{ goal_id: string; message: string }>;
  recovery_alerts?: string[];
  priority_defense?: Array<{ id: string; message: string }>;
  recent_activity?: Array<{
    id: string;
    activity_type: string;
    message: string;
    created_at: string;
  }>;
  privacy_note?: string;
  integrations?: Record<string, string>;
};

export type FocusModeProposal = {
  detected: boolean;
  title: string;
  session_type: string;
  ends_at_hint: string | null;
  prompt: string;
};
