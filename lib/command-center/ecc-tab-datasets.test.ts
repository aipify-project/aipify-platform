import assert from "node:assert/strict";
import {
  buildAlertsDataset,
  buildApprovalsDataset,
  buildCompanionBriefingDataset,
  buildEccOverviewCounts,
  buildOpportunitiesDataset,
  buildPerformanceDataset,
  buildRisksDataset,
  crossTabSafeguardDedupe,
  deduplicateCommandCenterItems,
  isSyntheticEccRecord,
  mapAlertToItem,
  mapApprovalToItem,
  mapOpportunityToItem,
  normalizeReportTitle,
  sortBySeverity,
} from "./ecc-tab-datasets";
import type { ExecutiveCommandCenter } from "@/lib/executive-command-center-engine/parse";
import {
  getOpportunityStatusPresentation,
  getReportStatePresentation,
  getSeverityPresentation,
  mapExecutivePriorityToSeverity,
} from "@/lib/design/semantic-status-system";

const sampleCenter: ExecutiveCommandCenter = {
  found: true,
  overall_health_score: 79,
  alerts: [
    {
      alert_key: "approval_delay",
      alert_title: "Critical Approval Delay",
      alert_type: "approval_delay",
      priority: "critical",
      alert_status: "open",
      summary: "Trust action awaiting sign-off.",
    },
    {
      alert_key: "approval_delay",
      alert_title: "Critical Approval Delay",
      alert_type: "approval_delay",
      priority: "urgent",
      alert_status: "open",
      summary: "Duplicate seed row.",
    },
    {
      alert_key: "major_customer_risk",
      alert_title: "Major Customer Risk",
      alert_type: "customer_risk",
      priority: "attention",
      alert_status: "open",
      summary: "Top account health declining.",
    },
    {
      alert_key: "major_customer_risk",
      alert_title: "Major Customer Risk",
      alert_type: "customer_risk",
      priority: "urgent",
      alert_status: "open",
      summary: "Duplicate customer risk row.",
    },
    {
      alert_key: "ps620:ntf:1",
      alert_title: "Synthetic layout testing alert",
      alert_type: "security",
      priority: "critical",
      alert_status: "open",
      summary: "Should be filtered from real org views.",
    },
  ],
  actions: [
    {
      action_key: "approval_trust",
      action_title: "Pending Trust Approval",
      action_type: "approval",
      priority: "critical",
      action_status: "pending",
      record_href: "/app/approvals",
      summary: "Level 3 action awaiting approval.",
    },
    {
      action_key: "approval_trust",
      action_title: "Pending Trust Approval",
      action_type: "approval",
      priority: "critical",
      action_status: "pending",
      record_href: "/app/approvals",
      summary: "Duplicate pending trust approval.",
    },
    {
      action_key: "ps620:act:2",
      action_title: "Demo approval queued",
      action_type: "approval",
      priority: "critical",
      action_status: "pending",
      summary: "Synthetic demo action.",
    },
  ],
  opportunities: [
    {
      opportunity_key: "partner_nordic",
      opportunity_title: "Partner — Nordic Integrator",
      opportunity_type: "partner",
      opportunity_status: "recommended",
      priority: "information",
      recommendation: "Schedule partner intro call.",
    },
    {
      opportunity_key: "partner_nordic",
      opportunity_title: "Partner — Nordic Integrator",
      opportunity_type: "partner",
      opportunity_status: "recommended",
      priority: "information",
      recommendation: "Duplicate partner opportunity.",
    },
    {
      opportunity_key: "market_eu",
      opportunity_title: "Market expansion — EU",
      opportunity_type: "market",
      opportunity_status: "identified",
      priority: "attention",
      recommendation: "Evaluate EU market entry.",
    },
  ],
  health: [
    {
      health_key: "customer",
      health_title: "Customer Health",
      health_score: 79,
      health_status: "needs_attention",
      summary: "One renewal at risk.",
    },
    {
      health_key: "execution",
      health_title: "Execution Health",
      health_score: 85,
      health_status: "healthy",
      summary: "Initiatives progressing.",
    },
  ],
  briefings: [
    {
      briefing_key: "daily_exec",
      briefing_title: "Daily Executive Briefing",
      briefing_type: "daily_executive",
      briefing_status: "generated",
      summary: "Morning executive briefing ready.",
    },
  ],
  board_reports: [
    {
      report_key: "mbr",
      report_title: "Monthly Mbr",
      report_type: "monthly_mbr",
      report_status: "available",
      summary: "One-click MBR report.",
    },
    {
      report_key: "mbr_dup",
      report_title: "Monthly Mbr",
      report_type: "monthly_mbr",
      report_status: "available",
      summary: "Duplicate monthly report.",
    },
    {
      report_key: "annual",
      report_title: "Annual Summary",
      report_type: "annual",
      report_status: "template",
      summary: "Annual performance summary.",
    },
  ],
  since_last_login: [],
};

// 1. Critical severity uses red presentation
assert.match(getSeverityPresentation("critical").badgeClassName, /red/);

// 2. urgent maps to high severity
assert.equal(mapExecutivePriorityToSeverity("urgent"), "high");

// 3. attention maps to medium severity
assert.equal(mapExecutivePriorityToSeverity("attention"), "medium");

