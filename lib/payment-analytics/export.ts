import type { PaymentAnalyticsCenter } from "@/lib/payment-analytics/types";

function escapeCsv(value: string | number): string {
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function buildPaymentAnalyticsCsv(center: PaymentAnalyticsCenter): string {
  const lines: string[] = [];

  lines.push("Payment Analytics Export");
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

export function buildPaymentAnalyticsPdfText(center: PaymentAnalyticsCenter): string {
  const sections = [
    "AIPIFY PAYMENT ANALYTICS CENTER",
    "================================",
    "",
    "OVERVIEW",
    `Revenue Today: ${center.overview.revenue_today} ${center.overview.currency}`,
    `Revenue This Month: ${center.overview.revenue_this_month} ${center.overview.currency}`,
    `Active Subscriptions: ${center.overview.active_subscriptions}`,
    `Failed Payments: ${center.overview.failed_payments}`,
    `Average Revenue Per Customer: ${center.overview.average_revenue_per_customer}`,
    `Churned Subscriptions: ${center.overview.churned_subscriptions}`,
    "",
    "PROVIDER BREAKDOWN (30d)",
    ...center.provider_breakdown.map(
      (p) =>
        `${p.provider_key}: ${p.revenue_30d} revenue · ${p.transactions} tx · ${p.success_rate}% success`
    ),
    "",
    "CUSTOMER SEGMENTS (30d)",
    `Self-Service: ${center.segments.self_service} ${center.segments.currency}`,
    `Enterprise: ${center.segments.enterprise} ${center.segments.currency}`,
  ];

  return sections.join("\n");
}
