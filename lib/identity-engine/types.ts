import type {
  CommunicationStyle,
  IdentityMode,
  IdentityTone,
  NameUsage,
  NotificationStyle,
  ProactivityLevel,
  ResponseLength,
  SocialInteractionStyle,
} from "./dimensions";

export type NotificationPreferences = {
  push: boolean;
  email: boolean;
  calendar: boolean;
  in_app: boolean;
  daily_summaries: boolean;
};

export type IdentityBoundaries = {
  no_repeated_contact: boolean;
  no_excessive_notifications: boolean;
  no_emotional_pressure: boolean;
  no_dependency_encouragement: boolean;
  no_guilt: boolean;
};

export type IdentityProfile = {
  id: string;
  communication_style: CommunicationStyle;
  proactivity_level: ProactivityLevel;
  tone: IdentityTone;
  name_usage: NameUsage;
  notification_style: NotificationStyle;
  identity_mode: IdentityMode;
  social_interaction_style: SocialInteractionStyle;
  response_length: ResponseLength;
  notification_preferences: NotificationPreferences;
  boundaries: IdentityBoundaries;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
};

export type IdentityObservation = {
  id: string;
  observation_type: string;
  description: string;
  confidence_score: number;
  suggested_change?: Record<string, unknown>;
  status?: string;
  created_at: string;
};

export type IdentityCenterBundle = {
  has_customer: boolean;
  user_name?: string;
  profile?: IdentityProfile;
  explainability?: string;
  boundary_principles?: string[];
  privacy_note?: string;
  pending_observations?: IdentityObservation[];
  interaction_history?: IdentityObservation[];
  onboarding_questions?: string[];
  integrations?: Record<string, string>;
};
