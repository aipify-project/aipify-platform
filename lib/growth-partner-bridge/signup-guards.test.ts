import test from "node:test";
import assert from "node:assert/strict";
import {
  guardGrowthPartnerSignupAgainstCsp,
  isCspSellerExistsPayload,
  noticeCspRegisterWithExistingGrowthPartner,
  resolvePersonalSalesPath,
} from "./signup-guards";
import { mapGpStatusFromCsp } from "./parse";
import { CSP_SELLER_EXISTS_CODE, PARTNERS_PORTAL_REDIRECT } from "./constants";

test("blocks Growth Partner signup when CSP partner id is present", () => {
  const blocked = guardGrowthPartnerSignupAgainstCsp({ cspPartnerId: "11111111-1111-4111-8111-111111111111" });
  assert.equal(blocked.blocked, true);
  if (blocked.blocked) {
    assert.equal(blocked.code, CSP_SELLER_EXISTS_CODE);
    assert.equal(blocked.redirectPath, PARTNERS_PORTAL_REDIRECT);
  }
});

test("allows Growth Partner signup when no CSP identity", () => {
  assert.equal(guardGrowthPartnerSignupAgainstCsp({ cspPartnerId: null }).blocked, false);
  assert.equal(guardGrowthPartnerSignupAgainstCsp({ cspPartnerId: "  " }).blocked, false);
});

test("detects csp_seller_exists payload from Core", () => {
  assert.equal(isCspSellerExistsPayload({ ok: false, error: "csp_seller_exists", code: "csp_seller_exists" }), true);
  assert.equal(isCspSellerExistsPayload({ ok: true }), false);
});

test("personal sales path prefers active GP slug and rejects csp- codes", () => {
  assert.equal(
    resolvePersonalSalesPath({ growthPartnerSlug: "north-studio", linkStatus: "active", locale: "no" }),
    "/s/north-studio?lang=no",
  );
  assert.equal(
    resolvePersonalSalesPath({ growthPartnerSlug: "north-studio", linkStatus: "disabled", locale: "no" }),
    null,
  );
  assert.equal(
    resolvePersonalSalesPath({ growthPartnerSlug: "csp-0123456789ab", linkStatus: "active", locale: "en" }),
    null,
  );
});

test("maps CSP status + verified product cert without inventing certification", () => {
  assert.deepEqual(mapGpStatusFromCsp({ cspStatus: "approved", productCertPassed: true }), {
    partnerStatus: "certified",
    certificationStatus: "passed",
    linkActive: true,
  });
  assert.deepEqual(mapGpStatusFromCsp({ cspStatus: "approved", productCertPassed: false }), {
    partnerStatus: "certification_required",
    certificationStatus: "pending",
    linkActive: false,
  });
  assert.deepEqual(mapGpStatusFromCsp({ cspStatus: "suspended", productCertPassed: true }), {
    partnerStatus: "suspended",
    certificationStatus: "passed",
    linkActive: false,
  });
});

test("soft-notices GP existence for CSP register without inventing a block policy for commission identity", () => {
  const notice = noticeCspRegisterWithExistingGrowthPartner({
    growthPartnerProfileId: "22222222-2222-4222-8222-222222222222",
  });
  assert.equal(notice.blocked, true);
  if (notice.blocked) assert.equal(notice.code, "growth_partner_exists");
});