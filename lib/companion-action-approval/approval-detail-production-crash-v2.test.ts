import assert from "node:assert/strict";
import test from "node:test";
import {
  buildApprovalsDeepLink,
  normalizeApprovalDetail,
  resolveEccApprovalNavigationHref,
  selectFocusedApprovalId,
} from "@/lib/companion-action-approval";
import { mapApprovalToItem } from "@/lib/command-center/ecc-tab-datasets";
import { resolveCommandBriefRecordTitleLabelKey } from "@/lib/command-center/command-brief-record-title-labels";

/** Concrete Production approval from Kompis website publish QA run. */
const PRODUCTION_APPROVAL_ID = "bb098f62-a20a-4fc9-9d32-f174b72d9abc";
const PRODUCTION_HREF = `/app/approvals?request=${PRODUCTION_APPROVAL_ID}`;
const PRODUCTION_HREF_WITH_RETURN = `${PRODUCTION_HREF}&return=%2Fapp%2Fcommand-center`;

const productionShape = {
  id: PRODUCTION_APPROVAL_ID,
  title: "Kompis website publish",
  description:
    "Godkjenner publisering av det norske QA-utkastet kun på /aipify-cms-qa for kontroll av Aipify sin ordinære kundeleveranse. Forsiden og øvrige sider skal ikke endres.",
  category: "action",
  status: "pending",
  risk_level: "3",
  created_at: "2026-07-31T18:17:32.85211+00:00",
  action_name: "website_publish_approved_draft",
  source: "kompis",
  resource_type: "kompis_operator_run",
  resource_id: "86ec08bc-b381-414d-8977-e94944e92c47",
  return_to_kompis: true,
  website_path: "/aipify-cms-qa",
  website_locale: "no",
  candidate_id: "535b6964-0aae-4e3b-b2c9-06ddd97a77a3",
  expected_current_version_id: "7b857e0d-fdb0-4a79-8c33-b8be9e24f5fd",
  current_version_id: "7b857e0d-fdb0-4a79-8c33-b8be9e24f5fd",
  action_checksum: "a8e1801860d0dc104b9881bfc95452889da5a72c0aca01666ae02464d4ffa8d1",
  binding_complete: true,
  tool_key: "website_publish_approved_draft",
  run_id: "86ec08bc-b381-414d-8977-e94944e92c47",
  step_id: "177259f5-b24d-4a20-9c32-51fd0bd53014",
  expires_at: null as string | null,
  audit_reference: "bb098f62",
};

test("concrete Production approval builds canonical ECC href", () => {
  const item = mapApprovalToItem({
    action_key: `core_approval:${PRODUCTION_APPROVAL_ID}`,
    action_title: "Kompis website publish",
    action_type: "approval",
    priority: "critical",
    action_status: "pending",
    approval_id: PRODUCTION_APPROVAL_ID,
    record_href: PRODUCTION_HREF,
    summary: productionShape.description,
    source: "kompis",
  });

  assert.equal(item.href, PRODUCTION_HREF);
  assert.equal(item.staleLink, false);
  assert.equal(
    resolveCommandBriefRecordTitleLabelKey(item.title),
    "customerApp.executiveCommandCenter.commandBriefOverview.recordTitles.kompisWebsitePublish",
  );
});

test("ECC navigation never drops UUID when canAccessApprovals is false", () => {
  assert.equal(
    resolveEccApprovalNavigationHref({
      href: PRODUCTION_HREF_WITH_RETURN,
      canAccessApprovals: false,
      staleLink: false,
    }),
    PRODUCTION_HREF_WITH_RETURN,
  );
  assert.equal(
    resolveEccApprovalNavigationHref({
      href: PRODUCTION_HREF,
      canAccessApprovals: false,
    }),
    PRODUCTION_HREF,
  );
});

test("ECC navigation still rewrites bare approvals list without UUID", () => {
  const rewritten = resolveEccApprovalNavigationHref({
    href: "/app/approvals",
    canAccessApprovals: false,
    staleLink: true,
  });
  assert.match(rewritten, /^\/app\/command-center\/approvals\?return=/);
});

test("loader normalizes Production website Kompis shape without throw", () => {
  const detail = normalizeApprovalDetail(productionShape);
  assert.ok(detail);
  assert.equal(detail!.id, PRODUCTION_APPROVAL_ID);
  assert.equal(detail!.websitePath, "/aipify-cms-qa");
  assert.equal(detail!.websiteLocale, "no");
  assert.equal(detail!.bindingComplete, true);
  assert.equal(detail!.decisionAllowed, true);
  assert.equal(detail!.isWebsiteKompisPublish, true);
  assert.equal(detail!.expiresAt, null);
});

test("loader tolerates null optional metadata", () => {
  const detail = normalizeApprovalDetail({
    ...productionShape,
    description: "",
    expires_at: null,
    skill_name: undefined,
    approver_role_required: undefined,
    current_version_id: null,
  });
  assert.ok(detail);
  assert.equal(detail!.decisionAllowed, true);
});

test("incomplete website scope disables decisions without throw", () => {
  const detail = normalizeApprovalDetail({
    ...productionShape,
    candidate_id: null,
    action_checksum: null,
    binding_complete: false,
  });
  assert.ok(detail);
  assert.equal(detail!.bindingComplete, false);
  assert.equal(detail!.decisionAllowed, false);
  assert.equal(detail!.decisionBlockReason, "incomplete_scope");
});

test("selectFocusedApprovalId tolerates null searchParams", () => {
  assert.equal(selectFocusedApprovalId(null), null);
  assert.equal(selectFocusedApprovalId(undefined), null);
  assert.equal(
    selectFocusedApprovalId(new URLSearchParams(`request=${PRODUCTION_APPROVAL_ID}`)),
    PRODUCTION_APPROVAL_ID,
  );
});

test("canonical deep link helper matches Production contract", () => {
  assert.equal(buildApprovalsDeepLink(PRODUCTION_APPROVAL_ID), PRODUCTION_HREF);
});
