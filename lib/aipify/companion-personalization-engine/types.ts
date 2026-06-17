export type PersonalizationCategory =
  | "communication_style" | "briefing_preferences" | "notification_preferences"
  | "reporting_preferences" | "companion_personality" | "workflow_preferences"
  | "language_preferences" | "meeting_preferences" | "learning_preferences" | "productivity_preferences";

export type CommunicationStyle =
  | "executive" | "professional" | "detailed" | "concise" | "friendly" | "analytical" | "balanced";

export type BriefingStyle = "ultra_short" | "summary" | "standard" | "detailed" | "executive_report";
export type NotificationStyle = "minimal" | "balanced" | "active" | "high_awareness";
export type CompanionPersonality = "professional" | "supportive" | "executive" | "analytical" | "coach" | "balanced";
export type AdaptationLevel = "low" | "moderate" | "high";
export type LearningPreference = "guided" | "self_service" | "interactive" | "documentation_first" | "video_first";
export type PreferenceStatus = "suggested" | "approved" | "rejected" | "active";
export type PreferenceConfidence = "high" | "medium" | "low" | "unverified";

export type PersonalizationProfile = {
  communication_styles?: string[];
  briefing_style?: string;
  notification_style?: string;
  companion_personality?: string;
  adaptation_level?: string;
  preferred_language?: string;
  secondary_language?: string;
  report_language?: string;
  notification_language?: string;
  notify_email?: boolean;
  notify_desktop?: boolean;
  notify_mobile?: boolean;
  notify_in_app?: boolean;
  learning_preference?: string;
  workflow_preferences?: Record<string, unknown>;
  personalization_score?: number;
};

export type PersonalizationPreference = {
  id: string;
  pref_key: string;
  category: string;
  title: string;
  value: string;
  source_key: string;
  confidence: string;
  status: string;
  updated_at: string;
};

export type PersonalizationInsight = {
  id: string;
  title: string;
  summary: string;
  insight_type: string;
  created_at: string;
};

export type PersonalizationTimelineEvent = {
  id: string;
  event_type: string;
  description: string;
  created_at: string;
};

export type PersonalizationDashboard = {
  found: boolean;
  can_self?: boolean;
  can_org_defaults?: boolean;
  can_manage_org?: boolean;
  has_preferences?: boolean;
  personalization_score?: number;
  active_preferences_count?: number;
  profile?: PersonalizationProfile;
  preferences?: PersonalizationPreference[];
  timeline?: PersonalizationTimelineEvent[];
  usage_examples?: string[];
  privacy_note?: string;
  principle?: string;
};

export const PERSONALIZATION_CATEGORY_KEYS = [
  "communication_style", "briefing_preferences", "notification_preferences",
  "reporting_preferences", "companion_personality", "workflow_preferences",
  "language_preferences", "meeting_preferences", "learning_preferences", "productivity_preferences",
] as const;

export const COMMUNICATION_STYLE_KEYS = [
  "executive", "professional", "detailed", "concise", "friendly", "analytical", "balanced",
] as const;

export type CompanionPersonalizationEngineLabels = {
  title: string;
  subtitle: string;
  loading: string;
  principle: string;
  privacyNote: string;
  emptyTitle: string;
  emptyBody: string;
  emptyCta: string;
  accessDenied: string;
  filters: { search: string; category: string; source: string; confidence: string; status: string; all: string };
  dashboard: {
    personalizationScore: string;
    activePreferences: string;
    communicationProfile: string;
    briefingStyle: string;
    notificationStyle: string;
    adaptationLevel: string;
    reviewCenter: string;
    insights: string;
    timeline: string;
    usageExamples: string;
    reset: string;
    save: string;
  };
  review: { preference: string; source: string; confidence: string; lastUpdated: string; status: string; approve: string; reject: string; edit: string; reset: string };
  profile: {
    communicationStyles: string;
    briefingStyle: string;
    notificationStyle: string;
    companionPersonality: string;
    adaptationLevel: string;
    preferredLanguage: string;
    learningPreference: string;
    notifyChannels: string;
  };
  communicationStyles: Record<string, string>;
  briefingStyles: Record<string, string>;
  notificationStyles: Record<string, string>;
  personalities: Record<string, string>;
  adaptationLevels: Record<string, string>;
  learningPreferences: Record<string, string>;
  categories: Record<string, string>;
  statuses: Record<string, string>;
  confidenceLevels: Record<string, string>;
  faq: { title: string; whatIs: string; whatIsAnswer: string; control: string; controlAnswer: string; security: string; securityAnswer: string };
};
