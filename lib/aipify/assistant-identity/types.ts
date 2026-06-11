export const COMMUNICATION_STYLES = [
  "professional",
  "professional_warm",
  "short_effective",
  "personal",
  "technical_precise",
] as const;

export const ADDRESS_NAME_MODES = [
  "first_name",
  "full_name",
  "company_role",
  "custom",
] as const;

export const UNCERTAINTY_HANDLING = [
  "ask_first",
  "suggest_and_approve",
  "draft_only",
  "report_only",
] as const;

export const FOCUS_AREAS = [
  "support",
  "administration",
  "quality",
  "automation",
  "insights",
  "all",
] as const;

export const PHRASE_CATEGORIES = [
  "welcome",
  "first_day",
  "daily_greeting",
  "since_last_login",
  "desktop_notification",
  "reminder",
  "uncertainty",
  "approval_request",
  "completed_task",
  "learning",
  "quality_guardian",
  "support",
  "knowledge_gap",
  "emergency",
  "encouragement",
  "safe_boundary",
] as const;

export type AssistantIdentityProfile = {
  id?: string;
  assistant_owner_name?: string | null;
  preferred_address_name?: string | null;
  address_name_mode?: string;
  preferred_communication_style?: string;
  primary_focus_areas?: string[];
  uncertainty_handling_preference?: string;
  welcome_completed?: boolean;
  welcome_completed_at?: string | null;
  welcome_step?: number;
};

export type AssistantCommunicationPreferences = {
  preferred_language?: string | null;
  preferred_tone?: string;
  use_name_in_greetings?: boolean;
  allow_personalized_phrases?: boolean;
  allow_encouragement?: boolean;
  reminder_style?: string;
  notification_style?: string;
};

export type AssistantIdentityBundle = {
  has_customer: boolean;
  enabled?: boolean;
  require_welcome_flow?: boolean;
  profile?: AssistantIdentityProfile;
  preferences?: AssistantCommunicationPreferences | null;
  display_name?: string | null;
  privacy_note?: string;
};

export type AssistantIdentityCard = {
  has_customer: boolean;
  welcome_completed?: boolean;
  require_welcome_flow?: boolean;
  display_name?: string | null;
  philosophy?: string;
};

export type AssistantGreeting = {
  has_customer: boolean;
  greeting?: string;
  display_name?: string;
  use_personalization?: boolean;
};

export type WelcomeCompleteResult = {
  completed: boolean;
  welcome_message?: string;
  profile?: AssistantIdentityProfile;
};
