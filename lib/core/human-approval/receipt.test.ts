import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  buildHumanApprovalReceiptModel,
  formatHumanApprovalReceiptPlainText,
  receiptContainsRequiredFields,
  receiptPlainTextExcludesSensitiveFields,
} from "./receipt";
import type { CoreHumanApprovalRequest, HumanApprovalReceiptLabels } from "./types";

const repoRoot = path.join(import.meta.dirname, "..", "..", "..");
const CORE_LOCALES = ["en", "no", "sv", "da", "pl", "uk"] as const;

const CONFIRMED_EXACT: Record<(typeof CORE_LOCALES)[number], string> = {
  en: "Approval confirmed",
  no: "Godkjenning bekreftet",
  sv: "Godkännande bekräftat",
  da: "Godkendelse bekræftet",
  pl: "Zatwierdzenie potwierdzone",
  uk: "Затвердження підтверджено",
};

const labels: HumanApprovalReceiptLabels = {
  title: "Approval confirmed",
  copy: "Copy",
  copied: "Copied",
  approvedBy: "Approved by",
  approverRole: "Approver role",
  approvedAt: "Approved at",
  action: "Action",
  scope: "Scope",
  target: "Target",
  validity: "Validity",
  oneTime: "One-time approval",
  ongoing: "Ongoing approval",
  expiresAt: "Expires at",
  auditId: "Audit ID",
  correlationId: "Correlation ID",
  status: "Status",
  executionResult: "Execution result",
  unchanged: "What will not change",
  notAvailable: "Not available",
};

const request: CoreHumanApprovalRequest = {
  id: "33333333-3333-3333-3333-333333333333",
  organization_id: "22222222-2222-2222-2222-222222222222",
  requester_user_id: "user-1",
  requester_role_snapshot: "staff",
  action_category: "trust_action",
  action_key: "draft_reply",
  title: "Support: draft_reply",
  summary: "Draft a reply",
  unchanged_summary: "Billing and unrelated permissions will not be changed.",
  scope_summary: "draft_reply · support_case",
  access_mode: "one_time",
  risk_level: 2,
  status: "succeeded",
  consumer_kind: "trust_action",
  consumer_ref_id: "11111111-1111-1111-1111-111111111111",
  approved_by_user_id: "approver-1",
  approved_by_display: "Approver One",
  denied_by_user_id: null,
  approver_role_snapshot: "admin",
  target_environment: "tenant:22222222-2222-2222-2222-222222222222",
  expires_at: "2026-07-04T00:00:00.000Z",
  revoked_at: null,
  consumed_at: "2026-07-03T12:10:00.000Z",
  execution_started_at: "2026-07-03T12:08:00.000Z",
  execution_completed_at: "2026-07-03T12:10:00.000Z",
  execution_result: "succeeded",
  execution_error_summary: null,
  approved_at: "2026-07-03T12:05:00.000Z",
  created_at: "2026-07-03T12:00:00.000Z",
  updated_at: "2026-07-03T12:10:00.000Z",
  correlation_id: "33333333-3333-3333-3333-333333333333",
  latest_audit_id: "44444444-4444-4444-4444-444444444444",
};

const model = buildHumanApprovalReceiptModel(request, labels.title, labels);
const plain = formatHumanApprovalReceiptPlainText(model, labels);

assert.ok(receiptContainsRequiredFields(plain, model));
assert.ok(receiptPlainTextExcludesSensitiveFields(plain));
assert.match(plain, /Approver One/);
assert.match(plain, /Billing and unrelated permissions will not be changed/);
assert.doesNotMatch(plain, /scope_json|payload_hash|secret|token/i);

const localizedLabelSets: Record<string, HumanApprovalReceiptLabels> = {
  en: labels,
  no: {
    ...labels,
    title: "Godkjenning bekreftet",
    approvedBy: "Godkjent av",
    copy: "Kopier",
    copied: "Kopiert",
  },
  sv: {
    ...labels,
    title: "Godkännande bekräftat",
    approvedBy: "Godkänd av",
    copy: "Kopiera",
    copied: "Kopierad",
  },
  da: {
    ...labels,
    title: "Godkendelse bekræftet",
    approvedBy: "Godkendt af",
    copy: "Kopiér",
    copied: "Kopieret",
  },
};

for (const [locale, localeLabels] of Object.entries(localizedLabelSets)) {
  const localizedModel = buildHumanApprovalReceiptModel(request, localeLabels.title, localeLabels);
  const localizedPlain = formatHumanApprovalReceiptPlainText(localizedModel, localeLabels);
  assert.match(localizedPlain, new RegExp(localeLabels.title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.ok(receiptPlainTextExcludesSensitiveFields(localizedPlain), `${locale} receipt stays safe`);
}

for (const locale of CORE_LOCALES) {
  const dashboard = JSON.parse(
    fs.readFileSync(path.join(repoRoot, `locales/${locale}/customer-app/dashboard.json`), "utf8"),
  ) as Record<string, unknown>;
  const approvals = dashboard.approvals as Record<string, unknown>;
  assert.ok(approvals?.confirmed, `${locale} missing approvals.confirmed`);
  assert.ok(approvals?.receipt, `${locale} missing approvals.receipt`);
  const receipt = approvals.receipt as Record<string, unknown>;
  for (const key of [
    "title",
    "copy",
    "copied",
    "approvedBy",
    "approverRole",
    "approvedAt",
    "action",
    "scope",
    "target",
    "validity",
    "oneTime",
    "ongoing",
    "expiresAt",
    "auditId",
    "correlationId",
    "status",
    "executionResult",
    "unchanged",
    "notAvailable",
  ]) {
    assert.equal(typeof receipt[key], "string", `${locale} receipt.${key} missing`);
    assert.notEqual(String(receipt[key]).trim(), "", `${locale} receipt.${key} empty`);
  }
  if (locale in CONFIRMED_EXACT) {
    assert.equal(String(approvals.confirmed), CONFIRMED_EXACT[locale], `${locale} confirmed text`);
    assert.equal(String(receipt.title), CONFIRMED_EXACT[locale], `${locale} receipt.title text`);
  }
}

console.log("human-approval receipt tests passed");
