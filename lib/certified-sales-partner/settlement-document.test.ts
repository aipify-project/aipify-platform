import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { applyVerifiedPaidPeriod } from "./payment-periods";
import { commissionAmountForSale, hasReachedEarnThreshold, snapshotCommissionAtFirstConfirmedSale } from "./commission-rules";
import { presentSaleEarn } from "./earn-interval-gate";
import { PERCENT_COMMISSION_STATUS } from "../product-catalog/percent-commission-contract";
import { formatEconomyMoney } from "../platform/economy-display";
import {
  STATEMENT_LOCALES,
  STATEMENT_TITLES,
  buildSettlementDocument,
  readSettlementSource,
  settlementPreviewLines,
} from "./settlement-document";
import { renderSettlementPreviewPdf } from "./settlement-document-pdf";
import { buildSettlementTransitionArgs } from "./settlement-transition-args";

const root = process.cwd();
const idA = "11111111-1111-4111-8111-111111111111";
const idB = "22222222-2222-4222-8222-222222222222";

const snapshot = snapshotCommissionAtFirstConfirmedSale(
  [{ id: "rate-1", productId: "product-1", amount: 1500, currency: "NOK", effectiveFrom: "2026-01-01T00:00:00.000Z" }],
  "product-1",
  "2026-02-01T00:00:00.000Z",
);
assert.equal(snapshot?.amount, 1500);
assert.equal(snapshot?.currency, "NOK");
assert.equal(hasReachedEarnThreshold(1), false);
assert.equal(commissionAmountForSale({ paidPeriodsCount: 1, snapshotAmount: 1500, status: "registered_awaiting_second_payment" }), 0);
assert.equal(commissionAmountForSale({ paidPeriodsCount: 2, snapshotAmount: 1500, status: "earned" }), 1500);
assert.equal(PERCENT_COMMISSION_STATUS, "core_blocked");
const nok = formatEconomyMoney({ amount: 10.126, currency: "NOK", locale: "no" });
const eur = formatEconomyMoney({ amount: 10.5, currency: "EUR", locale: "en" });
assert.equal(nok.state, "value");
assert.equal(eur.state, "value");
if (nok.state === "value") assert.equal(nok.text, "10,13 kr");
if (eur.state === "value") assert.match(eur.text, /10\.50/);

const list = {
  settlements: [
    { id: idA, partner_id: "partner-a", period_month: "2026-10", status: "closed", total_amount: 1500, currency: "NOK", line_count: 2 },
    { id: idB, partner_id: "partner-b", period_month: "2026-10", status: "approved", total_amount: 40, currency: "EUR", line_count: 1 },
  ],
};
const own = readSettlementSource(list, idA);
const other = readSettlementSource(list, idB);
assert.equal(own?.currency, "NOK");
assert.equal(other?.currency, "EUR");
assert.equal(own?.totalAmount, 1500);
assert.equal(other?.totalAmount, 40);
assert.notEqual(own?.currency, other?.currency);
assert.equal(readSettlementSource(list, "33333333-3333-4333-8333-333333333333"), null);

for (const locale of STATEMENT_LOCALES) {
  const file = JSON.parse(readFileSync(join(root, "locales", locale, "partnerSettlements.json"), "utf8")) as {
    statement: { title: string };
  };
  assert.equal(file.statement.title, STATEMENT_TITLES[locale]);
  const model = buildSettlementDocument(own!, locale);
  assert.equal(model.title, STATEMENT_TITLES[locale]);
  assert.equal(model.issued, false);
  assert.equal(model.documentNumber, null);
  assert.equal(model.vatAmount, null);
  assert.equal(model.taxTreatment, "verification_required");
  assert.equal(model.payment, null);
  assert.equal(model.documentType, "commission_statement");
  assert.ok(settlementPreviewLines(model).includes(STATEMENT_TITLES[locale]));
}

