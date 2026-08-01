import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  canShowInstallationWizardPreview,
  isPreviewBlockedWriteEndpoint,
  isInstallationWizardPreviewMode,
} from "./preview-mode";

const ROW = join(process.cwd(), "components/app/app-portal/IntegrationConnectionRow.tsx");
const WIZARD = join(process.cwd(), "components/app/app-portal/InstallationWizard.tsx");
const DIALOG = join(process.cwd(), "components/app/app-portal/InstallationWizardPreviewDialog.tsx");
const SESSION = join(
  process.cwd(),
  "app/api/app-portal/integrations/installation/session/route.ts"
);

const rowSrc = readFileSync(ROW, "utf8");
const wizardSrc = readFileSync(WIZARD, "utf8");
const dialogSrc = readFileSync(DIALOG, "utf8");
const sessionSrc = readFileSync(SESSION, "utf8");

assert.match(rowSrc, /previewWizard/);
assert.match(rowSrc, /InstallationWizardPreviewDialog/);
assert.match(rowSrc, /canShowInstallationWizardPreview/);
assert.match(wizardSrc, /mode: InstallationWizardMode/);
assert.match(wizardSrc, /data-installation-wizard-mode/);
assert.match(wizardSrc, /isPreview/);
assert.match(wizardSrc, /listCustomerFacingSupportModes/);
assert.match(wizardSrc, /previewStateAfterSupportSelect/);
assert.match(wizardSrc, /listPreviewExampleAssistanceActions/);
assert.match(dialogSrc, /mode="preview"/);
assert.match(dialogSrc, /mode=preview/);
assert.match(sessionSrc, /Preview mode is read-only/);

assert.equal(isInstallationWizardPreviewMode("preview"), true);
assert.equal(
  canShowInstallationWizardPreview({ canManage: true, actionTier: "active" }),
  true
);
assert.equal(
  canShowInstallationWizardPreview({ canManage: false, actionTier: "active" }),
  false
);

for (const endpoint of [
  "/api/app-portal/integrations/installation/session",
  "/api/app-portal/integrations/save",
  "/api/app-portal/integrations/test",
  "/api/app-portal/integrations/activate",
]) {
  assert.equal(isPreviewBlockedWriteEndpoint(endpoint), true);
}

// Preview dialog must load with mode=preview and never POST session.
assert.equal(dialogSrc.includes("method: \"POST\""), false);
assert.equal(dialogSrc.includes("/installation/session"), false);

console.log("preview-action.test.ts: ok");
