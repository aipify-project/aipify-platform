export type PlatformCompanionPersonalityTab =
  | "overview"
  | "personality"
  | "communication"
  | "preferences"
  | "relationship_model"
  | "interaction_history"
  | "adaptation"
  | "reports"
  | "executive";

export type PersonalityTrait = {
  trait_key: string;
  trait_title: string;
  trait_category?: string;
  description?: string;
  layer_key?: string;
};

export type IdentityRule = {
  rule_key: string;
  rule_title: string;
  rule_type?: string;
  description?: string;
};

export type RoleProfile = {
  role_key: string;
  role_title: string;
  traits?: unknown;
  description?: string;
  example_behaviors?: unknown;
};

export type CommunicationStyle = {
  style_key: string;
  style_title: string;
  description?: string;
  example_summary?: string;
};

export type InteractionRecord = {
  interaction_type: string;
  summary: string;
  topic_key?: string;
  style_used?: string;
  quality_score?: number;
  recorded_at?: string;
};

export type PlatformCompanionPersonalityCenter = {
  found: boolean;
  principle?: string;
  philosophy?: string;
  section?: string;
  overview?: Record<string, string | number | unknown>;
  personality?: Record<string, unknown>;
  communication?: Record<string, unknown>;
  preferences?: Record<string, unknown>;
  relationship_model?: Record<string, unknown>;
  interaction_history?: InteractionRecord[];
  adaptation?: Record<string, unknown>;
  reports?: Record<string, unknown>;
  executive_dashboard?: Record<string, unknown>;
  tenant_aggregate?: Record<string, unknown>;
  audit_recent?: { event_type: string; summary: string; created_at?: string }[];
  mobile_access?: Record<string, unknown>;
  routes?: Record<string, string>;
  notifications?: Record<string, unknown>;
};

export type PlatformCompanionPersonalityLabels = {
  title: string;
  subtitle: string;
  loading: string;
  back: string;
  principle: string;
  emptyState: string;
  tabs: Record<PlatformCompanionPersonalityTab, string>;
  overview: Record<string, string>;
  actions: Record<string, string>;
  sections: Record<string, string>;
};
