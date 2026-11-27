import assert from "node:assert/strict";
import {
  cleanCompanyWebsite,
  companyWebsiteHref,
  formatCompanyAddressLines,
} from "./company-profile-format";

assert.equal(cleanCompanyWebsite("javascript:alert(1)"), null);
assert.equal(cleanCompanyWebsite("https://example.com"), "https://example.com");
assert.equal(companyWebsiteHref("example.com"), "https://example.com");
assert.equal(companyWebsiteHref("https://secure.example/path"), "https://secure.example/path");
assert.equal(companyWebsiteHref(null), null);
assert.equal(
  formatCompanyAddressLines({
    street: "Gate 1",
    postalCode: "5003",
    city: "Bergen",
    country: "NO",
  }),
  "Gate 1\n5003 Bergen\nNO",
);
assert.equal(
  formatCompanyAddressLines({
    street: null,
    postalCode: null,
    city: null,
    country: null,
  }),
  null,
);

console.log("account-profile company-profile-format: PASS");
