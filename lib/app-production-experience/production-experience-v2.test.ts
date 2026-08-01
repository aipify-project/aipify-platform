import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  countActionableApprovals,
  isActionableApprovalRecord,
  shouldShowApprovalDelayAlert,
} from "./approval-parity";
import {
  isShowcaseCustomerRecord,
  isShowcaseTitle,
  isShowcaseTypeCode,
} from "./showcase-filter";
import { resolveBusinessTypeLabelKey } from "./business-type-labels";
import { buildAlertsDataset, buildApprovalsDataset, buildRisksDataset } from "@/lib/command-center/ecc-tab-datasets";
import { buildCommandBriefAttentionItemsFromCenter } from "@/lib/command-center/command-brief-attention";
import { resolveKompisHistoryTitle, isGenericKompisHistoryTitle } from "@/lib/kompis-operator/history-presentation";
import { AppPremiumShell } from "@/lib/design/app-premium-shell";
import type { ExecutiveCommandCenter } from "@/lib/executive-command-center-engine/parse";

const APPROVAL_UUID = "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee";

function centerFixture(overrides: Partial<ExecutiveCommandCenter> = {}): ExecutiveCommandCenter {
  return {
    found: true,
    overall_health_score: 76,
    alerts: [],
    actions: [],
    opportunities: [],
    health: [],
    briefings: [],
    board_reports: [],
    since_last_login: [],
    ...overrides,
  };
}

describe("production experience v2 — showcase classification", () => {
  it("flags Phase 590 fixture titles and type codes", () => {
    assert.equal(isShowcaseTitle("Contract Expiring"), true);
    assert.equal(isShowcaseTitle("Daily Executive Briefing"), true);
    assert.equal(isShowcaseTitle("Revenue Alerts"), true);
    assert.equal(isShowcaseTitle("New Partner Leads"), true);
    assert.equal(isShowcaseTypeCode("approval_delay"), false);
    assert.equal(isShowcaseTypeCode("daily_executive"), true);
    assert.equal(isShowcaseTypeCode("partner_leads"), true);
    assert.equal(
      isShowcaseCustomerRecord({
        alert_title: "Large Invoice Overdue",
        alert_type: "invoice_overdue",
      }),
      true,
    );
    assert.equal(
      isShowcaseCustomerRecord({
        alert_title: "Website publish awaiting review",
        alert_type: "approval_delay",
        alert_key: "real-alert-1",
      }),
      false,
    );
  });
});

describe("production experience v2 — approval parity", () => {
  it("counts only actionable CORE approvals", () => {
    const records = [
      {
        action_type: "approval",
        action_status: "pending",
        approval_id: APPROVAL_UUID,
        action_title: "Publish website",
      },
      {
        action_type: "approval",
        action_status: "approved",
        approval_id: "bbbbbbbb-bbbb-cccc-dddd-eeeeeeeeeeee",
        action_title: "Already approved",
      },
      {
        action_type: "approval",
        action_status: "pending",
        action_key: "approval_trust",
        action_title: "Pending Trust Approval",
      },
      {
        category: "notification",
        action_status: "pending",
        approval_id: "cccccccc-bbbb-cccc-dddd-eeeeeeeeeeee",
      },
    ];
    assert.equal(countActionableApprovals(records), 1);
    assert.equal(isActionableApprovalRecord(records[0]!), true);
    assert.equal(isActionableApprovalRecord(records[1]!), false);
  });

  it("hides approval-delay alerts when no actionable approvals exist", () => {
    const delay = { alert_type: "approval_delay", alert_title: "Critical approval is delayed" };
    assert.equal(shouldShowApprovalDelayAlert(delay, 0), false);
    assert.equal(shouldShowApprovalDelayAlert(delay, 1), true);
  });
});

describe("production experience v2 — ECC dataset parity", () => {
  it("excludes showcase alerts and stale approval delay from attention", () => {
    const center = centerFixture({
      alerts: [
        {
          alert_key: "ps620:contract",
          alert_title: "Contract Expiring",
          alert_type: "contract_expiring",
          alert_status: "open",
          priority: "urgent",
        },
        {
          alert_key: "delay-1",
          alert_title: "Critical approval is delayed",
          alert_type: "approval_delay",
          alert_status: "open",
          priority: "critical",
        },
        {
          alert_key: "real-1",
          alert_title: "Integration reconnect needed",
          alert_type: "integration_failure",
          alert_status: "open",
          priority: "urgent",
        },
      ] as never[],
      actions: [
        {
          action_type: "approval",
          action_status: "approved",
          approval_id: APPROVAL_UUID,
          action_title: "Already done",
          priority: "critical",
        },
      ] as never[],
    });

    const alerts = buildAlertsDataset(center);
    assert.equal(
      alerts.some((item) => item.title === "Contract Expiring"),
      false,
    );
    assert.equal(
      alerts.some((item) => item.itemType === "approval_delay"),
      false,
    );
    assert.equal(buildApprovalsDataset(center).length, 0);

    const attention = buildCommandBriefAttentionItemsFromCenter(center);
    assert.equal(
      attention.items.some((item) => item.itemType === "approval_delay"),
      false,
    );
    assert.equal(buildRisksDataset(center).activeRisks.some((r) => r.itemType === "approval_delay"), false);
  });

  it("keeps approval delay when an actionable approval exists", () => {
    const center = centerFixture({
      alerts: [
        {
          alert_key: "delay-1",
          alert_title: "Critical approval is delayed",
          alert_type: "approval_delay",
          alert_status: "open",
          priority: "critical",
        },
      ] as never[],
      actions: [
        {
          action_type: "approval",
          action_status: "pending",
          approval_id: APPROVAL_UUID,
          action_title: "Publish website draft",
          priority: "critical",
        },
      ] as never[],
    });
    assert.equal(buildApprovalsDataset(center).length, 1);
    assert.equal(buildAlertsDataset(center).some((a) => a.itemType === "approval_delay"), true);
  });
});

describe("production experience v2 — type labels", () => {
  it("maps technical types to locale keys", () => {
    assert.equal(
      resolveBusinessTypeLabelKey("approval delay"),
      "customerApp.executiveCommandCenter.types.approvalDelay",
    );
    assert.equal(
      resolveBusinessTypeLabelKey("daily_executive"),
      "customerApp.executiveCommandCenter.types.dailyExecutive",
    );
    assert.equal(resolveBusinessTypeLabelKey("unknown_xyz"), null);
  });
});

describe("production experience v2 — Kompis history titles", () => {
  it("replaces generic Kompis title with request or tool label", () => {
    assert.equal(isGenericKompisHistoryTitle("Kompis"), true);
    assert.equal(
      resolveKompisHistoryTitle({
        title: "Kompis",
        latestRequestText: "Kontroller nettstedet",
        fallback: "Aktivitet",
      }),
      "Kontroller nettstedet",
    );
    assert.equal(
      resolveKompisHistoryTitle({
        title: "Kompis",
        toolLabel: "Publisering av nettsted",
        fallback: "Aktivitet",
      }),
      "Publisering av nettsted",
    );
  });
});

describe("production experience v2 — layout contract", () => {
  it("uses wide desktop max width", () => {
    assert.match(AppPremiumShell.page, /max-w-\[1560px\]/);
    assert.match(AppPremiumShell.commandBriefPage, /max-w-\[1560px\]/);
  });
});
