import type {
  CommunicationDigest,
  CommunicationNotification,
  CommunicationPreferences,
  CompanionExperience,
  CompanionObjective,
  ConfigurationOptionsBlueprint,
  EngagementSummary,
  IntegrationLink,
  MobileDashboardBlueprint,
  NotificationCommunicationEngineCard,
  NotificationCommunicationEngineDashboard,
  NotificationPrinciplesBlueprint,
  SelfLoveConnection,
  SinceLastTimeSummary,
  TrustConnection,
} from "./types";

function parseStringArray(value: unknown): string[] | undefined {
  return Array.isArray(value) ? (value as string[]) : undefined;
}

function parseSuccessCriteria(value: unknown) {
  if (!Array.isArray(value)) return undefined;
  return value as NotificationCommunicationEngineDashboard["success_criteria"];
}

function parseCompanionObjectives(value: unknown): CompanionObjective[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value as CompanionObjective[];
}

function parseCompanionExperiences(value: unknown): CompanionExperience[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value as CompanionExperience[];
}

function parseMobileDashboard(value: unknown): MobileDashboardBlueprint | undefined {
  if (typeof value !== "object" || !value) return undefined;
  return value as MobileDashboardBlueprint;
}

function parseNotificationPrinciples(value: unknown): NotificationPrinciplesBlueprint | undefined {
  if (typeof value !== "object" || !value) return undefined;
  return value as NotificationPrinciplesBlueprint;
}

function parseSelfLoveConnection(value: unknown): SelfLoveConnection | undefined {
  if (typeof value !== "object" || !value) return undefined;
  return value as SelfLoveConnection;
}

function parseTrustConnection(value: unknown): TrustConnection | undefined {
  if (typeof value !== "object" || !value) return undefined;
  return value as TrustConnection;
}

function parseConfigurationOptions(value: unknown): ConfigurationOptionsBlueprint | undefined {
  if (typeof value !== "object" || !value) return undefined;
  return value as ConfigurationOptionsBlueprint;
}

function parseIntegrationLinks(value: unknown): IntegrationLink[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value as IntegrationLink[];
}

function parseEngagementSummary(value: unknown): EngagementSummary | undefined {
  if (typeof value !== "object" || !value) return undefined;
  return value as EngagementSummary;
}

function parseSinceLastTime(value: unknown): SinceLastTimeSummary | null | undefined {
  if (value === null) return null;
  if (typeof value !== "object" || !value) return undefined;
  return value as SinceLastTimeSummary;
}

export function parseNotificationCommunicationEngineCard(
  data: unknown
): NotificationCommunicationEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    unread: Number(d.unread ?? 0),
    critical_unread: Number(d.critical_unread ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    mission: typeof d.mission === "string" ? d.mission : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    engagement_summary: parseEngagementSummary(d.engagement_summary),
    blueprint_note: typeof d.blueprint_note === "string" ? d.blueprint_note : undefined,
    ...d,
  } as NotificationCommunicationEngineCard;
}

function parseNotification(item: unknown): CommunicationNotification {
  const n = (item ?? {}) as Record<string, unknown>;
  return {
    id: String(n.id ?? ""),
    category: typeof n.category === "string" ? n.category : undefined,
    priority: typeof n.priority === "string" ? n.priority : undefined,
    title: String(n.title ?? ""),
    message: typeof n.message === "string" ? n.message : null,
    action_url: typeof n.action_url === "string" ? n.action_url : null,
    recommended_action: typeof n.recommended_action === "string" ? n.recommended_action : null,
    status: typeof n.status === "string" ? n.status : undefined,
    delivered_at: typeof n.delivered_at === "string" ? n.delivered_at : null,
    read_at: typeof n.read_at === "string" ? n.read_at : null,
    dismissed_at: typeof n.dismissed_at === "string" ? n.dismissed_at : null,
    created_at: typeof n.created_at === "string" ? n.created_at : undefined,
  };
}

