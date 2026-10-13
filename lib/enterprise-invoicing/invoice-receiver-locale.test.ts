/**
 * Guards the locale root cause behind raw "NEXT DUE TITLE" / "Empty" UI text:
 * account invoices must load customer-app `core` where enterpriseInvoicing lives.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const page = fs.readFileSync(path.join(ROOT, "app/app/account/invoices/page.tsx"), "utf8");
const panel = fs.readFileSync(
  path.join(ROOT, "components/shared/enterprise-invoicing/EnterpriseInvoiceDetailsPanel.tsx"),
  "utf8"
);

assert.match(page, /getCustomerAppDictionaryForSplits/);
assert.match(page, /["']core["']/);
assert.match(page, /portalStructure/);
assert.doesNotMatch(panel, /billingProfileToggle/);
assert.doesNotMatch(panel, /showProfile/);
assert.doesNotMatch(panel, /upsert_enterprise_billing_profile|\/api\/enterprise-invoicing\/profile/);
assert.match(panel, /nextDueEmptyBody/);
assert.match(panel, /historyEmptyTitle/);
assert.match(panel, /border-\[var\(--app-border/);

const en = JSON.parse(
  fs.readFileSync(path.join(ROOT, "locales/en/customer-app/core.json"), "utf8")
) as { enterpriseInvoicing: { customerWorkspace: Record<string, string> } };
const cw = en.enterpriseInvoicing.customerWorkspace;
assert.ok(cw.nextDueEmptyBody);
assert.ok(cw.historyEmptyTitle);
assert.ok(cw.historyEmptyBody);
assert.ok(cw.requiresPayment);

console.log("invoice-receiver-locale.test.ts: all assertions passed");
