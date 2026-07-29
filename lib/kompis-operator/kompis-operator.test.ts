import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  createKompisOperatorIdempotencyKey,
  planKompisOperatorRequest,
  planToRpcJson,
} from "./planner";
import { mapKompisOperatorRpcError, parseCreateRunInput, parseApproveInput } from "./parse";
import { riskClassTone, runStatusTone } from "./severity";
import { KOMPIS_OPERATOR_TOOL_REGISTRY, isKompisOperatorToolKey } from "./tools-registry";
import {
  discoverCoreOperatorLocales,
  discoverExtendedOperatorLocales,
  discoverOperatorLocales,
} from "./locales";

assert.match(createKompisOperatorIdempotencyKey(), /^kor-/);

const readPlan = planKompisOperatorRequest("Kontroller APP og Website Kompis");
assert.equal(readPlan.riskClass, 0);
assert.ok(readPlan.steps.length >= 2);
assert.equal(readPlan.requiresApproval, false);
assert.ok(readPlan.steps.every((step) => isKompisOperatorToolKey(step.toolKey)));

const critical = planKompisOperatorRequest("Slett alle brukere og endre DNS");
assert.equal(critical.riskClass, 3);
assert.equal(critical.steps.length, 0);
assert.equal(critical.unavailableReason, "critical_blocked");

const criticalWithLicense = planKompisOperatorRequest(
  "Slett all kundedata og endre lisensen",
);
assert.equal(criticalWithLicense.riskClass, 3);
assert.equal(criticalWithLicense.steps.length, 0);
assert.equal(criticalWithLicense.unavailableReason, "critical_blocked");

const sqlBlocked = planKompisOperatorRequest("SELECT * FROM users WHERE 1=1");
assert.equal(sqlBlocked.unavailableReason, "sql_blocked");

const unsupported = planKompisOperatorRequest("Book a flight to Mars tomorrow");
assert.equal(unsupported.unavailableReason, "unsupported_intent");

const draft = planKompisOperatorRequest("Opprett et utkast til supportsak");
assert.equal(draft.riskClass, 1);
assert.equal(draft.requiresApproval, true);

const rpcPlan = planToRpcJson(readPlan);
assert.equal(typeof rpcPlan.riskClass, "number");
assert.ok(Array.isArray(rpcPlan.steps));

assert.deepEqual(mapKompisOperatorRpcError("CRITICAL_BLOCKED"), {
  status: 422,
  code: "critical_blocked",
});
assert.equal(parseCreateRunInput({ requestText: "ab", idempotencyKey: "kor-12345678" }).ok, true);
assert.equal(parseCreateRunInput({ requestText: "a", idempotencyKey: "bad" }).ok, false);
assert.equal(parseApproveInput({ confirmation: true, reason: "ok" }).ok, true);
assert.equal(parseApproveInput({ confirmation: false }).ok, false);

assert.equal(riskClassTone(0, "idle"), "info");
assert.equal(riskClassTone(3, "blocked"), "danger");
assert.equal(riskClassTone(1, "success"), "success");
assert.equal(runStatusTone("completed"), "success");
assert.equal(runStatusTone("partial"), "warning");
assert.equal(runStatusTone("failed"), "danger");

assert.ok(discoverOperatorLocales().includes("en"));
assert.ok(discoverOperatorLocales().includes("es"));
assert.ok(discoverCoreOperatorLocales().includes("no"));
assert.ok(discoverExtendedOperatorLocales().includes("es"));

const root = process.cwd();
for (const locale of discoverOperatorLocales()) {
  const core = JSON.parse(
    readFileSync(join(root, "locales", locale, "customer-app", "core.json"), "utf8"),
  ) as { kompisOperator?: Record<string, string> };
  assert.ok(core.kompisOperator, `${locale} missing kompisOperator`);
  assert.equal(Object.keys(core.kompisOperator).length >= 40, true, `${locale} key count`);
  assert.doesNotMatch(JSON.stringify(core.kompisOperator), /unonight/i);
}

const migration = readFileSync(
  join(root, "supabase/migrations/20261935100000_app_kompis_operator_workspace_v1.sql"),
  "utf8",
);
assert.doesNotMatch(migration, /unonight/i);
assert.match(migration, /_platform_require_high_risk_write/);
assert.match(migration, /kompis_operator_runs/);
assert.match(migration, /super_admin/);

assert.ok(KOMPIS_OPERATOR_TOOL_REGISTRY.some((tool) => tool.key === "website_kompis_status_read"));
assert.ok(KOMPIS_OPERATOR_TOOL_REGISTRY.some((tool) => !tool.available));

const source = readFileSync(join(root, "lib/kompis-operator/planner.ts"), "utf8");
assert.doesNotMatch(source, /unonight/i);
assert.doesNotMatch(source, /32d748eb/i);

console.log("kompis-operator: all tests passed");
