import assert from "node:assert/strict";
import test from "node:test";
import type { CheckoutContext } from "./checkout";
import {
  assertAttributionBoundToTenant,
  assertPriceVersionImmutable,
  buildFreeAccessEntitlement,
  buildPriceMappingIndex,
  computePriceVersionId,
  createTestCheckoutAdapter,
  createTestPriceAdapter,
  interpretCheckoutReturn,
  isLiveStripeMappingEnabled,
  LIVE_CHECKOUT_ADAPTER_DISABLED,
  LIVE_PRICE_ADAPTER_DISABLED,
  majorToMinorExact,
  parseMinorAmount,
  planProductCenterStripeMapping,
  prepareCheckoutIntent,
  resolveMappedPrice,
  resolveSalesAttribution,
  validateServerPricing,
  type ApprovedDiscount,
  type PriceVersionMapping,
} from "./index";
import {
  APPROVED_SELLER,
  attributedIntent,
  checkoutContext,
  makeIntent,
  mapping,
  MONTHLY,
  MONTHLY_GROSS,
  NOW,
  ONE_TIME,
  ONE_TIME_GROSS,
  OPEN_GATE,
  price,
  PROD_GATE,
  request,
  SALES_CODE,
  salesLink,
  T_A,
  T_B,
  variant,
  YEARLY,
  YEARLY_GROSS,
} from "./test-fixtures";

// --------------------------------------------------------------------- money

test("money: explicit 0 is valid, null/undefined/NaN are missing, floats and negatives rejected", () => {
  assert.deepEqual(parseMinorAmount(0), { ok: true, value: 0 });
  assert.deepEqual(parseMinorAmount(null), { ok: false, reason: "missing" });
  assert.deepEqual(parseMinorAmount(undefined), { ok: false, reason: "missing" });
  assert.deepEqual(parseMinorAmount(Number.NaN), { ok: false, reason: "missing" });
  assert.deepEqual(parseMinorAmount(10.5), { ok: false, reason: "not_integer" });
  assert.deepEqual(parseMinorAmount(-1), { ok: false, reason: "negative" });
  assert.deepEqual(majorToMinorExact(599, "NOK"), { ok: true, value: 59900 });
  assert.deepEqual(majorToMinorExact(599.99, "NOK"), { ok: true, value: 59999 });
  assert.deepEqual(majorToMinorExact(599.999, "NOK"), { ok: false, reason: "not_integer" });
  assert.deepEqual(majorToMinorExact(500, "JPY"), { ok: true, value: 500 });
  assert.deepEqual(majorToMinorExact(0, "NOK"), { ok: true, value: 0 });
  assert.deepEqual(majorToMinorExact(null, "NOK"), { ok: false, reason: "missing" });
});

// ------------------------------------------------------------ C. stripe mapping

test("C: monthly / yearly / one-time are planned independently with immutable content-addressed ids", () => {
  const plan = planProductCenterStripeMapping({
    variants: [variant({ oneTimePrice: price("one_time", 1000) })],
  });
  assert.equal(plan.paidCount, 3);
  assert.equal(plan.providerWritesPerformed, false);
  const ids = plan.entries.map((e) => (e.kind === "paid" ? e.priceVersionId : null));
  assert.equal(new Set(ids).size, 3);
  const month = plan.entries.find((e) => e.kind === "paid" && e.interval === "month");
  assert.ok(month && month.kind === "paid");
  if (month?.kind === "paid") {
    assert.equal(month.amountMinor, 59900);
    assert.equal(month.action, "create_provider_price_required");
    assert.equal(month.priceVersionId, MONTHLY.priceVersionId);
  }
  // Yearly is its own amount — never 12 × monthly.
  const year = plan.entries.find((e) => e.kind === "paid" && e.interval === "year");
  assert.ok(year?.kind === "paid" && year.amountMinor === 599000);
});

test("C: explicit 0 is free access (no provider price); null is blocked — 0 ≠ null", () => {
  const plan = planProductCenterStripeMapping({
    variants: [variant({ monthlyPrice: price("month", 0), yearlyPrice: price("year", null, { amountMinor: null }) })],
  });
  const m = plan.entries.find((e) => e.interval === "month");
  const y = plan.entries.find((e) => e.interval === "year");
  assert.equal(m?.kind, "free_access");
  assert.equal(y?.kind, "blocked");
  assert.equal(y?.kind === "blocked" && y.reason, "amount_missing");
  assert.equal(plan.freeAccessCount, 1);
  assert.equal(plan.blockedCount, 1);
});

