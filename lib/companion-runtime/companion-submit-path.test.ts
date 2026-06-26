import assert from "node:assert/strict";
import {
  classifyCompanionSubmitPath,
  resolveDirectTurnRoute,
} from "./companion-submit-path";
import { resolveDirectDateTimeKind } from "./direct-datetime-answer";

assert.equal(resolveDirectDateTimeKind("Hva er datoen i dag?"), "date");
assert.equal(resolveDirectDateTimeKind("Hva er klokken nå?"), "time");
assert.equal(classifyCompanionSubmitPath("Kan du le?", "no"), "direct");
assert.equal(classifyCompanionSubmitPath("Hva tenker du om kaffe?", "no"), "direct");
assert.equal(classifyCompanionSubmitPath("Hva er Self Love?", "en"), "direct");
assert.equal(
  classifyCompanionSubmitPath("Hvor mange medlemmer har vi?", "no"),
  "direct_exact_source_or_queue",
);
assert.equal(classifyCompanionSubmitPath("Siste hendelser", "no"), "direct_exact_source_or_queue");
assert.equal(
  classifyCompanionSubmitPath("Vis aktive medlemmer med brukernavn", "no"),
  "queued",
);

assert.equal(
  resolveDirectDateTimeKind("Bestill en time for testkunde mandag kl. 10:00"),
  null,
);
assert.notEqual(
  resolveDirectTurnRoute("Bestill en time for testkunde mandag kl. 10:00", "no"),
  "datetime",
);

assert.equal(resolveDirectDateTimeKind("Jeg vil booke en time neste uke"), null);
assert.notEqual(resolveDirectTurnRoute("Jeg vil booke en time neste uke", "no"), "datetime");

assert.equal(resolveDirectDateTimeKind("Hva er klokken?"), "time");
assert.equal(resolveDirectTurnRoute("Hva er klokken?", "no"), "datetime");

assert.equal(resolveDirectDateTimeKind("Hva er tiden nå?"), "time");
assert.equal(resolveDirectTurnRoute("Hva er tiden nå?", "no"), "datetime");

assert.equal(resolveDirectDateTimeKind("Hvilken dato er det?"), "date");
assert.equal(resolveDirectTurnRoute("Hvilken dato er det?", "no"), "datetime");

console.log("companion-submit-path.test.ts passed");
