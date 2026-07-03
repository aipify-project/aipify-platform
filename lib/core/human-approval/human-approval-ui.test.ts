import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  CORE_HUMAN_APPROVAL_UI_ENV_KEY,
  HUMAN_APPROVAL_READ_ONLY_ACTIONS,
  filterHumanApprovalNavItems,
  isCoreHumanApprovalUiEnabled,
  isHumanApprovalPilotRole,
  isHumanApprovalReadOnlyAction,
  rejectUnsafeHumanApprovalMethod,
  resolveHumanApprovalAccessState,
} from "@/lib/app/human-approval-nav";
import {
  flattenHumanApprovalLabelKeys,
  readHumanApprovalLocaleFileSync,
} from "@/lib/core/human-approval/labels";
import { isSafeCoreHumanApprovalRpcPayload } from "@/lib/core/human-approval/parse";
import { SENSITIVE_CORE_APPROVAL_RPC_FIELDS } from "@/lib/core/human-approval/types";
import {
  accessModeLabelKey,
  mapCoreHumanApprovalStatusToKind,
  mapTrustStatusToCoreStatus,
  normalizeRiskLevel,
  riskLabelKeyForLevel,
  statusLabelKey,
} from "@/lib/core/human-approval/status-labels";

const repoRoot = path.join(import.meta.dirname, "..", "..", "..");
const CORE_LOCALES = ["en", "no", "sv", "da", "pl", "uk"] as const;
const REQUIRED_STATUS_KEYS = [
  "pending",
  "approved",
  "denied",
  "expired",
  "revoked",
  "executing",
  "succeeded",
  "failed",
] as const;
const REQUIRED_RISK_KEYS = ["information", "draft", "reversible", "sensitive", "critical"] as const;
const REQUIRED_ACCESS_KEYS = ["oneTime", "ongoing"] as const;

const envSnapshot = process.env[CORE_HUMAN_APPROVAL_UI_ENV_KEY];
delete process.env[CORE_HUMAN_APPROVAL_UI_ENV_KEY];

assert.equal(isCoreHumanApprovalUiEnabled(), false, "feature flag default OFF");
process.env[CORE_HUMAN_APPROVAL_UI_ENV_KEY] = "true";
assert.equal(isCoreHumanApprovalUiEnabled(), true, "feature flag ON via env");
if (envSnapshot === undefined) {
  delete process.env[CORE_HUMAN_APPROVAL_UI_ENV_KEY];
} else {
  process.env[CORE_HUMAN_APPROVAL_UI_ENV_KEY] = envSnapshot;
}

assert.equal(isHumanApprovalPilotRole("owner"), true);
assert.equal(isHumanApprovalPilotRole("administrator"), true);
assert.equal(isHumanApprovalPilotRole("organization_owner"), true);
assert.equal(isHumanApprovalPilotRole("organization_admin"), true);
assert.equal(isHumanApprovalPilotRole("manager"), false);
assert.equal(isHumanApprovalPilotRole("staff"), false);

assert.equal(
  resolveHumanApprovalAccessState({
    authenticated: true,
    organizationRole: "owner",
    featureEnabled: true,
  }),
  "ready",
);
assert.equal(
  resolveHumanApprovalAccessState({
    authenticated: true,
    organizationRole: "viewer",
    featureEnabled: true,
  }),
  "forbidden",
);
assert.equal(
  resolveHumanApprovalAccessState({
    authenticated: true,
    organizationRole: "owner",
    featureEnabled: false,
  }),
  "feature_disabled",
);

assert.equal(statusLabelKey("pending"), "status.pending");
assert.equal(statusLabelKey("rejected"), "status.denied");
assert.equal(riskLabelKeyForLevel(3), "risk.sensitive");
assert.equal(accessModeLabelKey("ongoing"), "accessMode.ongoing");
assert.equal(mapTrustStatusToCoreStatus("completed"), "succeeded");
assert.equal(mapCoreHumanApprovalStatusToKind("pending"), "waiting");
assert.equal(normalizeRiskLevel("3"), 3);

const safePayload = {
  id: "33333333-3333-3333-3333-333333333333",
  title: "Support: draft_reply",
  status: "pending",
  scope_summary: "draft_reply",
};
assert.equal(isSafeCoreHumanApprovalRpcPayload(safePayload), true);
for (const field of SENSITIVE_CORE_APPROVAL_RPC_FIELDS) {
  assert.equal(
    isSafeCoreHumanApprovalRpcPayload({ ...safePayload, [field]: "secret" }),
    false,
    `${field} must be filtered`,
  );
}

for (const action of HUMAN_APPROVAL_READ_ONLY_ACTIONS) {
  assert.equal(isHumanApprovalReadOnlyAction(action), true);
}
assert.equal(isHumanApprovalReadOnlyAction("approve"), false);
assert.equal(isHumanApprovalReadOnlyAction("execute"), false);

assert.equal(rejectUnsafeHumanApprovalMethod("GET"), false);
assert.equal(rejectUnsafeHumanApprovalMethod("POST"), true);
assert.equal(rejectUnsafeHumanApprovalMethod("DELETE"), true);

const navItems = [
  { id: "approvals", href: "/app/approvals", labelKey: "x" },
  { id: "humanApproval", href: "/app/human-approval", labelKey: "y" },
];
assert.equal(filterHumanApprovalNavItems(navItems).length, 1);
process.env[CORE_HUMAN_APPROVAL_UI_ENV_KEY] = "true";
assert.equal(filterHumanApprovalNavItems(navItems).length, 2);
if (envSnapshot === undefined) {
  delete process.env[CORE_HUMAN_APPROVAL_UI_ENV_KEY];
} else {
  process.env[CORE_HUMAN_APPROVAL_UI_ENV_KEY] = envSnapshot;
}

const english = readHumanApprovalLocaleFileSync("en");
assert.match(String(english.auditTimelinePlaceholder), /audit event list support/i);

for (const locale of CORE_LOCALES) {
  const filePath = path.join(repoRoot, `locales/${locale}/customer-app/humanApproval.json`);
  assert.ok(fs.existsSync(filePath), `${locale} humanApproval.json missing`);
  const localized = readHumanApprovalLocaleFileSync(locale);
  for (const key of REQUIRED_STATUS_KEYS) {
    assert.ok(
      (localized.status as Record<string, string>)?.[key],
      `${locale} missing status.${key}`,
    );
  }
  for (const key of REQUIRED_RISK_KEYS) {
    assert.ok((localized.risk as Record<string, string>)?.[key], `${locale} missing risk.${key}`);
  }
  for (const key of REQUIRED_ACCESS_KEYS) {
    assert.ok(
      (localized.accessMode as Record<string, string>)?.[key],
      `${locale} missing accessMode.${key}`,
    );
  }
}

const englishKeys = flattenHumanApprovalLabelKeys(english);
assert.ok(englishKeys.includes("auditTimelinePlaceholder"));
assert.ok(englishKeys.includes("status.pending"));

console.log("human-approval ui tests passed");
