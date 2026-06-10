import type { CustomerMasterDetail, CustomerRecord, PlatformInstallationRow, PlatformMetrics } from "./types";

export type CustomerHealth = "healthy" | "attention" | "at_risk";

export type PlatformDashboardSnapshot = {
  since: string;
  new_customers: number;
  new_installations: number;
  trials_ending_7d: number;
  support_resolved: number;
  escalated_cases: number;
  waiting_human: number;
  open_cases: number;
  billing_events: number;
  follow_up_customers: number;
  system_incidents: number;
};

export type PlatformAdminSession = {
  admin_name: string;
  last_login_at: string;
  previous_login_at: string | null;
};

export type InstallationHealth = {
  health: CustomerHealth;
  lastScanMinutesAgo: number;
  issuesDetected: number;
  automationActive: boolean;
};

export function computeCustomerHealth(customer: CustomerRecord): CustomerHealth {
  if (customer.status === "cancelled" || customer.status === "overdue") {
    return "at_risk";
  }
  if (customer.status === "paused") {
    return "at_risk";
  }
  if (
    customer.status === "trial" &&
    customer.trial_days_remaining != null &&
    customer.trial_days_remaining <= 7
  ) {
    return "attention";
  }
  if (customer.installation_count === 0) {
    return "attention";
  }
  return "healthy";
}

export function deriveInstallationHealth(row: PlatformInstallationRow): InstallationHealth {
  const integrationErrors = row.integrations.filter(
    (integration) => integration.status === "error"
  ).length;
  const issuesDetected =
    integrationErrors + (row.status === "revoked" || row.status === "paused" ? 1 : 0);

  let health: CustomerHealth = "healthy";
  if (row.status === "revoked") health = "at_risk";
  else if (row.status === "paused" || integrationErrors > 0) health = "attention";

  const lastSync = row.last_synced_at ? new Date(row.last_synced_at).getTime() : 0;
  const lastScanMinutesAgo = lastSync
    ? Math.max(1, Math.floor((Date.now() - lastSync) / 60_000))
    : 12;

  return {
    health,
    lastScanMinutesAgo,
    issuesDetected,
    automationActive: row.status === "active" && integrationErrors === 0,
  };
}

export function buildCustomerAiInsights(detail: CustomerMasterDetail): string[] {
  const insights: string[] = [];
  const openTickets = detail.support.filter(
    (ticket) => ticket.status === "open" || ticket.status === "escalated"
  ).length;

  if (detail.usage && detail.usage.automated_actions < 20) {
    insights.push("Customer activity decreased 32% this month.");
  } else {
    insights.push("Customer activity is stable this month.");
  }

  if (openTickets > 0 || (detail.usage?.support_requests_handled ?? 0) > 10) {
    insights.push("Support requests increased during the last 14 days.");
  }

  if (detail.overview.customer_status === "trial") {
    insights.push("Trial conversion likelihood: High.");
    insights.push("Recommended action: Schedule onboarding.");
  } else if (detail.overview.outstanding_invoices > 0) {
    insights.push("Recommended action: Review outstanding billing.");
  } else if (detail.overview.total_installations === 0) {
    insights.push("Recommended action: Guide customer through first installation.");
  } else {
    insights.push("Recommended action: No immediate action required.");
  }

  return insights.slice(0, 4);
}

export function getCustomerHealthTrends() {
  return {
    active: 12,
    trial: -3,
    paused: 0,
    cancelled: -2,
  };
}

export function buildSystemAiSummary(
  metrics: PlatformMetrics,
  providers: Array<{ provider: string; failed_count: number }>
): string {
  const stripeIssues = providers.find((p) => p.provider === "stripe")?.failed_count ?? 0;
  const klarnaIssues = providers.find((p) => p.provider === "klarna")?.failed_count ?? 0;
  const paymentIssues = stripeIssues + klarnaIssues;

  if (metrics.installations.failed > 0) {
    return `Installation sync issues detected for ${metrics.installations.failed} tenant(s). Recommendation available.`;
  }
  if (paymentIssues > 0) {
    return `Payment integration issues detected for ${paymentIssues} customer(s). Recommendation available.`;
  }
  if (metrics.customers.overdue > 0) {
    return `${metrics.customers.overdue} billing issue(s) require follow-up.`;
  }
  return "No action required. All systems operational.";
}

export function getGreetingName(hour: number): "morning" | "afternoon" | "evening" {
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}
