import assert from "node:assert/strict";
import test from "node:test";
import { listIsoAlpha2Countries } from "@/lib/platform-portal/countries";
import {
  buildCspPhoneDialOptions,
  CSP_CALLING_CODES,
  dialForCspCountry,
  flagEmojiForCountry,
  normalizeCspPhone,
  validateCspCombinedPhone,
  validateCspPhone,
} from "./phone";

test("every ISO country offered in the form has a calling code", () => {
  const missing = listIsoAlpha2Countries("en")
    .map((c) => c.code)
    .filter((code) => !CSP_CALLING_CODES[code]);
  assert.deepEqual(missing, []);
  for (const [iso, dial] of Object.entries(CSP_CALLING_CODES)) {
    assert.match(iso, /^[A-Z]{2}$/);
    assert.match(dial, /^\+[1-9][0-9]{0,3}$/, iso);
  }
});

test("dial lookup is case-insensitive, global, and never defaults to a country", () => {
  assert.equal(dialForCspCountry("no"), "+47");
  assert.equal(dialForCspCountry("PL"), "+48");
  assert.equal(dialForCspCountry("UA"), "+380");
  assert.equal(dialForCspCountry("JP"), "+81");
  assert.equal(dialForCspCountry("BR"), "+55");
  assert.equal(dialForCspCountry("US"), "+1");
  assert.equal(dialForCspCountry("ZZ"), null);
  assert.equal(dialForCspCountry(undefined), null);
});

test("dial options: one per country, flag + dial + name label, countries sharing +1 stay distinct", () => {
  const options = buildCspPhoneDialOptions("en");
  assert.equal(options.length, listIsoAlpha2Countries("en").length);
  const no = options.find((o) => o.country === "NO")!;
  assert.equal(no.dial, "+47");
  assert.ok(no.label.includes("+47") && no.label.includes(no.name));
  assert.equal(no.flag, flagEmojiForCountry("NO"));
  assert.ok(options.some((o) => o.country === "US") && options.some((o) => o.country === "CA"));
  assert.equal(new Set(options.map((o) => o.country)).size, options.length);
  assert.equal(flagEmojiForCountry("x1"), "");
});

test("empty phone is allowed and normalizes to null", () => {
  assert.deepEqual(validateCspPhone({ dial: "+47", national: "" }), { ok: true, e164: null });
  assert.deepEqual(validateCspPhone({ dial: "", national: "   " }), { ok: true, e164: null });
  assert.equal(normalizeCspPhone({ dial: "+47", national: undefined }), null);
  assert.deepEqual(validateCspCombinedPhone(""), { ok: true, e164: null });
  assert.deepEqual(validateCspCombinedPhone(undefined), { ok: true, e164: null });
});

test("normalizes to E.164 across countries, dropping separators and a trunk zero", () => {
  assert.equal(normalizeCspPhone({ dial: "+47", national: "912 34 567" }), "+4791234567");
  assert.equal(normalizeCspPhone({ dial: "47", national: "912-34-567" }), "+4791234567");
  assert.equal(normalizeCspPhone({ dial: "+46", national: "(070) 123 45 67" }), "+46701234567");
  assert.equal(normalizeCspPhone({ dial: "+44", national: "020 7946 0958" }), "+442079460958");
  assert.equal(normalizeCspPhone({ dial: "+1", national: "(415) 555-0132" }), "+14155550132");
  assert.equal(normalizeCspPhone({ dial: "+380", national: "50 123 4567" }), "+380501234567");
  // Italy keeps the leading zero.
  assert.equal(normalizeCspPhone({ dial: "+39", national: "06 6982 1234" }), "+390669821234");
});

test("rejects letters and other characters", () => {
  for (const national of ["91234abc", "tel 91234567", "9123 4567 ext 2", "9123+4567", "9123#4567"]) {
    const r = validateCspPhone({ dial: "+47", national });
    assert.deepEqual(r, { ok: false, error: "invalid_phone" }, national);
  }
  assert.equal(normalizeCspPhone({ dial: "+47", national: "abc" }), null);
});

test("rejects bad dial codes and totals outside 8–15 digits", () => {
  assert.deepEqual(validateCspPhone({ dial: "", national: "91234567" }), { ok: false, error: "invalid_phone" });
  assert.deepEqual(validateCspPhone({ dial: "+0", national: "91234567" }), { ok: false, error: "invalid_phone" });
  assert.deepEqual(validateCspPhone({ dial: "+47abc", national: "91234567" }), { ok: false, error: "invalid_phone" });
  // total digits = 2 + 5 = 7 → too short; 2 + 6 = 8 → ok
  assert.equal(validateCspPhone({ dial: "+47", national: "91234" }).ok, false);
  assert.equal(validateCspPhone({ dial: "+47", national: "912345" }).ok, true);
  // total digits = 2 + 13 = 15 → ok; 16 → too long
  assert.equal(validateCspPhone({ dial: "+47", national: "1234567890123" }).ok, true);
  assert.equal(validateCspPhone({ dial: "+47", national: "12345678901234" }).ok, false);
  // only zeros / separators
  assert.equal(validateCspPhone({ dial: "+47", national: "0" }).ok, false);
  assert.equal(validateCspPhone({ dial: "+47", national: "---" }).ok, false);
});

test("combined international string", () => {
  assert.deepEqual(validateCspCombinedPhone("+47 912 34 567"), { ok: true, e164: "+4791234567" });
  assert.deepEqual(validateCspCombinedPhone("+1 (415) 555-0132"), { ok: true, e164: "+14155550132" });
  for (const bad of ["91234567", "0047 91234567", "+47 9123 abc", "+0 1234567", "+12345", "+1234567890123456"]) {
    assert.deepEqual(validateCspCombinedPhone(bad), { ok: false, error: "invalid_phone" }, bad);
  }
});
