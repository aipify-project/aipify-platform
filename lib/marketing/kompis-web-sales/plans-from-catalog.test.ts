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
assert.equal(truth.proAnswerQuota, 10000);
assert.equal(truth.pro.id, "pro");
assert.equal(truth.paidCurrency, "NOK");
assert.equal(truth.paidMonthlyDisplay, "599");
assert.equal(truth.checkoutEnabled, false);
assert.equal(truth.offerStatus, "planned");

const labels = parseKompisWebSalesLabels(enMarketing as Record<string, unknown>);
assert.equal(labels.benefits.items.length, 5);
assert.equal(labels.how.steps.length, 4);
assert.ok(labels.faq.items.length >= 5);
assert.equal(labels.hrefs.start, "/start");
assert.equal(labels.hrefs.contact, "/contact/support");
assert.equal(labels.hrefs.becomeSeller, "/certified-sales-partner#apply");
assert.equal(labels.hrefs.contactMailto, "mailto:hello@aipify.ai");
assert.equal(labels.footer.becomeSeller, "Become a seller");
assert.ok(labels.growthPartners.cta.length > 0);
assert.ok(labels.pricing.free.quota.includes("150"));
assert.equal(labels.pricing.free.quotaFigure, "150");
assert.ok(labels.pricing.free.noCardPill.length > 0);
assert.ok(labels.pricing.paid.quota.includes("2500"));
assert.equal(labels.pricing.paid.quotaFigure, "2,500");
assert.ok(labels.pricing.paid.priceMonthly.includes("599"));
assert.ok(labels.pricing.paid.priceNote.length > 0);
assert.equal(labels.pricing.paid.cta, "Start free");
assert.equal(truth.proMonthlyDisplay, "1 199");
assert.equal(truth.proAnnualDisplay, "11 990");
assert.ok(labels.pricing.pro.quota.includes("10000") || labels.pricing.pro.quota.includes("10,000"));
assert.equal(labels.pricing.pro.quotaFigure, "10,000");
assert.ok(labels.pricing.pro.priceMonthly.includes("1 199"));
assert.ok(labels.pricing.pro.priceNote.length > 0);
assert.equal(labels.pricing.pro.cta, "Start free");
assert.ok(labels.pricing.pro.checkoutUnavailable.toLowerCase().includes("checkout"));
assert.ok(labels.demo.illustrationBadge.toLowerCase().includes("illustration"));

console.log("kompis-web-sales plans/labels: PASS");
