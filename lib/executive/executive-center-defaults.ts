import type { CommandCenterBundle } from "@/lib/notification/command-center-state";
import type { ExecutiveFeedEntry } from "@/lib/notification/executive-feed";
import type { PresenceNotification } from "@/lib/presence/notification-state";

export type ExecutiveActionCardModel = {
  id: string;
  title: string;
  detail: string;
  actionLabel: string;
  href?: string;
  actionId?: string;
  tone?: "default" | "attention" | "positive";
};

export type OrganizationHealthMetric = {
  id: string;
  label: string;
  value: string;
  status: "healthy" | "attention" | "neutral";
};

export function buildDefaultExecutiveFeed(
  labels: string[],
): ExecutiveFeedEntry[] {
  return labels.map((message, index) => ({
    id: `default-feed-${index}`,
    time_label: "",
    message,
    level: "informational",
    created_at: new Date().toISOString(),
  }));
}

export function resolveExecutiveFeed(
  feed: ExecutiveFeedEntry[] | undefined,
  fallbackMessages: string[],
): ExecutiveFeedEntry[] {
  if (feed && feed.length > 0) return feed;
  return buildDefaultExecutiveFeed(fallbackMessages);
}

export function countEscalations(notifications: PresenceNotification[] = []): number {
  return notifications.filter(
    (item) => item.level === "action_required" || item.level === "critical",
  ).length;
}

export function countCriticalSecurityAlerts(
  notifications: PresenceNotification[] = [],
): number {
  return notifications.filter((item) => item.level === "critical").length;
}

export function buildExecutiveActionCards(
  bundle: CommandCenterBundle,
  labels: {
    pendingApprovals: { title: string; detail: (count: number) => string; action: string };
    escalations: { title: string; detail: (count: number) => string; action: string };
    executiveSummary: { title: string; detail: string; action: string };
    securityAlerts: { title: string; detail: (count: number) => string; action: string };
  },
): ExecutiveActionCardModel[] {
  const pending = bundle.pending_approvals ?? 0;
  const escalations = countEscalations(bundle.notifications);
  const critical = countCriticalSecurityAlerts(bundle.notifications);

  return [
    {
      id: "pending-approvals",
      title: labels.pendingApprovals.title,
      detail: labels.pendingApprovals.detail(pending),
      actionLabel: labels.pendingApprovals.action,
      href: "/app/approvals",
      tone: pending > 0 ? "attention" : "default",
    },
    {
      id: "escalations",
      title: labels.escalations.title,
      detail: labels.escalations.detail(escalations),
      actionLabel: labels.escalations.action,
      href: "/app/command-center#attention",
      tone: escalations > 0 ? "attention" : "default",
    },
    {
      id: "executive-summary",
      title: labels.executiveSummary.title,
      detail: bundle.executive_summary ?? labels.executiveSummary.detail,
      actionLabel: labels.executiveSummary.action,
      href: "/app/executive",
      tone: "default",
    },
    {
      id: "security-alerts",
      title: labels.securityAlerts.title,
      detail: labels.securityAlerts.detail(critical),
      actionLabel: labels.securityAlerts.action,
      href: "/app/settings/security",
      tone: critical > 0 ? "attention" : "positive",
    },
  ];
}

export function buildOrganizationHealthMetrics(
  score: number | undefined,
  labels: {
    operational: string;
    security: string;
    team: string;
    commerce: string;
  },
): OrganizationHealthMetric[] {
  const base = score ?? 82;
  const band = (value: number): OrganizationHealthMetric["status"] =>
    value >= 80 ? "healthy" : value >= 65 ? "neutral" : "attention";

  return [
    { id: "operational", label: labels.operational, value: `${Math.min(100, base + 2)}%`, status: band(base + 2) },
    { id: "security", label: labels.security, value: `${Math.min(100, base + 5)}%`, status: band(base + 5) },
    { id: "team", label: labels.team, value: `${Math.max(55, base - 4)}%`, status: band(base - 4) },
    { id: "commerce", label: labels.commerce, value: `${Math.min(100, base - 1)}%`, status: band(base - 1) },
  ];
}
