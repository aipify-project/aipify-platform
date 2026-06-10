import type {
  NotificationActionType,
  PresenceEventType,
  PresenceNotificationChannel,
  PresenceNotificationLevel,
} from "./notifications";
import type { QuietHoursPreferences } from "./quiet-hours";

export type PresenceNotificationAction = {
  id: string;
  type: NotificationActionType;
  label: string;
  href?: string;
};

export type PresenceNotification = {
  id: string;
  event_type: PresenceEventType | string;
  level: PresenceNotificationLevel;
  title: string;
  body: string | null;
  status: string;
  channels: PresenceNotificationChannel[];
  actions: PresenceNotificationAction[];
  created_at: string;
  read_at: string | null;
};

export type PresenceNotificationPreferences = QuietHoursPreferences & {
  channel_in_app: boolean;
  channel_desktop: boolean;
  channel_email_digest: boolean;
  channel_mobile_push: boolean;
  min_level_in_app: PresenceNotificationLevel;
  min_level_desktop: PresenceNotificationLevel;
  min_level_email: PresenceNotificationLevel;
};

export type PresencePilotMetrics = {
  tenant_slug: string;
  notifications_sent_7d: number;
  actions_completed_7d: number;
  dismiss_rate_pct: number;
  usefulness_score: number;
};
