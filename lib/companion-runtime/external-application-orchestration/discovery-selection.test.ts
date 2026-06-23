import assert from "node:assert/strict";
import { classifyExternalApplicationCapabilityStatus } from "./capability-status";
import { selectExternalApplications } from "./program-selection";
import type { ExternalApplicationDiscoveryResult } from "./types";

assert.equal(
  classifyExternalApplicationCapabilityStatus({
    adapter_registered: false,
    readiness: "adapter_missing",
    connection_connected: false,
    permission_granted: true,
    operation_supported: true,
  }),
  "adapter_missing",
);

assert.equal(
  classifyExternalApplicationCapabilityStatus({
    adapter_registered: true,
    readiness: "partial",
    connection_connected: false,
    permission_granted: true,
    operation_supported: true,
  }),
  "partial",
);

const discovery: ExternalApplicationDiscoveryResult = {
  workspace: "graphic_design",
  operation: "handoff",
  requires_selection: true,
  applications: [
    {
      application_key: "canva",
      display_name_key: "x",
      adapter_type: "api_oauth",
      capability_status: "partial",
      connection_connected: true,
      permission_granted: true,
      supported_operations: ["handoff"],
      readiness: "partial",
      workspaces: ["graphic_design"],
    },
    {
      application_key: "adobe_photoshop",
      display_name_key: "x",
      adapter_type: "desktop_bridge",
      capability_status: "adapter_missing",
      connection_connected: false,
      permission_granted: true,
      supported_operations: ["handoff"],
      readiness: "adapter_missing",
      workspaces: ["graphic_design"],
    },
  ],
};

const selection = selectExternalApplications({ discovery, operation: "handoff" });
assert.equal(selection.selected?.application_key, "canva");
assert.equal(selection.requires_user_selection, false);

console.log("external-application-orchestration/discovery-selection.test.ts: all assertions passed");
