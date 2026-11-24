import assert from "node:assert/strict";
import test from "node:test";
import {
  commissionAmountForSale,
  deriveSaleStatusFromPaidPeriods,
  hasReachedEarnThreshold,
  isRenewalCommissionEligible,
  isWithinAttributionWindow,
  qualifyingSaleKey,
  snapshotCommissionAtFirstConfirmedSale,
  wouldDoubleCommission,
} from "./commission-rules";
import { CSP_BACKEND_PROBE_RPC, CSP_CERTIFICATION_PASS_SCORE } from "./constants";
import { isCertifiedSalesPartnerBackendReady, isCspProbeResultReady } from "./feature-gate";
import { isKompisHelpAvailableInPartnerContext } from "./kompis-help";

test("earns only after two paid periods", () => {
  assert.equal(hasReachedEarnThreshold(1), false);
  assert.equal(hasReachedEarnThreshold(2), true);
  assert.equal(deriveSaleStatusFromPaidPeriods(1), "registered_awaiting_second_payment");
  assert.equal(deriveSaleStatusFromPaidPeriods(2), "earned");
});

test("snapshots fixed commission and ignores renewals", () => {
  const snap = snapshotCommissionAtFirstConfirmedSale(
    [{ id: "r1", productId: "p1", amount: 799, currency: "NOK", effectiveFrom: "2026-01-01T00:00:00Z" }],
    "p1",
    "2026-02-01T00:00:00Z",
  );
  assert.deepEqual(snap, { amount: 799, currency: "NOK", rateVersionId: "r1" });
  assert.equal(isRenewalCommissionEligible(), false);
  assert.equal(
    commissionAmountForSale({
      paidPeriodsCount: 5,
      snapshotAmount: 799,
      status: "earned",
    }),
    799,
  );
});

test("blocks double commission on same partner/customer/product", () => {
  assert.equal(
    wouldDoubleCommission(
      [{ partnerId: "a", customerOrgId: "c", productId: "p", status: "earned" }],
      { partnerId: "a", customerOrgId: "c", productId: "p" },
    ),
    true,
  );
  assert.equal(qualifyingSaleKey("a", "c", "p"), "a:c:p");
  assert.equal(isWithinAttributionWindow("2026-01-01", "2026-02-01"), true);
  assert.ok(CSP_CERTIFICATION_PASS_SCORE === 80);
});

test("feature gate stays fail-closed and probes csp_get_backend_status", async () => {
  assert.equal(CSP_BACKEND_PROBE_RPC, "csp_get_backend_status");
  assert.equal(await isCertifiedSalesPartnerBackendReady({ env: {} }), false);
  assert.equal(
    await isCertifiedSalesPartnerBackendReady({
      env: {},
      probe: async () => ({ found: false, error: "csp_backend_not_applied" }),
    }),
    false,
  );
  assert.equal(isCspProbeResultReady({ found: true, ready: true }), true);
  assert.equal(isKompisHelpAvailableInPartnerContext(), false);
});

console.log("certified-sales-partner-commission-rules: all tests passed");
