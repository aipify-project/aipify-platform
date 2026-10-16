import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  mapWebsiteKompisLicenseQuotaRead,
  readWebsiteKompisLicenseQuota,
  type WebsiteKompisLicenseQuotaPorts,
  type WebsiteKompisRpcResult,
  type WebsiteKompisSessionContext,
} from "./license-quota-read";

const CUSTOMER = "11111111-1111-4111-8111-111111111111";
const OTHER = "22222222-2222-4222-8222-222222222222";

function readyContext(customerId: string | null = CUSTOMER): WebsiteKompisSessionContext {
  return {
    authenticated: true,
    state: "ready",
    customer_id: customerId,
  };
}

function ok<T>(data: T): WebsiteKompisRpcResult<T> {
  return { ok: true, data };
}

function quota(plan: "free" | "standard" | "pro", periodKey: string, numbers: [number, number, number, number]) {
  const [allowance, finalized, reserved, remaining] = numbers;
  return {
    plan,
    state: "active",
    period_key: periodKey,
    period_zone: "utc",
    allowance,
    finalized,
    reserved,
    remaining,
    accepts_new_answers: remaining > 0,
    deny_reason: null,
  };
}

async function run(
  context: WebsiteKompisSessionContext,
  moduleResult: WebsiteKompisRpcResult<boolean>,
  license: unknown,
  quotaPayload: unknown,
  options?: { licenseOk?: boolean; quotaOk?: boolean; moduleThrows?: boolean },
) {
  const calls: string[] = [];
  const ports: WebsiteKompisLicenseQuotaPorts = {
    async readOrganizationContext() {
      calls.push("get_app_organization_context");
      return context;
    },
    async isTenantModuleEnabled(customerId) {
      calls.push(`is_tenant_module_enabled:${customerId}`);
      if (options?.moduleThrows) throw new Error("timeout");
      return moduleResult;
    },
    async getLicensePlan(customerId) {
      calls.push(`get_website_kompis_license_plan:${customerId}`);
      if (options?.licenseOk === false) return { ok: false };
      return ok(license);
    },
    async getAnswerQuota(customerId) {
      calls.push(`get_website_kompis_answer_quota:${customerId}`);
      if (options?.quotaOk === false) return { ok: false };
      return ok(quotaPayload);
    },
  };
  const read = await readWebsiteKompisLicenseQuota(ports);
  return { read, calls };
}

const nullPlan = await run(readyContext(), ok(true), { plan: null, state: null, version: null }, {
  plan: null,
  allowance: 150,
  finalized: 0,
  reserved: 0,
  remaining: 150,
  period_key: "lifetime",
  accepts_new_answers: true,
});
assert.equal(nullPlan.read.kind, "unknown_plan");
assert.equal("allowance" in nullPlan.read, false);
assert.equal(JSON.stringify(nullPlan.read).includes("150"), false);
assert.deepEqual(nullPlan.calls, [
  "get_app_organization_context",
  `is_tenant_module_enabled:${CUSTOMER}`,
  `get_website_kompis_license_plan:${CUSTOMER}`,
  `get_website_kompis_answer_quota:${CUSTOMER}`,
]);

for (const plan of ["free", "standard", "pro"] as const) {
  const period = plan === "free" ? "lifetime" : "2026-10";
  const numbers = plan === "free" ? [150, 12, 1, 137] : plan === "standard" ? [2500, 40, 2, 2458] : [10000, 3, 0, 9997];
  const known = await run(
    readyContext(),
    ok(true),
    { plan, state: "active", version: 1 },
    quota(plan, period, numbers as [number, number, number, number]),
  );
  assert.equal(known.read.kind, "known_plan");
  if (known.read.kind === "known_plan") {
    assert.equal(known.read.plan, plan);
    assert.equal(known.read.allowance, numbers[0]);
    assert.equal(known.read.finalized, numbers[1]);
    assert.equal(known.read.reserved, numbers[2]);
    assert.equal(known.read.remaining, numbers[3]);
    assert.equal(known.read.periodKey, period);
  }
}

const noModule = await run(readyContext(), ok(false), { plan: "pro", state: "active" }, quota("pro", "2026-10", [10000, 1, 0, 9999]));
assert.equal(noModule.read.kind, "no_module");
assert.equal(JSON.stringify(noModule.read).includes("pro"), false);
assert.equal(JSON.stringify(noModule.read).includes("10000"), false);

const inactive = mapWebsiteKompisLicenseQuotaRead({
  moduleResult: ok(false),
  licenseResult: ok({ plan: "free" }),
  quotaResult: ok(quota("free", "lifetime", [150, 0, 0, 150])),
});
assert.equal(inactive.kind, "no_module");

