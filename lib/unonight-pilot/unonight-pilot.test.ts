import assert from "node:assert/strict";
import {
  buildPilotSignalDedupKey,
  filterDeniedFields,
  generateShadowRecommendations,
  assertShadowRecommendationNotExecutable,
  isDeniedPilotField,
  isDuplicateSignal,
  parseUnonightPilotCommandBrief,
  parseUnonightPilotHealthDashboard,
  runPilotDiscovery,
  validateKillSwitchAllowsSync,
  validatePilotActivationGates,
  evaluateKillSwitch,
  canRunSync,
  UNONIGHT_COMPANY_SLUG,
} from "./index";

// 1. Unonight org treated normally — slug constant, no bypass flag
assert.equal(UNONIGHT_COMPANY_SLUG, "unonight");

// 2. Read-only blocks mutations
const readOnlyGate = validatePilotActivationGates(
  {
    pilot_mode: "unonight_read_only",
    enabled: true,
    read_only: true,
    shadow_mode: false,
    health_state: "read_only_active",
    kill_switch: false,
    last_successful_sync: null,
    last_discovery_run: null,
    approved_at: null,
  },
  { allowMutation: true }
);
assert.equal(readOnlyGate.ok, false);
assert.equal(readOnlyGate.blockedBy, "read_only");

// 3. Denied sensitive fields
assert.equal(isDeniedPilotField("message_body"), true);
assert.equal(isDeniedPilotField("queue_depth"), false);
const filtered = filterDeniedFields({
  queue_depth: 12,
  message_body: "secret",
  title: "Support queue",
});
assert.deepEqual(filtered.deniedHits, ["message_body"]);
assert.equal(filtered.allowed.queue_depth, 12);

// 4. Org scoping / cross-tenant rejection
const crossTenant = validatePilotActivationGates(
  {
    pilot_mode: "unonight_read_only",
    enabled: true,
    read_only: true,
    shadow_mode: false,
    health_state: "read_only_active",
    kill_switch: false,
    last_successful_sync: null,
    last_discovery_run: null,
    approved_at: null,
  },
  { authOrgId: "org-a", targetOrgId: "org-b" }
);
assert.equal(crossTenant.ok, false);
assert.equal(crossTenant.blockedBy, "cross_tenant");

const briefWrongTenant = parseUnonightPilotCommandBrief({
  found: false,
  reason: "not_unonight_tenant",
});
assert.equal(briefWrongTenant.found, false);

// 5. Kill switch stops sync
const killSwitchSettings = {
  pilot_mode: "unonight_read_only" as const,
  enabled: true,
  read_only: true,
  shadow_mode: false,
  health_state: "paused" as const,
  kill_switch: true,
  last_successful_sync: null,
  last_discovery_run: null,
  approved_at: null,
};
assert.equal(validateKillSwitchAllowsSync(killSwitchSettings), false);
assert.equal(evaluateKillSwitch(killSwitchSettings).syncBlocked, true);

// 6. Shadow recs don't execute
const shadowRecs = generateShadowRecommendations(
  [
    {
      signal_type: "support_metric",
      title: "Support queue depth observed",
      summary: "Metadata only",
      observed_at: new Date().toISOString(),
      metrics: { queue_depth: 12 },
    },
  ],
  true
);
assert.ok(shadowRecs.length >= 1);
assert.throws(() => assertShadowRecommendationNotExecutable({ executed: true }));

const parsedBrief = parseUnonightPilotCommandBrief({
  found: true,
  pilot_active: true,
  read_only: true,
  shadow_mode: true,
  shadow_recommendations: [
    {
      id: "rec-1",
      title: "Review staffing",
      summary: "Queue elevated",
      confidence: "moderate",
      prepared_at: "2026-06-21T10:00:00Z",
      label_key: "customerApp.unonightPilot621.shadowRecommendationPrepared",
    },
  ],
  since_last_login_mode: "observed_by_aipify",
});
assert.equal(parsedBrief.shadow_recommendations?.[0]?.executed, false);
assert.equal(parsedBrief.since_last_login_mode, "observed_by_aipify");

// 7. Dedup logic
const key = buildPilotSignalDedupKey({
  organizationId: "org-1",
  sourceSystem: "unonight",
  sourceRecordId: "rec-1",
  eventType: "queue_depth",
});
const existing = new Set([key]);
assert.equal(
  isDuplicateSignal(existing, {
    organizationId: "org-1",
    sourceSystem: "unonight",
    sourceRecordId: "rec-1",
    eventType: "queue_depth",
  }),
  true
);

// 8. No fake data injection — discovery marks external connection required
const discovery = runPilotDiscovery();
assert.equal(discovery.externalConnectionRequired, true);
assert.ok(discovery.connectionNote.includes("Configure"));

// 9. Sync scheduler respects kill switch
assert.equal(canRunSync(killSwitchSettings), false);

// 10. Parser handles platform health dashboard
const health = parseUnonightPilotHealthDashboard({
  found: true,
  organization_id: "org-unonight",
  settings: {
    pilot_mode: "unonight_read_only",
    enabled: true,
    read_only: true,
    shadow_mode: false,
    health_state: "read_only_active",
    kill_switch: false,
  },
  data_sources: [],
});
assert.equal(health.settings?.read_only, true);

console.log("unonight-pilot phase 621 tests passed");