test("C: no fallback — absent interval produces no entry; bad data is blocked with a reason", () => {
  const onlyMonthly = planProductCenterStripeMapping({ variants: [variant({ yearlyPrice: null })] });
  assert.equal(onlyMonthly.entries.length, 1);
  assert.equal(onlyMonthly.entries[0].interval, "month");

  const cases: Array<[Parameters<typeof variant>[0], string]> = [
    [{ active: false }, "variant_inactive"],
    [{ monthlyPrice: price("month", 599, { vatLabel: "unknown" }) }, "vat_label_unknown"],
    [{ monthlyPrice: price("month", 599, { currency: "krone" }) }, "currency_invalid"],
    [{ monthlyPrice: price("month", 599, { amountMinor: 12345 }) }, "major_minor_mismatch"],
    [{ monthlyPrice: price("month", 599.999, { amountMinor: null }) }, "amount_not_exact_minor"],
    [{ monthlyPrice: price("month", -5, { amountMinor: null }) }, "amount_negative"],
  ];
  for (const [over, reason] of cases) {
    const plan = planProductCenterStripeMapping({ variants: [variant({ ...over, yearlyPrice: null })] });
    const e = plan.entries[0];
    assert.equal(e.kind, "blocked", reason);
    assert.equal(e.kind === "blocked" && e.reason, reason);
  }
});

test("C: existing mapping is reused; a changed amount creates a NEW version that supersedes, never mutates", () => {
  const same = planProductCenterStripeMapping({ variants: [variant({ yearlyPrice: null })], existingMappings: [MONTHLY] });
  const e = same.entries[0];
  assert.ok(e.kind === "paid" && e.action === "reuse_existing" && e.providerPriceId === MONTHLY.providerPriceId);

  const changed = planProductCenterStripeMapping({
    variants: [variant({ yearlyPrice: null, monthlyPrice: price("month", 699) })],
    existingMappings: [MONTHLY],
  });
  const c = changed.entries[0];
  assert.ok(c.kind === "paid");
  if (c.kind === "paid") {
    assert.notEqual(c.priceVersionId, MONTHLY.priceVersionId);
    assert.equal(c.supersedesPriceVersionId, MONTHLY.priceVersionId);
    assert.equal(c.action, "create_provider_price_required");
  }
  // Same id with different content is a forbidden mutation.
  assert.deepEqual(assertPriceVersionImmutable(MONTHLY, { ...MONTHLY, amountMinor: 1 }), { ok: false, reason: "price_version_mutation_forbidden" });
  assert.deepEqual(assertPriceVersionImmutable(MONTHLY, { ...MONTHLY }), { ok: true });
  assert.equal(
    computePriceVersionId({ productKey: "kompis_web", variantKey: "standard", interval: "month", currency: "nok", amountMinor: 59900, vatLabel: "exclusive" }),
    MONTHLY.priceVersionId,
  );
});

test("C: runtime resolution is exact — missing, wrong currency, ambiguous and unbound all fail closed", () => {
  const idx = buildPriceMappingIndex([MONTHLY, YEARLY]);
  const key = { productKey: "kompis_web", variantKey: "standard", interval: "month" as const, currency: "NOK" };
  assert.ok(resolveMappedPrice(idx, key).ok);
  assert.deepEqual(resolveMappedPrice(idx, { ...key, interval: "one_time" }), { ok: false, reason: "mapping_missing" });
  assert.deepEqual(resolveMappedPrice(idx, { ...key, currency: "SEK" }), { ok: false, reason: "mapping_missing" });
  assert.deepEqual(resolveMappedPrice(idx, { ...key, currency: "kr" }), { ok: false, reason: "currency_invalid" });
  assert.deepEqual(resolveMappedPrice(idx, { ...key, variantKey: "pro" }), { ok: false, reason: "mapping_missing" });
  const dup = buildPriceMappingIndex([MONTHLY, { ...MONTHLY, priceVersionId: "pv_other" }]);
  assert.deepEqual(resolveMappedPrice(dup, key), { ok: false, reason: "mapping_ambiguous" });
  const unbound = buildPriceMappingIndex([{ ...MONTHLY, providerPriceId: null }]);
  assert.deepEqual(resolveMappedPrice(unbound, key), { ok: false, reason: "provider_price_not_bound" });
  const archived = buildPriceMappingIndex([{ ...MONTHLY, status: "archived" }]);
  assert.deepEqual(resolveMappedPrice(archived, key), { ok: false, reason: "mapping_missing" });
});

