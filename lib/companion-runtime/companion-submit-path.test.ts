import assert from "node:assert/strict";
import { classifyCompanionSubmitPath } from "./companion-submit-path";
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

console.log("companion-submit-path.test.ts passed");
