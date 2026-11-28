import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import {
  ACTIVATION_ACTIONS,
  ACTIVATION_CODE_LOCKS,
  ACTIVATION_READINESS,
  COMMERCIAL_ACTIVATION_YES_PACKAGES,
  ActivationBlockedError,
  activationMatrixAgreesWithMasterSwitches,
  assertActivationAllowed,
  evaluateActivation,
  listOpenOwnerApprovals,
  resolveActivationReadiness,
} from "./activation-gates";
import { COMMERCIAL_BILLING_SQL_CANDIDATES } from "./contract";
import { AGENT_CONTRACT_RULES } from "./agent-contracts";

const root = process.cwd();

test("activation matrix: writers always false; Staging foundation evidence true by default", () => {
  const m = ACTIVATION_READINESS;
  assert.equal(m.stagingFoundationApplied, true);
  assert.equal(m.productionFoundationApplied, false);
  assert.equal(m.snapshotRpcAvailable, false);
  assert.equal(m.stripeLive, false);
  assert.equal(m.checkoutLive, false);
  assert.equal(m.payoutLive, false);
  assert.equal(m.percentCommission, false);
  assert.equal(m.invoiceSend, false);
  assert.equal(ACTIVATION_CODE_LOCKS.writersEnabledInCode, false);
  assert.equal(activationMatrixAgreesWithMasterSwitches(), true);
});

test("evaluateActivation fail-closed for every writer action", () => {
  for (const action of ACTIVATION_ACTIONS) {
    const d = evaluateActivation(action);
    if (action === "read_license_snapshot_rpc") {
      // Snapshot RPC not available → still denied via gate_closed
      assert.equal(d.allowed, false);
      continue;
    }
    assert.equal(d.allowed, false, action);
    assert.ok(d.reasons.includes("writer_locked_in_code") || d.reasons.includes("owner_approval_required"));
  }
});

test("assertActivationAllowed throws ActivationBlockedError for writers", () => {
  assert.throws(
    () => assertActivationAllowed("create_live_checkout_session"),
    (err: unknown) => err instanceof ActivationBlockedError,
  );
});

test("resolveActivationReadiness ignores writer flips from callers", () => {
  const r = resolveActivationReadiness({
    stripeLive: true,
    checkoutLive: true,
    stagingFoundationApplied: true,
  } as never);
  assert.equal(r.stripeLive, false);
  assert.equal(r.checkoutLive, false);
  assert.equal(r.stagingFoundationApplied, true);
});

test("open owner approvals include Production foundation + snapshot split", () => {
  const open = listOpenOwnerApprovals();
  const keys = open.map((o) => o.key);
  assert.ok(keys.includes("production_sql_apply_license_foundation"));
  assert.ok(keys.includes("staging_apply_snapshot_read_rpc_only"));
  assert.ok(keys.includes("execute_grant_role_matrix"));
  assert.ok(keys.includes("stripe_live_activation_and_secrets"));
});

test("YES packages pin full SHAs matching SQL candidates on disk", () => {
  assert.equal(
    COMMERCIAL_ACTIVATION_YES_PACKAGES.foundationProduction.sqlSha256,
    COMMERCIAL_BILLING_SQL_CANDIDATES.foundation.sha256,
  );
  assert.equal(
    COMMERCIAL_ACTIVATION_YES_PACKAGES.snapshotReadStaging.sqlSha256,
    COMMERCIAL_BILLING_SQL_CANDIDATES.snapshotRead.sha256,
  );

  for (const pkg of [
    COMMERCIAL_ACTIVATION_YES_PACKAGES.foundationProduction,
    COMMERCIAL_ACTIVATION_YES_PACKAGES.snapshotReadStaging,
  ]) {
    const sql = join(root, pkg.sqlPath);
    assert.equal(existsSync(sql), true, pkg.sqlPath);
    const hash = createHash("sha256").update(readFileSync(sql)).digest("hex");
    assert.equal(hash, pkg.sqlSha256, pkg.sqlPath);
    assert.equal(existsSync(join(root, pkg.doc)), true, pkg.doc);
  }
});

test("Agent 2/3/4 contract rules: no purchase CTA; analytics verified-only; no statusbar mutate", () => {
  assert.equal(AGENT_CONTRACT_RULES.agent2.purchaseCtaFromThisModule, false);
  assert.equal(AGENT_CONTRACT_RULES.agent3.analyticsPurchaseRequiresVerifiedPayment, true);
  assert.equal(AGENT_CONTRACT_RULES.agent4.mutatesGlobalStatusbar, false);
});
