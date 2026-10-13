import assert from "node:assert/strict";
import {
  buildCustomerInvoiceWorkspace,
  classifyCustomerInvoiceBucket,
  resolveVerifiedPaymentUrl,
} from "./customer-invoice-view-model";
import type { EnterpriseInvoice } from "./types";

function invoice(partial: Partial<EnterpriseInvoice> & Pick<EnterpriseInvoice, "id" | "status">): EnterpriseInvoice {
  return {
    tenant_id: "tenant",
    tenant_name: "Org",
    invoice_number: `INV-${partial.id}`,
    plan_key: null,
    description: "Subscription",
    amount: 1000,
    tax_amount: 250,
    total_amount: 1250,
    amount_paid: 0,
    currency: "NOK",
    payment_terms: "net_30",
    due_date: "2026-11-01",
    purchase_order_number: "",
    internal_reference: "",
    billing_method: "invoice",
    dnb_kid: "",
    bank_reference: "",
    sent_at: null,
    viewed_at: null,
    approved_at: null,
    paid_at: null,
    created_at: "2026-10-01T00:00:00Z",
    updated_at: "2026-10-01T00:00:00Z",
    is_overdue: false,
    suggest_reminder: false,
    ...partial,
  };
}

assert.equal(classifyCustomerInvoiceBucket(invoice({ id: "1", status: "paid" })), "paid");
assert.equal(classifyCustomerInvoiceBucket(invoice({ id: "2", status: "overdue", is_overdue: true })), "overdue");
assert.equal(classifyCustomerInvoiceBucket(invoice({ id: "3", status: "sent" })), "awaiting_payment");
assert.equal(classifyCustomerInvoiceBucket(invoice({ id: "4", status: "cancelled" })), "other");

assert.equal(resolveVerifiedPaymentUrl(invoice({ id: "5", status: "sent" })), null);
assert.equal(
  resolveVerifiedPaymentUrl({
    ...invoice({ id: "6", status: "sent" }),
    payment_url: "https://pay.example/checkout",
  } as EnterpriseInvoice & { payment_url: string }),
  "https://pay.example/checkout"
);

const workspace = buildCustomerInvoiceWorkspace([
  invoice({ id: "paid", status: "paid", paid_at: "2026-09-01T00:00:00Z", amount_paid: 1250 }),
  invoice({ id: "due-soon", status: "sent", due_date: "2026-10-20" }),
  invoice({ id: "late", status: "overdue", is_overdue: true, due_date: "2026-09-15" }),
]);

assert.equal(workspace.nextDue?.invoice.id, "late");
assert.equal(workspace.overdue.length, 1);
assert.equal(workspace.awaitingPayment.length, 1);
assert.equal(workspace.paid.length, 1);
assert.equal(workspace.nextDue?.canPayOnline, false);
assert.equal(workspace.nextDue?.hasOriginalPdf, false);

console.log("customer-invoice-view-model.test.ts: all assertions passed");
