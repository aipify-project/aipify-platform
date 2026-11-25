import assert from "node:assert/strict";
import test from "node:test";
import { evaluateSalesLinkGates, parsePartnerOverview } from "./partner-overview";

const PRODUCT_ID = "11111111-1111-4111-8111-111111111111";

const overview = (partnerStatus: string, certStatus: string, published = true) =>
  parsePartnerOverview({
    found: true,
    partner: { id: "p1", display_name: "Test Partner", status: partnerStatus },
    products: published
      ? [{ id: PRODUCT_ID, product_key: "kompis_web", fixed_commission_amount: "100", currency: "NOK", certification_status: certStatus }]
      : [],
    certifications: [{ product_id: PRODUCT_ID, product_key: "kompis_web", status: certStatus, score: 90, passed_at: "2026-01-01T00:00:00Z" }],
  });

test("link gates: all derived gates satisfied by key or id", () => {
  for (const ref of ["kompis_web", PRODUCT_ID]) {
    const r = evaluateSalesLinkGates(overview("approved", "passed"), ref);
    assert.equal(r.allowed, true);
    assert.equal(r.productId, PRODUCT_ID);
  }
});

test("link gates: unapproved partner, unpublished product, or missing certification each block", () => {
  assert.equal(evaluateSalesLinkGates(overview("under_review", "passed"), "kompis_web").allowed, false);
  assert.equal(evaluateSalesLinkGates(overview("approved", "not_started"), "kompis_web").allowed, false);
  assert.equal(evaluateSalesLinkGates(overview("approved", "passed", false), "kompis_web").allowed, false);
  assert.equal(evaluateSalesLinkGates(overview("approved", "passed"), "unknown_product").allowed, false);
});

test("link gates: explicit agreement_accepted=false blocks; malformed payload never allows", () => {
  const o = parsePartnerOverview({
    partner: { id: "p1", status: "approved", agreement_accepted: false },
    products: [{ id: PRODUCT_ID, product_key: "kompis_web", certification_status: "passed" }],
  });
  assert.equal(evaluateSalesLinkGates(o, "kompis_web").allowed, false);
  for (const bad of [null, undefined, "x", 42, [], { partner: "x", products: "y" }]) {
    assert.equal(evaluateSalesLinkGates(parsePartnerOverview(bad), "kompis_web").allowed, false);
  }
});
