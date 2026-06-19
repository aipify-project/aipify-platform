import type {
  ActivityFeedCenter,
  CommActivity,
  CommAnnouncement,
  CommApproval,
  CommMessage,
  CommNotification,
  CommunicationManagementCenter,
  NotificationManagementCenter,
  UnifiedApprovalCenter,
} from "./types";

function parseMessage(raw: unknown): CommMessage | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (typeof o.id !== "string") return null;
  return {
    id: o.id,
    message_type: String(o.message_type ?? "direct"),
    status: (o.status as CommMessage["status"]) ?? "pending",
    priority: (o.priority as CommMessage["priority"]) ?? "normal",
    subject: String(o.subject ?? ""),
    body: String(o.body ?? ""),
    sender_user_id: typeof o.sender_user_id === "string" ? o.sender_user_id : null,
    recipient_user_id: typeof o.recipient_user_id === "string" ? o.recipient_user_id : null,
    read_at: typeof o.read_at === "string" ? o.read_at : null,
    created_at: typeof o.created_at === "string" ? o.created_at : "",
  };
}

function parseMessages(raw: unknown): CommMessage[] {
  if (!Array.isArray(raw)) return [];
  return raw.map(parseMessage).filter((m): m is CommMessage => m !== null);
}

function parseNotifications(raw: unknown): CommNotification[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const o = item as Record<string, unknown>;
    return {
      id: String(o.id ?? ""),
      notification_type: String(o.notification_type ?? ""),
      priority: String(o.priority ?? "normal"),
      status: String(o.status ?? "pending"),
      summary: String(o.summary ?? ""),
      source: typeof o.source === "string" ? o.source : undefined,
      read_at: typeof o.read_at === "string" ? o.read_at : null,
      created_at: typeof o.created_at === "string" ? o.created_at : "",
    };
  }).filter((n) => n.id);
}

export function parseCommunicationManagementCenter(data: unknown): CommunicationManagementCenter | null {
  if (!data || typeof data !== "object") return null;
  const o = data as Record<string, unknown>;
  const overview = o.overview as Record<string, unknown> | undefined;
  const routes = o.routes as Record<string, string> | undefined;
  const reports = o.reports as Record<string, unknown> | undefined;

  return {
    found: Boolean(o.found),
    principle: typeof o.principle === "string" ? o.principle : undefined,
    overview: overview
      ? {
          unread_messages: Number(overview.unread_messages ?? 0),
          unread_notifications: Number(overview.unread_notifications ?? 0),
          pending_approvals: Number(overview.pending_approvals ?? 0),
          announcements: Number(overview.announcements ?? 0),
        }
      : undefined,
    inbox: parseMessages(o.inbox),
    direct_messages: parseMessages(o.direct_messages),
    announcements: Array.isArray(o.announcements) ? (o.announcements as CommAnnouncement[]) : [],
    notifications_preview: parseNotifications(o.notifications_preview),
    approvals_preview: Array.isArray(o.approvals_preview) ? (o.approvals_preview as CommApproval[]) : [],
    activity_preview: Array.isArray(o.activity_preview) ? (o.activity_preview as CommActivity[]) : [],
    department_feeds: Array.isArray(o.department_feeds) ? (o.department_feeds as CommunicationManagementCenter["department_feeds"]) : [],
    routes: routes ? { notifications: routes.notifications ?? "/app/notifications", approvals: routes.approvals ?? "/app/approvals", activity: routes.activity ?? "/app/activity" } : undefined,
    reports: reports ? { unread_messages: Number(reports.unread_messages ?? 0), notification_volume_30d: Number(reports.notification_volume_30d ?? 0) } : undefined,
  };
}

export function parseNotificationManagementCenter(data: unknown): NotificationManagementCenter | null {
  if (!data || typeof data !== "object") return null;
  const o = data as Record<string, unknown>;
  const overview = o.overview as Record<string, unknown> | undefined;
  return {
    found: Boolean(o.found),
    principle: typeof o.principle === "string" ? o.principle : undefined,
    overview: overview
      ? { unread: Number(overview.unread ?? 0), critical: Number(overview.critical ?? 0), attention_required: Number(overview.attention_required ?? 0) }
      : undefined,
    notifications: parseNotifications(o.notifications),
    communications_route: typeof o.communications_route === "string" ? o.communications_route : undefined,
  };
}

export function parseActivityFeedCenter(data: unknown): ActivityFeedCenter | null {
  if (!data || typeof data !== "object") return null;
  const o = data as Record<string, unknown>;
  return {
    found: Boolean(o.found),
    principle: typeof o.principle === "string" ? o.principle : undefined,
    activity: Array.isArray(o.activity) ? (o.activity as CommActivity[]) : [],
    recent_tasks: Array.isArray(o.recent_tasks) ? (o.recent_tasks as ActivityFeedCenter["recent_tasks"]) : [],
    recent_documents: Array.isArray(o.recent_documents) ? (o.recent_documents as ActivityFeedCenter["recent_documents"]) : [],
    communications_route: typeof o.communications_route === "string" ? o.communications_route : undefined,
  };
}

export function parseUnifiedApprovalCenter(data: unknown): UnifiedApprovalCenter | null {
  if (!data || typeof data !== "object") return null;
  const o = data as Record<string, unknown>;
  const routes = o.routes as Record<string, string> | undefined;
  return {
    found: Boolean(o.found),
    principle: typeof o.principle === "string" ? o.principle : undefined,
    pending: Array.isArray(o.pending) ? (o.pending as CommApproval[]) : [],
    pending_count: Number(o.pending_count ?? 0),
    routes: routes ? { trust_approvals: routes.trust_approvals ?? "/app/approvals", communications: routes.communications ?? "/app/communications" } : undefined,
  };
}