const paidWithoutProof = buildSettlementDocument(
  { ...own!, status: "paid", paidAt: null, paymentReference: null },
  "no",
);
assert.equal(paidWithoutProof.payment, null);
assert.equal(paidWithoutProof.status, "paid");

const paidWithProof = buildSettlementDocument(
  { ...own!, status: "paid", paidAt: "2026-11-01T10:00:00.000Z", paymentReference: "BANK-100" },
  "en",
);
assert.equal(paidWithProof.payment?.paymentReference, "BANK-100");

const blocked = buildSettlementTransitionArgs({
  settlementId: idA,
  fromStatus: "closed",
  toStatus: "paid",
  paidAt: "2026-11-01T10:00:00.000Z",
  paymentReference: "BANK-100",
  adminId: "admin-1",
  bankPayoutConfirmed: false,
});
assert.equal(blocked.ok, false);
if (!blocked.ok) assert.equal(blocked.error, "bank_payout_confirmation_required");

const approved = buildSettlementTransitionArgs({
  settlementId: idA,
  fromStatus: "open",
  toStatus: "approved",
  adminId: "admin-1",
});
assert.equal(approved.ok, true);
if (approved.ok) {
  assert.equal(approved.args.p_to, "approved");
  assert.equal(approved.args.p_paid_at, null);
  assert.equal("p_from_status" in approved.args, false);
  assert.equal("document_number" in approved.args, false);
}

const paid = buildSettlementTransitionArgs({
  settlementId: idA,
  fromStatus: "closed",
  toStatus: "paid",
  paidAt: "2026-11-01T10:00:00.000Z",
  paymentReference: "BANK-100",
  adminId: "admin-1",
  bankPayoutConfirmed: true,
});
const paidAgain = buildSettlementTransitionArgs({
  settlementId: idA,
  fromStatus: "closed",
  toStatus: "paid",
  paidAt: "2026-11-01T10:00:00.000Z",
  paymentReference: "BANK-100",
  adminId: "admin-1",
  bankPayoutConfirmed: true,
});
assert.deepEqual(paid, paidAgain);

const annual = presentSaleEarn({ status: "earned", billingInterval: "annual" });
const once = presentSaleEarn({ status: "earned", billingInterval: "one_time" });
const monthly = presentSaleEarn({ status: "earned", billingInterval: "monthly" });
const missing = presentSaleEarn({ status: "earned", billingInterval: null });
assert.equal(annual.status, "core_pending");
assert.equal(annual.presentation.uiMayCountAsEarned, false);
assert.equal(once.status, "core_pending");
assert.equal(monthly.status, "earned");
assert.equal(monthly.presentation.corePending, false);
assert.equal(missing.status, "earned");
assert.equal(missing.presentation.note, "interval_not_on_record");

const refund = applyVerifiedPaidPeriod({
  currentPaidPeriods: 2,
  eventPeriodOrdinal: 2,
  isSuccessfulCharge: false,
  isDuplicate: false,
  isRefundOrChargeback: true,
});
assert.equal(refund.paidPeriods, 2);
assert.equal(refund.needsReversalReview, true);
assert.equal(refund.reason, "needs_reversal_review");

const uk = buildSettlementDocument(own!, "uk");
const pl = buildSettlementDocument(other!, "pl");
async function renderPreviews() {
  const ukPdf = await renderSettlementPreviewPdf(uk);
  const plPdf = await renderSettlementPreviewPdf(pl);
  assert.equal(Buffer.from(ukPdf.subarray(0, 5)).toString(), "%PDF-");
  assert.equal(Buffer.from(plPdf.subarray(0, 5)).toString(), "%PDF-");
  assert.ok(ukPdf.byteLength > 1000);
  assert.ok(settlementPreviewLines(uk).includes("Розрахунок комісійних"));
  assert.ok(settlementPreviewLines(pl).includes("Rozliczenie prowizji"));
}
renderPreviews().then(() => {
  console.log("settlement-document.test.ts PASS");
}).catch((error) => {
  console.error(error);
  process.exit(1);
});