test("C: live adapter is disabled; test adapter is offline, fixture-labelled and idempotent", async () => {
  assert.equal(isLiveStripeMappingEnabled(), false);
  const plan = planProductCenterStripeMapping({ variants: [variant({ yearlyPrice: null })] });
  const entry = plan.entries[0];
  assert.deepEqual(await LIVE_PRICE_ADAPTER_DISABLED.ensurePrice(entry), { ok: false, reason: "live_stripe_disabled" });
  const t = createTestPriceAdapter();
  const a = await t.ensurePrice(entry);
  const b = await t.ensurePrice(entry);
  assert.ok(a.ok && b.ok && a.providerPriceId === b.providerPriceId && a.providerPriceId.startsWith("price_fixture_"));
  assert.equal(t.created.size, 1);
  const free = planProductCenterStripeMapping({ variants: [variant({ monthlyPrice: price("month", 0), yearlyPrice: null })] }).entries[0];
  assert.deepEqual(await t.ensurePrice(free), { ok: false, reason: "plan_not_paid" });
});

// ----------------------------------------------------- server pricing / VAT / discounts

const pct: ApprovedDiscount = { code: "TEN", active: true, kind: "percent", basisPoints: 1000 };

test("C: exclusive VAT — net 599.00, VAT 25%, gross 748.75", () => {
  const r = validateServerPricing({ mapping: MONTHLY, requestedCurrency: "NOK", vatRateBp: 2500, now: NOW });
  assert.ok(r.ok);
  if (r.ok) {
    assert.equal(r.pricing.netAfterDiscountExVatMinor, 59900);
    assert.equal(r.pricing.vatMinor, 14975);
    assert.equal(r.pricing.grossMinor, MONTHLY_GROSS);
  }
});

test("C: inclusive VAT keeps the listed gross exactly; discount applies to net before VAT", () => {
  const inc = mapping("month", 125000, { vatLabel: "inclusive" });
  const r = validateServerPricing({ mapping: inc, requestedCurrency: "NOK", vatRateBp: 2500, now: NOW });
  assert.ok(r.ok && r.pricing.grossMinor === 125000 && r.pricing.netAfterDiscountExVatMinor === 100000 && r.pricing.vatMinor === 25000);
  const d = validateServerPricing({ mapping: MONTHLY, requestedCurrency: "NOK", vatRateBp: 2500, discountCode: "TEN", approvedDiscounts: [pct], now: NOW });
  assert.ok(d.ok);
  if (d.ok) {
    assert.equal(d.pricing.discountMinor, 5990);
    assert.equal(d.pricing.netAfterDiscountExVatMinor, 53910);
    assert.equal(d.pricing.vatMinor, 13478); // 13477.5 rounds half up
    assert.equal(d.pricing.grossMinor, 67388);
  }
});

test("C: VAT rate null is not configured (fail-closed); explicit 0 is valid zero-rated", () => {
  assert.deepEqual(validateServerPricing({ mapping: MONTHLY, requestedCurrency: "NOK", vatRateBp: null, now: NOW }), { ok: false, reason: "vat_rate_not_configured" });
  assert.deepEqual(validateServerPricing({ mapping: MONTHLY, requestedCurrency: "NOK", vatRateBp: undefined, now: NOW }), { ok: false, reason: "vat_rate_not_configured" });
  assert.deepEqual(validateServerPricing({ mapping: MONTHLY, requestedCurrency: "NOK", vatRateBp: -1, now: NOW }), { ok: false, reason: "vat_rate_invalid" });
  assert.deepEqual(validateServerPricing({ mapping: MONTHLY, requestedCurrency: "NOK", vatRateBp: 2500.5, now: NOW }), { ok: false, reason: "vat_rate_invalid" });
  const zero = validateServerPricing({ mapping: MONTHLY, requestedCurrency: "NOK", vatRateBp: 0, now: NOW });
  assert.ok(zero.ok && zero.pricing.vatMinor === 0 && zero.pricing.grossMinor === 59900);
});

