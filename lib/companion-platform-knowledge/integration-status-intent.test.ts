import assert from "node:assert/strict";
import { detectLiveIntegrationStatusIntent } from "./integration-status-intent";

const acceptanceQuery =
  "Bruk den aktive Unonight-integrasjonen og hent live tilkoblingsinformasjon nå. Oppgi organisasjonsnavn og organisasjons-ID, API-versjon, tilgangstype, aktive tillatelser/scopes, støttede språk og når integrasjonen sist ble brukt. Ikke bruk Knowledge Center eller generell informasjon. Fortell tydelig hvilken integrasjon og datakilde svaret kommer fra.";

const intent = detectLiveIntegrationStatusIntent(acceptanceQuery);
assert.ok(intent);
assert.equal(intent?.providerKey, "unonight");
assert.equal(intent?.requiresLive, true);
assert.equal(intent?.blocksKnowledgeCenter, true);

assert.equal(detectLiveIntegrationStatusIntent("How do member roles work in Aipify?"), null);

console.log("companion integration status intent tests passed");
