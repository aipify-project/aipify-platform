import assert from "node:assert/strict";
import {
  DEPENDENCY_PURCHASE_GATE_LATER_WIRING,
  evaluateDependencyPurchaseGate,
  normalizeDependencyKeys,
  PRODUCT_DEPENDENCY_SEMANTICS,
} from "./dependency-purchase-gate";

assert.equal(PRODUCT_DEPENDENCY_SEMANTICS, "all");
assert.deepEqual(normalizeDependencyKeys(["Kompis_Web", " kompis_web ", "bad key!", "design_pack"]), [
  "kompis_web",
  "design_pack",
]);

const org = "org-a";

// Positive: primary with no deps
{
  const d = evaluateDependencyPurchaseGate({
    organizationId: org,
    expectedOrganizationId: org,
    product: { productKey: "kompis_web", productType: "primary", dependsOnProductKeys: [] },
    entitlements: { organizationId: org, activeProductKeys: [] },
  });
  assert.equal(d.ok, true);
}

// Positive: addon with ALL deps active
{
  const d = evaluateDependencyPurchaseGate({
    organizationId: org,
    expectedOrganizationId: org,
    product: {
      productKey: "design_pack",
      productType: "addon",
      dependsOnProductKeys: ["kompis_web", "kompis_bedrift"],
    },
    entitlements: {
      organizationId: org,
      activeProductKeys: ["kompis_web", "kompis_bedrift"],
    },
  });
  assert.equal(d.ok, true);
  if (d.ok) assert.deepEqual(d.requires, ["kompis_web", "kompis_bedrift"]);
}

// Negative: addon missing one of ALL deps
{
  const d = evaluateDependencyPurchaseGate({
    organizationId: org,
    expectedOrganizationId: org,
    product: {
      productKey: "design_pack",
      productType: "addon",
      dependsOnProductKeys: ["kompis_web", "kompis_bedrift"],
    },
    entitlements: { organizationId: org, activeProductKeys: ["kompis_web"] },
  });
  assert.equal(d.ok, false);
  if (!d.ok) {
    assert.equal(d.error, "dependency_unsatisfied");
    assert.deepEqual(d.missingKeys, ["kompis_bedrift"]);
  }
}

// Negative: expired / empty entitlement set
{
  const d = evaluateDependencyPurchaseGate({
    organizationId: org,
    expectedOrganizationId: org,
    product: {
      productKey: "design_pack",
      productType: "addon",
      dependsOnProductKeys: ["kompis_web"],
    },
    entitlements: { organizationId: org, activeProductKeys: [] },
  });
  assert.equal(d.ok, false);
  if (!d.ok) assert.equal(d.error, "dependency_unsatisfied");
}

// Negative: foreign tenant entitlements
{
  const d = evaluateDependencyPurchaseGate({
    organizationId: org,
    expectedOrganizationId: org,
    product: {
      productKey: "design_pack",
      productType: "addon",
      dependsOnProductKeys: ["kompis_web"],
    },
    entitlements: { organizationId: "org-other", activeProductKeys: ["kompis_web"] },
  });
  assert.equal(d.ok, false);
  if (!d.ok) assert.equal(d.error, "foreign_tenant");
}

// Negative: unknown / unset addon dependency data
{
  const d = evaluateDependencyPurchaseGate({
    organizationId: org,
    expectedOrganizationId: org,
    product: { productKey: "design_pack", productType: "addon", dependsOnProductKeys: [] },
    entitlements: { organizationId: org, activeProductKeys: ["kompis_web"] },
  });
  assert.equal(d.ok, false);
  if (!d.ok) assert.equal(d.error, "dependency_data_unknown");
}

// Negative: self dependency
{
  const d = evaluateDependencyPurchaseGate({
    organizationId: org,
    expectedOrganizationId: org,
    product: {
      productKey: "design_pack",
      productType: "addon",
      dependsOnProductKeys: ["design_pack"],
    },
    entitlements: { organizationId: org, activeProductKeys: ["design_pack"] },
  });
  assert.equal(d.ok, false);
  if (!d.ok) assert.equal(d.error, "self_dependency");
}

// Negative: unresolved tenant
{
  const d = evaluateDependencyPurchaseGate({
    organizationId: null,
    expectedOrganizationId: org,
    product: { productKey: "kompis_web", productType: "primary", dependsOnProductKeys: [] },
    entitlements: { organizationId: org, activeProductKeys: [] },
  });
  assert.equal(d.ok, false);
  if (!d.ok) assert.equal(d.error, "tenant_unresolved");
}

assert.equal(DEPENDENCY_PURCHASE_GATE_LATER_WIRING.liveCheckoutFile, "lib/app-commerce/create-commerce-checkout.ts");
assert.equal(DEPENDENCY_PURCHASE_GATE_LATER_WIRING.keepCheckoutClosed, true);

// Guard: live checkout must not import this gate yet (authoring-only).
import { readFileSync } from "node:fs";
import { join } from "node:path";
const checkout = readFileSync(join(process.cwd(), "lib/app-commerce/create-commerce-checkout.ts"), "utf8");
assert.doesNotMatch(checkout, /dependency-purchase-gate/);

console.log("dependency-purchase-gate.test.ts: PASS");
