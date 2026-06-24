import assert from "node:assert/strict";
import { buildDirectDateTimeAnswer, resolveDirectDateTimeKind } from "./direct-datetime-answer";

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

console.log("direct-datetime-answer.test.ts passed");
