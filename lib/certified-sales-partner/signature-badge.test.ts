import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildCertifiedSellerBadge,
  CSP_CERTIFIED_SELLER_BADGE_TEXT,
  shouldShowCertifiedBadge,
} from "./signature-badge";

describe("certified seller badge", () => {
  it("shows only when partner and certification are active", () => {
    const on = buildCertifiedSellerBadge({
      certificationActive: true,
      partnerActive: true,
      productLabel: "Buddy Web",
    });
    assert.equal(on.show, true);
    assert.match(on.text, new RegExp(CSP_CERTIFIED_SELLER_BADGE_TEXT));
    assert.match(on.text, /Buddy Web/);
    assert.match(on.html, /data-csp-certified-badge/);
  });

  it("hides on suspension or revoked certification", () => {
    assert.equal(
      shouldShowCertifiedBadge({ certificationActive: true, partnerActive: false }),
      false,
    );
    assert.equal(
      shouldShowCertifiedBadge({ certificationActive: false, partnerActive: true }),
      false,
    );
  });
});
