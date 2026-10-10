import assert from "node:assert/strict";
import {
  buildWebsiteKompisWarmSafeFallbackCopy,
  presentWebsiteKompisCustomerSiteAnswer,
  resolveWebsiteKompisEmbedUiLabels,
} from "@/lib/marketing/website-kompis-visitor-tone";

const warmNo = buildWebsiteKompisWarmSafeFallbackCopy("no", "Unonight", "professional-friendly");
assert.match(warmNo, /Unonight/);
assert.match(warmNo, /Ta gjerne kontakt/);

const shortNo = buildWebsiteKompisWarmSafeFallbackCopy("no", "Unonight", "short-direct");
assert.match(shortNo, /Ikke nok publisert info/);
assert.ok(!shortNo.includes("Ta gjerne"));

const currentPage = presentWebsiteKompisCustomerSiteAnswer(
  {
    directAnswer: "Medlemskap gir eksklusive fordeler.",
    explanation: null,
    steps: [],
  },
  {
    locale: "no",
    fallbackTone: "professional-friendly",
    source: "current-page",
  },
);
assert.match(currentPage.directAnswer, /Her er det jeg finner på denne siden:/);
assert.match(currentPage.directAnswer, /Medlemskap gir eksklusive fordeler/);

const compactLabels = resolveWebsiteKompisEmbedUiLabels({
  locale: "no",
  welcomeMessageVariant: "compact",
});
assert.equal(compactLabels.greeting, "Hei! Hva kan jeg hjelpe deg med?");
assert.equal(compactLabels.placeholder, "Skriv en melding…");
assert.equal(compactLabels.prompt, "Om denne siden");

const standardLabels = resolveWebsiteKompisEmbedUiLabels({
  locale: "no",
  welcomeMessageVariant: "standard",
});
assert.equal(standardLabels.greeting, "Hei! Hva kan jeg hjelpe deg med?");
assert.equal(standardLabels.placeholder, "Skriv en melding…");
assert.match(standardLabels.prompt, /nettsiden/);
assert.notEqual(standardLabels.greeting, standardLabels.prompt);

const enLabels = resolveWebsiteKompisEmbedUiLabels({
  locale: "en",
  welcomeMessageVariant: "standard",
});
assert.equal(enLabels.greeting, "Hi! How can I help you?");
assert.equal(enLabels.placeholder, "Type a message…");

console.log("website-kompis-visitor-tone.test.ts: all assertions passed");
