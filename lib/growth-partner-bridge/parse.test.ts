import test from "node:test";
import assert from "node:assert/strict";
import { parseUnifiedSellerEnsureResult, parseUnifiedSellerSalesLinks } from "./parse";

test("parses unified sales links payload", () => {
  const parsed = parseUnifiedSellerSalesLinks({
    ok: true,
    csp_partner_id: "11111111-1111-4111-8111-111111111111",
    csp_status: "approved",
    csp_attribution_links: [{ code: "csp-0123456789ab", active: true, channel_origin: "referral_link" }],
    growth_partner_profile_id: "22222222-2222-4222-8222-222222222222",
    growth_partner_status: "certified",
    certification_status: "passed",
    primary_link_slug: "north-studio",
    link_status: "active",
    personal_sales_path: "/s/north-studio",
    bridge_ready: true,
  });
  assert.equal(parsed.ok, true);
  assert.equal(parsed.primaryLinkSlug, "north-studio");
  assert.equal(parsed.cspAttributionLinks[0]?.code, "csp-0123456789ab");
  assert.equal(parsed.bridgeReady, true);
});

test("parses ensure result and errors fail closed", () => {
  assert.equal(parseUnifiedSellerEnsureResult({ ok: false, error: "forbidden" }).ok, false);
  assert.equal(parseUnifiedSellerEnsureResult({ ok: true, created: false, profile_id: "p1" }).created, false);
});