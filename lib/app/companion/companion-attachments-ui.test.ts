import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const repoRoot = join(import.meta.dirname, "..", "..", "..");

const panelSource = readFileSync(
  join(repoRoot, "components/app/companion-experience/CompanionPanel.tsx"),
  "utf8",
);
const composerSource = readFileSync(
  join(repoRoot, "components/app/companion-experience/CompanionAttachmentComposer.tsx"),
  "utf8",
);
const userCardSource = readFileSync(
  join(repoRoot, "components/app/companion-experience/CompanionUserMessageCard.tsx"),
  "utf8",
);

assert.match(panelSource, /CompanionAttachmentComposer/);
assert.doesNotMatch(panelSource, /function ComposerForm/);
assert.match(composerSource, /type="file"/);
assert.match(composerSource, /onDrop/);
assert.match(composerSource, /onPaste/);
assert.match(composerSource, /deleteCompanionAttachment/);
assert.match(composerSource, /setCompanionActiveArtifact/);
assert.match(userCardSource, /attachments\.map/);
assert.match(composerSource, /CompanionArtifactHandoffConsentDialog/);
assert.match(composerSource, /canvaHandoff\.sendToCanva/);

const handoffDialogSource = readFileSync(
  join(repoRoot, "components/app/companion-experience/CompanionArtifactHandoffConsentDialog.tsx"),
  "utf8",
);
const previewRouteSource = readFileSync(
  join(repoRoot, "app/api/aipify/companion/artifact-handoff/preview/route.ts"),
  "utf8",
);
const executeRouteSource = readFileSync(
  join(repoRoot, "app/api/aipify/companion/artifact-handoff/execute/route.ts"),
  "utf8",
);

assert.match(handoffDialogSource, /fetchArtifactHandoffPreview/);
assert.match(handoffDialogSource, /executeArtifactHandoff/);
assert.match(previewRouteSource, /loadCompanionHandoffAttachmentAccess/);
assert.match(executeRouteSource, /recordCompanionArtifactHandoffAudit/);
assert.match(executeRouteSource, /consent_granted/);

console.log("companion-attachments-ui.test.ts: all assertions passed");
