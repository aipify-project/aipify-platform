import assert from "node:assert/strict";
import { detectLiveIntegrationStatusIntent } from "./integration-status-intent";

const acceptanceQuery =
  "Bruk den aktive Unonight-integrasjonen og hent live tilkoblingsinformasjon nå. Oppgi organisasjonsnavn og organisasjons-ID, API-versjon, tilgangstype, aktive tillatelser/scopes, støttede språk og når integrasjonen sist ble brukt. Ikke bruk Knowledge Center eller generell informasjon. Fortell tydelig hvilken integrasjon og datakilde svaret kommer fra.";

const intent = detectLiveIntegrationStatusIntent(acceptanceQuery);
assert.ok(intent);
assert.equal(intent?.providerKey, "unonight");
assert.equal(intent?.requiresLive, true);
assert.equal(intent?.blocksKnowledgeCenter, true);
assert.equal(intent?.queryKind, "status");

assert.equal(detectLiveIntegrationStatusIntent("How do member roles work in Aipify?"), null);

const test1 = detectLiveIntegrationStatusIntent(
  "Er Unonight koblet til Aipify akkurat nå, og hvilken tilgang har Aipify?",
);
assert.equal(test1?.queryKind, "status");
assert.equal(test1?.blocksKnowledgeCenter, true);

const test2 = detectLiveIntegrationStatusIntent("Når ble den sist brukt?", {
  integrationContext: "unonight",
});
assert.equal(test2?.queryKind, "last_used");
assert.equal(test2?.requiresLive, true);

const test3 = detectLiveIntegrationStatusIntent(
  "Hva har Aipify lov til å lese fra Unonight, og hva har den ikke lov til å gjøre?",
);
assert.equal(test3?.queryKind, "scopes");

const test4 = detectLiveIntegrationStatusIntent(
  "Hvilke språk oppgir Unonight-integrasjonen at den støtter?",
);
assert.equal(test4?.queryKind, "languages");

const test5 = detectLiveIntegrationStatusIntent(
  "Hvor mange aktive medlemmer har Unonight akkurat nå?",
);
assert.equal(test5?.queryKind, "unsupported_data");
assert.equal(test5?.blocksKnowledgeCenter, true);

const test6 = detectLiveIntegrationStatusIntent("Vis meg de siste private meldingene fra Unonight.");
assert.equal(test6?.queryKind, "private_data");
assert.equal(test6?.requiresLive, false);

const test7 = detectLiveIntegrationStatusIntent(
  "Hvordan vet du at opplysningene om Unonight er oppdaterte?",
);
assert.equal(test7?.queryKind, "source_trust");

const test8 = detectLiveIntegrationStatusIntent(
  "Fortell meg hvordan jeg endrer rollen til et teammedlem i Unonight.",
);
assert.equal(test8?.queryKind, "role_disambiguation");
assert.equal(test8?.blocksKnowledgeCenter, true);

const orgConnection = detectLiveIntegrationStatusIntent("Er organisasjonen koblet til Aipify?");
assert.equal(orgConnection?.queryKind, "status");
assert.equal(orgConnection?.blocksKnowledgeCenter, true);

console.log("companion integration status intent tests passed");
