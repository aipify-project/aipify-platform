import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildCommandBriefAlertSummary,
  buildCommandBriefApprovalSummary,
  buildCommandBriefAttentionItems,
  buildCommandBriefActivityFeed,
  buildCommandBriefIntegrationSignals,
  buildCommandBriefKpiCounts,
  filterRealCompanionRecommendations,
  pickCommandBriefNextAction,
} from "./command-brief-overview";
import type { ExecutiveCommandCenter } from "@/lib/executive-command-center-engine/parse";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const LOCALES = ["en", "no", "sv", "da", "pl", "uk"] as const;

for (const locale of LOCALES) {
  const dict = JSON.parse(
    fs.readFileSync(path.join(ROOT, `locales/${locale}/customer-app/commandCenter.json`), "utf8")
  ) as { executiveCommandCenter?: { commandBriefOverview?: { title?: string; companionAsk?: string } } };
  assert.ok(dict.executiveCommandCenter?.commandBriefOverview?.title, `${locale}: commandBriefOverview.title`);
  assert.ok(dict.executiveCommandCenter?.commandBriefOverview?.companionAsk, `${locale}: companionAsk`);
}

const syntheticCenter: ExecutiveCommandCenter = {
  found: true,
  overall_health_score: 72,
  companion_recommendations: [
    {
      alert_title: "Critical Approval Delay",
      recommendation: "Synthetic layout test record",
      priority: "critical",
      alert_key: "ps620:synthetic-approval",
    },
  ],
  since_last_login: [
    {
      item_key: "ps620:mock-event",
      item_title: "Mock data event",
      summary: "layout testing only",
      priority: "information",
    },
  ],
  alerts: [],
  actions: [],
};

assert.equal(filterRealCompanionRecommendations(syntheticCenter.companion_recommendations ?? []).length, 0);
assert.equal(buildCommandBriefAttentionItems(syntheticCenter).length, 0);
assert.equal(buildCommandBriefActivityFeed(syntheticCenter).length, 0);

const realCenter: ExecutiveCommandCenter = {
  found: true,
  overall_health_score: 85,
  since_last_login: [
    {
      item_key: "real:integration",
      item_title: "Shopify connection verified",
      summary: "Aipify verified the integration connection.",
      priority: "completed",
      item_category: "integration",
    },
  ],
  alerts: [
    {
      alert_key: "alert:open-1",
      alert_title: "Support queue review",
      summary: "Two cases await review.",
      priority: "attention",
      status: "open",
    },
    {
      alert_key: "alert:open-2",
      alert_title: "Inventory sync delay",
      summary: "Sync is behind schedule.",
      priority: "information",
      status: "open",
    },
  ],
  actions: [
    {
      action_key: "action:pending-1",
      action_title: "Approve refund policy",
      summary: "Refund policy update awaits approval.",
      priority: "attention",
      status: "pending",
    },
  ],
  business_packs: [
    {
      pack_key: "hosts",
      pack_title: "Aipify Hosts",
      summary: "Guest operations pack is active.",
      events_count: 4,
      alerts_count: 1,
    },
  ],
};

const attention = buildCommandBriefAttentionItems(realCenter);
assert.ok(attention.length >= 1);
assert.ok(attention.length <= 3);

const kpis = buildCommandBriefKpiCounts(realCenter);
assert.equal(kpis.organizationHealth, 85);
assert.ok(kpis.sinceLastLogin >= 0);

const alertSummary = buildCommandBriefAlertSummary(realCenter, attention);
assert.ok(alertSummary.length >= 0);
assert.ok(alertSummary.length <= 3);
for (const item of alertSummary) {
  assert.ok(!attention.some((a) => a.dedupeKey === item.dedupeKey), "alert summary excludes attention items");
}

const approvalSummary = buildCommandBriefApprovalSummary(realCenter, attention);
assert.ok(approvalSummary.length >= 0);
assert.ok(approvalSummary.length <= 3);
for (const item of approvalSummary) {
  assert.ok(!attention.some((a) => a.dedupeKey === item.dedupeKey), "approval summary excludes attention items");
}

const integrationSignals = buildCommandBriefIntegrationSignals(realCenter);
assert.equal(integrationSignals.length, 1);
assert.equal(integrationSignals[0]?.title, "Aipify Hosts");
assert.equal(integrationSignals[0]?.eventsCount, 4);
assert.equal(integrationSignals[0]?.alertsCount, 1);

assert.equal(pickCommandBriefNextAction([]), null);
assert.equal(pickCommandBriefNextAction(attention)?.dedupeKey, attention[0]?.dedupeKey);

console.log("command-brief-overview.test.ts: all assertions passed");
