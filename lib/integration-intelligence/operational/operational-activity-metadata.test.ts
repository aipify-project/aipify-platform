import assert from "node:assert/strict";
import { parseActivityOperationsCenter } from "@/lib/activity-operations/parse";
import { isPresentableOperationalRecord, isUncertifiedOperationalRecord } from "./source-classification";

const liveBundle = parseActivityOperationsCenter({
  since_last_login: {
    top_risks: [
      {
        id: "evt-live-001",
        category: "operational_activity",
        priority: "attention_required",
        title: "Certified provider update",
        data_classification: "live",
        source_verified: true,
        readiness: "ready",
        freshness: "fresh",
        source_reference: "organization_operational_event_certifications",
      },
    ],
  },
});

const seedBundle = parseActivityOperationsCenter({
  since_last_login: {
    top_risks: [
      {
        id: "evt-seed-001",
        category: "operational_activity",
        priority: "attention_required",
        title: "Design validation row",
        data_classification: "seed",
        source_verified: false,
        readiness: "ready",
        freshness: "unknown",
      },
    ],
  },
});

const uncertifiedBundle = parseActivityOperationsCenter({
  since_last_login: {
    top_risks: [
      {
        id: "evt-uncertified-001",
        category: "operational_activity",
        priority: "information",
        title: "Missing provider certification",
        data_classification: "unknown",
        source_verified: false,
        readiness: "uncertified",
        freshness: "unknown",
        source_reference: "organization_activity_operations_events:uncertified",
      },
    ],
  },
});

const liveEvent = liveBundle.since_last_login?.top_risks?.[0];
const seedEvent = seedBundle.since_last_login?.top_risks?.[0];
const uncertifiedEvent = uncertifiedBundle.since_last_login?.top_risks?.[0];

assert.ok(liveEvent);
assert.ok(seedEvent);
assert.ok(uncertifiedEvent);
assert.equal(isPresentableOperationalRecord(liveEvent!), true);
assert.equal(isPresentableOperationalRecord(seedEvent!), false);
assert.equal(isPresentableOperationalRecord(uncertifiedEvent!), false);
assert.equal(isUncertifiedOperationalRecord(uncertifiedEvent!), true);

console.log("operational activity metadata parse: PASS");