const crossTenant = await run(
  readyContext(CUSTOMER),
  ok(false),
  { plan: null, state: null, version: null },
  { plan: null, allowance: null, finalized: null, reserved: null, remaining: null, accepts_new_answers: false },
);
assert.equal(crossTenant.read.kind, "no_module");
assert.ok(crossTenant.calls.every((call) => !call.includes(OTHER)));

const permission = await run(readyContext(), { ok: false }, { plan: "free" }, quota("free", "lifetime", [150, 0, 0, 150]));
assert.equal(permission.read.kind, "unavailable");
assert.equal(JSON.stringify(permission.read).includes("0"), false);

const timeout = await run(
  readyContext(),
  ok(true),
  { plan: "standard" },
  quota("standard", "2026-10", [2500, 0, 0, 2500]),
  { moduleThrows: true },
);
assert.equal(timeout.read.kind, "unavailable");

const quotaDenied = await run(
  readyContext(),
  ok(true),
  { plan: "free", state: "active", version: 1 },
  quota("free", "lifetime", [150, 0, 0, 150]),
  { quotaOk: false },
);
assert.equal(quotaDenied.read.kind, "unavailable");
assert.equal(JSON.stringify(quotaDenied.read).includes("150"), false);

const anon = await run(
  { ...readyContext(null), authenticated: false, state: "unauthenticated", customer_id: null },
  ok(true),
  { plan: "pro" },
  quota("pro", "2026-10", [10000, 0, 0, 10000]),
);
assert.equal(anon.read.kind, "unauthenticated");
assert.deepEqual(anon.calls, ["get_app_organization_context"]);

const mismatched = mapWebsiteKompisLicenseQuotaRead({
  moduleResult: ok(true),
  licenseResult: ok({ plan: "standard", state: "active" }),
  quotaResult: ok({ ...quota("pro", "2026-10", [10000, 0, 0, 10000]) }),
});
assert.equal(mismatched.kind, "unavailable");

const root = process.cwd();
const loader = readFileSync(join(root, "lib/website-kompis-plans/load-license-quota-read.ts"), "utf8");
const pure = readFileSync(join(root, "lib/website-kompis-plans/license-quota-read.ts"), "utf8");
const panel = readFileSync(join(root, "components/app/website-kompis/WebsiteKompisPlansPanel.tsx"), "utf8");
for (const source of [loader, pure, panel]) {
  assert.doesNotMatch(
    source,
    /reserve_website_kompis|finalize_website_kompis|release_website_kompis|set_website_kompis|schedule_website_kompis|insert into|update public\.tenant_modules/i,
  );
}
assert.match(loader, /get_app_organization_context/);
assert.match(loader, /is_tenant_module_enabled/);
assert.match(loader, /get_website_kompis_license_plan/);
assert.match(loader, /get_website_kompis_answer_quota/);
assert.match(loader, /p_customer_id: customerId/);
assert.doesNotMatch(panel, /create-checkout-session|STRIPE_/);

const assignmentKeys = [
  "unauthenticatedTitle",
  "unauthenticatedBody",
  "noModuleTitle",
  "noModuleBody",
  "unknownPlanTitle",
  "unknownPlanBody",
  "unavailableTitle",
  "unavailableBody",
  "knownTitle",
  "planLabel",
  "ceilingLabel",
  "usedLabel",
  "reservedLabel",
  "remainingLabel",
  "periodLabel",
  "periodLifetime",
  "periodUtcMonth",
  "acceptsAnswers",
  "pausesAnswers",
  "catalogSeparate",
  "notAPurchase",
];
const locales = ["en", "no", "sv", "da", "pl", "uk", "es"];
const english = JSON.parse(
  readFileSync(join(root, "locales/en/customer-app/core.json"), "utf8"),
).websiteKompisPlans.assignment;
for (const locale of locales) {
  const json = JSON.parse(readFileSync(join(root, `locales/${locale}/customer-app/core.json`), "utf8"));
  const assignment = json.websiteKompisPlans?.assignment;
  assert.ok(assignment, `${locale} assignment`);
  for (const key of assignmentKeys) {
    assert.equal(typeof assignment[key], "string", `${locale}.${key}`);
    assert.equal(assignment[key].includes("150"), false, `${locale}.${key} must not invent 150`);
    if (locale !== "en") {
      assert.notEqual(assignment[key], english[key], `${locale}.${key} must not copy English`);
    }
  }
}

console.log("website-kompis-plans/license-quota-read.test.ts: all assertions passed");
