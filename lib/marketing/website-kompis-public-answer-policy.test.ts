import assert from "node:assert/strict";
import {
  buildWebsiteKompisPublicAnswerPolicyPrompt,
  evaluateWebsiteKompisDeterministicAnswerPolicy,
  withWebsiteKompisPublicAnswerPathDiagnostic,
} from "@/lib/marketing/website-kompis-public-answer-policy";

const prompt = buildWebsiteKompisPublicAnswerPolicyPrompt("no");
assert.match(prompt, /Use ONLY the provided evidence/);
assert.match(prompt, /untrusted data/);
assert.match(prompt, /FAQ question lists/);
assert.match(prompt, /language code "no"/);

assert.equal(
  evaluateWebsiteKompisDeterministicAnswerPolicy({
    question: "Kan jeg bruke ekte navn?",
    directAnswer: "Du kan bruke et kallenavn. Ekte navn er ikke påkrevd.",
  }).ok,
  true,
);

assert.equal(
  evaluateWebsiteKompisDeterministicAnswerPolicy({
    question: "Hva koster medlemskap?",
    directAnswer:
      "Hva gjør jeg dersom leveringslenken ikke virker?\nHvordan bestiller jeg?\nNår får jeg leveransen?",
  }).ok,
  false,
);

const bioReject = evaluateWebsiteKompisDeterministicAnswerPolicy({
  question: "Hva koster Creator Pro?",
  directAnswer:
    "Jeg er en kreativ profil som elsker fotografi, reise og livsstil. Følg meg for mer inspirasjon hver uke og se bildene mine fra studioet. ".repeat(
      3,
    ),
});
assert.equal(bioReject.ok, false);

const tagged = withWebsiteKompisPublicAnswerPathDiagnostic(
  { answer: "ok" },
  "public_site_index",
  { includeDiagnostics: true },
);
assert.equal(
  (tagged.diagnostics as { answerPath?: string }).answerPath,
  "public_site_index",
);
assert.equal(
  withWebsiteKompisPublicAnswerPathDiagnostic({ answer: "ok" }, "faq", {
    includeDiagnostics: false,
  }).diagnostics,
  undefined,
);

console.log("website-kompis-public-answer-policy.test.ts: all assertions passed");
