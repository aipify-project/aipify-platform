import type { RELATIONSHIP_MODES } from "./constants";

export type RelationshipMode = (typeof RELATIONSHIP_MODES)[number];

export type CompanionIdentitySettings = {
  companion_display_name: string;
  official_name: string;
  relationship_mode: RelationshipMode | string;
  tone_preference: string;
  proactivity_level: string;
  humor_preference: string;
  notification_style: string;
  encouragement_preference: string;
  briefing_style: string;
  personalization_enabled: boolean;
  boundary_settings: Record<string, unknown> | null;
};

export type TrustSignal = {
  signal_key: string;
  label: string;
  score: number;
  trend: string;
};

export type RelationshipMilestone = {
  milestone_key: string;
  title: string;
  milestone_type: string;
  achieved_at: string | null;
  trust_score_delta: number | null;
};

export type RelationshipReview = {
  review_key: string;
  question: string;
  status: string;
  user_response: string | null;
};

export type PersonalizationStatus = {
  preference_key: string;
  category: string;
  value: Record<string, unknown> | null;
  adapted_at: string | null;
};

export type CompanionIdentityRelationshipCenter = {
  settings: CompanionIdentitySettings | null;
  trust_indicators: TrustSignal[];
  milestones: RelationshipMilestone[];
  pending_reviews: RelationshipReview[];
  personalization_status: PersonalizationStatus[];
  introduction_framework: string | null;
  blueprint: Record<string, unknown> | null;
  links: Record<string, string> | null;
  can_manage: boolean;
  can_record: boolean;
  privacy_note: string | null;
};
