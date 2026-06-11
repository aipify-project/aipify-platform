export type ConfidenceLevel = "low" | "medium" | "high";

export type ProfileStatus = "draft" | "pending_review" | "approved" | "active";

export type RiskLevel = "conservative" | "balanced" | "progressive";

export type BusinessDnaProfile = {
  id: string;
  company_name: string;
  industry: string;
  business_description: string;
  primary_language: string;
  supported_languages: string[];
  tone_of_voice: string;
  support_style: string;
  risk_level: string;
  profile_status: ProfileStatus;
  approved_at?: string | null;
};

export type BdeSettings = {
  human_review_mode: boolean;
  automation_enabled: boolean;
  high_confidence_auto_draft: boolean;
  learn_from_approved_replies: boolean;
  import_support_history: boolean;
  connected_systems: Array<Record<string, unknown>>;
  email_channel_provider: string | null;
  email_channel_status: string;
  fallback_language: string;
  privacy_settings: Record<string, unknown>;
};

export type HealthScore = {
  health_score: number;
  level: string;
  readiness_label: string;
  factors: Record<string, unknown>;
  gaps: string[];
};

export type BusinessDnaCenterBundle = {
  has_customer: boolean;
  profile?: BusinessDnaProfile;
  settings?: BdeSettings;
  health?: HealthScore;
  products?: Array<Record<string, unknown>>;
  workflows?: Array<Record<string, unknown>>;
  knowledge?: Array<Record<string, unknown>>;
  templates?: Array<Record<string, unknown>>;
  tone_profiles?: Array<Record<string, unknown>>;
  escalation_rules?: Array<Record<string, unknown>>;
  knowledge_sources?: Array<Record<string, unknown>>;
  template_suggestions?: Array<Record<string, unknown>>;
  automation_readiness?: { categories: Array<Record<string, unknown>> };
  recent_drafts?: Array<Record<string, unknown>>;
  audit_log?: Array<Record<string, unknown>>;
  privacy_note?: string;
  integrations?: Record<string, string>;
};

export type EmailAnalysis = {
  has_customer: boolean;
  category?: string;
  language?: string;
  confidence_score?: number;
  confidence_level?: ConfidenceLevel;
  template_found?: boolean;
  escalate?: boolean;
  escalation_reason?: string | null;
  human_review_required?: boolean;
  response_priority?: string;
};
