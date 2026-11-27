import assert from "node:assert/strict";
import {
  ACCOUNT_PROFILE_PHONE_COUNTRIES,
  composeE164,
  isPlausibleE164,
  phoneCountryByDial,
  splitStoredPhone,
} from "./phone";

assert.deepEqual(splitStoredPhone("+47 912 34 567"), {
  dial: "+47",
  national: "91234567",
});
assert.deepEqual(splitStoredPhone("+4681234567"), {
  dial: "+46",
  national: "81234567",
});
assert.equal(composeE164("+47", "912 34 567"), "+4791234567");
assert.equal(composeE164("+47", ""), "");
assert.equal(isPlausibleE164("+4791234567"), true);
assert.equal(isPlausibleE164("+47"), false);
assert.equal(isPlausibleE164(""), true);

const norway = phoneCountryByDial("+47");
assert.equal(norway.iso2, "NO");
assert.equal(norway.flagEmoji, "🇳🇴");
assert.equal(norway.flagSrc, "/flags/no.svg");
assert.ok(ACCOUNT_PROFILE_PHONE_COUNTRIES.every((row) => typeof row.flagEmoji === "string"));
assert.equal(phoneCountryByDial("+999").iso2, "OTHER");

console.log("account-profile phone.test.ts: ok");
