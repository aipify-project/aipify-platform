import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  buildInstallationWizardLabels,
  createInstallationWizardPreviewViewState,
  isPreviewLiveWaitingState,
  listCustomerFacingAssistanceActions,
  listCustomerFacingSupportModes,
  listPreviewExampleAssistanceActions,
  prepareSetupForInstallationWizardPreview,
  previewPresentationKeyForSupportMode,
  previewStateAfterSupportSelect,
  selectDefaultCustomerFacingSupportMode,
  waitingStateForSupportMode,
} from "./index";
import type { InstallationAssistanceAction } from "./types";
import type { AppPortalIntegrationSetup } from "../types";

const WIZARD = join(process.cwd(), "components/app/app-portal/InstallationWizard.tsx");
const DIALOG = join(
  process.cwd(),
  "components/app/app-portal/InstallationWizardPreviewDialog.tsx"
);
const PREVIEW_MODE = join(
  process.cwd(),
  "lib/app-portal/integrations/installation/preview-mode.ts"
);

const wizardSrc = readFileSync(WIZARD, "utf8");
const dialogSrc = readFileSync(DIALOG, "utf8");
const previewModeSrc = readFileSync(PREVIEW_MODE, "utf8");

// --- Root cause regressions ---
// Ordinary install waiting states must not drive preview after support select.
assert.equal(previewStateAfterSupportSelect("customer_it_managed"), "in_progress");
assert.equal(previewStateAfterSupportSelect("aipify_managed"), "in_progress");
assert.notEqual(
  previewStateAfterSupportSelect("customer_it_managed"),
  waitingStateForSupportMode("customer_it_managed")
);
assert.equal(isPreviewLiveWaitingState("awaiting_customer_it"), true);
assert.equal(isPreviewLiveWaitingState("in_progress"), false);

