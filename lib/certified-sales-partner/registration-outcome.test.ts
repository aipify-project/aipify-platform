import assert from "node:assert/strict";
import test from "node:test";
import { callCspRpc, failClosedJson } from "./core-rpc";
import { classifyCspPortalResponse, resolveCspPendingStatus } from "./portal-gate";
import {
  buildCspLoginUrl,
  classifyCspRegistrationResponse,
  CSP_APPLY_NEXT_PATH,
  mapCspRegistrationRpcError,
  parseCspRegistrationApplication,
  resolveCspExistingStatusKey,
} from "./registration-outcome";
import { validateCspRegistration } from "./registration";

const valid = {
  fullName: "Test Partner",
  email: "Partner@Example.com",
  country: "se",
  legalBusinessName: "Example AB",
  businessRegistrationNumber: "556000-0000",
  registeredBusinessConfirmed: true,
  termsAccepted: true,
  certificationUnderstood: true,
  infoAccurateConfirmed: true,
};

test("login url returns to the apply section through the existing partner sign-in", () => {
  assert.equal(CSP_APPLY_NEXT_PATH, "/certified-sales-partner#apply");
  const url = buildCspLoginUrl();
  assert.equal(url, "/login?portal=partner&next=%2Fcertified-sales-partner%23apply");
  const parsed = new URL(url, "https://example.com");
  assert.equal(parsed.pathname, "/login");
  assert.equal(parsed.searchParams.get("next"), "/certified-sales-partner#apply");
});

test("registration validation: country normalised, every confirmation required", () => {
  const ok = validateCspRegistration(valid);
  assert.ok(ok.ok);
  assert.equal(ok.ok && ok.payload.country, "SE");
  assert.equal(ok.ok && ok.payload.email, "partner@example.com");
  for (const [field, code] of [
    ["registeredBusinessConfirmed", "registered_business_confirmation_required"],
    ["termsAccepted", "terms_acceptance_required"],
    ["certificationUnderstood", "certification_acknowledgement_required"],
    ["infoAccurateConfirmed", "accuracy_confirmation_required"],
  ] as const) {
    const bad = validateCspRegistration({ ...valid, [field]: false });
    assert.ok(!bad.ok);
    assert.equal(!bad.ok && bad.error, code);
  }
});

test("rpc error mapping: unauthorized variants become login_required (401)", () => {
  for (const code of ["unauthorized", "Unauthorized", "not_authenticated", "auth_required"]) {
    assert.deepEqual(mapCspRegistrationRpcError(code), { status: 401, code: "login_required" });
  }
});

test("rpc error mapping: confirmation / validation codes stay i18n-friendly (400)", () => {
  assert.deepEqual(mapCspRegistrationRpcError("terms_acceptance_required"), {
    status: 400,
    code: "terms_acceptance_required",
  });
  assert.deepEqual(mapCspRegistrationRpcError("accuracy_confirmation_required"), {
    status: 400,
    code: "accuracy_confirmation_required",
  });
  assert.deepEqual(mapCspRegistrationRpcError("forbidden"), { status: 403, code: "forbidden" });
  assert.equal(mapCspRegistrationRpcError("something_else"), null);
  assert.equal(mapCspRegistrationRpcError(null), null);
});

test("registration response: 401 login_required never claims success", () => {
  const out = classifyCspRegistrationResponse(401, {
    error: "login_required",
    code: "login_required",
    login_url: buildCspLoginUrl(),
  });
  assert.equal(out.kind, "login_required");
  assert.ok(out.kind === "login_required");
  assert.equal(out.loginUrl, buildCspLoginUrl());
});

test("registration response: login_url must be a same-site /login path", () => {
  const out = classifyCspRegistrationResponse(401, { error: "login_required", login_url: "https://evil.example/login" });
  assert.ok(out.kind === "login_required");
  assert.equal(out.loginUrl, buildCspLoginUrl());
  const protocolRelative = classifyCspRegistrationResponse(401, { login_url: "//evil.example/login" });
  assert.ok(protocolRelative.kind === "login_required");
  assert.equal(protocolRelative.loginUrl, buildCspLoginUrl());
});

test("registration response: 200 carrying an unauthorized error is NOT success", () => {
  const out = classifyCspRegistrationResponse(200, { error: "unauthorized" });
  assert.equal(out.kind, "login_required");
  const failed = classifyCspRegistrationResponse(200, { error: "registration_failed" });
  assert.equal(failed.kind, "error");
});

