import assert from "node:assert/strict";
import { classifyWebsiteKompisFaqDisclosure } from "@/lib/website-kompis-faq/disclosure";
import { chunkFaqIds, planPublicSafeReview } from "@/lib/website-kompis-faq/bulk-review";

const ordinary = [
  "Hva får Gold-medlemmer?",
  "Hva er medlemskap?",
  "Kan jeg booke?",
  "Hva koster abonnementet?",
  "Hvordan får jeg faktura?",
  "Hva gjelder for nakenbilder?",
  "Can members book a session? Membership includes booking and the price.",
  "Hvad er medlemskab, og kan jeg booke?",
  "Vad ingår i medlemskapet? Medlemmar kan boka.",
  "Vi behandler personopplysninger etter samtykke.",
  "Internett og internasjonale medlemmer kan booke.",
  "Ask the employee at the desk.",
  "How do I reset my password?",
  "Where is the invoice number?",
  "A support case about opening hours.",
  "A member id is explained for new members.",
  "Økonomi, pris og ansatte i resepsjonen.",
  "Faktura sendes innen 14 dager.",
  "Sex and nakenbilder follow the public consent rules.",
];

for (const text of ordinary) {
  assert.deepEqual(classifyWebsiteKompisFaqDisclosure(text), [], text);
}

assert.deepEqual(classifyWebsiteKompisFaqDisclosure("Member id A-48291 is stored for this customer."), [
  "personal_identifier",
]);
assert.deepEqual(classifyWebsiteKompisFaqDisclosure("Medlemsnummer 45821 skal ikke stå i svaret."), [
  "personal_identifier",
]);
assert.deepEqual(classifyWebsiteKompisFaqDisclosure("Fakturanummer 10023 gjelder denne kunden."), [
  "customer_invoice",
]);
assert.deepEqual(classifyWebsiteKompisFaqDisclosure("Invoice 10023 is for this account."), [
  "customer_invoice",
]);
assert.ok(
  classifyWebsiteKompisFaqDisclosure("Intern note: ikke publiser denne teksten.").includes("internal_note"),
);
assert.ok(
  classifyWebsiteKompisFaqDisclosure("Internal note: do not publish this draft.").includes("internal_note"),
);
assert.ok(
  classifyWebsiteKompisFaqDisclosure("API key: sk_live_51HabcDEFghiJKLmnop").includes("access_secret"),
);
assert.ok(classifyWebsiteKompisFaqDisclosure("password: Sommer2026x").includes("access_secret"));
assert.ok(
  classifyWebsiteKompisFaqDisclosure(
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N",
  ).includes("access_secret"),
);

const many = Array.from({ length: 444 }, (_, index) => ({
  id: `00000000-0000-4000-8000-${index.toString(16).padStart(12, "0")}`,
  status: "draft",
  publicSafe: false,
  title: "Hva får Gold-medlemmer?",
  question: "Kan jeg booke?",
  answer: "Medlemskapet inkluderer booking. Faktura sendes etter kjøp. Nakenbilder følger samtykke.",
}));
many[10] = {
  ...many[10]!,
  answer: "Internal note: member id A-48291. Do not publish.",
};
const large = planPublicSafeReview(many, many.map((row) => row.id));
assert.equal(large.manualIds.length, 1);
assert.equal(large.readyIds.length, 443);
assert.equal(large.skipped.find((row) => row.id === many[10]!.id)?.disclosures?.includes("personal_identifier"), true);
assert.equal(large.skipped.find((row) => row.id === many[10]!.id)?.disclosures?.includes("internal_note"), true);
assert.equal(chunkFaqIds(many.map((row) => row.id)).length, 18);
assert.equal(chunkFaqIds(many.map((row) => row.id))[17]?.length, 19);

const fiveHundred = Array.from({ length: 500 }, (_, index) => ({
  id: `10000000-0000-4000-8000-${index.toString(16).padStart(12, "0")}`,
  status: "draft",
  publicSafe: false,
  title: "Hva er medlemskap?",
  question: null,
  answer: "Medlemmer kan booke.",
}));
assert.equal(planPublicSafeReview(fiveHundred, fiveHundred.map((row) => row.id)).readyIds.length, 500);

console.log("disclosure.test.ts: ok");
