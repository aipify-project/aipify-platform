import assert from "node:assert/strict";
import { buildExternalApplicationDiscovery } from "./discovery-runtime";
import { summarizeExternalApplicationRegistry } from "./manifest-registry";
import { listMissingExternalApplicationHandoffAdapters } from "./handoff-bridge";

const discovery = buildExternalApplicationDiscovery({
  category: "image",
  mime_type: "image/png",
  operation: "handoff",
  connected_application_keys: [],
  permission_granted_by_application: {
    canva: true,
    adobe_photoshop: true,
    microsoft_word: false,
  },
});

assert.equal(discovery.workspace, "graphic_design");
assert.ok(discovery.applications.some((entry) => entry.application_key === "canva"));
assert.ok(discovery.applications.some((entry) => entry.application_key === "adobe_photoshop"));
assert.equal(
  discovery.applications.find((entry) => entry.application_key === "canva")?.capability_status,
  "partial",
);
assert.equal(
  discovery.applications.find((entry) => entry.application_key === "adobe_photoshop")?.capability_status,
  "adapter_missing",
);

const registry = summarizeExternalApplicationRegistry();
assert.equal(registry.total, 7);
assert.equal(registry.by_adapter_type.api_oauth, 4);
assert.equal(registry.by_adapter_type.desktop_bridge, 3);
assert.equal(registry.by_adapter_type.file_handoff ?? 0, 0);
assert.deepEqual([...registry.handoff_registered].sort(), [
  "canva",
  "microsoft_excel",
  "microsoft_powerpoint",
  "microsoft_word",
]);

const missing = listMissingExternalApplicationHandoffAdapters();
assert.ok(missing.includes("adobe_photoshop"));
assert.ok(!missing.includes("canva"));
assert.ok(!missing.includes("microsoft_word"));

console.log("external-applications/discovery-runtime.test.ts: all assertions passed");
