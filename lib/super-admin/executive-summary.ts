import type { SuperAdminActionItem, SuperAdminControlCenter } from "./types";

export type ExecutiveSummaryLine = {
  id: string;
  text: string;
  emphasis?: boolean;
  href?: string;
};

export type ExecutiveSummaryLabels = {
  greetingMorning: string;
  greetingAfternoon: string;
  greetingEvening: string;
  allSystemsOperational: string;
  subscriptionsReview: string;
  growthPartnerActivity: string;
  marketplaceReviews: string;
  criticalIncidents: string;
  noInterventionRequired: string;
  platformStable: string;
};

function timeGreeting(labels: ExecutiveSummaryLabels): string {
  const hour = new Date().getHours();
  if (hour < 12) return labels.greetingMorning;
  if (hour < 18) return labels.greetingAfternoon;
  return labels.greetingEvening;
}

export function buildExecutiveSummary(
  center: SuperAdminControlCenter,
  labels: ExecutiveSummaryLabels
): ExecutiveSummaryLine[] {
  const name = center.display_name ?? "Administrator";
  const lines: ExecutiveSummaryLine[] = [
    {
      id: "greeting",
      text: timeGreeting(labels).replace("{name}", name),
      emphasis: true,
    },
  ];

  const critical = center.critical_incidents ?? 0;
  const subsReview = center.subscriptions_requiring_review ?? 0;
  const growthPending = center.growth_partner_applications_pending ?? 0;
  const marketplacePending = center.marketplace_reviews_pending ?? 0;
  const platformOk =
    (center.platform_status ?? "operational") === "operational" && critical === 0;

  if (platformOk) {
    lines.push({ id: "systems", text: labels.allSystemsOperational });
  } else if (critical > 0) {
    lines.push({
      id: "critical",
      text: labels.criticalIncidents.replace("{count}", String(critical)),
      href: "/platform/support",
    });
  }

  if (subsReview > 0) {
    lines.push({
      id: "subscriptions",
      text: labels.subscriptionsReview.replace("{count}", String(subsReview)),
      href: "/platform/subscriptions",
    });
  }

  if (growthPending > 0) {
    lines.push({
      id: "growth",
      text: labels.growthPartnerActivity.replace("{count}", String(growthPending)),
      href: "/platform/pilot-operations",
    });
  }

  if (marketplacePending > 0) {
    lines.push({
      id: "marketplace",
      text: labels.marketplaceReviews.replace("{count}", String(marketplacePending)),
      href: "/platform/skills",
    });
  }

  if (critical === 0 && subsReview === 0) {
    lines.push({ id: "stable", text: labels.noInterventionRequired });
  } else if (critical === 0) {
    lines.push({ id: "stable-soft", text: labels.platformStable });
  }

  return lines.slice(0, 5);
}

export function buildActionCenterItems(
  center: SuperAdminControlCenter,
  messages: {
    criticalIncidents: string;
    subscriptionReview: string;
    growthPartnerApplications: string;
    marketplaceReviews: string;
    organizationHealth: string;
    supportEscalations: string;
    globalGovernance: string;
  }
): SuperAdminActionItem[] {
  const items: SuperAdminActionItem[] = [];

  if ((center.critical_incidents ?? 0) > 0) {
    items.push({
      id: "incidents",
      category: "security",
      message: messages.criticalIncidents,
      href: "/platform/support",
      priority: "critical",
    });
  }

  if ((center.subscriptions_requiring_review ?? 0) > 0) {
    items.push({
      id: "billing",
      category: "billing",
      message: messages.subscriptionReview,
      href: "/platform/subscriptions",
      priority: "attention",
    });
  }

  if ((center.growth_partner_applications_pending ?? 0) > 0) {
    items.push({
      id: "growth",
      category: "growthPartners",
      message: messages.growthPartnerApplications,
      href: "/platform/pilot-operations",
      priority: "attention",
    });
  }

  if ((center.marketplace_reviews_pending ?? 0) > 0) {
    items.push({
      id: "marketplace",
      category: "installations",
      message: messages.marketplaceReviews,
      href: "/platform/skills",
      priority: "attention",
    });
  }

  if ((center.active_organizations ?? 0) > 0) {
    items.push({
      id: "customers",
      category: "customers",
      message: messages.organizationHealth,
      href: "/platform/customers",
      priority: "informational",
    });
  }

  items.push({
    id: "support",
    category: "support",
    message: messages.supportEscalations,
    href: "/platform/support",
    priority: "informational",
  });

  items.push({
    id: "security",
    category: "security",
    message: messages.globalGovernance,
    href: "/platform/trust/audit",
    priority: "informational",
  });

  return items;
}

export function countActionItemsRequiringReview(center: SuperAdminControlCenter): number {
  let count = 0;
  if ((center.subscriptions_requiring_review ?? 0) > 0) count += 1;
  if ((center.growth_partner_applications_pending ?? 0) > 0) count += 1;
  if ((center.marketplace_reviews_pending ?? 0) > 0) count += 1;
  if ((center.critical_incidents ?? 0) > 0) count += 1;
  return count;
}
