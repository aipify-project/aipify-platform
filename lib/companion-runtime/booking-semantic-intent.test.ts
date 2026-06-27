import assert from "node:assert/strict";
import {
  collectBookingDescriptorsFromManifests,
  isClearBookingListReadIntent,
  resolveBookingSemanticIntent,
} from "@/lib/companion-runtime/booking-semantic-intent";
import { isClearBookingCreateIntent } from "@/lib/companion-runtime/booking-proposal-turn-producer";
import { resolveDirectDateTimeKind } from "@/lib/companion-runtime/direct-datetime-answer";
import { APPOINTMENT_BOOKING_PROVIDER_MANIFESTS } from "@/lib/integration-intelligence/providers/appointment-booking/booking-manifest";

const descriptors = collectBookingDescriptorsFromManifests(APPOINTMENT_BOOKING_PROVIDER_MANIFESTS);

function assertCreateIntent(query: string) {
  const intent = resolveBookingSemanticIntent({ query, locale: "no", descriptors });
  assert.equal(intent.capability_key, "booking.create");
  assert.equal(intent.operation, "create");
  assert.equal(isClearBookingCreateIntent(intent), true);
}

assertCreateIntent("Bestill time mandag kl. 10");
assertCreateIntent("Jeg vil bestille time mandag kl. 10");
assertCreateIntent("Ny bestilling for kunde mandag kl. 10");

const c3xTurn1 = "Jeg vil bestille Kontrollert testavtale mandag 29. juni kl. 10.";
assertCreateIntent(c3xTurn1);
assert.equal(resolveDirectDateTimeKind(c3xTurn1), null);

const avbestilleIntent = resolveBookingSemanticIntent({
  query: "Jeg vil avbestille min time mandag",
  locale: "no",
  descriptors,
});
assert.notEqual(avbestilleIntent.capability_key, "booking.create");
assert.equal(isClearBookingCreateIntent(avbestilleIntent), false);

const c3xTurn2 =
  "Ja, bekreft bookingen. Kunde: P112-C3X-R3. Tjeneste: Kontrollert testavtale. Tidspunkt: mandag neste uke kl. 10:00. Varighet: 60 minutter. Opprett kun én booking.";

const tidspunktIntent = resolveBookingSemanticIntent({
  query: c3xTurn2,
  locale: "no",
  descriptors,
});

assert.equal(tidspunktIntent.capability_key, "booking.create");
assert.equal(tidspunktIntent.booking_id, null);
assert.equal(tidspunktIntent.confirmed, true);

const explicitBookingId = resolveBookingSemanticIntent({
  query: "Vis avtale id apt_test1234 for kunde",
  locale: "no",
  descriptors,
});
assert.equal(explicitBookingId.capability_key, "booking.read");
assert.equal(explicitBookingId.booking_id, "apt_test1234");

const tidLabelOnly = resolveBookingSemanticIntent({
  query: "Tidspunkt: mandag kl 10:00 for ny booking",
  locale: "no",
  descriptors,
});
assert.equal(tidLabelOnly.booking_id, null);

for (const query of ["Vis meg bookinger", "Vis bookinger", "Vis meg avtaler"]) {
  const listIntent = resolveBookingSemanticIntent({ query, locale: "no", descriptors });
  assert.equal(listIntent.capability_key, "booking.read", query);
  assert.equal(listIntent.operation, "list", query);
  assert.equal(isClearBookingListReadIntent(listIntent), true, query);
}

console.log("booking-semantic-intent.test.ts: all assertions passed");
