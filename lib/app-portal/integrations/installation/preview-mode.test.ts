import assert from "node:assert/strict";
import {
  INSTALLATION_WIZARD_PREVIEW_BLOCKED_ENDPOINTS,
  canShowInstallationWizardPreview,
  createInstallationWizardPreviewViewState,
  isInstallationWizardPreviewMode,
  isPreviewBlockedWriteEndpoint,
  isPreviewLiveWaitingState,
  listCustomerFacingSupportModes,
  listPreviewExampleAssistanceActions,
  prepareSetupForInstallationWizardPreview,
  previewStateAfterSupportSelect,
  selectDefaultCustomerFacingSupportMode,
} from "./preview-mode";
import type { AppPortalIntegrationSetup } from "../types";
import type { InstallationAssistanceAction } from "./types";

assert.equal(isInstallationWizardPreviewMode("preview"), true);
assert.equal(isInstallationWizardPreviewMode("install"), false);
assert.equal(isInstallationWizardPreviewMode(undefined), false);

assert.equal(
  canShowInstallationWizardPreview({ canManage: true, actionTier: "active" }),
  true
);
assert.equal(
  canShowInstallationWizardPreview({ canManage: true, actionTier: "verified" }),
  true
);
assert.equal(
  canShowInstallationWizardPreview({ canManage: false, actionTier: "active" }),
  false
);
assert.equal(
  canShowInstallationWizardPreview({ canManage: true, actionTier: "pending" }),
  false
);

const setup = {
  provider_key: "generic_fixture",
  display_name: "Fixture",
  installation_session: { session_id: "sess_1", state: "in_progress" },
  connection: { id: "c1" },
} as unknown as AppPortalIntegrationSetup;

const prepared = prepareSetupForInstallationWizardPreview(setup);
assert.equal(prepared.installation_session, null);
assert.equal(setup.installation_session != null, true);

const local = createInstallationWizardPreviewViewState();
assert.equal(local.state, "not_started");
assert.equal(local.paused, false);
assert.deepEqual(local.completed_step_keys, []);
assert.equal(local.support_mode, null);

for (const endpoint of INSTALLATION_WIZARD_PREVIEW_BLOCKED_ENDPOINTS) {
  assert.equal(isPreviewBlockedWriteEndpoint(endpoint), true);
  assert.equal(isPreviewBlockedWriteEndpoint(`${endpoint}?x=1`), true);
}
assert.equal(isPreviewBlockedWriteEndpoint("/api/app-portal/integrations/generic"), false);

assert.deepEqual(
  listCustomerFacingSupportModes([
    "partner_managed",
    "self_service",
    "aipify_managed",
    "guided",
    "customer_it_managed",
  ]),
  ["aipify_managed", "guided", "self_service", "customer_it_managed"]
);
assert.equal(
  selectDefaultCustomerFacingSupportMode(["partner_managed", "guided"]),
  "guided"
);
assert.equal(previewStateAfterSupportSelect("aipify_managed"), "in_progress");
assert.equal(isPreviewLiveWaitingState("awaiting_aipify"), true);

const actions: InstallationAssistanceAction[] = [
  {
    action_key: "ask_aipify_help",
    label: { kind: "locale_key", key: "a" },
  },
  {
    action_key: "continue_later",
    label: { kind: "locale_key", key: "b" },
  },
  {
    action_key: "change_method",
    label: { kind: "locale_key", key: "c" },
  },
];
assert.deepEqual(
  listPreviewExampleAssistanceActions(actions).map((a) => a.action_key),
  ["ask_aipify_help", "change_method"]
);

console.log("preview-mode.test.ts: ok");
