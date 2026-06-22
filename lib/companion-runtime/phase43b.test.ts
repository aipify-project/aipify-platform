import { FORBIDDEN_CUSTOMER_PILOT_NAMES } from "@/lib/companion-runtime/companion-forbidden-customer-pilot-names";
import { assertCoreSourceFreeOfCustomerPilotNames } from "@/lib/companion-runtime/companion-core-source-hygiene";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  buildCompanionFoundationCoverageArtifact,
  buildCompanionFoundationCoverageRegistry,
  summarizeCoverageReadiness,
} from "@/lib/companion-runtime/companion-foundation-coverage-registry";
import {
  COMPANION_CORE_CUSTOMER_SPECIFIC_NAMES,
  assertCompanionCoreCustomerNamesForbidden,
  findForbiddenCustomerNamesInText,
  scanCompanionCoreForForbiddenCustomerNames,
} from "@/lib/companion-runtime/companion-core-customer-name-invariant";
import { buildP1PriorityFreeze, reconcileCoverageRegistry } from "@/lib/companion-runtime/companion-foundation-coverage-reconciliation";
import { writeCompanionFoundationCoverageArtifacts } from "@/lib/companion-runtime/companion-foundation-coverage-report";

const repoRoot = path.join(import.meta.dirname, "..", "..");

assert.equal(COMPANION_CORE_CUSTOMER_SPECIFIC_NAMES, "forbidden");

const entriesBefore = buildCompanionFoundationCoverageRegistry();
const readinessBefore = summarizeCoverageReadiness(entriesBefore);
const artifactBefore = buildCompanionFoundationCoverageArtifact();
const capabilitiesBefore = artifactBefore.summary.total_capabilities;

const communityMember = entriesBefore.find((entry) => entry.module_id === "directory.community_member");
assert.ok(communityMember, "directory.community_member must exist in Core coverage");
assert.equal(communityMember!.provider_key, "community_member_directory");
const legacyDirectoryModuleId = `directory.${FORBIDDEN_CUSTOMER_PILOT_NAMES[0]}_member`;
assert.equal(
  entriesBefore.some((entry) => entry.module_id === legacyDirectoryModuleId),
  false,
  "legacy customer-specific directory module must not appear in Core registry",
);

const reconciled = reconcileCoverageRegistry(entriesBefore);
const p1 = buildP1PriorityFreeze(reconciled);
const p1Community = p1.packages.find((pkg) => pkg.priority_order === 9);
assert.ok(p1Community, "P1 package 9 must exist");
assert.equal(p1Community!.package_id, "p1.09_community_member_directory_source");
assert.equal(p1Community!.module_id, "directory.community_member");
assert.match(p1Community!.exact_gap, /community member directory/i);
assertCoreSourceFreeOfCustomerPilotNames(p1Community!.exact_gap, "source");
assertCoreSourceFreeOfCustomerPilotNames(p1Community!.why_p1, "source");

const artifact = buildCompanionFoundationCoverageArtifact();
const paths = writeCompanionFoundationCoverageArtifacts(artifact, repoRoot, fs, path);

for (const artifactPath of [
  paths.jsonPath,
  paths.p1Path,
  paths.knownGapsPath,
  paths.deprecatedPath,
  paths.markdownPath,
]) {
  const text = fs.readFileSync(artifactPath, "utf8");
  assert.equal(
    findForbiddenCustomerNamesInText(text).length,
    0,
    `${path.relative(repoRoot, artifactPath)} must not contain customer-specific names`,
  );
}

assert.ok(assertCompanionCoreCustomerNamesForbidden(repoRoot));

const violations = scanCompanionCoreForForbiddenCustomerNames(repoRoot);
assert.equal(violations.length, 0, `Core name violations: ${JSON.stringify(violations.slice(0, 5))}`);

const readinessAfter = summarizeCoverageReadiness(buildCompanionFoundationCoverageRegistry());
const artifactAfter = buildCompanionFoundationCoverageArtifact();

assert.deepEqual(readinessAfter, readinessBefore, "readiness totals must be unchanged by naming correction");
assert.equal(artifactAfter.summary.total_capabilities, capabilitiesBefore, "capability count must be unchanged");
assert.equal(p1.packages.length, 10, "P1 freeze must remain 10 packages");

console.log("phase43b.test.ts passed");
console.log(`  COMPANION_CORE_CUSTOMER_SPECIFIC_NAMES=${COMPANION_CORE_CUSTOMER_SPECIFIC_NAMES}`);
console.log(`  readiness: ${JSON.stringify(readinessAfter)}`);
console.log(`  capabilities: ${artifactAfter.summary.total_capabilities}`);
console.log(`  P1.09: ${p1Community!.package_id}`);
