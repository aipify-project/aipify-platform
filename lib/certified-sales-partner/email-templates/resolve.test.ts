import assert from "node:assert/strict";
import test from "node:test";
import { listPublishedCspEmailTemplates } from "./registry";
import { resolveCspEmailTemplate, escapeCspEmailHtml } from "./resolve";
import { CSP_EMAIL_TEMPLATE_LOCALES } from "./types";
import { cspMarketingProductDescription } from "./product-copy";

const baseValues = {
  seller_display_name: 'Ada "Seller"',
  seller_avatar_url: "",
  seller_company: "Example AS",
  seller_contact: "ada@example.com",
  product_name: "Kompis Web",
  product_description: "Answers from approved content.",
  referral_url: "https://aipify.ai/p/csp-0123456789ab/kompis_web?channel=referral_link&lang=no",
  company_branding: "Aipify",
};

test("published templates include product introduction for kompis_web", () => {
  const list = listPublishedCspEmailTemplates({ productKey: "kompis_web", type: "product_introduction" });
  assert.ok(list.length >= 1);
  assert.equal(list[0]!.published, true);
});

test("Norwegian locale resolves without English fallback", () => {
  const resolved = resolveCspEmailTemplate({
    templateId: "kompis-web-product-introduction-v1",
    locale: "no",
    values: baseValues,
  });
  assert.equal(resolved.ok, true);
  if (!resolved.ok) return;
  assert.match(resolved.subject, /Kompis Web/);
  assert.match(resolved.textBody, /Hei/);
  assert.doesNotMatch(resolved.textBody, /Hello,/);
});

test("all seven marketing locales resolve for published kompis_web introduction", () => {
  for (const locale of CSP_EMAIL_TEMPLATE_LOCALES) {
    const resolved = resolveCspEmailTemplate({
      templateId: "kompis-web-product-introduction-v1",
      locale,
      values: {
        ...baseValues,
        product_description: cspMarketingProductDescription("kompis_web", locale),
      },
    });
    assert.equal(resolved.ok, true, `locale ${locale} should resolve`);
    if (!resolved.ok) continue;
    assert.match(resolved.subject, /Kompis Web/);
    assert.ok(resolved.textBody.includes("Ada \"Seller\"") || resolved.textBody.includes("Ada"));
  }
});

test("unknown marketing locale stays unavailable — never silent English fallback", () => {
  const resolved = resolveCspEmailTemplate({
    templateId: "kompis-web-product-introduction-v1",
    locale: "fr",
    values: baseValues,
  });
  assert.equal(resolved.ok, false);
  if (resolved.ok) return;
  assert.equal(resolved.reason, "locale_unavailable");
});

test("HTML placeholders are escaped", () => {
  const resolved = resolveCspEmailTemplate({
    templateId: "kompis-web-product-introduction-v1",
    locale: "en",
    values: { ...baseValues, seller_display_name: "<script>alert(1)</script>" },
  });
  assert.equal(resolved.ok, true);
  if (!resolved.ok) return;
  assert.doesNotMatch(resolved.htmlBody, /<script>/);
  assert.match(resolved.htmlBody, /&lt;script&gt;/);
  assert.equal(escapeCspEmailHtml(`a&b`), "a&amp;b");
});

test("unpublished bedrift template cannot resolve for send", () => {
  const resolved = resolveCspEmailTemplate({
    templateId: "kompis-bedrift-product-introduction-v1",
    locale: "en",
    values: baseValues,
  });
  assert.equal(resolved.ok, false);
  if (resolved.ok) return;
  assert.equal(resolved.reason, "template_not_published");
});

test("product description uses approved sales-copy locale when present", () => {
  const no = cspMarketingProductDescription("kompis_web", "no");
  const pl = cspMarketingProductDescription("kompis_web", "pl");
  assert.match(no, /Kompis Web/);
  assert.match(pl, /Kompis Web/);
  assert.notEqual(no, pl);
});
