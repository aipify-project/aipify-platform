import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  canShowInstallContinueLater,
  sessionStateAfterSupportConfirm,
  waitingStateForSupportMode,
} from "./index";

const WIZARD = join(process.cwd(), "components/app/app-portal/InstallationWizard.tsx");
const PANEL = join(
  process.cwd(),
  "components/app/app-portal/AppPortalIntegrationSetupPanel.tsx"
);
const PAGE = join(
  process.cwd(),
  "app/app/platform/integrations/connect/[providerKey]/page.tsx"
);
const DIALOG = join(
  process.cwd(),
  "components/app/app-portal/InstallationWizardPreviewDialog.tsx"
);

const wizardSrc = readFileSync(WIZARD, "utf8");
const panelSrc = readFileSync(PANEL, "utf8");
const pageSrc = readFileSync(PAGE, "utf8");
const dialogSrc = readFileSync(DIALOG, "utf8");

// Live chain: page → render → SetupPanel → Wizard install
assert.match(pageSrc, /renderAppPortalIntegrationSetupPage/);
assert.match(panelSrc, /mode="install"/);
assert.match(panelSrc, /entry="connect_route"/);
assert.match(panelSrc, /data-installation-entry="connect_route"/);
assert.match(wizardSrc, /mode: InstallationWizardMode/);
assert.equal(wizardSrc.includes("mode = \"install\""), false);

// Selection must not write session in install path
assert.match(wizardSrc, /Install: local UI selection only/);
assert.match(wizardSrc, /confirm_support_mode:/);
assert.match(wizardSrc, /data-confirm-support/);
assert.equal(wizardSrc.includes("reason: `support_mode:${selected}`"), false);

// No waiting from selection alone
assert.equal(sessionStateAfterSupportConfirm("customer_it_managed"), "in_progress");
assert.notEqual(
  sessionStateAfterSupportConfirm("customer_it_managed"),
  waitingStateForSupportMode("customer_it_managed")
);
// V4: waiting is applied by handoff RPC after success — wizard calls submitInstallationHandoff.
assert.match(wizardSrc, /submitInstallationHandoff/);
assert.match(wizardSrc, /installation\/handoff/);
assert.match(wizardSrc, /installLifecycle === "handed_off"/);

// Continue later gated
assert.match(wizardSrc, /canShowInstallContinueLater/);
assert.match(wizardSrc, /data-continue-later/);
assert.equal(canShowInstallContinueLater(null), false);

// Actions panel filtered
assert.match(wizardSrc, /listRelevantInstallAssistanceActions/);
assert.match(wizardSrc, /installActionsChooseHint/);
assert.match(wizardSrc, /data-install-actions/);

// Status/responsibility from install lifecycle
assert.match(wizardSrc, /installStatusForLifecycle/);
assert.match(wizardSrc, /installResponsibilityForMode/);

// Contextual session error
assert.match(wizardSrc, /installSessionPersistError/);

// Preview regression: dialog still preview-only
assert.match(dialogSrc, /mode="preview"/);
assert.match(dialogSrc, /entry="preview_dialog"/);
assert.equal(dialogSrc.includes("method: \"POST\""), false);

// Locales
for (const locale of ["en", "no", "sv", "da", "pl", "uk"]) {
  const json = JSON.parse(
    readFileSync(
      join(process.cwd(), `locales/${locale}/customer-app/portalStructure.json`),
      "utf8"
    )
  );
  const install = json.portalStructure.integrations.installationWizard.install;
  assert.ok(install.status.customerItManaged);
  assert.ok(install.responsibility.aipifyManaged);
  assert.ok(install.primaryActions.customerItManaged);
  assert.equal(String(install.status.customerItManaged).includes("Venter"), false);
  assert.equal(String(install.status.customerItManaged).includes("Waiting"), false);
}

const no = JSON.parse(
  readFileSync(join(process.cwd(), "locales/no/customer-app/portalStructure.json"), "utf8")
).portalStructure.integrations.installationWizard.install;
assert.equal(no.status.customerItManaged, "Klar for IT-leverandør");
assert.equal(no.primaryActions.customerItManaged, "Inviter IT-leverandør");
assert.equal(no.sessionPersistError.includes("Prøv igjen"), true);

console.log("install-runtime-v3.test.ts: ok");
