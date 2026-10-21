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

const swedishFromHostCode = buildWebsiteKompisWarmSafeFallbackCopy("se", null, "professional-friendly");
assert.match(swedishFromHostCode, /Jag hittar inte tillräckligt publicerad information/);
assert.doesNotMatch(swedishFromHostCode, /Jeg finner ikke/);
const danishFromHostCode = buildWebsiteKompisWarmSafeFallbackCopy("dk", null, "professional-friendly");
assert.match(danishFromHostCode, /Jeg finder ikke nok offentliggjort information/);
const swedishShell = resolveWebsiteKompisEmbedUiLabels({ locale: "se", welcomeMessageVariant: "compact" });
assert.equal(swedishShell.productName, "Kompis");
assert.equal(swedishShell.placeholder, "Skriv ett meddelande…");
const englishShell = resolveWebsiteKompisEmbedUiLabels({ locale: "en", welcomeMessageVariant: "compact" });
assert.equal(englishShell.productName, "Kompis");
assert.equal(englishShell.title, "Website Kompis");
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

for (const locale of ["en", "no", "sv", "da", "pl", "uk"] as const) {
  const labels = resolveWebsiteKompisEmbedUiLabels({
    locale,
    welcomeMessageVariant: "standard",
  });
  assert.ok(labels.credit.trim().length > 0, `credit missing for ${locale}`);
  assert.ok(labels.sending.trim().length > 0, `sending missing for ${locale}`);
  assert.ok(labels.greeting.trim().length > 0, `greeting missing for ${locale}`);
  assert.ok(labels.placeholder.trim().length > 0, `placeholder missing for ${locale}`);
  assert.ok(labels.open.trim().length > 0, `open missing for ${locale}`);
  assert.ok(labels.error.trim().length > 0, `error missing for ${locale}`);
  assert.ok(labels.feedbackHelpful.trim().length > 0, `feedbackHelpful missing for ${locale}`);
  assert.ok(labels.feedbackCopy.trim().length > 0, `feedbackCopy missing for ${locale}`);
  assert.ok(labels.feedbackNotHelpful.trim().length > 0, `feedbackNotHelpful missing for ${locale}`);
}
assert.equal(enLabels.feedbackCopied, "Copied");
assert.equal(compactLabels.feedbackHelpful, "Nyttig svar");
assert.equal(enLabels.newChat, "New chat");
assert.equal(compactLabels.contactSupport, "Kontakt support");
assert.equal(enLabels.contactSupport, "Contact support");

console.log("website-kompis-visitor-tone.test.ts: all assertions passed");
