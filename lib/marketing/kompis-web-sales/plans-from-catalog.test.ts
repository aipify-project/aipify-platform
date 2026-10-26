import assert from "node:assert/strict";
import {
  assertSalesPlansStayInCatalog,
  getKompisWebSalesPlanTruth,
  KOMPIS_WEB_SALES_PAID_PLAN_ID,
} from "./plans-from-catalog";
import { parseKompisWebSalesLabels } from "./labels";
import enMarketing from "../../../locales/en/marketing.json";

assertSalesPlansStayInCatalog();
const truth = getKompisWebSalesPlanTruth();
assert.equal(truth.freeAnswerQuota, 150);
assert.equal(truth.freeRequiresCard, false);
assert.equal(truth.paid.id, KOMPIS_WEB_SALES_PAID_PLAN_ID);
assert.equal(truth.paidAnswerQuota, 2500);
assert.equal(truth.paidCurrency, "NOK");
assert.equal(truth.paidMonthlyDisplay, "599");
assert.equal(truth.checkoutEnabled, false);
assert.equal(truth.offerStatus, "planned");

const labels = parseKompisWebSalesLabels(enMarketing as Record<string, unknown>);
assert.equal(labels.benefits.items.length, 5);
assert.equal(labels.how.steps.length, 4);
assert.ok(labels.faq.items.length >= 5);
assert.equal(labels.hrefs.register, "/register");
assert.ok(labels.pricing.free.quota.includes("150"));
assert.ok(labels.pricing.paid.quota.includes("2500"));
assert.ok(labels.pricing.paid.priceMonthly.includes("599"));
assert.ok(labels.demo.illustrationBadge.toLowerCase().includes("illustration"));

console.log("kompis-web-sales plans/labels: PASS");
