import assert from "node:assert/strict";
import {
  isPresentableOperationalRecord,
  isUncertifiedOperationalRecord,
  resolveOperationalMetadataGapReason,
} from "./source-classification";

assert.equal(
  isPresentableOperationalRecord({
    data_classification: "live",
    source_verified: true,
    readiness: "ready",
  }),
  true,
);

assert.equal(
  isPresentableOperationalRecord({
    data_classification: "seed",
    source_verified: false,
    readiness: "ready",
  }),
  false,
);

assert.equal(
  isPresentableOperationalRecord({
    data_classification: "demo",
    source_verified: false,
    readiness: "ready",
  }),
  false,
);

assert.equal(
  isPresentableOperationalRecord({
    data_classification: "unknown",
    source_verified: false,
    readiness: "uncertified",
    freshness: "unknown",
  }),
  false,
);

assert.equal(isUncertifiedOperationalRecord({}), true);
assert.equal(
  isUncertifiedOperationalRecord({
    data_classification: "unknown",
    source_verified: false,
    readiness: "uncertified",
  }),
  true,
);
assert.equal(
  isUncertifiedOperationalRecord({ data_classification: "live", readiness: "ready" }),
  false,
);

assert.equal(
  resolveOperationalMetadataGapReason({
    data_classification: "seed",
    source_verified: false,
    readiness: "ready",
  }),
  "demo_data_not_presentable",
);

assert.equal(
  resolveOperationalMetadataGapReason({
    data_classification: "unknown",
    source_verified: false,
    readiness: "uncertified",
  }),
  "registry_not_connected",
);

console.log("operational source-classification: PASS");
