import type { PaymentAnalyticsCenter } from "./types";
import { computeExecutiveSnapshot, generateExecutiveInsights } from "./derived";

function escapeCsv(value: string | number): string {
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function buildPaymentAnalyticsCsv(
  center: PaymentAnalyticsCenter,
  title = "Payment Analytics Export"
): string {
  const executive = computeExecutiveSnapshot(center);
  const lines: string[] = [];

  lines.push(title);
  lines.push("");
  lines.push("Executive Snapshot");
  lines.push(`Total Revenue,${executive.total_revenue}`);
  lines.push(`Recurring Revenue,${executive.recurring_revenue}`);
  lines.push(`Revenue Growth %,${executive.revenue_growth_pct}`);
  lines.push(`Payment Success Rate,${executive.payment_success_rate}`);
  lines.push("");

  lines.push("Overview");
  lines.push(`Revenue Today,${center.overview.revenue_today}`);
  lines.push(`Revenue This Month,${center.overview.revenue_this_month}`);
  lines.push(`Active Subscriptions,${center.overview.active_subscriptions}`);
  lines.push(`Failed Payments,${center.overview.failed_payments}`);
  lines.push(`Average Revenue Per Customer,${center.overview.average_revenue_per_customer}`);
  lines.push(`Churned Subscriptions,${center.overview.churned_subscriptions}`);
  lines.push("");

  lines.push("Provider Breakdown (30d)");
  lines.push("Provider,Revenue,Transactions,Success Rate,Refunds,Failed");
  for (const row of center.provider_breakdown) {
    lines.push(
      [
        row.provider_key,
        row.revenue_30d,
        row.transactions,
        row.success_rate,
        row.refunds,
        row.failed_payments,
      ]
        .map(escapeCsv)
        .join(",")
    );
  }
  lines.push("");

  lines.push("Top Enterprise Customers");
  lines.push("Customer,Revenue,Open Invoices,Last Payment,Status");
  for (const row of center.top_enterprise_customers) {
    lines.push(
      [row.customer, row.revenue, row.open_invoices, row.last_payment ?? "", row.status]
        .map(escapeCsv)
        .join(",")
    );
  }
  lines.push("");

  lines.push("Failed Payment Insights");
  lines.push("Customer,Provider,Failure Reason,Retry Count,Recommended Action,Date");
  for (const row of center.failed_payment_insights) {
    lines.push(
      [
        row.customer,
        row.provider,
        row.failure_reason,
        row.retry_count,
        row.recommended_action,
        row.transaction_at,
      ]
        .map(escapeCsv)
        .join(",")
    );
  }

  return lines.join("\n");
}

export function buildPaymentAnalyticsPdfText(
  center: PaymentAnalyticsCenter,
  title = "AIPIFY PAYMENT ANALYTICS CENTER"
): string {
  const executive = computeExecutiveSnapshot(center);
  const insights = generateExecutiveInsights(center);

  const sections = [
    title,
    "================================",
    "",
    "EXECUTIVE SNAPSHOT",
    `Total Revenue: ${executive.total_revenue} ${executive.currency}`,
    `Recurring Revenue (MRR): ${executive.recurring_revenue} ${executive.currency}`,
    `Revenue Growth: ${executive.revenue_growth_pct}%`,
    `Payment Success Rate: ${executive.payment_success_rate}%`,
    `Net Revenue After Refunds: ${executive.net_revenue_after_refunds} ${executive.currency}`,
    "",
    "OVERVIEW",
    `Revenue Today: ${center.overview.revenue_today} ${center.overview.currency}`,
    `Revenue This Month: ${center.overview.revenue_this_month} ${center.overview.currency}`,
    `Active Subscriptions: ${center.overview.active_subscriptions}`,
    `Failed Payments: ${center.overview.failed_payments}`,
    "",
    "PROVIDER BREAKDOWN (30d)",
    ...center.provider_breakdown.map(
      (p) =>
        `${p.provider_key}: ${p.revenue_30d} revenue · ${p.transactions} tx · ${p.success_rate}% success`
    ),
    "",
    "EXECUTIVE INSIGHTS",
    ...insights.map((insight) => `- ${insight.observation}`),
  ];

  return sections.join("\n");
}

export function exportTitleForFormat(format: string): string {
  switch (format) {
    case "board_report":
      return "AIPIFY PAYMENT ANALYTICS — BOARD REPORT";
    case "executive_summary":
      return "AIPIFY PAYMENT ANALYTICS — EXECUTIVE SUMMARY";
    case "finance_fiken":
      return "AIPIFY PAYMENT ANALYTICS — FINANCE EXPORT (FIKEN)";
    case "auditor_package":
      return "AIPIFY PAYMENT ANALYTICS — AUDITOR PACKAGE";
    case "quarterly_revenue":
      return "AIPIFY PAYMENT ANALYTICS — QUARTERLY REVENUE REPORT";
    default:
      return "AIPIFY PAYMENT ANALYTICS CENTER";
  }
}

export function exportFilenameForFormat(format: string): string {
  const base = format.replace(/_/g, "-");
  if (format === "xlsx") return "payment-analytics.xlsx";
  if (format === "pdf" || format.includes("report") || format.includes("summary") || format.includes("package") || format.includes("fiken") || format.includes("quarterly")) {
    return `${base}.pdf`;
  }
  return "payment-analytics.csv";
}
