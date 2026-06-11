import type { ChatIntentResult, DesktopNotification } from "./types";

const OPEN_APPROVALS = /\b(open|show|go to)\s+approvals?\b/i;
const REMIND_PATTERN =
  /\bremind\s+me\b.*?(tomorrow|today|monday|tuesday|wednesday|thursday|friday|saturday|sunday|\d{4}-\d{2}-\d{2})/i;
const TIME_PATTERN = /(\d{1,2}:\d{2}|\d{1,2}\s*(am|pm))/i;
const WHY_NOTIFY = /\bwhy\s+(did\s+you\s+)?notify\b/i;
const IMPORTANT_NOW = /\b(what\s+is\s+important|what'?s\s+important|priorities|top\s+priorities)\b/i;
const OPEN_QUALITY = /\b(open|show)\s+quality\b/i;
const OPEN_BRIEFING = /\b(open|show)\s+briefing\b/i;

function parseReminderDueAt(message: string): string {
  const lower = message.toLowerCase();
  const now = new Date();
  let target = new Date(now);

  if (lower.includes("tomorrow")) {
    target.setDate(target.getDate() + 1);
  }

  const timeMatch = message.match(TIME_PATTERN);
  if (timeMatch) {
    const raw = timeMatch[1].replace(/\s+/g, "");
    const parts = raw.match(/^(\d{1,2})(?::(\d{2}))?(am|pm)?$/i);
    if (parts) {
      let hours = parseInt(parts[1], 10);
      const minutes = parts[2] ? parseInt(parts[2], 10) : 0;
      const meridiem = parts[3]?.toLowerCase();
      if (meridiem === "pm" && hours < 12) hours += 12;
      if (meridiem === "am" && hours === 12) hours = 0;
      target.setHours(hours, minutes, 0, 0);
    }
  } else {
    target.setHours(9, 0, 0, 0);
  }

  return target.toISOString();
}

function summarizePriorities(notifications: DesktopNotification[]): string {
  if (notifications.length === 0) {
    return "Everything looks calm right now. No critical items need your attention.";
  }
  const lines = notifications.slice(0, 5).map((n, i) => {
    const sev = n.severity === "critical" || n.severity === "high" ? "⚠ " : "• ";
    return `${sev}${i + 1}. ${n.title}`;
  });
  return `Here are your top priorities:\n${lines.join("\n")}`;
}

export function resolveDesktopChatIntent(
  message: string,
  context: { notifications?: DesktopNotification[]; lastNotification?: DesktopNotification | null }
): ChatIntentResult {
  const trimmed = message.trim();
  if (!trimmed) {
    return { intent: "empty", reply: "Ask me what is important, open approvals, or set a reminder." };
  }

  if (IMPORTANT_NOW.test(trimmed)) {
    return {
      intent: "priorities",
      reply: summarizePriorities(context.notifications ?? []),
    };
  }

  if (OPEN_APPROVALS.test(trimmed)) {
    return {
      intent: "navigate",
      reply: "Opening Approval Center.",
      action_href: "/app/approvals",
    };
  }

  if (OPEN_QUALITY.test(trimmed)) {
    return {
      intent: "navigate",
      reply: "Opening Quality Guardian.",
      action_href: "/app/quality",
    };
  }

  if (OPEN_BRIEFING.test(trimmed)) {
    return {
      intent: "navigate",
      reply: "Opening your briefing.",
      action_href: "/app/briefing",
    };
  }

  if (REMIND_PATTERN.test(trimmed)) {
    const due_at = parseReminderDueAt(trimmed);
    const title = trimmed.replace(/^remind me\s+(to\s+)?/i, "").slice(0, 120) || "Reminder";
    return {
      intent: "reminder",
      reply: `I'll remind you at ${new Date(due_at).toLocaleString()}.`,
      reminder: { title, due_at, reminder_type: "personal" },
    };
  }

  if (WHY_NOTIFY.test(trimmed)) {
    const n = context.lastNotification;
    if (!n) {
      return {
        intent: "explain",
        reply: "I have not sent you a recent notification. Check Desktop Companion history for past alerts.",
      };
    }
    return {
      intent: "explain",
      reply:
        n.explanation ??
        `I notified you about "${n.title}" from ${n.source_module} (${n.severity} severity). ${n.recommendation ?? "Review when convenient."}`,
      action_href: n.action_url ?? undefined,
    };
  }

  return {
    intent: "help",
    reply:
      "I can summarize priorities, open approvals or quality, explain notifications, or create reminders. Try: \"What is important right now?\"",
  };
}