test("C: currency must match exactly; client totals are compared, never trusted", () => {
  assert.deepEqual(validateServerPricing({ mapping: MONTHLY, requestedCurrency: "SEK", vatRateBp: 2500, now: NOW }), { ok: false, reason: "currency_mismatch" });
  assert.deepEqual(validateServerPricing({ mapping: MONTHLY, requestedCurrency: "x", vatRateBp: 2500, now: NOW }), { ok: false, reason: "currency_mismatch" });
  assert.deepEqual(validateServerPricing({ mapping: MONTHLY, requestedCurrency: "NOK", vatRateBp: 2500, clientClaimedGrossMinor: 100, now: NOW }), { ok: false, reason: "client_price_mismatch" });
  assert.ok(validateServerPricing({ mapping: MONTHLY, requestedCurrency: "NOK", vatRateBp: 2500, clientClaimedGrossMinor: MONTHLY_GROSS, now: NOW }).ok);
});

test("C: discounts — only server-approved, active, unexpired, in-scope, same-currency", () => {
  const base = { mapping: MONTHLY, requestedCurrency: "NOK", vatRateBp: 2500, now: NOW };
  const f = (d: ApprovedDiscount) => validateServerPricing({ ...base, discountCode: d.code, approvedDiscounts: [d] });
  assert.deepEqual(validateServerPricing({ ...base, discountCode: "NOPE", approvedDiscounts: [pct] }), { ok: false, reason: "discount_not_found" });
  assert.deepEqual(f({ ...pct, active: false }), { ok: false, reason: "discount_inactive" });
  assert.deepEqual(f({ ...pct, validUntil: "2026-01-01T00:00:00Z" }), { ok: false, reason: "discount_expired" });
  assert.deepEqual(f({ ...pct, productKeys: ["other"] }), { ok: false, reason: "discount_product_not_eligible" });
  assert.deepEqual(f({ ...pct, basisPoints: null }), { ok: false, reason: "discount_value_invalid" });
  assert.deepEqual(f({ ...pct, basisPoints: 10001 }), { ok: false, reason: "discount_value_invalid" });
  assert.deepEqual(f({ code: "FIX", active: true, kind: "fixed", amountMinor: 1000, currency: "SEK" }), { ok: false, reason: "discount_currency_mismatch" });
  const fixed = f({ code: "FIX", active: true, kind: "fixed", amountMinor: 10000, currency: "NOK" });
  assert.ok(fixed.ok && fixed.pricing.netAfterDiscountExVatMinor === 49900);
  // 100% off => zero total => never a paid checkout.
  assert.deepEqual(f({ ...pct, basisPoints: 10000 }), { ok: false, reason: "zero_total_requires_explicit_free_grant" });
  // fixed discount larger than net is capped at net => zero total.
  assert.deepEqual(f({ code: "BIG", active: true, kind: "fixed", amountMinor: 999999, currency: "NOK" }), { ok: false, reason: "zero_total_requires_explicit_free_grant" });
  // explicit 0 discount is valid and changes nothing
  const zeroDisc = f({ code: "ZERO", active: true, kind: "percent", basisPoints: 0 });
  assert.ok(zeroDisc.ok && zeroDisc.pricing.grossMinor === MONTHLY_GROSS);
});

// ------------------------------------------------------------------ D. checkout

test("D: gate — Production is always closed even when the test flag is set; no flag => closed", () => {
  assert.equal(PROD_GATE.checkoutEnabled, false);
  const prod = prepareCheckoutIntent(request(), checkoutContext({ gate: PROD_GATE }));
  assert.deepEqual(prod.ok === false && prod.reason, "checkout_closed");
  const closed = prepareCheckoutIntent(request(), checkoutContext({ gate: { ...OPEN_GATE, checkoutEnabled: false } }));
  assert.equal(closed.ok === false && closed.reason, "checkout_closed");
});

