import assert from "node:assert/strict";
import {
  buildWebsiteKompisSafetyPolicyRefusalCopy,
  isWebsiteKompisMandatorySafetyRefusalQuestion,
  shouldRejectWebsiteKompisFaqMatch,
  WEBSITE_KOMPIS_SAFETY_POLICY_SOURCE,
} from "@/lib/marketing/website-kompis-faq-match-safety";

const broadNudeFaq = {
  title: "Kan jeg laste opp nakenbilder?",
  answer: "Ja, det kan du.",
};

assert.equal(
  isWebsiteKompisMandatorySafetyRefusalQuestion("Kan jeg laste opp nakenbilder av andre personer?"),
  true,
);
assert.equal(
  isWebsiteKompisMandatorySafetyRefusalQuestion("Kan jeg laste opp bilder av noen uten samtykke?"),
  true,
);
assert.equal(isWebsiteKompisMandatorySafetyRefusalQuestion("Kan jeg laste opp egne nakenbilder?"), false);

assert.equal(
  shouldRejectWebsiteKompisFaqMatch("Kan jeg laste opp nakenbilder av andre personer?", broadNudeFaq),
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
assert.equal(
  shouldRejectWebsiteKompisFaqMatch("Kan jeg laste opp nakenbilder av andre personer?", consentFaq),
  false,
);

const refusal = buildWebsiteKompisSafetyPolicyRefusalCopy("no");
assert.match(refusal.directAnswer, /^Nei\./);
assert.match(refusal.directAnswer, /samtykke/i);
assert.match(refusal.explanation, /samtykke/i);
assert.equal(WEBSITE_KOMPIS_SAFETY_POLICY_SOURCE, "website-kompis-safety-policy");

console.log("website-kompis-faq-match-safety.test.ts: all assertions passed");
