import assert from "node:assert/strict";
import {
  composeE164,
  isPlausibleE164,
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

console.log("account-profile phone.test.ts: ok");