test("D: server-priced intent — amounts come from the mapping, marked as not payment proof", () => {
  const i = makeIntent();
  assert.equal(i.expectedFirstChargeMinor, MONTHLY_GROSS);
  assert.equal(i.expectedRecurringChargeMinor, MONTHLY_GROSS);
  assert.equal(i.paymentConfirmed, false);
  assert.equal(i.liveSessionCreationEnabled, false);
  assert.equal(i.status, "prepared");
  assert.equal(i.priceVersionId, MONTHLY.priceVersionId);
  const y = makeIntent({ interval: "year", idempotencyKey: "i2" });
  assert.equal(y.expectedFirstChargeMinor, YEARLY_GROSS);
  const o = makeIntent({ interval: "one_time", idempotencyKey: "i3" });
  assert.equal(o.expectedFirstChargeMinor, ONE_TIME_GROSS);
  assert.equal(o.expectedRecurringChargeMinor, null);
  assert.equal(ONE_TIME.interval, "one_time");
});

test("D: discount is first-period only; recurring stays at list price", () => {
  const i = makeIntent({ discountCode: "TEN" }, { approvedDiscounts: [pct] });
  assert.equal(i.expectedFirstChargeMinor, 67388);
  assert.equal(i.expectedRecurringChargeMinor, MONTHLY_GROSS);
});

test("D: no fallback price — missing mapping for the requested interval/currency/variant fails closed", () => {
  const monthlyOnly = checkoutContext({ mapping: buildPriceMappingIndex([MONTHLY]) });
  assert.equal(prepareCheckoutIntent(request({ interval: "year" }), monthlyOnly).ok, false);
  const r = prepareCheckoutIntent(request({ interval: "year" }), monthlyOnly);
  assert.equal(r.ok === false && r.reason, "mapping_missing");
  const cur = prepareCheckoutIntent(request({ currency: "SEK" }), checkoutContext());
  assert.equal(cur.ok === false && cur.reason, "mapping_missing");
  const v = prepareCheckoutIntent(request({ variantKey: "ghost" }), checkoutContext());
  assert.equal(v.ok === false && v.reason, "mapping_missing");
  const unbound = prepareCheckoutIntent(request(), checkoutContext({ mapping: buildPriceMappingIndex([{ ...MONTHLY, providerPriceId: null }]) }));
  assert.equal(unbound.ok === false && unbound.reason, "provider_price_not_bound");
});

test("D: product must exist, be published and checkout_ready", () => {
  const f = (product: CheckoutContext["product"]) => prepareCheckoutIntent(request(), checkoutContext({ product }));
  assert.equal((f(null) as { reason: string }).reason, "product_not_found");
  assert.equal((f({ productKey: "other", published: true, purchaseReadiness: "checkout_ready" }) as { reason: string }).reason, "product_not_found");
  assert.equal((f({ productKey: "kompis_web", published: false, purchaseReadiness: "checkout_ready" }) as { reason: string }).reason, "product_not_published");
  for (const readiness of ["info_only", "contact", "active_open"] as const) {
    assert.equal((f({ productKey: "kompis_web", published: true, purchaseReadiness: readiness }) as { reason: string }).reason, "product_not_checkout_ready");
  }
});

test("D: entitlement and dependencies — no double purchase; dependency must already be operational", () => {
  const active = {
    entitlementId: "e",
    tenantId: T_A,
    productKey: "kompis_web",
    variantKey: "standard",
    interval: "month" as const,
    state: "active" as const,
    source: "paid" as const,
    validFrom: "2026-11-01T00:00:00Z",
    validUntil: "2027-01-01T00:00:00Z",
    graceUntil: null,
  };
  const dup = prepareCheckoutIntent(request(), checkoutContext({ entitlements: [active] }));
  assert.equal(dup.ok === false && dup.reason, "already_entitled");
  // another tenant's entitlement does not block tenant A
  assert.ok(prepareCheckoutIntent(request(), checkoutContext({ entitlements: [{ ...active, tenantId: T_B }] })).ok);

  const deps = { kompis_web: ["base_product"] };
  const missing = prepareCheckoutIntent(request(), checkoutContext({ dependencies: deps }));
  assert.equal(missing.ok === false && missing.reason, "dependency_missing");
  const base = buildFreeAccessEntitlement({ tenantId: T_A, productKey: "base_product", grantedAt: NOW.toISOString() });
  assert.ok(prepareCheckoutIntent(request(), checkoutContext({ dependencies: deps, entitlements: [base] })).ok);
  const other = prepareCheckoutIntent(request(), checkoutContext({ dependencies: deps, entitlements: [{ ...base, tenantId: T_B }] }));
  assert.equal(other.ok === false && other.reason, "dependency_missing");
  const suspended = prepareCheckoutIntent(request(), checkoutContext({ dependencies: deps, entitlements: [{ ...base, state: "suspended" }] }));
  assert.equal(suspended.ok === false && suspended.reason, "dependency_not_operational");
});