assert.match(wizardSrc, /previewStateAfterSupportSelect/);
assert.match(wizardSrc, /listCustomerFacingSupportModes/);
assert.match(wizardSrc, /previewStatusForMode/);
assert.match(wizardSrc, /previewResponsibilityForMode/);
assert.match(wizardSrc, /listPreviewExampleAssistanceActions/);
assert.match(wizardSrc, /!isPreview &&/);
// Install selection must not call waitingStateForSupportMode; handoff uses waitingStateAfterRealHandoff.
assert.equal(wizardSrc.includes("waitingStateForSupportMode(selected)"), false);
assert.match(wizardSrc, /waitingStateAfterRealHandoff/);
assert.match(wizardSrc, /if \(isPreview\) \{\s*\n\s*await persistSession/);

// No Continue later in preview footer path — install-only branch.
assert.match(wizardSrc, /isPreview \? \(/);
assert.match(wizardSrc, /wizLabels\.continueLater/);
assert.equal(wizardSrc.includes("onContinueLater()") && wizardSrc.includes("isPreview"), true);

// Preview actions are disabled examples.
assert.match(wizardSrc, /previewActionsExampleHeading/);
assert.match(wizardSrc, /previewActionsUnavailable/);
assert.match(wizardSrc, /aria-disabled="true"/);

// --- Customer choices: no partner ---
const modes = listCustomerFacingSupportModes([
  "self_service",
  "guided",
  "aipify_managed",
  "partner_managed",
  "customer_it_managed",
]);
assert.deepEqual(modes, [
  "aipify_managed",
  "guided",
  "self_service",
  "customer_it_managed",
]);
assert.equal((modes as readonly string[]).includes("partner_managed"), false);
assert.equal(modes.length <= 4, true);

const withoutIt = listCustomerFacingSupportModes([
  "self_service",
  "guided",
  "aipify_managed",
  "partner_managed",
]);
assert.deepEqual(withoutIt, ["aipify_managed", "guided", "self_service"]);
assert.equal(selectDefaultCustomerFacingSupportMode(withoutIt), "aipify_managed");

// --- Assistance: no partner invite / continue later for customers ---
const assistance: InstallationAssistanceAction[] = [
  {
    action_key: "ask_aipify_help",
    label: { kind: "locale_key", key: "x.ask" },
    handoff: "support",
  },
  {
    action_key: "invite_partner",
    label: { kind: "locale_key", key: "x.partner" },
    support_mode: "partner_managed",
    handoff: "invite_placeholder",
  },
  {
    action_key: "continue_later",
    label: { kind: "locale_key", key: "x.later" },
  },
  {
    action_key: "change_method",
    label: { kind: "locale_key", key: "x.change" },
  },
  {
    action_key: "self_service",
    label: { kind: "locale_key", key: "x.self" },
    support_mode: "self_service",
  },
];
const customerActions = listCustomerFacingAssistanceActions(assistance);
assert.equal(
  customerActions.some((a) => a.action_key === "invite_partner"),
  false
);
assert.equal(
  customerActions.some((a) => a.action_key === "continue_later"),
  false
);

const previewExamples = listPreviewExampleAssistanceActions(assistance);
assert.ok(previewExamples.length >= 1);
assert.equal(
  previewExamples.some((a) => a.action_key === "continue_later"),
  false
);
assert.equal(
  previewExamples.some((a) => a.action_key === "invite_partner"),
  false
);
assert.equal(
  previewExamples.some((a) => a.handoff === "invite_placeholder"),
  false
);

// --- Status / responsibility keys ---
assert.equal(previewPresentationKeyForSupportMode(null), "choose");
assert.equal(previewPresentationKeyForSupportMode("partner_managed"), "choose");
assert.equal(previewPresentationKeyForSupportMode("guided"), "guided");
assert.equal(previewPresentationKeyForSupportMode("customer_it_managed"), "customer_it_managed");

const labels = buildInstallationWizardLabels((key) => {
  const map: Record<string, string> = {
    "customerApp.portalStructure.integrations.installationWizard.preview.status.choose":
      "Choose how setup should be done",
    "customerApp.portalStructure.integrations.installationWizard.preview.status.customerItManaged":
      "Ready for IT provider",
    "customerApp.portalStructure.integrations.installationWizard.preview.status.guided":
      "Ready for guided setup",
    "customerApp.portalStructure.integrations.installationWizard.preview.status.aipifyManaged":
      "Aipify is preparing the setup",
    "customerApp.portalStructure.integrations.installationWizard.preview.status.selfService":
      "Ready for self-service setup",
    "customerApp.portalStructure.integrations.installationWizard.preview.responsibility.choose":
      "Select a setup method to see who is responsible.",
    "customerApp.portalStructure.integrations.installationWizard.preview.responsibility.customerItManaged":
      "Your IT provider performs the technical steps",
    "customerApp.portalStructure.integrations.installationWizard.preview.responsibility.guided":
      "Aipify guides you step by step",
    "customerApp.portalStructure.integrations.installationWizard.preview.responsibility.aipifyManaged":
      "You only need to approve what we ask for",
    "customerApp.portalStructure.integrations.installationWizard.preview.responsibility.selfService":
      "You complete the steps yourself. Aipify can help when needed",
    "customerApp.portalStructure.integrations.installationWizard.states.awaitingCustomerIt":
      "Waiting for IT provider",
  };
  return map[key] ?? key;
});

assert.equal(labels.previewStatusForMode(null), "Choose how setup should be done");
assert.equal(labels.previewStatusForMode("customer_it_managed"), "Ready for IT provider");
assert.notEqual(labels.previewStatusForMode("customer_it_managed"), "Waiting for IT provider");
assert.equal(
  labels.previewResponsibilityForMode("guided"),
  "Aipify guides you step by step"
);
assert.equal(
  labels.previewResponsibilityForMode("customer_it_managed"),
  "Your IT provider performs the technical steps"
);
assert.equal(
  labels.previewStatusForMode("aipify_managed"),
  "Aipify is preparing the setup"
);
assert.equal(
  labels.previewResponsibilityForMode("aipify_managed"),
  "You only need to approve what we ask for"
);

// --- Session isolation ---
const setup = {
  provider_key: "generic_fixture",
  installation_session: { session_id: "sess_live", state: "awaiting_customer_it" },
} as unknown as AppPortalIntegrationSetup;
const prepared = prepareSetupForInstallationWizardPreview(setup);
assert.equal(prepared.installation_session, null);
const local = createInstallationWizardPreviewViewState();
assert.equal(local.support_mode, null);
assert.equal(local.state, "not_started");

assert.equal(dialogSrc.includes("method: \"POST\""), false);
assert.equal(dialogSrc.includes("/installation/session"), false);
assert.match(dialogSrc, /mode="preview"/);
assert.match(dialogSrc, /prepareSetupForInstallationWizardPreview/);
assert.match(dialogSrc, /instanceKey/);

// Source guards: partner not rendered from contract.support_modes.map in customer path
assert.match(wizardSrc, /visibleSupportModes\.map/);
assert.equal(wizardSrc.includes("contract.support_modes.map"), false);
assert.match(previewModeSrc, /partner_managed/);
assert.match(previewModeSrc, /CUSTOMER_FACING_SUPPORT_MODES/);

// Locales — exact V2 status/responsibility strings for no/en
for (const locale of ["en", "no", "sv", "da", "pl", "uk"]) {
  const file = join(
    process.cwd(),
    `locales/${locale}/customer-app/portalStructure.json`
  );
  const json = JSON.parse(readFileSync(file, "utf8"));
  const preview = json.portalStructure.integrations.installationWizard.preview;
  assert.ok(preview.status.aipifyManaged);
  assert.ok(preview.responsibility.guided);
  assert.ok(preview.actionsExampleHeading);
  assert.ok(preview.actionsUnavailable);
  assert.equal(typeof preview.status.customerItManaged, "string");
  assert.match(preview.status.customerItManaged, /IT|IT-|ІТ|IT /i);
  assert.equal(preview.status.customerItManaged.includes("Venter"), false);
  assert.equal(preview.status.customerItManaged.includes("Waiting"), false);
}

const no = JSON.parse(
  readFileSync(join(process.cwd(), "locales/no/customer-app/portalStructure.json"), "utf8")
).portalStructure.integrations.installationWizard;
assert.equal(no.supportModes.partnerManaged, "Partner gjør oppsettet");
assert.equal(no.supportModes.customerItManaged, "Min IT-leverandør hjelper");
assert.equal(no.preview.status.customerItManaged, "Klar for IT-leverandør");
assert.equal(
  no.preview.responsibility.aipifyManaged,
  "Du trenger bare å godkjenne det vi ber om"
);
assert.equal(no.preview.actionsExampleHeading, "Eksempel på handlinger i aktiv installasjon");
assert.equal(no.actions.continueLater, "Fortsett senere");

console.log("preview-defect-v2.test.ts: ok");
