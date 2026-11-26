import assert from "node:assert/strict";
import { buildWorkspaceProductCards } from "./product-hero";

const webOnly = buildWorkspaceProductCards({
  webKind: "known_plan",
  webPlan: "pro",
  bedrift: "not_licensed",
});
assert.equal(webOnly.find((c) => c.id === "kompis_web")?.status, "active");
assert.equal(webOnly.find((c) => c.id === "kompis_web")?.primaryAction, "open");
assert.equal(webOnly.find((c) => c.id === "kompis_bedrift")?.status, "not_licensed");
assert.equal(webOnly.find((c) => c.id === "sales_partner")?.status, "under_review");
assert.equal(webOnly.find((c) => c.id === "sales_partner")?.inMyProducts, false);
assert.notEqual(webOnly.find((c) => c.id === "sales_partner")?.status, "active");

const bedriftOnly = buildWorkspaceProductCards({
  webKind: "no_module",
  webPlan: null,
  bedrift: "licensed",
});
assert.equal(bedriftOnly.find((c) => c.id === "kompis_bedrift")?.status, "active");
assert.equal(bedriftOnly.find((c) => c.id === "kompis_web")?.status, "not_licensed");

const none = buildWorkspaceProductCards({
  webKind: "unavailable",
  webPlan: null,
  bedrift: "unknown",
});
assert.equal(none.every((c) => c.status !== "active"), true);

console.log("product-hero.test.ts: ok");
