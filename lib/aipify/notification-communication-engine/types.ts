export type CompanionObjective = {
  key?: string;
  label?: string;
  description?: string;
  route?: string;
  status?: string;
};

export type CompanionExperience = {
  emoji?: string;
  key?: string;
  scenario?: string;
  example?: string;
};

export type MobileDashboardBlock = {
  key?: string;
  label?: string;
  description?: string;
  route?: string;
  count?: number;
  cross_link?: string;
};

export type MobileDashboardBlueprint = {
  principle?: string;
  blocks?: MobileDashboardBlock[];
  privacy_note?: string;
};

export type NotificationPrinciplesBlueprint = {
  principle?: string;
  principles?: string[];
  anti_patterns?: string[];
  settings_route?: string;
  presence_cross_link?: string;
};

export type SelfLoveConnection = {
  principle?: string;
  companion_patterns?: string[];
  self_love_route?: string;
  phase?: string;
  boundary_note?: string;
};

export type TrustConnection = {
  principle?: string;
  users_should_know?: string[];
  operators_should_understand?: string[];
  audit_note?: string;
};

export type ConfigurationOption = {
  key?: string;
  label?: string;
  route?: string;
  description?: string;
};

export type ConfigurationOptionsBlueprint = {
  principle?: string;
  options?: ConfigurationOption[];
  communication_preferences_note?: string;
};

export type DogfoodingEntry = {
  slug?: string;
  role?: string;
  focus?: string[];
  contributions?: string[];
};

export type IntegrationLink = {
  key?: string;
  label?: string;
  route?: string;
  note?: string;
};

export type EngagementSummary = {
  preferences_configured?: boolean;
  unread_notifications?: number;
  critical_unread?: number;
  delivered_last_24h?: number;
  delivered_last_7d?: number;
  frequency?: string;
  quiet_hours_enabled?: boolean;
  critical_bypass_quiet_hours?: boolean;
  subscribed_categories?: number;
  mobile_push_scaffold?: boolean;
  mobile_push_note?: string;
  privacy_note?: string;
};

export type SinceLastTimeSummary = {
  since?: string;
  source?: string;
  support_resolved?: number;
  kc_updated?: number;
  tasks_completed?: number;
  bottlenecks?: number;
  bell_moments?: number;
  recognition_moments?: number;
  summary?: string;
  [key: string]: unknown;
};

export type AbosSuccessCriterion = {
  key?: string;
  label?: string;
  met?: boolean;
  note?: string | null;
};

export type ImplementationBlueprintMeta = {
  phase?: number | string;
  title?: string;
  engine_phase?: string;
  doc?: string;
  mapping_note?: string;
};

export type NotificationCategory =
  | "support"
  | "approvals"
  | "tasks"
  | "integrations"
  | "governance"
  | "quality"
  | "onboarding"
  | "billing"
  | "system_alerts";

export type NotificationPriority = "low" | "medium" | "high" | "critical";
export type NotificationStatus = "pending" | "delivered" | "read" | "dismissed" | "failed";
export type DigestType = "daily" | "weekly" | "approval" | "support";
export type NotificationFrequency = "immediate" | "daily_digest" | "weekly_digest";

export type CommunicationNotification = {
  id: string;
  category?: NotificationCategory | string;
  priority?: NotificationPriority | string;
  title: string;
  message?: string | null;
  action_url?: string | null;
  recommended_action?: string | null;
  status?: NotificationStatus | string;
  delivered_at?: string | null;
  read_at?: string | null;
  dismissed_at?: string | null;
  created_at?: string;
};

export type CommunicationPreferences = {
  preferred_channels?: string[];
  frequency?: NotificationFrequency | string;
  quiet_hours?: Record<string, unknown>;
  category_subscriptions?: Record<string, boolean>;
  critical_bypass_quiet_hours?: boolean;
};

export type CommunicationDigest = {
  id: string;
  digest_type?: DigestType | string;
  period_start?: string;
  period_end?: string;
  status?: string;
  summary_metadata?: Record<string, unknown>;
  generated_at?: string | null;
  created_at?: string;
};

export type NotificationTrends = {
  unread?: number;
  critical_unread?: number;
  delivered_7d?: number;
  by_category?: Record<string, number>;
};

export type NotificationCommunicationEngineCard = {
  has_organization: boolean;
  unread?: number;
  critical_unread?: number;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  implementation_blueprint?: ImplementationBlueprintMeta;
  engagement_summary?: EngagementSummary;
  blueprint_note?: string;
  [key: string]: unknown;
};

export type NotificationCommunicationEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  safety_note?: string;
  principles?: string[];
  preferences?: CommunicationPreferences;
  trends?: NotificationTrends;
  unread_notifications: CommunicationNotification[];
  critical_alerts: CommunicationNotification[];
  recent_history: CommunicationNotification[];
  recent_digests: CommunicationDigest[];
  future_channels?: string[];
  implementation_blueprint?: ImplementationBlueprintMeta;
  mission?: string;
  mobile_philosophy?: string;
  abos_principle?: string;
  mobile_companion_engine_note?: string;
  distinction_note?: string;
  companion_objectives?: CompanionObjective[];
  companion_experiences?: CompanionExperience[];
  mobile_dashboard?: MobileDashboardBlueprint;
  notification_principles?: NotificationPrinciplesBlueprint;
  self_love_connection?: SelfLoveConnection;
  trust_connection?: TrustConnection;
  configuration_options?: ConfigurationOptionsBlueprint;
  dogfooding?: {
    principle?: string;
    aipify_group?: DogfoodingEntry;
    unonight?: DogfoodingEntry;
  };
  integration_links?: IntegrationLink[];
  engagement_summary?: EngagementSummary;
  since_last_time?: SinceLastTimeSummary | null;
  success_criteria?: AbosSuccessCriterion[];
  vision_phrases?: string[];
  [key: string]: unknown;
};
