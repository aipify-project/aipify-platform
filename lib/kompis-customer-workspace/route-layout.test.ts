import assert from "node:assert/strict";
import {
  kompisContextLabelKey,
  normalizeAppRoute,
  resolveEffectiveKompisLayoutMode,
  resolveKompisRouteLayout,
} from "./route-layout";

assert.equal(normalizeAppRoute("/app/home/"), "/app/home");
assert.equal(normalizeAppRoute("app/integrations"), "/app/integrations");

assert.equal(resolveKompisRouteLayout("/app").layoutMode, "split");
assert.equal(resolveKompisRouteLayout("/app").contextKey, "dashboard");
assert.equal(resolveKompisRouteLayout("/app/integrations").layoutMode, "split");
assert.equal(resolveKompisRouteLayout("/app/integrations").module, "integrations");

const billing = resolveKompisRouteLayout("/app/settings/billing");
assert.equal(billing.layoutMode, "overlay");
assert.equal(billing.prefersOverlayForWidth, true);
assert.equal(resolveKompisRouteLayout("/app/approvals").layoutMode, "overlay");

const dash = resolveKompisRouteLayout("/app");
assert.equal(resolveEffectiveKompisLayoutMode(dash, { viewportWidth: 800 }), "overlay");
assert.equal(resolveEffectiveKompisLayoutMode(dash, { viewportWidth: 1400 }), "split");

assert.equal(kompisContextLabelKey("integrations"), "integrations");
assert.equal(kompisContextLabelKey("secret_internal"), "generic");

console.log("route-layout.test.ts: ok");
