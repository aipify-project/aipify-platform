import assert from "node:assert/strict";
import { buildDirectDateTimeAnswer, resolveDirectDateTimeKind } from "./direct-datetime-answer";
import { isBookingAppointmentActionQuery } from "./direct-datetime-kind";

const fixedNow = new Date("2026-06-22T14:30:00.000Z");

assert.equal(resolveDirectDateTimeKind("What is today's date?"), "date");

const dateAnswer = buildDirectDateTimeAnswer({
  query: "Hva er datoen i dag?",
  locale: "nb-NO",
  timeZone: "Europe/Oslo",
  now: fixedNow,
});

assert.ok(dateAnswer);
assert.match(dateAnswer!.directAnswer, /2026/);

const timeAnswer = buildDirectDateTimeAnswer({
  query: "Hva er klokken nå?",
  locale: "nb-NO",
  timeZone: "Europe/Oslo",
  now: fixedNow,
});

assert.ok(timeAnswer);
assert.match(timeAnswer!.directAnswer, /\d/);

assert.equal(resolveDirectDateTimeKind("Hva er klokken?"), "time");
assert.equal(resolveDirectDateTimeKind("Hva er tiden nå?"), "time");
assert.equal(resolveDirectDateTimeKind("Hvilken dato er det?"), "date");

assert.equal(
  resolveDirectDateTimeKind("Bestill en time for testkunde mandag kl. 10:00"),
  null,
);
assert.equal(resolveDirectDateTimeKind("Jeg vil booke en time neste uke"), null);
assert.equal(
  isBookingAppointmentActionQuery("Bestill en time for testkunde mandag kl. 10:00"),
  true,
);
assert.equal(isBookingAppointmentActionQuery("Jeg vil booke en time neste uke"), true);
assert.equal(isBookingAppointmentActionQuery("Hva er klokken?"), false);

console.log("direct-datetime-answer.test.ts passed");
