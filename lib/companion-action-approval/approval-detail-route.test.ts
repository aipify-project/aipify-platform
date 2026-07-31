import assert from "node:assert/strict";
import test from "node:test";
import {
  buildApprovalsDeepLink,
  extractApprovalRequestIdFromHref,
  isApprovalRequestUuid,
  resolveApprovalDetailHref,
  selectFocusedApprovalId,
} from "./parse";

const SAMPLE_ID = "11111111-1111-4111-8111-111111111111";

test("canonical deep link uses request query param", () => {
  assert.equal(buildApprovalsDeepLink(SAMPLE_ID), `/app/approvals?request=${SAMPLE_ID}`);
});

test("selectFocusedApprovalId accepts only UUID request param", () => {
  assert.equal(selectFocusedApprovalId(new URLSearchParams(`request=${SAMPLE_ID}`)), SAMPLE_ID);
  assert.equal(selectFocusedApprovalId(new URLSearchParams("request=not-a-uuid")), null);
  assert.equal(selectFocusedApprovalId(new URLSearchParams(`id=${SAMPLE_ID}`)), null);
  assert.equal(selectFocusedApprovalId(new URLSearchParams(`approval=${SAMPLE_ID}`)), null);
});

test("resolveApprovalDetailHref prefers approval_id over bare list href", () => {
  assert.equal(
    resolveApprovalDetailHref({
      record_href: "/app/approvals",
      approval_id: SAMPLE_ID,
    }),
    `/app/approvals?request=${SAMPLE_ID}`,
  );
  assert.equal(resolveApprovalDetailHref({ record_href: "/app/approvals" }), null);
  assert.equal(
    resolveApprovalDetailHref({ record_href: `/app/approvals?request=${SAMPLE_ID}` }),
    `/app/approvals?request=${SAMPLE_ID}`,
  );
});

test("extractApprovalRequestIdFromHref rejects non-canonical params", () => {
  assert.equal(extractApprovalRequestIdFromHref(`/app/approvals?id=${SAMPLE_ID}`), null);
  assert.equal(extractApprovalRequestIdFromHref(`/app/approvals?request=${SAMPLE_ID}`), SAMPLE_ID);
  assert.equal(isApprovalRequestUuid("not-uuid"), false);
});
