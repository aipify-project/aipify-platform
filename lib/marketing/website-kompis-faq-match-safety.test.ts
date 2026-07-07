import assert from "node:assert/strict";
import {
  buildWebsiteKompisSafetyPolicyRefusalCopy,
  filterWebsiteKompisSafeFaqRows,
  isWebsiteKompisMandatorySafetyRefusalQuestion,
  shouldRejectWebsiteKompisFaqMatch,
  WEBSITE_KOMPIS_SAFETY_POLICY_SOURCE,
} from "@/lib/marketing/website-kompis-faq-match-safety";

const broadNudeFaq = {
  title: "Kan jeg laste opp nakenbilder?",
  answer: "Ja, det kan du.",
};

const mirroredUnsafeFaq = {
  title: "Kan jeg laste opp nakenbilder av andre personer?",
  answer: "Ja, det kan du.",
};

const duplicateUnsafeRows = [
  {
    item_id: "faq-nude-a",
    title: "Kan jeg laste opp nakenbilder?",
    answer: "Ja, det kan du.",
    category: "safety",
    content_type: "faq",
    locale: "no",
    source_url: null,
    score: 50,
    matched_reason: "title",
  },
  {
    item_id: "faq-nude-b",
    title: "Kan jeg laste opp nakenbilder?",
    answer: "Ja, det kan du.",
    category: "safety",
    content_type: "faq",
    locale: "no",
    source_url: null,
    score: 49,
    matched_reason: "title",
  },
];

const exactBlocker = "Kan jeg laste opp nakenbilder av andre personer?";

assert.equal(isWebsiteKompisMandatorySafetyRefusalQuestion(exactBlocker), true);
assert.equal(
  isWebsiteKompisMandatorySafetyRefusalQuestion("Kan jeg laste opp bilder av andre?"),
  true,
);
assert.equal(
  isWebsiteKompisMandatorySafetyRefusalQuestion("Kan jeg sende andres bilder i privat chat?"),
  true,
);
assert.equal(
  isWebsiteKompisMandatorySafetyRefusalQuestion("Kan jeg laste opp bilder av noen uten samtykke?"),
  true,
);
assert.equal(isWebsiteKompisMandatorySafetyRefusalQuestion("Kan jeg laste opp egne nakenbilder?"), false);

assert.equal(shouldRejectWebsiteKompisFaqMatch(exactBlocker, broadNudeFaq), true);
assert.equal(shouldRejectWebsiteKompisFaqMatch(exactBlocker, mirroredUnsafeFaq), true);
assert.equal(
  shouldRejectWebsiteKompisFaqMatch("Kan jeg laste opp bilder av andre?", broadNudeFaq),
  true,
);
assert.equal(
  shouldRejectWebsiteKompisFaqMatch("Kan jeg sende andres bilder i privat chat?", broadNudeFaq),
  true,
);
assert.equal(
  shouldRejectWebsiteKompisFaqMatch("Kan jeg laste opp bilder av noen uten samtykke?", broadNudeFaq),
  true,
);
assert.equal(
  shouldRejectWebsiteKompisFaqMatch("Kan jeg laste opp egne nakenbilder?", broadNudeFaq),
  true,
);
assert.equal(
  shouldRejectWebsiteKompisFaqMatch(
    "Kan jeg laste opp egne nakenbilder?",
    {
      title: "Kan jeg laste opp egne nakenbilder?",
      answer: "Ja, egne bilder er tillatt når du har rettighetene og følger plattformens regler.",
    },
  ),
  false,
);

const consentFaq = {
  title: "Kan jeg laste opp nakenbilder av andre personer?",
  answer: "Nei, bare med uttrykkelig samtykke og nødvendige rettigheter.",
};
assert.equal(shouldRejectWebsiteKompisFaqMatch(exactBlocker, consentFaq), false);

assert.equal(filterWebsiteKompisSafeFaqRows(exactBlocker, duplicateUnsafeRows).length, 0);

const refusal = buildWebsiteKompisSafetyPolicyRefusalCopy("no");
assert.match(refusal.directAnswer, /^Nei\./);
assert.match(refusal.directAnswer, /samtykke/i);
assert.match(refusal.directAnswer, /rettighe/i);
assert.match(refusal.explanation, /samtykke/i);
assert.match(refusal.explanation, /eier|dele/i);
assert.equal(WEBSITE_KOMPIS_SAFETY_POLICY_SOURCE, "website-kompis-safety-policy");

console.log("website-kompis-faq-match-safety.test.ts: all assertions passed");
