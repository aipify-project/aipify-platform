import assert from "node:assert/strict";
import {
  buildWebsiteKompisMissingConcreteCostGapAnswer,
  buildWebsiteKompisPublicAnswerPolicyPrompt,
  evaluateWebsiteKompisDeterministicAnswerPolicy,
  isWebsiteKompisProviderKnowledgeGapResponse,
  isWebsiteKompisProviderPartialKnowledgeGapResponse,
  withWebsiteKompisPublicAnswerPathDiagnostic,
} from "@/lib/marketing/website-kompis-public-answer-policy";

const prompt = buildWebsiteKompisPublicAnswerPolicyPrompt("no");
assert.match(prompt, /Use ONLY the provided evidence/);
assert.match(prompt, /untrusted data/);
assert.match(prompt, /FAQ question lists/);
assert.match(prompt, /language code "no"/);
assert.match(prompt, /concrete requested value/);
assert.match(prompt, /covered=false/);

const missingCost = buildWebsiteKompisMissingConcreteCostGapAnswer({
  locale: "no",
  supportedNextStepFromEvidence:
    "Før poengene trekkes, får du alltid se kostnaden og bekrefte handlingen.",
});
assert.match(missingCost.directAnswer, /finner ikke et konkret/i);
assert.match(missingCost.directAnswer, /kostnaden/i);
assert.equal(missingCost.explanation, null);

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

// LIVE.14: long Push extract with kostnad/poeng signals must not be rejected as bio.
assert.equal(
  evaluateWebsiteKompisDeterministicAnswerPolicy({
    question: "Hva koster en Push på markedsplassen?",
    directAnswer:
      "Ut fra nettstedets offentlige sider:\n\nMed Push kan du flytte en aktiv annonse til toppen av markedsplassen. Før poengene trekkes, får du alltid se kostnaden og bekrefte handlingen. ".repeat(
        2,
      ),
  }).ok,
  true,
);

const tagged = withWebsiteKompisPublicAnswerPathDiagnostic(
  { answer: "ok" } as { answer: string; diagnostics?: { answerPath?: string } },
  "public_site_index",
  { includeDiagnostics: true },
);
assert.equal(tagged.diagnostics?.answerPath, "public_site_index");
assert.equal(
  withWebsiteKompisPublicAnswerPathDiagnostic(
    { answer: "ok" } as { answer: string; diagnostics?: { answerPath?: string } },
    "faq",
    { includeDiagnostics: false },
  ).diagnostics,
  undefined,
);

assert.equal(
  isWebsiteKompisProviderKnowledgeGapResponse({
    supportEscalation: { offered: true, reason: "knowledge_gap" },
  }),
  true,
);
assert.equal(
  isWebsiteKompisProviderKnowledgeGapResponse({
    supportEscalation: { offered: false, reason: null },
  }),
  false,
);
assert.equal(
  isWebsiteKompisProviderPartialKnowledgeGapResponse({
    supportEscalation: { offered: true, reason: "knowledge_gap" },
    sources: [{ title: "Push", route: "https://www.customer.example/push" }],
  }),
  true,
);
assert.equal(
  isWebsiteKompisProviderPartialKnowledgeGapResponse({
    supportEscalation: { offered: true, reason: "knowledge_gap" },
    sources: [],
  }),
  false,
);

console.log("website-kompis-public-answer-policy.test.ts: all assertions passed");
