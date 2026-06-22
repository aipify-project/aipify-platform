import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildCommandBriefAttentionItemsFromCenter,
  COMMAND_BRIEF_ATTENTION_LIMIT,
  COMMAND_BRIEF_ATTENTION_SEE_ALL_HREF,
} from "./command-brief-attention";
import {
  buildCommandBriefAlertSummary,
  buildCommandBriefApprovalSummary,
  buildCommandBriefActivityFeed,
  buildCommandBriefIntegrationSignals,
  buildCommandBriefKpiCounts,
  buildCommandBriefNextAction,
  filterRealCompanionRecommendations,
} from "./command-brief-overview";
import type { ExecutiveCommandCenter } from "@/lib/executive-command-center-engine/parse";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const LOCALES = ["en", "no", "sv", "da", "pl", "uk"] as const;

const PAGE_TITLES: Record<(typeof LOCALES)[number], string> = {
  en: "Command Brief",
  no: "Din oversikt",
  sv: "Din översikt",
  da: "Dit overblik",
  pl: "Twój przegląd",
  uk: "Ваш огляд",
};

for (const locale of LOCALES) {
  const dict = JSON.parse(
    fs.readFileSync(path.join(ROOT, `locales/${locale}/customer-app/commandCenter.json`), "utf8")
  ) as {
    executiveCommandCenter?: {
      commandBriefOverview?: {
        title?: string;
        companionAsk?: string;
        activityEmptyTitle?: string;
        activityEmptyBody?: string;
        kpiStatus?: { sinceLastLoginZero?: string; approvalZero?: string; nextActionZero?: string };
        companionStatusReady?: string;
        attention?: {
          viewAll?: string;
          severity?: { critical?: string; attention?: string; waiting?: string; info?: string };
        };
      };
    };
  };
  const overview = dict.executiveCommandCenter?.commandBriefOverview;
  assert.equal(overview?.title, PAGE_TITLES[locale], `${locale}: commandBriefOverview.title`);
  assert.ok(overview?.companionAsk, `${locale}: companionAsk`);
  assert.ok(overview?.activityEmptyTitle, `${locale}: activityEmptyTitle`);
  assert.ok(overview?.activityEmptyBody, `${locale}: activityEmptyBody`);
  assert.ok(overview?.kpiStatus?.sinceLastLoginZero, `${locale}: kpiStatus.sinceLastLoginZero`);
  assert.ok(overview?.kpiStatus?.approvalZero, `${locale}: kpiStatus.approvalZero`);
  assert.ok(overview?.kpiStatus?.nextActionZero, `${locale}: kpiStatus.nextActionZero`);
  assert.ok(overview?.companionStatusReady, `${locale}: companionStatusReady`);
  assert.ok(overview?.attention?.viewAll, `${locale}: attention.viewAll`);
  assert.ok(overview?.attention?.severity?.critical, `${locale}: attention.severity.critical`);
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
assert.equal(buildCommandBriefAttentionItemsFromCenter(syntheticCenter).items.length, 0);
assert.equal(buildCommandBriefActivityFeed(syntheticCenter).length, 0);

const syntheticTimelineCenter: ExecutiveCommandCenter = {
  found: true,
  timeline: [
    {
      event_key: "timeline:synthetic",
      event_title: "Synthetic activity timeline event",
      summary: "Synthetic activity timeline event for Since Last Login validation.",
      priority: "information",
    },
  ],
};

assert.equal(buildCommandBriefActivityFeed(syntheticTimelineCenter).length, 0);

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
      alert_status: "open",
    },
    {
      alert_key: "alert:open-2",
      alert_title: "Inventory sync delay",
      summary: "Sync is behind schedule.",
      priority: "information",
      alert_status: "open",
    },
  ],
  actions: [
    {
      action_key: "action:pending-1",
      action_title: "Approve refund policy",
      action_type: "approval",
      summary: "Refund policy update awaits approval.",
      priority: "attention",
      action_status: "pending",
    },
    {
      action_key: "action:critical-1",
      action_title: "Approve emergency policy",
      action_type: "approval",
      summary: "Critical policy update blocked.",
      priority: "critical",
      action_status: "blocked",
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

const attention = buildCommandBriefAttentionItemsFromCenter(realCenter);
assert.ok(attention.items.length >= 1);
assert.ok(attention.items.length <= COMMAND_BRIEF_ATTENTION_LIMIT);
assert.ok(attention.totalCount >= attention.items.length);
assert.ok(attention.seeAllHref.includes(COMMAND_BRIEF_ATTENTION_SEE_ALL_HREF));
assert.ok(attention.seeAllHref.includes("return=%2Fapp%2Fcommand-center"));

const ordinaryPendingOnly: ExecutiveCommandCenter = {
  found: true,
  actions: [
    {
      action_key: "action:ordinary",
      action_title: "Routine approval",
      action_type: "approval",
      priority: "attention",
      action_status: "pending",
      summary: "Should not duplicate KPI pending approvals.",
    },
  ],
};
assert.equal(buildCommandBriefAttentionItemsFromCenter(ordinaryPendingOnly).items.length, 0);

const kpis = buildCommandBriefKpiCounts(realCenter);
assert.equal(kpis.organizationHealth, 85);
assert.equal(kpis.awaitingApproval, 2);
assert.ok(kpis.sinceLastLogin >= 0);

const alertSummary = buildCommandBriefAlertSummary(realCenter, attention.items);
assert.ok(alertSummary.length >= 0);
assert.ok(alertSummary.length <= 3);
for (const item of alertSummary) {
  assert.ok(!attention.items.some((a) => a.dedupeKey === item.dedupeKey), "alert summary excludes attention items");
}

const approvalSummary = buildCommandBriefApprovalSummary(realCenter, attention.items);
assert.ok(approvalSummary.length >= 0);
assert.ok(approvalSummary.length <= 3);
for (const item of approvalSummary) {
  assert.ok(!attention.items.some((a) => a.dedupeKey === item.dedupeKey), "approval summary excludes attention items");
}

const integrationSignals = buildCommandBriefIntegrationSignals(realCenter);
assert.equal(integrationSignals.length, 1);
assert.equal(integrationSignals[0]?.title, "Aipify Hosts");
assert.equal(integrationSignals[0]?.eventsCount, 4);
assert.equal(integrationSignals[0]?.alertsCount, 1);

assert.equal(buildCommandBriefNextAction({ found: true, alerts: [], actions: [] }), null);
assert.equal(
  buildCommandBriefNextAction(realCenter)?.dedupeKey,
  buildCommandBriefNextAction(realCenter)?.dedupeKey
);
assert.ok(buildCommandBriefNextAction(realCenter)?.href.includes("return=%2Fapp%2Fcommand-center"));

console.log("command-brief-overview.test.ts: all assertions passed");
