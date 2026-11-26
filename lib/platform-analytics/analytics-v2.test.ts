import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { buildPlatformAnalyticsJourney } from "./journey";
import { buildPlatformAnalyticsOverview } from "./overview";
import { parseAnalyticsPeriod } from "./period";
import { buildPlatformProductAnalytics } from "./products";
import { buildPlatformAnalyticsSalesPartners } from "./sales-partners";
import { buildPlatformAnalyticsBundleCsv } from "./export-csv";
import {
  buildCustomerGrowthSeries,
  buildMrrTrendSeries,
  estimateActiveCustomerTrend,
  estimateMrrGrowthPercent,
} from "@/lib/platform/metrics-dashboard";

const period = parseAnalyticsPeriod("30d");
const metrics = {
  customers: { total: 20, active: 12, trial: 3, cancelled: 2, paused: 1, overdue: 0 },
  revenue: { mrr: 1000, arr: 12000, outstanding_invoice_amount: 250 },
  growth: { new_customers_30d: 4, most_used_modules: ["website_kompis", "support"] },
  installations: { total: 9, active: 7, failed: 0 },
};

const overview = buildPlatformAnalyticsOverview({
  metrics,
  cspOverview: {
    approved_partners: 5,
    certified_partners: 2,
    academy: { partners_in_academy: 1 },
  },
  measurementIdConfigured: true,
  period,
});

assert.equal(overview.metrics.customersTotal.value, 20);
assert.equal(overview.metrics.customerRegistrationsPeriod.value, 4);
assert.equal(overview.metrics.activeSubscriptions.available, false);
assert.equal(overview.metrics.revenueMrr.value, 1000);
assert.equal(overview.metrics.revenueArr.value, 12000);

const otherPeriod = buildPlatformAnalyticsOverview({
  metrics,
  cspOverview: null,
  measurementIdConfigured: false,
  period: parseAnalyticsPeriod("7d"),
});
assert.equal(otherPeriod.metrics.customerRegistrationsPeriod.available, false);
assert.equal(otherPeriod.metrics.customerRegistrationsPeriod.limitedToCoreWindow, true);

const journey = buildPlatformAnalyticsJourney({
  metrics,
  period,
  measurementConfigured: true,
});
assert.equal(journey.steps[0]?.id, "visit");
assert.equal(journey.steps[0]?.status, "partial");
assert.ok(journey.steps.every((step) => step.status !== "available" || step.count != null));
assert.doesNotMatch(JSON.stringify(journey), /"conversion_rate":\s*88/);

const products = buildPlatformProductAnalytics({
  metrics,
  cspOverview: {
    products: [
      { product_key: "kompis_web", published: true, customers: 3 },
      { product_key: "aipify_voice", published: false },
    ],
  },
});
assert.ok(products.rows.some((row) => row.key === "kompis_web"));
assert.ok(!products.rows.some((row) => row.key === "aipify_voice"));

const sales = buildPlatformAnalyticsSalesPartners({
  cspOverview: { approved_partners: 5, certified_partners: 2 },
});
assert.equal(sales.metrics.approvedPartners, 5);
assert.equal(sales.metrics.certifiedPartners, 2);

const csv = buildPlatformAnalyticsBundleCsv({
  overview,
  journey,
  products,
  salesPartners: sales,
});
assert.match(csv, /overview/);
assert.match(csv, /journey/);
assert.doesNotMatch(csv, /partner_bank|iban/i);

assert.deepEqual(buildMrrTrendSeries(1000), []);
assert.deepEqual(buildCustomerGrowthSeries(4, 20), []);
assert.equal(estimateMrrGrowthPercent(metrics as never), null);
assert.equal(estimateActiveCustomerTrend(metrics as never), null);

const sqlPath = "docs/platform/sql-candidates/platform_analytics_metrics_enrichment_v2.sql";
const sql = readFileSync(join(process.cwd(), sqlPath), "utf8");
assert.match(sql, /PREPARED_ONLY/);
assert.match(sql, /'subscriptions'/);
assert.match(sql, /paid_active/);
const sha = createHash("sha256").update(sql).digest("hex");
assert.equal(sha, "7df1665d3564bde38ffc80f10767c6cdcf1a7bbb6ba6fea4033fcd3c54bd83be");

assert.match(
  readFileSync(join(process.cwd(), "app/platform/analytics/customer-journeys/page.tsx"), "utf8"),
  /PlatformAnalyticsJourneyPanel/,
);
assert.doesNotMatch(
  readFileSync(join(process.cwd(), "app/platform/analytics/customer-journeys/page.tsx"), "utf8"),
  /CustomerJourneyAnalyticsPanel/,
);

console.log("platform-analytics-v2.test.ts: ok", sha);
