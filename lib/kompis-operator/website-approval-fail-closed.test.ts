import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

function installServerOnlyShim(): void {
  const moduleApi = require("node:module") as {
    Module: {
      _load: (request: string, parent: unknown, isMain: boolean) => unknown;
    };
  };
  const originalLoad = moduleApi.Module._load;
  moduleApi.Module._load = function (request, parent, isMain) {
    if (request === "server-only") {
      return {};
    }
    return originalLoad.call(this, request, parent, isMain);
  };
}

async function run() {
  installServerOnlyShim();

  const { resolveKompisCoreApprovalPresentation } = await import("./approval-presentation");
  const { PLANNER_VERSION, planKompisOperatorRequestSync, planToRpcJson } = await import("./planner");
  const {
    APPROVAL_SCOPE_INCOMPLETE,
    buildWebsiteActionChecksum,
    buildWebsiteApprovalIdempotencyKey,
    extractWebsiteContentHints,
    isEmptySafeInput,
    NORWEGIAN_QA_DRAFT,
    validatePublishApprovalScope,
    validateRollbackApprovalScope,
  } = await import("./website-approval-scope");

  const sql = readFileSync(
    "supabase/migrations/20261936300000_kompis_website_approval_fail_closed_v1.sql",
    "utf8",
  );
  assert.match(sql, /APPROVAL_SCOPE_INCOMPLETE/);
  assert.match(sql, /_kompis_assert_publish_approval_scope/);
  assert.match(sql, /_kompis_assert_rollback_approval_scope/);
  assert.match(sql, /assert_kompis_operator_core_approval_ready/);
  assert.match(sql, /is distinct from/);
  assert.match(sql, /prepare_kompis_website_publish_approval_from_run/);
  assert.match(sql, /cancel_incomplete_kompis_website_approval/);
  assert.match(sql, /trg_kompis_core_approval_binding_scope_guard/);
  assert.doesNotMatch(
    sql,
    /if v_binding\.path is not null and v_path is not null and v_binding\.path <> v_path/,
  );
  assert.doesNotMatch(sql, /unonight|32d748eb|2b756bf8|180c9d31/i);

  assert.equal(isEmptySafeInput({}), true);
  const empty = validatePublishApprovalScope({});
  assert.equal(empty.ok, false);
  if (!empty.ok) {
    assert.equal(empty.errorCode, APPROVAL_SCOPE_INCOMPLETE);
    assert.ok(empty.missing.includes("website_id"));
    assert.ok(empty.missing.includes("candidate_id"));
  }

  const checksum = buildWebsiteActionChecksum({
    organizationId: "11111111-1111-4111-8111-111111111111",
    runId: "22222222-2222-4222-8222-222222222222",
    stepId: "33333333-3333-4333-8333-333333333333",
    toolKey: "website_publish_approved_draft",
    websiteId: "44444444-4444-4444-8444-444444444444",
    path: "/aipify-cms-qa",
    candidateOrTargetId: "55555555-5555-4555-8555-555555555555",
    expectedCurrentVersionId: "66666666-6666-4666-8666-666666666666",
    locale: "no",
    reason: "test",
  });
  assert.equal(checksum.length, 64);
  const scope = validatePublishApprovalScope({
    website_id: "44444444-4444-4444-8444-444444444444",
    path: "/aipify-cms-qa",
    candidate_id: "55555555-5555-4555-8555-555555555555",
    locale: "no",
    expected_current_version_id: "66666666-6666-4666-8666-666666666666",
    reason: "test",
    action_checksum: checksum,
    idempotency_key: buildWebsiteApprovalIdempotencyKey(checksum),
  });
  assert.equal(scope.ok, true);

  const rollback = validateRollbackApprovalScope({ path: "/aipify-cms-qa" });
  assert.equal(rollback.ok, false);

  assert.equal(PLANNER_VERSION, "planner_v5");
  const request =
    "Oppdater den eksisterende QA-siden /aipify-cms-qa med en tydelig norsk overskrift og en kort forklaring på at siden brukes til å verifisere Aipify sin ordinære kundeleveranse. Ikke endre forsiden eller andre sider. Lag først et utkast og en forhåndsvisning. Publisering krever godkjenning.";
  const plan = planKompisOperatorRequestSync(request);
  assert.equal(plan.intent, "website_content_update_prepare_publish");
  assert.ok(plan.steps.some((s) => s.toolKey === "website_page_draft_create"));
  assert.ok(plan.steps.some((s) => s.toolKey === "website_draft_preview_create"));
  assert.equal(plan.steps.some((s) => s.toolKey === "website_publish_approved_draft"), false);
  const draft = plan.steps.find((s) => s.toolKey === "website_page_draft_create");
  assert.equal(draft?.safeInput.path, NORWEGIAN_QA_DRAFT.path);
  assert.equal(draft?.safeInput.locale, NORWEGIAN_QA_DRAFT.locale);
  assert.equal(draft?.safeInput.title, NORWEGIAN_QA_DRAFT.title);
  assert.equal(draft?.safeInput.text, NORWEGIAN_QA_DRAFT.text);
  assert.equal(plan.preparePublishAfterPreview, true);
  const rpc = planToRpcJson(plan);
  assert.equal((rpc.scope as Record<string, unknown>).path, "/aipify-cms-qa");

  const barePublish = planKompisOperatorRequestSync("Publiser det godkjente utkastet");
  assert.equal(barePublish.steps.length, 0);
  assert.equal(barePublish.blockedReasonCode, "approval_scope_incomplete");

  const hints = extractWebsiteContentHints(
    "Oppdater /aipify-cms-qa med norsk overskrift. Ikke endre forsiden.",
  );
  assert.equal(hints.path, "/aipify-cms-qa");
  assert.equal(hints.isNorwegianQaUpdate, true);
  assert.equal(hints.locale, "no");

  assert.equal(
    resolveKompisCoreApprovalPresentation({
      coreApprovalRequired: true,
      safeErrorCode: "approval_scope_incomplete",
    }),
    "incomplete_scope",
  );

  console.log("website-approval-fail-closed tests passed");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