function parseDigest(item: unknown): CommunicationDigest {
  const d = (item ?? {}) as Record<string, unknown>;
  return {
    id: String(d.id ?? ""),
    digest_type: typeof d.digest_type === "string" ? d.digest_type : undefined,
    period_start: typeof d.period_start === "string" ? d.period_start : undefined,
    period_end: typeof d.period_end === "string" ? d.period_end : undefined,
    status: typeof d.status === "string" ? d.status : undefined,
    summary_metadata:
      typeof d.summary_metadata === "object" && d.summary_metadata
        ? (d.summary_metadata as Record<string, unknown>)
        : undefined,
    generated_at: typeof d.generated_at === "string" ? d.generated_at : null,
    created_at: typeof d.created_at === "string" ? d.created_at : undefined,
  };
}

export function parseNotificationCommunicationEngineDashboard(
  data: unknown
): NotificationCommunicationEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  const prefs =
    typeof d.preferences === "object" && d.preferences
      ? (d.preferences as CommunicationPreferences)
      : undefined;

  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    principles: parseStringArray(d.principles),
    preferences: prefs,
    trends:
      typeof d.trends === "object" && d.trends
        ? (d.trends as NotificationCommunicationEngineDashboard["trends"])
        : undefined,
    unread_notifications: Array.isArray(d.unread_notifications)
      ? d.unread_notifications.map(parseNotification)
      : [],
    critical_alerts: Array.isArray(d.critical_alerts)
      ? d.critical_alerts.map(parseNotification)
      : [],
    recent_history: Array.isArray(d.recent_history)
      ? d.recent_history.map(parseNotification)
      : [],
    recent_digests: Array.isArray(d.recent_digests)
      ? d.recent_digests.map(parseDigest)
      : [],
    future_channels: parseStringArray(d.future_channels),
    mission: typeof d.mission === "string" ? d.mission : undefined,
    mobile_philosophy: typeof d.mobile_philosophy === "string" ? d.mobile_philosophy : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    mobile_companion_engine_note:
      typeof d.mobile_companion_engine_note === "string" ? d.mobile_companion_engine_note : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    companion_objectives: parseCompanionObjectives(d.companion_objectives),
    companion_experiences: parseCompanionExperiences(d.companion_experiences),
    mobile_dashboard: parseMobileDashboard(d.mobile_dashboard),
    notification_principles: parseNotificationPrinciples(d.notification_principles),
    self_love_connection: parseSelfLoveConnection(d.self_love_connection),
    trust_connection: parseTrustConnection(d.trust_connection),
    configuration_options: parseConfigurationOptions(d.configuration_options),
    integration_links: parseIntegrationLinks(d.integration_links),
    engagement_summary: parseEngagementSummary(d.engagement_summary),
    since_last_time: parseSinceLastTime(d.since_last_time),
    success_criteria: parseSuccessCriteria(d.success_criteria),
    vision_phrases: parseStringArray(d.vision_phrases),
    ...d,
  } as NotificationCommunicationEngineDashboard;
}

export function parseCommunicationPreferences(data: unknown): CommunicationPreferences {
  const d = (data ?? {}) as Record<string, unknown>;
  const prefs =
    typeof d.preferences === "object" && d.preferences
      ? (d.preferences as Record<string, unknown>)
      : d;

  return {
    preferred_channels: Array.isArray(prefs.preferred_channels)
      ? (prefs.preferred_channels as string[])
      : undefined,
    frequency: typeof prefs.frequency === "string" ? prefs.frequency : undefined,
    quiet_hours:
      typeof prefs.quiet_hours === "object" && prefs.quiet_hours
        ? (prefs.quiet_hours as Record<string, unknown>)
        : undefined,
    category_subscriptions:
      typeof prefs.category_subscriptions === "object" && prefs.category_subscriptions
        ? (prefs.category_subscriptions as Record<string, boolean>)
        : undefined,
    critical_bypass_quiet_hours:
      typeof prefs.critical_bypass_quiet_hours === "boolean"
        ? prefs.critical_bypass_quiet_hours
        : undefined,
  };
}
