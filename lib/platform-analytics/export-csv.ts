import type { PlatformAnalyticsOverview } from "./overview";
import type { PlatformAnalyticsJourney } from "./journey";
import type { PlatformAnalyticsSalesPartners } from "./sales-partners";
import type { PlatformProductAnalytics } from "./products";

function esc(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

function cell(value: string | number | null | undefined): string {
  if (value == null) return "";
  return esc(String(value));
}

export function buildPlatformAnalyticsOverviewCsv(overview: PlatformAnalyticsOverview): string {
  const lines = [
    ["metric_id", "value", "available", "period", "generated_at"].map(esc).join(","),
  ];
  for (const [key, metric] of Object.entries(overview.metrics)) {
    lines.push(
      [
        cell(metric.id || key),
        cell(metric.available ? metric.value : null),
        cell(metric.available ? "true" : "false"),
        cell(overview.periodKey),
        cell(overview.generatedAt),
      ].join(","),
    );
  }
  return `${lines.join("\n")}\n`;
}

export function buildPlatformAnalyticsBundleCsv(input: {
  overview: PlatformAnalyticsOverview;
  journey: PlatformAnalyticsJourney;
  products: PlatformProductAnalytics;
  salesPartners: PlatformAnalyticsSalesPartners;
}): string {
  const lines = [
    ["section", "key", "value", "status", "source", "generated_at"].map(esc).join(","),
  ];
  for (const metric of Object.values(input.overview.metrics)) {
    lines.push(
      [
        cell("overview"),
        cell(metric.id),
        cell(metric.available ? metric.value : null),
        cell(metric.available ? "available" : "unavailable"),
        cell(metric.definitionId ?? ""),
        cell(input.overview.generatedAt),
      ].join(","),
    );
  }
  for (const step of input.journey.steps) {
    lines.push(
      [
        cell("journey"),
        cell(step.id),
        cell(step.count),
        cell(step.status),
        cell(step.source),
        cell(input.journey.generatedAt),
      ].join(","),
    );
  }
  for (const row of input.products.rows) {
    lines.push(
      [
        cell("product"),
        cell(row.key),
        cell(row.usageCount),
        cell(row.status),
        cell(row.source),
        cell(input.products.generatedAt),
      ].join(","),
    );
  }
  for (const [key, value] of Object.entries(input.salesPartners.metrics)) {
    lines.push(
      [
        cell("sales_partners"),
        cell(key),
        cell(value),
        cell(input.salesPartners.available ? "available" : "unavailable"),
        cell("csp_get_platform_overview"),
        cell(input.salesPartners.generatedAt),
      ].join(","),
    );
  }
  return `${lines.join("\n")}\n`;
}
