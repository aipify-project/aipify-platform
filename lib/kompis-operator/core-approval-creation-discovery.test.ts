import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import {
  buildKompisApprovalDeepLink,
  canShowLocalApproveAndExecute,
  planRequiresCoreApproval,
  resolveKompisCoreApprovalPresentation,
  shouldShowApprovalCreationFailed,
} from "./approval-presentation";
import { toolRequiresCoreApproval } from "./core-approval-policy";

const ROOT = join(process.cwd());
const MIGRATION = join(
  ROOT,
  "supabase/migrations/20261936200000_kompis_core_approval_creation_discovery_v1.sql",
);

function run() {
  const sql = readFileSync(MIGRATION, "utf8");
  assert.doesNotMatch(sql, /unonight|32d748eb|2b756bf8|180c9d31/i);
  assert.match(sql, /Apply-side effects = 0/i);
  assert.match(sql, /set search_path = public/);
  assert.match(sql, /CORE_APPROVAL_CREATE_FAILED/);
  assert.match(sql, /core_approval_decision_required/);
  assert.match(sql, /request_kompis_operator_core_approval/);
  assert.match(sql, /create_app_kompis_operator_run/);
  assert.match(sql, /deferred_to',\s*'kompis_operator'/);
  assert.match(sql, /approval_status = 'approved'/);
  assert.match(sql, /get_customer_approvals_center/);
  assert.match(sql, /return_to_kompis/);
  assert.doesNotMatch(sql, /insert into public\.action_requests[\s\S]*values\s*\(/i);

  assert.equal(toolRequiresCoreApproval("website_publish_approved_draft"), true);
  assert.equal(
    planRequiresCoreApproval({
      steps: [{ toolKey: "website_publish_approved_draft" }],
    }),
    true,
  );
  assert.equal(
    planRequiresCoreApproval({
      steps: [{ toolKey: "website_page_draft_create" }],
    }),
    false,
  );

  assert.equal(
    resolveKompisCoreApprovalPresentation({
      coreApprovalRequired: true,
      coreApprovalRequestId: null,
      approvalStatus: "pending",
      runStatus: "awaiting_approval",
    }),
    "creation_failed",
  );
  assert.equal(
    resolveKompisCoreApprovalPresentation({
      coreApprovalRequired: true,
      safeErrorCode: "approval_scope_incomplete",
    }),
    "incomplete_scope",
  );
  assert.equal(
    resolveKompisCoreApprovalPresentation({
      coreApprovalRequired: true,
      coreApprovalRequestId: "11111111-1111-4111-8111-111111111111",
      coreApprovalStatus: "pending",
      approvalStatus: "pending",
      runStatus: "awaiting_approval",
    }),
    "awaiting_approval",
  );
  assert.equal(
    resolveKompisCoreApprovalPresentation({
      coreApprovalRequired: true,
      coreApprovalRequestId: "11111111-1111-4111-8111-111111111111",
      coreApprovalStatus: "approved",
      approvalStatus: "approved",
      runStatus: "planned",
    }),
    "approved",
  );
  assert.equal(
    shouldShowApprovalCreationFailed({
      coreApprovalRequired: true,
      coreApprovalRequestId: null,
      approvalStatus: "pending",
      runStatus: "awaiting_approval",
    }),
    true,
  );
  assert.equal(
    canShowLocalApproveAndExecute({
      coreApprovalRequired: true,
      coreApprovalRequestId: "11111111-1111-4111-8111-111111111111",
      approvalStatus: "pending",
    }),
    false,
  );
  assert.equal(
    buildKompisApprovalDeepLink("11111111-1111-4111-8111-111111111111"),
    "/app/approvals?request=11111111-1111-4111-8111-111111111111",
  );
  assert.equal(buildKompisApprovalDeepLink(null), null);

  const panel = readFileSync(
    join(ROOT, "components/app/kompis-operator/KompisOperatorWorkspacePanel.tsx"),
    "utf8",
  );
  assert.match(panel, /reviewAndApprove/);
  assert.match(panel, /approvalRequiredTitle/);
  assert.match(panel, /\/app\/approvals\?request=/);
  assert.match(panel, /core_approval_required &&\s*\n\s*activeRun\.core_approval_request_id/);
  assert.match(panel, /approvalCreationFailedTitle/);

  const approvalsPanel = readFileSync(
    join(ROOT, "components/app/approvals/ApprovalsCenterPanel.tsx"),
    "utf8",
  );
  assert.match(approvalsPanel, /selectFocusedApprovalId/);
  assert.match(approvalsPanel, /returnToKompis/);
  assert.match(approvalsPanel, /resolveTrustApproveRequest/);

  const locales = ["en", "no", "sv", "da", "pl", "uk", "es"];
  for (const locale of locales) {
    const core = JSON.parse(
      readFileSync(join(ROOT, `locales/${locale}/customer-app/core.json`), "utf8"),
    );
    const dash = JSON.parse(
      readFileSync(join(ROOT, `locales/${locale}/customer-app/dashboard.json`), "utf8"),
    );
    for (const key of [
      "approvalRequiredTitle",
      "approvalRequiredBody",
      "reviewAndApprove",
      "approvalCreationFailedTitle",
      "approvalCreationFailedBody",
      "returnToKompis",
    ]) {
      assert.equal(typeof core.kompisOperator[key], "string", `${locale}.kompisOperator.${key}`);
      assert.notEqual(core.kompisOperator[key].includes("customerApp."), true);
    }
    for (const key of [
      "title",
      "empty",
      "returnToKompis",
      "internalReason",
      "focusedMissing",
      "kompisPublishTitle",
    ]) {
      assert.equal(typeof dash.approvals[key], "string", `${locale}.approvals.${key}`);
    }
  }

  const noDash = JSON.parse(
    readFileSync(join(ROOT, "locales/no/customer-app/dashboard.json"), "utf8"),
  );
  assert.equal(noDash.approvals.title, "Godkjenningssenter");
  assert.equal(noDash.approvals.empty.includes("Ingen ventende godkjenninger"), true);
  assert.doesNotMatch(noDash.approvals.empty, /No pending approvals/);
  assert.doesNotMatch(noDash.approvals.title, /Approval center/i);

  const noCore = JSON.parse(
    readFileSync(join(ROOT, "locales/no/customer-app/core.json"), "utf8"),
  );
  assert.equal(noCore.kompisOperator.approvalRequiredTitle, "Godkjenning kreves");
  assert.equal(noCore.kompisOperator.reviewAndApprove, "Gjennomgå og godkjenn");

  const rulePath = join(ROOT, ".cursor/rules/kompis-core-approval-creation-discovery.mdc");
  const rule = readFileSync(rulePath, "utf8");
  assert.match(rule, /no awaiting approval without CORE approval/i);
  assert.match(rule, /No UnoNight hardcoding/);

  const migrationNames = readdirSync(join(ROOT, "supabase/migrations")).filter((name) =>
    name.startsWith("202619362"),
  );
  assert.deepEqual(migrationNames, [
    "20261936200000_kompis_core_approval_creation_discovery_v1.sql",
  ]);

  console.log("kompis-core-approval-creation-discovery tests passed");
}

run();
