import type {
  PaymentOperationsAlert,
  PaymentOperationsAuditEntry,
  PaymentOperationsCenter,
  SettlementRecord,
} from "./types";
import type { AuditFilterCategory } from "./constants";
import type { OperationsIndicator } from "./types";

export type ExecutivePaymentSummary = {
  health_score: number;
  health_label: OperationsIndicator;
  critical_provider_status: "operational" | "degraded";
  warnings_count: number;
  next_settlement_provider: string | null;
  next_settlement_date: string | null;
  expected_settlement_total: number;
  pending_settlement_total: number;
  currency: string;
};

export type SettlementColumnTotals = {
  today: number;
  pending: number;
  failed: number;
  currency: string;
};

export type AlertQuickAction = {
  label_key: "reviewProvider" | "viewLogs" | "runDiagnostic";
  href: string;
};

const CRITICAL_PROVIDER_KEYS = new Set(["stripe", "vipps", "klarna"]);

export function sumSettlementAmount(items: SettlementRecord[]): number {
  return items.reduce((acc, item) => acc + item.amount, 0);
}

export function formatSettlementDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

export function computeSettlementTotals(
  settlements: PaymentOperationsCenter["settlements"],
  currency: string
): SettlementColumnTotals {
  return {
    today: sumSettlementAmount(settlements.today),
    pending: sumSettlementAmount(settlements.pending),
    failed: sumSettlementAmount(settlements.failed),
    currency,
  };
}

export function computeExecutiveSummary(center: PaymentOperationsCenter): ExecutivePaymentSummary {
  const { summary, providers, settlements, alerts } = center;
  const currency = summary.monthly_transaction_currency || "NOK";
  const warningCount = alerts.filter((alert) => alert.severity === "warning").length;
  const criticalCount = alerts.filter((alert) => alert.severity === "critical").length;
  const operationalCount = providers.filter((provider) => provider.status === "operational").length;
  const totalProviders = providers.length || 1;

  let healthScore = Math.round((operationalCount / totalProviders) * 100);
  healthScore -= warningCount * 2;
  healthScore -= criticalCount * 5;
  healthScore -= Math.min(summary.failed_payment_events * 2, 10);
  healthScore -= settlements.failed.length * 3;
  healthScore = Math.max(0, Math.min(100, healthScore));

  const criticalDegraded = providers.some(
    (provider) =>
      CRITICAL_PROVIDER_KEYS.has(provider.provider_key) &&
      provider.enabled &&
      provider.status !== "operational"
  );

  const pendingTotal = sumSettlementAmount(settlements.pending);
  const todayTotal = sumSettlementAmount(settlements.today);
  const expectedTotal = todayTotal + pendingTotal;

  const nextPending = [...settlements.pending]
    .filter((item) => item.estimated_payout_date)
    .sort((a, b) => {
      const aTime = new Date(a.estimated_payout_date!).getTime();
      const bTime = new Date(b.estimated_payout_date!).getTime();
      return aTime - bTime;
    })[0];

  let healthLabel: OperationsIndicator = "healthy";
  if (healthScore < 85 || criticalDegraded) healthLabel = "attention";
  if (healthScore < 70 || criticalCount > 0) healthLabel = "critical";
  if (healthScore >= 95 && warningCount === 0 && !criticalDegraded) healthLabel = "healthy";

  return {
    health_score: healthScore,
    health_label: healthLabel,
    critical_provider_status: criticalDegraded ? "degraded" : "operational",
    warnings_count: warningCount,
    next_settlement_provider: nextPending?.provider_key ?? null,
    next_settlement_date: nextPending?.estimated_payout_date ?? null,
    expected_settlement_total: expectedTotal,
    pending_settlement_total: pendingTotal,
    currency,
  };
}

export function getOperationsMetricIndicator(
  metric:
    | "activeProviders"
    | "countriesSupported"
    | "pendingSetups"
    | "enterpriseCustomers"
    | "monthlyVolume"
    | "failedEvents",
  center: PaymentOperationsCenter
): OperationsIndicator {
  const { summary, providers } = center;

  switch (metric) {
    case "activeProviders":
      return providers.every((provider) => provider.status === "operational")
        ? "healthy"
        : summary.pending_provider_setups > 0
          ? "attention"
          : "critical";
    case "failedEvents":
      return summary.failed_payment_events === 0
        ? "healthy"
        : summary.failed_payment_events <= 2
          ? "attention"
          : "critical";
    case "monthlyVolume":
      return summary.failed_payment_events > 0 ? "attention" : "stable";
    case "pendingSetups":
      return summary.pending_provider_setups === 0
        ? "healthy"
        : summary.pending_provider_setups <= 1
          ? "attention"
          : "critical";
    case "countriesSupported":
    case "enterpriseCustomers":
      return "stable";
    default:
      return "stable";
  }
}

export function categorizeAuditEntry(entry: PaymentOperationsAuditEntry): AuditFilterCategory {
  const action = entry.action.toLowerCase();
  if (action.includes("webhook")) return "webhooks";
  if (action.includes("invoice") || action.includes("terms")) return "invoices";
  if (action.includes("settlement")) return "settlements";
  if (action.includes("payment")) return "payments";
  if (action.includes("security") || action.includes("credential")) return "security";
  if (
    action.includes("production") ||
    action.includes("enabled") ||
    action.includes("configured") ||
    action.includes("updated")
  ) {
    return entry.provider_key ? "providers" : "configuration";
  }
  return entry.provider_key ? "providers" : "configuration";
}

export function deriveAlertQuickAction(alert: PaymentOperationsAlert): AlertQuickAction {
  const href = alert.provider_key
    ? `/platform/payment-providers?provider=${alert.provider_key}`
    : "/platform/payment-providers";

  switch (alert.alert_type) {
    case "settlement_delay":
      return { label_key: "reviewProvider", href };
    case "webhook_health":
      return { label_key: "runDiagnostic", href };
    case "provider_outage":
    case "security_incident":
      return { label_key: "viewLogs", href: "/platform/trust" };
    default:
      return {
        label_key: alert.severity === "critical" ? "viewLogs" : "reviewProvider",
        href,
      };
  }
}

export function deriveAlertRecommendedAction(alert: PaymentOperationsAlert): string {
  switch (alert.alert_type) {
    case "settlement_delay":
      return "settlement_delay";
    case "webhook_health":
      return "webhook_interruption";
    case "provider_outage":
      return "provider_outage";
    case "security_incident":
      return "security_incident";
    case "provider_status":
      return "operational_update";
    default:
      return alert.severity === "warning" ? "review_recommended" : "monitor";
  }
}

export function filterAuditEntries(
  entries: PaymentOperationsAuditEntry[],
  category: AuditFilterCategory
): PaymentOperationsAuditEntry[] {
  if (category === "all") return entries;
  return entries.filter((entry) => categorizeAuditEntry(entry) === category);
}
