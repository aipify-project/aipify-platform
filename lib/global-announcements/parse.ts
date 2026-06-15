import type {
  AnalyticsSummaryRow,
  AnnouncementAuditEntry,
  AnnouncementFilters,
  AnnouncementOverview,
  AnnouncementRow,
  GlobalAnnouncementCenter,
} from "./types";
import type {
  AnnouncementCategory,
  AnnouncementStatus,
  DeliveryChannel,
  TargetAudience,
} from "./constants";
import {
  ANNOUNCEMENT_CATEGORIES,
  ANNOUNCEMENT_STATUSES,
  DELIVERY_CHANNELS,
  TARGET_AUDIENCES,
} from "./constants";

function asRecord(raw: unknown): Record<string, unknown> | null {
  return raw && typeof raw === "object" ? (raw as Record<string, unknown>) : null;
}

function asString(value: unknown, fallback = ""): string {
  return value == null ? fallback : String(value);
}

function asNumber(value: unknown, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function asBool(value: unknown, fallback = false): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function parseOverview(raw: unknown): AnnouncementOverview {
  const row = asRecord(raw) ?? {};
  return {
    active_announcements: asNumber(row.active_announcements),
    scheduled_messages: asNumber(row.scheduled_messages),
    draft_messages: asNumber(row.draft_messages),
    targeted_campaigns: asNumber(row.targeted_campaigns),
    delivery_success_rate: asNumber(row.delivery_success_rate, 98.5),
    messages_requiring_review: asNumber(row.messages_requiring_review),
  };
}

function parseAnnouncement(raw: unknown): AnnouncementRow | null {
  const row = asRecord(raw);
  if (!row || !row.id) return null;

  const category = asString(row.category, "system_update");
  const audience = asString(row.audience, "all_customers");
  const status = asString(row.status, "draft");
  const channelsRaw = row.delivery_channels;
  const channels = Array.isArray(channelsRaw)
    ? channelsRaw
        .map((c) => asString(c))
        .filter((c): c is DeliveryChannel => DELIVERY_CHANNELS.includes(c as DeliveryChannel))
    : (["in_app", "notification_center"] as DeliveryChannel[]);

  const analyticsRaw = asRecord(row.analytics);
  const analytics = analyticsRaw
    ? {
        views: asNumber(analyticsRaw.views),
        email_opens: asNumber(analyticsRaw.email_opens),
        click_rate: asNumber(analyticsRaw.click_rate),
        delivery_success_rate: asNumber(analyticsRaw.delivery_success_rate, 100),
      }
    : null;

  const filtersRaw = asRecord(row.audience_filters) ?? {};

  return {
    id: asString(row.id),
    title: asString(row.title),
    summary: asString(row.summary),
    full_content: asString(row.full_content),
    category: (ANNOUNCEMENT_CATEGORIES.includes(category as AnnouncementCategory)
      ? category
      : "system_update") as AnnouncementCategory,
    audience: (TARGET_AUDIENCES.includes(audience as TargetAudience)
      ? audience
      : "all_customers") as TargetAudience,
    status: (ANNOUNCEMENT_STATUSES.includes(status as AnnouncementStatus)
      ? status
      : "draft") as AnnouncementStatus,
    delivery_channels: channels,
    publish_at: row.publish_at ? asString(row.publish_at) : null,
    expire_at: row.expire_at ? asString(row.expire_at) : null,
    scheduled_at: row.scheduled_at ? asString(row.scheduled_at) : null,
    requires_approval: asBool(row.requires_approval),
    approval_status: asString(row.approval_status, "not_required"),
    created_by: asString(row.created_by),
    audience_filters: Object.fromEntries(
      Object.entries(filtersRaw).map(([k, v]) => [k, asString(v)])
    ),
    created_at: asString(row.created_at),
    analytics,
  };
}

function parseAnalyticsSummary(raw: unknown): AnalyticsSummaryRow | null {
  const row = asRecord(raw);
  if (!row) return null;
  return {
    announcement_id: asString(row.announcement_id),
    title: asString(row.title),
    views: asNumber(row.views),
    email_opens: asNumber(row.email_opens),
    click_rate: asNumber(row.click_rate),
    delivery_success_rate: asNumber(row.delivery_success_rate, 100),
  };
}

function parseAudit(raw: unknown): AnnouncementAuditEntry | null {
  const row = asRecord(raw);
  if (!row || !row.id) return null;
  return {
    id: asString(row.id),
    announcement_id: row.announcement_id ? asString(row.announcement_id) : null,
    event_type: asString(row.event_type),
    summary: asString(row.summary),
    created_at: asString(row.created_at),
  };
}

export function parseGlobalAnnouncementCenter(raw: unknown): GlobalAnnouncementCenter | null {
  const row = asRecord(raw);
  if (!row) return null;

  const filtersRaw = asRecord(row.filters) ?? {};

  return {
    principle: asString(
      row.principle,
      "Clear, timely communication builds trust across customers, partners, and internal teams."
    ),
    is_empty: Boolean(row.is_empty),
    filters: {
      category: asString(filtersRaw.category) as AnnouncementFilters["category"],
      audience: asString(filtersRaw.audience) as AnnouncementFilters["audience"],
      status: asString(filtersRaw.status) as AnnouncementFilters["status"],
      country: asString(filtersRaw.country) || undefined,
      language: asString(filtersRaw.language) || undefined,
      plan: asString(filtersRaw.plan) || undefined,
    },
    overview: parseOverview(row.overview),
    announcements: Array.isArray(row.announcements)
      ? row.announcements
          .map(parseAnnouncement)
          .filter((item): item is AnnouncementRow => item !== null)
      : [],
    analytics_summary: Array.isArray(row.analytics_summary)
      ? row.analytics_summary
          .map(parseAnalyticsSummary)
          .filter((item): item is AnalyticsSummaryRow => item !== null)
      : [],
    audit: Array.isArray(row.audit)
      ? row.audit.map(parseAudit).filter((item): item is AnnouncementAuditEntry => item !== null)
      : [],
  };
}

export function buildAnnouncementFilterQuery(filters: AnnouncementFilters): string {
  const params = new URLSearchParams();
  if (filters.category) params.set("category", filters.category);
  if (filters.audience) params.set("audience", filters.audience);
  if (filters.status) params.set("status", filters.status);
  if (filters.country) params.set("country", filters.country);
  if (filters.language) params.set("language", filters.language);
  if (filters.plan) params.set("plan", filters.plan);
  const query = params.toString();
  return query ? `?${query}` : "";
}
