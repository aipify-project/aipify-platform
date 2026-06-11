import assert from "node:assert/strict";
import { calculateHealthScore, healthBandFromScore } from "./health-score";

assert.equal(
  calculateHealthScore({
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    overdueWorkflowPenalty: 0,
    responseTimePenalty: 0,
  }),
  100
);

assert.equal(
  calculateHealthScore({
    critical: 2,
    high: 1,
    medium: 2,
    low: 3,
    overdueWorkflowPenalty: 25,
    responseTimePenalty: 20,
  }),
  2
);

assert.equal(
  calculateHealthScore({
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    overdueWorkflowPenalty: 100,
    responseTimePenalty: 100,
  }),
  65
);

assert.equal(healthBandFromScore(95), "healthy");
assert.equal(healthBandFromScore(80), "good");
assert.equal(healthBandFromScore(60), "needs_attention");
assert.equal(healthBandFromScore(30), "risky");
assert.equal(healthBandFromScore(10), "critical");
