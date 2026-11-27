import { compareTimestampsDesc, formatPlatformDateTimeClock } from "@/lib/platform-presentation-quality";
import type {
  SupportConversationEntry,
  SupportRequestDetail,
  SupportRequestItem,
  SupportRequestMessage,
  SupportRequestPriority,
  SupportRequestStatus,
  SupportInboxView,
} from "./types";

export function supportTicketReference(id: string): string {
  return id.slice(0, 8).toUpperCase();
}

export function formatSupportActivityAt(
  value: string | null | undefined,
  locale: string,
): string {
  return formatPlatformDateTimeClock(value, {
    locale,
    emptyFallback: "—",
    invalidFallback: "—",
  });
}

/**
 * Status tone for icon+text chips.
 * Resolved = soft green. Closed/archived = neutral grey (ended, not “success”).
 */
export function supportStatusTone(
  status: SupportRequestStatus,
): "open" | "waiting" | "resolved" | "closed" | "neutral" {
  switch (status) {
    case "waiting_for_customer":
    case "waiting_for_aipify":
      return "waiting";
    case "resolved":
      return "resolved";
    case "closed":
    case "archived":
      return "closed";
    case "open":
    case "in_review":
    case "reopened":
      return "open";
    default:
      return "neutral";
  }
}

export function supportPriorityTone(
  priority: SupportRequestPriority,
): "low" | "medium" | "high" | "urgent" {
  return priority;
}

export const SUPPORT_INBOX_VIEW_STATUSES: Record<SupportInboxView, SupportRequestStatus[] | null> = {
  all: null,
  open: ["open", "in_review", "waiting_for_aipify", "reopened"],
  waiting: ["waiting_for_customer"],
  closed: ["resolved", "closed", "archived"],
};

export function filterItemsByInboxView(
  items: SupportRequestItem[],
  view: SupportInboxView,
): SupportRequestItem[] {
  const allowed = SUPPORT_INBOX_VIEW_STATUSES[view];
  if (!allowed) return items;
  return items.filter((item) => allowed.includes(item.status));
}

export function sortItemsByActivityDesc(items: SupportRequestItem[]): SupportRequestItem[] {
  return [...items].sort((a, b) => compareTimestampsDesc(a.updated_at, b.updated_at));
}

export function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0] ?? ""}${parts[1]![0] ?? ""}`.toUpperCase();
}

/**
 * Build a customer-visible conversation.
 * Prefer Core `messages` when present; otherwise description + compact status lines.
 * Never include internal notes or draft content.
 */
export function buildSupportConversation(
  detail: SupportRequestDetail,
  labels: {
    customerFallback: string;
    aipifyName: string;
    systemName: string;
    openingMessage: string;
    statusChanged: string;
  },
): SupportConversationEntry[] {
  const req = detail.request;
  if (!req) return [];

  const entries: SupportConversationEntry[] = [];

  const messages = detail.messages ?? [];
  if (messages.length > 0) {
    for (const message of messages) {
      if (message.visibility && message.visibility !== "customer_visible") continue;
      entries.push(messageToEntry(message, labels));
    }
  } else {
    entries.push({
      id: `opening:${req.id}`,
      kind: "message",
      side: "customer",
      author_name: req.created_by || labels.customerFallback,
      body: req.description_full || req.description || labels.openingMessage,
      created_at: req.created_at,
    });
  }

  for (const event of detail.status_history ?? []) {
    if (!event.at) continue;
    entries.push({
      id: `status:${event.at}:${event.status}`,
      kind: "status",
      side: "system",
      author_name: labels.systemName,
      body: event.description?.trim() || `${labels.statusChanged}: ${event.status}`,
      created_at: event.at,
      status: event.status,
    });
  }

  // Deduplicate by id; newest first.
  const seen = new Set<string>();
  const unique = entries.filter((entry) => {
    if (seen.has(entry.id)) return false;
    seen.add(entry.id);
    return true;
  });
  unique.sort((a, b) => compareTimestampsDesc(a.created_at, b.created_at));
  return unique;
}

function messageToEntry(
  message: SupportRequestMessage,
  labels: { customerFallback: string; aipifyName: string },
): SupportConversationEntry {
  const role = (message.author_role || "").toLowerCase();
  const isAipify =
    role.includes("platform") ||
    role.includes("support") ||
    role.includes("aipify") ||
    role === "agent";
  return {
    id: message.id,
    kind: "message",
    side: isAipify ? "aipify" : "customer",
    author_name:
      message.author_name ||
      (isAipify ? labels.aipifyName : labels.customerFallback),
    body: message.body,
    created_at: message.created_at,
  };
}

export function lastVisiblePreview(item: SupportRequestItem): string {
  const excerpt = item.last_message_excerpt?.trim();
  if (excerpt) return excerpt;
  return item.description?.trim() || "";
}
