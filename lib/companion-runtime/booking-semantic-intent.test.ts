import assert from "node:assert/strict";
import {
  collectBookingDescriptorsFromManifests,
  resolveBookingSemanticIntent,
} from "@/lib/companion-runtime/booking-semantic-intent";
import { APPOINTMENT_BOOKING_PROVIDER_MANIFESTS } from "@/lib/integration-intelligence/providers/appointment-booking/booking-manifest";

const descriptors = collectBookingDescriptorsFromManifests(APPOINTMENT_BOOKING_PROVIDER_MANIFESTS);

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

console.log("booking-semantic-intent.test.ts: all assertions passed");