test("registration response: backend closed stays fail-closed", () => {
  assert.equal(classifyCspRegistrationResponse(503, { backend_ready: false }).kind, "backend_closed");
  assert.equal(classifyCspRegistrationResponse(200, { backend_ready: false }).kind, "backend_closed");
});

test("registration response: validation codes pass through for translation", () => {
  const out = classifyCspRegistrationResponse(400, { error: "terms_acceptance_required", code: "terms_acceptance_required" });
  assert.ok(out.kind === "invalid");
  assert.equal(out.code, "terms_acceptance_required");
  const mapped = classifyCspRegistrationResponse(200, { error: "accuracy_confirmation_required" });
  assert.ok(mapped.kind === "invalid");
  assert.equal(mapped.code, "accuracy_confirmation_required");
});

test("registration response: created vs existing is status-aware", () => {
  const created = classifyCspRegistrationResponse(200, { created: true, status: "under_review" });
  assert.deepEqual(created, { kind: "created", partnerStatus: "under_review" });
  const existing = classifyCspRegistrationResponse(200, { created: false, partner: { status: "approved" } });
  assert.deepEqual(existing, { kind: "existing", partnerStatus: "approved" });
  assert.deepEqual(parseCspRegistrationApplication({}), {
    created: null,
    partnerStatus: null,
    partnerId: null,
  });
  assert.equal(resolveCspExistingStatusKey("under_review"), "under_review");
  assert.equal(resolveCspExistingStatusKey("certified"), "approved");
  assert.equal(resolveCspExistingStatusKey("brand_new_status"), "other");
  assert.equal(resolveCspExistingStatusKey(null), "other");
});

test("core rpc: unauthorized and no-partner answers are distinct from backend-not-applied", async () => {
  const rpc = (data: unknown) => ({ rpc: async () => ({ data, error: null }) });
  const unauthorized = await callCspRpc(rpc({ error: "unauthorized" }), "csp_register_partner_application");
  assert.ok(!unauthorized.ready);
  assert.equal(!unauthorized.ready && unauthorized.error, "unauthorized");
  assert.equal(failClosedJson(unauthorized as never).status, 401);

  const raised = await callCspRpc(
    { rpc: async () => ({ data: null, error: { message: "unauthorized" } }) },
    "csp_register_partner_application",
  );
  assert.equal(!raised.ready && raised.error, "unauthorized");

  const none = await callCspRpc(rpc({ found: false, error: "partner_not_found" }), "csp_get_partner_overview");
  assert.equal(!none.ready && none.error, "partner_not_found");
  const noneJson = failClosedJson(none as never);
  assert.equal(noneJson.status, 404);
  assert.equal(noneJson.body.backend_ready, true);

  const notApplied = await callCspRpc(rpc({ found: false }), "csp_get_partner_overview");
  assert.equal(!notApplied.ready && notApplied.error, "csp_backend_not_applied");
  const closed = failClosedJson(notApplied as never);
  assert.equal(closed.status, 503);
  assert.equal(closed.body.backend_ready, false);
});

test("portal gate: backend closed keeps fail-closed, distinct from unauthorized / not registered", () => {
  assert.equal(classifyCspPortalResponse(503, { backend_ready: false, found: false }).kind, "backend_closed");
  assert.equal(classifyCspPortalResponse(200, { found: false }).kind, "backend_closed");
  assert.equal(classifyCspPortalResponse(401, { error: "Unauthorized" }).kind, "unauthorized");
  assert.equal(
    classifyCspPortalResponse(404, { found: false, backend_ready: true, error: "partner_not_found" }).kind,
    "not_registered",
  );
  assert.equal(classifyCspPortalResponse(500, { error: "portal_load_failed" }).kind, "error");
});

test("portal gate: pending statuses get their own panel, approved partners proceed", () => {
  for (const [raw, expected] of [
    ["under_review", "under_review"],
    ["registered", "under_review"],
    ["needs_information", "needs_information"],
    ["rejected", "rejected"],
    ["suspended", "suspended"],
  ] as const) {
    const gate = classifyCspPortalResponse(200, { found: true, partner: { id: "p1", status: raw } });
    assert.ok(gate.kind === "pending");
    assert.equal(gate.status, expected);
  }
  for (const approved of ["approved", "active", "certified", "in_academy"]) {
    assert.equal(classifyCspPortalResponse(200, { partner: { status: approved } }).kind, "ready");
  }
  assert.equal(resolveCspPendingStatus(null), null);
});