test("D: required inputs and server validation (tenant, idempotency key, VAT, client price)", () => {
  assert.equal((prepareCheckoutIntent(request({ callerTenantId: "" }), checkoutContext()) as { reason: string }).reason, "tenant_required");
  assert.equal((prepareCheckoutIntent(request({ idempotencyKey: " " }), checkoutContext()) as { reason: string }).reason, "idempotency_key_required");
  assert.equal((prepareCheckoutIntent(request(), checkoutContext({ vatRateBp: null })) as { reason: string }).reason, "vat_rate_not_configured");
  assert.equal((prepareCheckoutIntent(request({ clientClaimedGrossMinor: 1 }), checkoutContext()) as { reason: string }).reason, "client_price_mismatch");
});

test("D: idempotency — same key replays, changed request conflicts, other tenants never share keys", () => {
  const first = makeIntent();
  const existing = { [`${T_A}::idem-1`]: first };
  const replay = prepareCheckoutIntent(request(), checkoutContext({ existingIntents: existing }));
  assert.ok(replay.ok && replay.replayed && replay.intent.intentId === first.intentId);
  const conflict = prepareCheckoutIntent(request({ interval: "year" }), checkoutContext({ existingIntents: existing }));
  assert.equal(conflict.ok === false && conflict.reason, "idempotency_key_conflict");
  const tenantB = prepareCheckoutIntent(request({ callerTenantId: T_B }), checkoutContext({ existingIntents: existing }));
  assert.ok(tenantB.ok && !tenantB.replayed && tenantB.intent.intentId !== first.intentId && tenantB.intent.tenantId === T_B);
  // corrupted store entry for another tenant is refused
  const poisoned = prepareCheckoutIntent(request(), checkoutContext({ existingIntents: { [`${T_A}::idem-1`]: { ...first, tenantId: T_B } } }));
  assert.equal(poisoned.ok === false && poisoned.reason, "cross_tenant_forbidden");
});

test("D: redirect / success return is never payment proof; live checkout adapter is disabled; test adapter is a fixture", async () => {
  assert.deepEqual(interpretCheckoutReturn({ sessionId: "cs_x", status: "complete" }), {
    paymentConfirmed: false,
    activation: "webhook_required",
    entitlementChange: "none",
  });
  const intent = makeIntent();
  assert.deepEqual(await LIVE_CHECKOUT_ADAPTER_DISABLED.createSession(intent), { ok: false, reason: "live_checkout_disabled" });
  const t = createTestCheckoutAdapter();
  const a = await t.createSession(intent);
  const b = await t.createSession(intent);
  assert.ok(a.ok && b.ok && a.sessionId === b.sessionId && a.sessionId.startsWith("cs_fixture_") && a.fixture === true);
  assert.deepEqual(await t.createSession({ ...intent, status: "x" as never }), { ok: false, reason: "intent_not_prepared" });
});

// ----------------------------------------------------------------- attribution

test("D: personal sales link — attributed, tenant-bound, free program needs no license", () => {
  const i = attributedIntent();
  assert.ok(i.attribution);
  assert.equal(i.attribution?.buyerTenantId, T_A);
  assert.equal(i.attribution?.partnerId, "partner_1");
  assert.equal(i.attributionRejectedReason, null);
  assert.equal(assertAttributionBoundToTenant(i.attribution, T_A), true);
  assert.equal(assertAttributionBoundToTenant(i.attribution, T_B), false);
  assert.equal(assertAttributionBoundToTenant(null, T_B), true);
});

test("D: anti-self-referral reuses attribution-policy — purchase continues unattributed", () => {
  const i = makeIntent(
    { salesLinkCode: SALES_CODE, callerAuthUserId: "auth_partner" },
    { salesLink: salesLink({ partnerAuthUserId: "auth_partner" }), seller: APPROVED_SELLER },
  );
  assert.equal(i.attribution, null);
  assert.equal(i.attributionRejectedReason, "self_referral");
  assert.equal(i.expectedFirstChargeMinor, MONTHLY_GROSS);
});

