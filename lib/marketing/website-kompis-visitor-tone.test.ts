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
assert.equal(compactLabels.greetingSupport, "Spør meg om det du lurer på.");
assert.equal(compactLabels.placeholder, "Skriv en melding…");
assert.equal(compactLabels.productName, "Kompis");
assert.equal(compactLabels.credit, "Drevet av Aipify");
assert.equal(compactLabels.sourceFromSite, "Kilde fra nettstedet");
assert.equal(compactLabels.quickActions.length, 2);
assert.ok(!compactLabels.quickActions.some((action) => /kontakt/i.test(action.label)));

const standardLabels = resolveWebsiteKompisEmbedUiLabels({
  locale: "no",
  welcomeMessageVariant: "standard",
});
assert.equal(standardLabels.greeting, "Hei! Hva kan jeg hjelpe deg med?");
assert.equal(standardLabels.placeholder, "Skriv en melding…");
assert.notEqual(standardLabels.greeting, standardLabels.greetingSupport);

const enLabels = resolveWebsiteKompisEmbedUiLabels({
  locale: "en",
  welcomeMessageVariant: "standard",
});
assert.equal(enLabels.greeting, "Hi! How can I help you?");
assert.equal(enLabels.placeholder, "Type a message…");
assert.equal(enLabels.credit, "Powered by Aipify");

console.log("website-kompis-visitor-tone.test.ts: all assertions passed");