// 4. Alerts dedupe Critical Approval Delay
const alerts = buildAlertsDataset(sampleCenter);
assert.equal(alerts.filter((item) => item.title === "Critical Approval Delay").length, 1);

// 5. Alerts dedupe Major Customer Risk
assert.equal(alerts.filter((item) => item.title === "Major Customer Risk").length, 1);

// 6. Alerts sorted by severity (critical before medium/high)
assert.ok(alerts[0]?.primaryBadge.value === "critical");
const majorRiskIndex = alerts.findIndex((item) => item.title === "Major Customer Risk");
assert.ok(majorRiskIndex > 0);

// 7. Alert action mapping for approval delay
const approvalAlert = alerts.find((item) => item.itemType === "approval_delay");
assert.equal(approvalAlert?.actionLabelKey, "customerApp.executiveCommandCenter.tabs.alerts.actions.reviewApproval");
assert.equal(approvalAlert?.href, "/app/approvals");

// 8. Alert action mapping for customer risk
const customerRisk = alerts.find((item) => item.itemType === "customer_risk");
assert.equal(customerRisk?.actionLabelKey, "customerApp.executiveCommandCenter.tabs.alerts.actions.viewCustomerRisk");

// 9. Synthetic ps620 records filtered from alerts
assert.ok(!alerts.some((item) => item.title.includes("Synthetic")));

// 10. Approvals dedupe Pending Trust Approval
const approvals = buildApprovalsDataset(sampleCenter);
assert.equal(approvals.filter((item) => item.title === "Pending Trust Approval").length, 1);

// 11. Approval dual badges (severity + workflow)
const pendingApproval = approvals[0];
assert.equal(pendingApproval?.primaryBadge.type, "severity");
assert.equal(pendingApproval?.secondaryBadge?.type, "workflow");
assert.equal(pendingApproval?.secondaryBadge?.value, "awaiting_approval");

// 12. Risks split active vs operational health
const risks = buildRisksDataset(sampleCenter);
assert.ok(risks.activeRisks.length >= 1);
assert.ok(risks.operationalHealth.length >= 2);
assert.ok(!risks.activeRisks.some((item) => item.itemType === "health"));

// 13. Health cards expose score separately from badge
const healthItem = risks.operationalHealth.find((item) => item.title === "Customer Health");
assert.equal(healthItem?.healthScore, 79);
assert.equal(healthItem?.primaryBadge.type, "health");

// 14. Opportunity uses opportunity status badge (not severity)
const opportunities = buildOpportunitiesDataset(sampleCenter);
const partner = opportunities.find((item) => item.title.includes("Nordic"));
assert.equal(partner?.primaryBadge.type, "opportunity");
assert.equal(partner?.primaryBadge.value, "recommended");
assert.match(getOpportunityStatusPresentation("recommended").badgeClassName, /violet/);

// 15. Opportunity dedupe partner/market entries
assert.equal(opportunities.filter((item) => item.title.includes("Nordic")).length, 1);

// 16. Performance dataset returns health items without synthetic copy
const performance = buildPerformanceDataset(sampleCenter);
assert.ok(performance.healthItems.length >= 2);
assert.ok(!performance.healthItems.some((item) => /synthetic|mock|demo/i.test(item.description)));

// 17. Report dedup keeps one Monthly Business Review per period
const briefing = buildCompanionBriefingDataset(sampleCenter);
assert.equal(
  briefing.boardReports.filter((item) => item.title === "Monthly Business Review").length,
  1
);

// 18. Report states use report presentation (not severity)
const annualReport = briefing.boardReports.find((item) => item.title === "Annual Summary");
assert.equal(annualReport?.primaryBadge.type, "report");
assert.equal(annualReport?.primaryBadge.value, "template");
assert.match(getReportStatePresentation("template").badgeClassName, /muted|secondary/i);

// 19. Report title normalization Monthly Mbr → Monthly Business Review
assert.equal(normalizeReportTitle("Monthly Mbr", "monthly_mbr"), "Monthly Business Review");

// 20. Overview counts match deduplicated datasets
const counts = buildEccOverviewCounts(sampleCenter);
assert.equal(counts.openAlerts, alerts.length);
assert.equal(counts.pendingActions, approvals.length);
assert.equal(counts.criticalItems, alerts.filter((item) => item.primaryBadge.value === "critical").length);

// 21. Synthetic records detected and filtered
assert.equal(isSyntheticEccRecord({ alert_key: "ps620:demo:1", alert_title: "Test" }), true);
assert.equal(isSyntheticEccRecord({ alert_key: "real_alert", alert_title: "Invoice overdue" }), false);

// Extra safeguards used by dataset builders
const deduped = deduplicateCommandCenterItems([
  mapAlertToItem(sampleCenter.alerts![0] as Record<string, unknown>),
  mapAlertToItem(sampleCenter.alerts![1] as Record<string, unknown>),
]);
assert.equal(deduped.length, 1);
assert.equal(sortBySeverity(deduped)[0]?.primaryBadge.value, "critical");
assert.equal(
  crossTabSafeguardDedupe([
    mapApprovalToItem(sampleCenter.actions![0] as Record<string, unknown>),
    mapOpportunityToItem(sampleCenter.opportunities![0] as Record<string, unknown>),
  ]).length,
  2
);

console.log("ecc-tab-datasets tests: 21 scenarios passed");