test("D: attribution rejections — unknown link, code mismatch, inactive, window, product, unapproved partner", () => {
  const f = (link: ReturnType<typeof salesLink> | null, seller = APPROVED_SELLER, extra: Partial<Parameters<typeof resolveSalesAttribution>[0]> = {}) =>
    resolveSalesAttribution({ link, seller, buyerTenantId: T_A, buyerAuthUserId: "b", productKey: "kompis_web", now: NOW, ...extra });
  assert.deepEqual(f(null), { attributed: false, reason: "no_link" });
  assert.deepEqual(f(salesLink({ active: false })), { attributed: false, reason: "link_inactive" });
  assert.deepEqual(f(salesLink({ code: "bad-code" })), { attributed: false, reason: "link_code_invalid" });
  assert.deepEqual(f(salesLink({ productKey: "other_product" })), { attributed: false, reason: "product_mismatch" });
  assert.deepEqual(f(salesLink({ firstTouchAt: "2026-01-01T00:00:00Z" })), { attributed: false, reason: "attribution_window_expired" });
  assert.deepEqual(f(salesLink(), { cspPartnerStatus: "suspended" }), { attributed: false, reason: "partner_not_authorized" });
  assert.deepEqual(f(salesLink(), APPROVED_SELLER, { buyerTenantId: "" }), { attributed: false, reason: "buyer_tenant_required" });
  // A link code that does not match what the buyer sent is dropped by checkout.
  const mismatch = makeIntent({ salesLinkCode: "csp-zzzzzzzzzzzz" }, { salesLink: salesLink(), seller: APPROVED_SELLER });
  assert.equal(mismatch.attribution, null);
  const unknown = makeIntent({ salesLinkCode: SALES_CODE }, { salesLink: null });
  assert.equal(unknown.attributionRejectedReason, "no_link");
});

test("D: tenant commercial program attribution needs an operational license + active seller membership", () => {
  const license = {
    program: { programId: "prog_t", ownerTenantId: "owner_t", kind: "tenant_commercial" as const },
    status: "active" as const,
    source: "paid_subscription" as const,
    licenseLevelKey: "l",
    maxActiveSellers: 2,
    activeSellerCount: 1,
    expiresAt: null,
  };
  const link = salesLink({ code: "any-code", programId: "prog_t", programKind: "tenant_commercial", ownerTenantId: "owner_t" });
  const membership = { membershipId: "m", programId: "prog_t", sellerUserId: "s", role: "seller" as const, status: "active" as const };
  const args = { link, buyerTenantId: T_A, buyerAuthUserId: "b", productKey: "kompis_web", now: NOW };
  const ok = resolveSalesAttribution({ ...args, seller: { license, membership } });
  assert.ok(ok.attributed);
  const f = (seller: Parameters<typeof resolveSalesAttribution>[0]["seller"], buyer = T_A) =>
    resolveSalesAttribution({ ...args, buyerTenantId: buyer, seller });
  assert.deepEqual(f({ license: { ...license, status: "expired" }, membership }), { attributed: false, reason: "license_not_operational" });
  assert.deepEqual(f({ license: null, membership }), { attributed: false, reason: "license_not_operational" });
  assert.deepEqual(f({ license, membership: { ...membership, role: "read_only" } }), { attributed: false, reason: "membership_not_active" });
  assert.deepEqual(f({ license, membership: { ...membership, status: "inactive" } }), { attributed: false, reason: "membership_not_active" });
  assert.deepEqual(f({ license, membership: null }), { attributed: false, reason: "membership_not_active" });
  assert.deepEqual(f({ license: { ...license, program: { ...license.program, programId: "prog_other" } }, membership }), { attributed: false, reason: "program_mismatch" });
  // a tenant cannot earn by selling to itself
  assert.deepEqual(f({ license, membership }, "owner_t"), { attributed: false, reason: "self_tenant_referral" });
});

test("D: attribution never applies a price or discount (price parity)", () => {
  const plain = makeIntent({ idempotencyKey: "p" });
  const attributed = attributedIntent({ idempotencyKey: "q" });
  assert.equal(plain.pricing.grossMinor, attributed.pricing.grossMinor);
});
