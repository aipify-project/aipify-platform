export const MODERATION_DECISIONS = ["auto_approve", "manual_review", "auto_reject"] as const;
export const MODERATION_SOURCE_TYPES = [
  "profile_image",
  "album_image",
  "chat_attachment",
  "marketplace_image",
  "verification_image",
  "support_attachment",
  "product_image",
] as const;
export const MODERATION_SUGGESTED_ACTIONS = [
  "approve",
  "reject",
  "request_new_upload",
  "escalate",
  "blur",
  "age_gate",
  "move_to_adult_area",
] as const;
export const MODERATION_CATEGORIES = [
  "profile_photo",
  "adult_content",
  "explicit_nudity",
  "sexual_content",
  "product_image",
  "screenshot",
  "document_verification",
  "spam_advertising",
  "violent_content",
  "hate_symbols",
  "illegal_content",
  "possible_minor",
  "animal_bestiality",
  "weapons",
  "drugs",
  "self_harm",
  "fraud_identity",
  "face_not_visible",
  "low_quality",
  "duplicate",
] as const;
export const CRITICAL_STOP_CATEGORIES = [
  "possible_minor",
  "child_content",
  "bestiality",
  "sexualized_violence",
  "severe_violence",
  "illegal_content",
  "hate_symbols",
  "self_harm",
  "non_consensual",
  "stolen_identity",
  "deepfake_intimate",
] as const;
export const MODERATION_QUEUE_TABS = [
  "needs_review",
  "auto_approved",
  "auto_rejected",
  "high_risk",
  "reported",
  "history",
] as const;

export type ModerationDecision = (typeof MODERATION_DECISIONS)[number];
export type ModerationSourceType = (typeof MODERATION_SOURCE_TYPES)[number];
export type ModerationSuggestedAction = (typeof MODERATION_SUGGESTED_ACTIONS)[number];
export type ModerationCategory = (typeof MODERATION_CATEGORIES)[number];
export type ModerationQueueTab = (typeof MODERATION_QUEUE_TABS)[number];

export type ModerationPolicyContext = {
  platform_profile?: "membership" | "dating" | "marketplace" | "social" | "commerce" | "forum" | "creator" | "support" | "custom";
  adult_content_allowed?: boolean;
  adult_in_profile_allowed?: boolean;
  explicit_profile_forbidden?: boolean;
  is_public_album?: boolean;
  is_private_album?: boolean;
  is_reported?: boolean;
};

export type ModerationAnalysisSignals = {
  detected_categories?: string[];
  risk_flags?: string[];
  confidence_hint?: number;
  is_duplicate?: boolean;
  face_visible?: boolean;
};

export type ModerationImageInput = {
  image_url: string;
  source_type: ModerationSourceType;
  source_id?: string;
  user_id?: string;
  source_system?: string;
  policy_context?: ModerationPolicyContext;
  analysis_signals?: ModerationAnalysisSignals;
  is_reported?: boolean;
};

export type ModerationEvaluation = {
  decision: ModerationDecision;
  confidence: number;
  categories: string[];
  risk_flags: string[];
  reason_summary: string;
  suggested_action: ModerationSuggestedAction | null;
  is_high_risk: boolean;
  priority: "low" | "normal" | "high" | "critical";
};

export type ModerationResultItem = {
  id: string;
  source_system: string;
  source_type: ModerationSourceType;
  source_id: string | null;
  user_id: string | null;
  image_url: string;
  decision: ModerationDecision;
  confidence: number;
  categories: string[];
  risk_flags: string[];
  policy_version: number;
  reason_summary: string;
  suggested_action: ModerationSuggestedAction | null;
  is_high_risk: boolean;
  is_reported: boolean;
  priority: string;
  status: string;
  reviewed_by: string | null;
  reviewed_at: string | null;
  final_decision: string | null;
  review_reason: string | null;
  created_at: string;
};

export type ModerationDashboard = {
  tab: ModerationQueueTab;
  settings: {
    suggest_only_mode: boolean;
    auto_approve_enabled: boolean;
    auto_reject_enabled: boolean;
    auto_approve_threshold: number;
    auto_reject_threshold: number;
  };
  policy: {
    version: number;
    label: string;
    platform_profile: string;
  };
  metrics: {
    total_reviewed: number;
    pending_review: number;
    auto_approved: number;
    auto_rejected: number;
    high_risk_pending: number;
    admin_overrides: number;
    queue_reduction_pct: number;
  };
  learning_insights: Array<{ pattern: string; count: number; message: string }>;
  items: ModerationResultItem[];
  privacy_note: string;
};
