import assert from "node:assert/strict";
import {
  BOOKING_RESUME_CONTINUATION_PHRASES,
  detectBookingResumeContinuationIntent,
  normalizeBookingResumeContinuationQuery,
} from "@/lib/companion-runtime/booking-resume-intent";

const VALID_UUID = "a1b2c3d4-e5f6-4789-a012-3456789abcde";

const allowedPhrases = [
  // Norwegian
  "ja",
  "bekreft",
  "ja bekreft",
  "fortsett",
  "ja fortsett",
  "utfør",
  "gjør det",
  "fullfør",
  // English
  "yes",
  "confirm",
  "yes confirm",
  "continue",
  "yes continue",
  "proceed",
  "do it",
  "complete",
  // Swedish
  "bekräfta",
  "fortsätt",
  "ja fortsätt",
  "utför",
  "gör det",
  "slutför",
  // Danish
  "bekræft",
  "fortsæt",
  "ja fortsæt",
  "udfør",
  "gør det",
  "fuldfør",
] as const;

for (const phrase of allowedPhrases) {
  assert.equal(
    detectBookingResumeContinuationIntent(phrase),
    true,
    `expected true for allowed phrase: ${phrase}`,
  );
}

assert.deepEqual(new Set(BOOKING_RESUME_CONTINUATION_PHRASES), new Set(allowedPhrases));

for (const phrase of allowedPhrases) {
  assert.equal(
    detectBookingResumeContinuationIntent(phrase.toUpperCase()),
    true,
    `expected case-insensitive true for: ${phrase}`,
  );
}

assert.equal(detectBookingResumeContinuationIntent("  Ja   Bekreft  "), true);
assert.equal(normalizeBookingResumeContinuationQuery("  Ja   Bekreft  "), "ja bekreft");
assert.equal(detectBookingResumeContinuationIntent("ja!"), true);
assert.equal(detectBookingResumeContinuationIntent("yes?"), true);
assert.equal(detectBookingResumeContinuationIntent("confirm."), true);
assert.equal(normalizeBookingResumeContinuationQuery("confirm."), "confirm");

const rejectedExamples = [
  "ja, hva er fakturering?",
  "yes, show me the invoice",
  "kan du bekrefte åpningstidene",
  "confirm booking 123",
  "fortsett med noe annet",
  VALID_UUID,
  `ja ${VALID_UUID}`,
  "",
  "   ",
  "tilfeldig tekst",
  "maybe yes later",
  "please confirm my appointment tomorrow",
  "continue with something else",
  "proceed to billing",
];

for (const example of rejectedExamples) {
  assert.equal(
    detectBookingResumeContinuationIntent(example),
    false,
    `expected false for: ${JSON.stringify(example)}`,
  );
}

assert.equal(detectBookingResumeContinuationIntent("ja"), true);
assert.equal(detectBookingResumeContinuationIntent("yes"), true);

console.log("booking-resume-intent.test.ts: all assertions passed");
