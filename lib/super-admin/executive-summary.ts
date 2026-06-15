import type { SuperAdminActionItem, SuperAdminControlCenter } from "./types";

export const SUPER_ADMIN_MONITORING_AREAS = 12;

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
  monitoringAreas: string;
  allSystemsOperational: string;
  subscriptionsReview: string;
  growthPartnerActivity: string;
  marketplaceReviews: string;
  paymentProviderIncomplete: string;
  criticalIncidents: string;
  noInterventionRequired: string;
  platformStable: string;
  attentionRequiredToday: string;
  estimatedReviewTime: string;
};

function timeGreeting(labels: ExecutiveSummaryLabels): string {
  const hour = new Date().getHours();
  if (hour < 12) return labels.greetingMorning;
  if (hour < 18) return labels.greetingAfternoon;
  return labels.greetingEvening;
}

export function countAttentionItems(center: SuperAdminControlCenter): number {
  let count = 0;
  if ((center.critical_incidents ?? 0) > 0) count += 1;
  if ((center.subscriptions_requiring_review ?? 0) > 0) count += 1;
  if ((center.growth_partner_applications_pending ?? 0) > 0) count += 1;
  if ((center.marketplace_reviews_pending ?? 0) > 0) count += 1;
  if (center.payment_provider_incomplete) count += 1;
  return count;
}

export function estimateReviewMinutes(center: SuperAdminControlCenter): number {
  const items = countAttentionItems(center);
  if (items === 0) return 0;
  return Math.max(3, items * 3);
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
    {
      id: "monitoring",
      text: labels.monitoringAreas.replace("{count}", String(SUPER_ADMIN_MONITORING_AREAS)),
    },
  ];

  const critical = center.critical_incidents ?? 0;
  const subsReview = center.subscriptions_requiring_review ?? 0;
  const growthPending = center.growth_partner_applications_pending ?? 0;
  const marketplacePending = center.marketplace_reviews_pending ?? 0;
  const attentionCount = countAttentionItems(center);
  const platformOk =
    (center.platform_status ?? "operational") === "operational" && critical === 0;

  if (attentionCount > 0) {
    lines.push({
      id: "attention",
      text: labels.attentionRequiredToday.replace("{count}", String(attentionCount)),
      emphasis: true,
    });
    lines.push({
      id: "review-time",
      text: labels.estimatedReviewTime.replace("{minutes}", String(estimateReviewMinutes(center))),
    });
  } else if (platformOk) {
    lines.push({ id: "systems", text: labels.allSystemsOperational });
    lines.push({ id: "stable", text: labels.noInterventionRequired });
  }

  if (critical > 0) {
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

  if (center.payment_provider_incomplete) {
    lines.push({
      id: "payments",
      text: labels.paymentProviderIncomplete,
      href: "/platform/payment-providers",
    });
  }

  if (attentionCount > 0 && critical === 0) {
    lines.push({ id: "stable-soft", text: labels.platformStable });
  }

  return lines.slice(0, 8);
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
    paymentProviderSetup: string;
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
      impact: "high",
      estimated_minutes: 10,
      section: "critical",
    });
  }

  if ((center.subscriptions_requiring_review ?? 0) > 0) {
    items.push({
      id: "billing",
      category: "billing",
      message: messages.subscriptionReview,
      href: "/platform/subscriptions",
      priority: "attention",
      impact: "high",
      estimated_minutes: 8,
      section: "requires_approval",
    });
  }

  if ((center.growth_partner_applications_pending ?? 0) > 0) {
    items.push({
      id: "growth",
      category: "growthPartners",
      message: messages.growthPartnerApplications,
      href: "/platform/pilot-operations",
      priority: "attention",
      impact: "medium",
      estimated_minutes: 6,
      section: "requires_approval",
    });
  }

  if ((center.marketplace_reviews_pending ?? 0) > 0) {
    items.push({
      id: "marketplace",
      category: "installations",
      message: messages.marketplaceReviews,
      href: "/platform/skills",
      priority: "attention",
      impact: "medium",
      estimated_minutes: 5,
      section: "requires_approval",
    });
  }

  if (center.payment_provider_incomplete) {
    items.push({
      id: "payments",
      category: "billing",
      message: messages.paymentProviderSetup,
      href: "/platform/payment-providers",
      priority: "attention",
      impact: "high",
      estimated_minutes: 12,
      section: "requires_approval",
    });
  }

  if ((center.active_organizations ?? 0) > 0) {
    items.push({
      id: "customers",
      category: "customers",
      message: messages.organizationHealth,
      href: "/platform/customers",
      priority: "informational",
      impact: "low",
      estimated_minutes: 4,
      section: "recommended",
    });
  }

  items.push({
    id: "support",
    category: "support",
    message: messages.supportEscalations,
    href: "/platform/support",
    priority: "informational",
    impact: "medium",
    estimated_minutes: 5,
    section: "recommended",
  });

  items.push({
    id: "security",
    category: "security",
    message: messages.globalGovernance,
    href: "/platform/trust/audit",
    priority: "informational",
    impact: "low",
    estimated_minutes: 3,
    section: "milestones",
  });

  return items;
}

export function countActionItemsRequiringReview(center: SuperAdminControlCenter): number {
  return countAttentionItems(center);
}
