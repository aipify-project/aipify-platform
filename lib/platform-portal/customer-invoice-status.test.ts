import assert from "node:assert/strict";
import test from "node:test";
import { formatEconomyCount, formatEconomyMoney } from "@/lib/platform/economy-display";
import {
  buildZeroAmountInvoicePreview,
  calendarDateInTimeZone,
  classifyPlatformInvoice,
  summarizePlatformInvoices,
} from "./customer-invoice-status";

const today = "2026-11-27";

function row(
  partial: Parameters<typeof classifyPlatformInvoice>[0],
): Parameters<typeof classifyPlatformInvoice>[0] {
  return {
    id: "inv",
    invoiceNumber: "AIP-INV-000001",
    currency: "NOK",
    amount: 100,
    dueDate: "2026-11-01",
    issuedAt: "2026-10-01",
    ...partial,
  };
}

test("paid, open, overdue, partial, zero, credit, cancelled, and unknown", () => {
  const paid = classifyPlatformInvoice(row({ status: "paid", dueDate: "2026-01-01" }), today);
  assert.equal(paid.ok && paid.presentation, "paid");
  const open = classifyPlatformInvoice(row({ status: "sent", dueDate: "2026-12-01", amount: 100 }), today);
  assert.equal(open.ok && open.presentation, "open");
  const overdue = classifyPlatformInvoice(row({ status: "sent", dueDate: "2026-11-26", amount: 50 }), today);
  assert.equal(overdue.ok && overdue.presentation, "overdue");
  assert.equal(overdue.ok && overdue.outstanding, 50);

  const storedOverdueButNotDue = classifyPlatformInvoice(
    row({ status: "overdue", dueDate: "2026-12-01", amount: 50 }),
    today,
  );
  assert.equal(storedOverdueButNotDue.ok && storedOverdueButNotDue.presentation, "open");

  const dueToday = classifyPlatformInvoice(row({ status: "sent", dueDate: "2026-11-27", amount: 10 }), today);
  assert.equal(dueToday.ok && dueToday.presentation, "open");

  const partial = classifyPlatformInvoice(
    row({ status: "partially_paid", amount: 100, amountPaid: 40, dueDate: "2026-11-01" }),
    today,
  );
  assert.equal(partial.ok && partial.presentation, "overdue");
  assert.equal(partial.ok && partial.outstanding, 60);

  const partialFuture = classifyPlatformInvoice(
    row({ status: "partially_paid", amount: 100, amountPaid: 40, dueDate: "2026-12-15" }),
    today,
  );
  assert.equal(partialFuture.ok && partialFuture.presentation, "open");

  assert.equal(
    classifyPlatformInvoice(row({ status: "partially_paid", amountPaid: null, dueDate: "2026-11-01" }), today).ok,
    false,
  );

  const zeroOpen = classifyPlatformInvoice(row({ status: "sent", amount: 0, dueDate: "2026-01-01" }), today);
  assert.equal(zeroOpen.ok && zeroOpen.presentation, "zero_open");

  const zeroPaid = classifyPlatformInvoice(row({ status: "paid", amount: 0 }), today);
  assert.equal(zeroPaid.ok && zeroPaid.presentation, "paid");

  const credited = classifyPlatformInvoice(row({ status: "credited", amount: -10, currency: "NOK" }), today);
  assert.equal(credited.ok && credited.presentation, "credited");
  const cancelled = classifyPlatformInvoice(row({ status: "cancelled", amount: 80 }), today);
  assert.equal(cancelled.ok && cancelled.presentation, "cancelled");
  const failedStatus = classifyPlatformInvoice(row({ status: "failed", amount: 80 }), today);
  assert.equal(failedStatus.ok && failedStatus.presentation, "failed");
  const draft = classifyPlatformInvoice(row({ status: "draft", amount: 80, dueDate: "2026-01-01" }), today);
  assert.equal(draft.ok && draft.presentation, "draft");
  assert.equal(classifyPlatformInvoice(row({ status: "mystery" }), today).ok, false);
  assert.equal(classifyPlatformInvoice(row({ status: "sent", amount: null }), today).ok, false);
  assert.equal(classifyPlatformInvoice(row({ status: "sent", currency: "kr" }), today).ok, false);
});

