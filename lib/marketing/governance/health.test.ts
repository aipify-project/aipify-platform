import assert from "node:assert/strict";
import { buildWebsiteHealthReport, getWebsiteGovernanceBundle } from "./health";

const routes = getWebsiteGovernanceBundle().routes;
assert.ok(routes.includes("/"));
assert.ok(routes.includes("/growth-partners"));
assert.ok(routes.includes("/certified-sales-partner"));
assert.ok(routes.includes("/contact/support"));
assert.equal(routes.includes("/product"), false);
assert.equal(routes.includes("/book-demo"), false);
assert.equal(routes.includes("/login"), false);

const report = buildWebsiteHealthReport({ localizedLocales: 7 });
const seo = report.checks.find((c) => c.id === "seo_health");
assert.ok(seo?.summary?.includes("noindex"));
const conversion = report.checks.find((c) => c.id === "conversion_paths");
assert.doesNotMatch(String(conversion?.summary), /Book Demo/i);

console.log("health.test.ts: ok");
