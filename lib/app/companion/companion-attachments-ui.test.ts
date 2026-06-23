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
assert.doesNotMatch(composerSource, /canva/i);

console.log("companion-attachments-ui.test.ts: all assertions passed");
