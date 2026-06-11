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
};
