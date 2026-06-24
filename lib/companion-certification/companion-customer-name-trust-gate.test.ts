import assert from "node:assert/strict";
import fs, { readFileSync } from "node:fs";
import path, { join } from "node:path";
import {
  COMPANION_MESSAGE_CONSUMER_PATHS,
  COMPANION_MESSAGE_SURFACE_PATHS,
} from "@/lib/app/companion/companion-user-message-policy";
import {
  buildCompanionFoundationCoverageArtifact,
  buildCompanionFoundationCoverageRegistry,
} from "@/lib/companion-runtime/companion-foundation-coverage-registry";
import { writeCompanionFoundationCoverageArtifacts } from "@/lib/companion-runtime/companion-foundation-coverage-report";
import {
  assertCompanionCoreCustomerNamesForbidden,
  buildForbiddenCustomerPilotNamePatternForRepo,
  findForbiddenCustomerNamesInText,
  scanCompanionCoreForForbiddenCustomerNames,
} from "./companion-core-customer-name-scan";
import { loadForbiddenCustomerPilotNames } from "./forbidden-customer-pilot-names";
import {
  loadPilotAdapterCertificationConfig,
  resolvePrimaryPilotAdapterTestsRoot,
} from "./pilot-adapter-manifest";
import { assertCoreSourceFreeOfCustomerPilotNames } from "./companion-core-source-hygiene";

const repoRoot = join(import.meta.dirname, "..", "..");
const forbiddenCustomerNamePattern = buildForbiddenCustomerPilotNamePatternForRepo(repoRoot);
const forbiddenTerms = loadForbiddenCustomerPilotNames(repoRoot);

assert.ok(assertCompanionCoreCustomerNamesForbidden(repoRoot));
assert.equal(scanCompanionCoreForForbiddenCustomerNames(repoRoot).length, 0);

const messageSurfaces = [
  "components/app/companion-experience/CompanionUserMessageCard.tsx",
  "components/app/companion-experience/CompanionAssistantMessageCard.tsx",
  ...COMPANION_MESSAGE_SURFACE_PATHS,
  ...COMPANION_MESSAGE_CONSUMER_PATHS,
];

for (const relativePath of messageSurfaces) {
  const source = readFileSync(join(repoRoot, relativePath), "utf8");
  assert.doesNotMatch(
    source,
    forbiddenCustomerNamePattern,
    `${relativePath} must not contain customer-specific presentation code`,
  );
}

const legacyDirectoryModuleId = loadPilotAdapterCertificationConfig(repoRoot).legacy_directory_module_id;
const entries = buildCompanionFoundationCoverageRegistry();
assert.equal(
  entries.some((entry) => entry.module_id === legacyDirectoryModuleId),
  false,
  "legacy customer-specific directory module must not appear in Core registry",
);

const artifact = buildCompanionFoundationCoverageArtifact();
const coveragePaths = writeCompanionFoundationCoverageArtifacts(artifact, repoRoot, fs, path);
for (const artifactPath of [
  coveragePaths.jsonPath,
  coveragePaths.p1Path,
  coveragePaths.knownGapsPath,
  coveragePaths.deprecatedPath,
  coveragePaths.markdownPath,
]) {
  const text = readFileSync(artifactPath, "utf8");
  assert.equal(
    findForbiddenCustomerNamesInText(text, forbiddenTerms).length,
    0,
    `${path.relative(repoRoot, artifactPath)} must not contain customer-specific names`,
  );
}

const p1CommunityGap = JSON.parse(readFileSync(coveragePaths.p1Path, "utf8")).packages?.find(
  (pkg: { priority_order?: number }) => pkg.priority_order === 9,
);
assert.ok(p1CommunityGap?.exact_gap, "P1.09 gap text required for hygiene scan");
assertCoreSourceFreeOfCustomerPilotNames(p1CommunityGap.exact_gap, "source");
assertCoreSourceFreeOfCustomerPilotNames(p1CommunityGap.why_p1, "source");

const pilotAdapterTestsRoot = resolvePrimaryPilotAdapterTestsRoot(repoRoot);
assert.ok(
  readFileSync(join(repoRoot, `${pilotAdapterTestsRoot}/phase33.test.ts`), "utf8").length > 0,
  "pilot adapter certification tests must remain outside Core",
);
assert.ok(
  fs.existsSync(join(repoRoot, `${pilotAdapterTestsRoot}/provider-layer-placement.test.ts`)),
  "pilot adapter placement test must remain outside Core",
);

console.log("companion-customer-name-trust-gate.test.ts: PASS");
