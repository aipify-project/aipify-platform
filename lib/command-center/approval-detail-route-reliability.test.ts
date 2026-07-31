import assert from "node:assert/strict";
import test from "node:test";
import {
  buildApprovalsDataset,
  isSyntheticEccRecord,
  mapApprovalToItem,
} from "@/lib/command-center/ecc-tab-datasets";
import type { ExecutiveCommandCenter } from "@/lib/executive-command-center-engine/parse";

const SAMPLE_ID = "22222222-2222-4222-8222-222222222222";

test("seed Pending Trust Approval without request UUID is synthetic", () => {
  assert.equal(
    isSyntheticEccRecord({
      action_key: "approval_trust",
      action_title: "Pending Trust Approval",
      action_type: "approval",
      record_href: "/app/approvals",
      summary: "Level 3 action awaiting approval.",
    }),
    true,
  );
});

test("CORE approval with UUID builds canonical ECC href", () => {
  const item = mapApprovalToItem({
    action_key: `core_approval:${SAMPLE_ID}`,
    action_title: "Kompis website publish",
    action_type: "approval",
    priority: "critical",
    action_status: "pending",
    approval_id: SAMPLE_ID,
    record_href: `/app/approvals?request=${SAMPLE_ID}`,
    summary: "Publish approved draft to QA path.",
  });

  assert.equal(item.href, `/app/approvals?request=${SAMPLE_ID}`);
  assert.equal(item.staleLink, false);
  assert.equal(item.itemTypeLabelKey, "customerApp.executiveCommandCenter.tabs.approvals.typeApproval");
  assert.match(item.actionLabelKey, /review$/);
});

test("bare /app/approvals without UUID is stale non-deep-link", () => {
  const item = mapApprovalToItem({
    action_key: "legacy_list",
    action_title: "Legacy approval",
    action_type: "approval",
    priority: "urgent",
    action_status: "pending",
    record_href: "/app/approvals",
    summary: "Needs refresh.",
  });
  assert.equal(item.staleLink, true);
  assert.equal(item.href, "/app/approvals");
  assert.match(item.actionLabelKey, /refresh$/);
});

test("buildApprovalsDataset filters seed placeholder and keeps CORE deep link", () => {
  const center = {
    found: true,
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
        action_key: `core_approval:${SAMPLE_ID}`,
        action_title: "Kompis website publish",
        action_type: "approval",
        priority: "critical",
        action_status: "pending",
        approval_id: SAMPLE_ID,
        record_href: `/app/approvals?request=${SAMPLE_ID}`,
        summary: "Publish approved draft.",
      },
    ],
  } as ExecutiveCommandCenter;

  const approvals = buildApprovalsDataset(center);
  assert.equal(approvals.length, 1);
  assert.equal(approvals[0]?.href, `/app/approvals?request=${SAMPLE_ID}`);
});