test("summary separates currencies, refuses incomplete reads, and keeps zero paid out of overdue", () => {
  const summary = summarizePlatformInvoices({
    complete: true,
    today,
    nextBillingDate: "2026-12-01T00:00:00Z",
    invoices: [
      row({ id: "1", status: "sent", amount: 100, currency: "NOK", dueDate: "2026-11-01", issuedAt: "2026-10-02" }),
      row({ id: "2", status: "sent", amount: 299, currency: "EUR", dueDate: "2026-11-20", issuedAt: "2026-10-03" }),
      row({ id: "3", status: "paid", amount: 10, currency: "NOK", dueDate: "2026-10-01", issuedAt: "2026-09-01" }),
      row({ id: "4", status: "paid", amount: 5, currency: "EUR", issuedAt: "2026-09-02" }),
      row({ id: "5", status: "sent", amount: 0, currency: "NOK", dueDate: "2026-01-01", issuedAt: "2026-10-04" }),
      row({ id: "6", status: "cancelled", amount: 999, currency: "NOK", issuedAt: "2026-10-05" }),
      row({ id: "7", status: "sent", amount: 20, currency: "NOK", dueDate: "2026-12-20", issuedAt: "2026-11-01" }),
    ],
  });
  assert.equal(summary.readState, "ready");
  assert.equal(summary.overdueCount, 2);
  assert.equal(summary.paidCount, 2);
  assert.deepEqual(summary.overdueAmounts, [
    { currency: "EUR", amount: 299 },
    { currency: "NOK", amount: 100 },
  ]);
  assert.deepEqual(summary.paidAmounts, [
    { currency: "EUR", amount: 5 },
    { currency: "NOK", amount: 10 },
  ]);
  assert.equal(summary.paidMeasure, "summed_paid_amount");
  assert.equal(summary.latest?.id, "7");
  assert.equal(summary.latest?.presentation, "open");
  assert.equal(summary.nextBillingDate, "2026-12-01");

  const failed = summarizePlatformInvoices({
    complete: true,
    today,
    invoices: [row({ status: "sent", amount: null })],
  });
  assert.equal(failed.readState, "unavailable");
  assert.equal(failed.overdueCount, 0);

  const incomplete = summarizePlatformInvoices({ complete: false, today, invoices: [] });
  assert.equal(incomplete.readState, "unavailable");

  const empty = summarizePlatformInvoices({ complete: true, today, invoices: [] });
  assert.equal(empty.readState, "ready");
  assert.equal(empty.overdueCount, 0);
  assert.equal(empty.paidCount, 0);
  assert.equal(empty.latest, null);
  assert.equal(empty.nextBillingDate, null);
});

test("timezone boundary uses the calendar date in the given zone", () => {
  const oslo = calendarDateInTimeZone(new Date("2026-11-26T23:30:00.000Z"), "Europe/Oslo");
  const utc = calendarDateInTimeZone(new Date("2026-11-26T23:30:00.000Z"), "UTC");
  assert.equal(oslo, "2026-11-27");
  assert.equal(utc, "2026-11-26");
  const beforeMidnight = classifyPlatformInvoice(
    row({ status: "sent", dueDate: "2026-11-26", amount: 1 }),
    utc,
  );
  const afterMidnight = classifyPlatformInvoice(
    row({ status: "sent", dueDate: "2026-11-26", amount: 1 }),
    oslo,
  );
  assert.equal(beforeMidnight.ok && beforeMidnight.presentation, "open");
  assert.equal(afterMidnight.ok && afterMidnight.presentation, "overdue");
});

test("money format keeps counts as counts and NOK as kr", () => {
  const nok = formatEconomyMoney({ amount: 0, currency: "NOK", locale: "no" });
  const eur = formatEconomyMoney({ amount: 299, currency: "EUR", locale: "no" });
  const count = formatEconomyCount(0, "no");
  assert.equal(nok.state === "value" && nok.text, "0,00 kr");
  assert.equal(eur.state === "value" && eur.text, "299,00 EUR");
  assert.equal(count.state === "value" && count.text, "0");
});

test("zero-amount preview is not an issued invoice and creates no payment", () => {
  const preview = buildZeroAmountInvoicePreview();
  assert.equal(preview.issued, false);
  assert.equal(preview.persisted, false);
  assert.equal(preview.emailed, false);
  assert.equal(preview.booked, false);
  assert.equal(preview.paymentEvent, false);
  assert.equal(preview.source, "contract_fixture");
  assert.equal(preview.seller.legalName, "Aipify Group AS");
  assert.equal(preview.line.description, "Aipify APP – Ubegrenset");
  assert.equal(preview.line.quantity, 1);
  assert.equal(preview.totalAmount, 0);
  assert.equal(preview.vatAmount, 0);
  assert.equal(preview.statusWhenStillOpen, "zero_open");
  assert.equal(preview.statusWhenLedgerSaysPaid, "paid");
  assert.equal(preview.recipientPlaceholder, "ORGANIZATION");
});
