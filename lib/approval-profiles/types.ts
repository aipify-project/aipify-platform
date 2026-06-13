import type { APPROVAL_MODES, PROFILE_TYPES, REVIEW_STATES } from "./constants";

export type ProfileType = (typeof PROFILE_TYPES)[number];
export type ApprovalMode = (typeof APPROVAL_MODES)[number];
export type ReviewState = (typeof REVIEW_STATES)[number];

export type ApprovalProfile = {
  profile_key: string;
  profile_name: string;
  profile_type: ProfileType | string;
  owner_label: string | null;
  approval_mode: ApprovalMode | string;
  review_state: ReviewState | string;
  status: string;
  spending_thresholds: Record<string, unknown> | null;
  approved_categories: string[] | null;
};

export type ApprovalProfileRecommendation = {
  recommendation_key: string;
  message: string;
  profile_type: string | null;
  status: string;
};

export type ApprovalProfileActivity = {
  activity_key: string;
  profile_key: string;
  action_category: string;
  approved_via_profile: boolean;
  override_used: boolean;
  time_saved_minutes: number;
  created_at: string;
};

export type ApprovalProfilesCenter = {
  settings: { profiles_enabled: boolean; default_approval_mode: string } | null;
  active_profiles: ApprovalProfile[];
  pending_reviews: ApprovalProfile[];
  recommendations: ApprovalProfileRecommendation[];
  approval_activity: ApprovalProfileActivity[];
  time_savings: Record<string, unknown> | null;
  governance_indicators: Record<string, unknown> | null;
  blueprint: Record<string, unknown> | null;
  links: Record<string, string> | null;
  can_manage: boolean;
  can_record: boolean;
  can_delete: boolean;
  privacy_note: string | null;
};
