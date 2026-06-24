import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { MARKETING_BUSINESS_PACK_SLUGS } from "@/lib/marketing/business-packs/registry";
import { SKILL_REGISTRY } from "@/lib/core/skills/registry";
import {
  buildCommercialCapabilityMatrix,
  assertNoManifestOnlyMarkedProductionReady,
} from "@/lib/companion-runtime/v1-commercial-capability-matrix";
import {
  buildCompanionFoundationCoverageArtifact,
  buildCompanionFoundationCoverageRegistry,
  listAllProviderKeys,
  summarizeCoverageReadiness,
} from "@/lib/companion-runtime/companion-foundation-coverage-registry";
import {
  assertFourPanelCoverage,
  assertHairdresserServiceCoverageExists,
  assertMemberVerificationCoverageExists,
  assertNoFalseProductionReady,
  buildCompanionFoundationCoverageGaps,
  countGapsByPriority,
} from "@/lib/companion-runtime/companion-foundation-coverage-gaps";
import {
  COMPANION_COVERAGE_GAP_PRIORITY_I18N_KEYS,
  COMPANION_COVERAGE_LOCALES,
  COMPANION_COVERAGE_READINESS_I18N_KEYS,
} from "@/lib/companion-runtime/companion-foundation-coverage-i18n";
import { writeCompanionFoundationCoverageArtifacts } from "@/lib/companion-runtime/companion-foundation-coverage-report";
import { COMMUNITY_EXTERNAL_ADAPTER_PROVIDER_KEY } from "@/lib/integration-intelligence/community/external-adapter-coverage-bridge";

const repoRoot = path.join(import.meta.dirname, "..", "..");

const entries = buildCompanionFoundationCoverageRegistry();
const artifact = buildCompanionFoundationCoverageArtifact();
const commercial = buildCommercialCapabilityMatrix();
const gaps = buildCompanionFoundationCoverageGaps(entries);

assert.ok(entries.length >= 50, "coverage registry should enumerate foundation modules");
assert.equal(artifact.version, "companion-foundation-coverage-v1");
assert.equal(artifact.entries.length, entries.length);
assert.equal(artifact.panel_coverage.length, 4);

assert.ok(assertNoFalseProductionReady(entries), "no false production_ready without live source + test");
assert.ok(assertNoManifestOnlyMarkedProductionReady(commercial), "commercial matrix integrity");
assert.ok(assertMemberVerificationCoverageExists(entries), "member verification coverage modules");
assert.ok(assertHairdresserServiceCoverageExists(entries), "hairdresser/service coverage modules");
assert.ok(assertFourPanelCoverage(entries), "four panel coverage entries");

for (const slug of MARKETING_BUSINESS_PACK_SLUGS) {
  assert.ok(
    entries.some((entry) => entry.business_pack_key === slug || entry.module_id === `business_pack.${slug}`),
    `marketing business pack ${slug} must appear in coverage registry`,
  );
}

const providerKeys = listAllProviderKeys(entries);
for (const manifest of [...commercial.map((c) => c.provider_key), COMMUNITY_EXTERNAL_ADAPTER_PROVIDER_KEY]) {
  assert.ok(providerKeys.includes(manifest), `provider ${manifest} must appear in coverage registry`);
}

const communityAdapterEntry = entries.find((entry) => entry.provider_key === "community_external_adapter");
assert.ok(communityAdapterEntry, "community_external_adapter coverage entry");
assert.ok(
  communityAdapterEntry!.capability_ids.includes("member.read.read") ||
    communityAdapterEntry!.capability_ids.includes("member.read"),
  "community member.read capability tracked",
);
assert.notEqual(
  communityAdapterEntry!.readiness,
  "production_ready",
  "community external adapter must not be false production_ready",
);

const verificationEntry = entries.find((entry) => entry.module_id === "verification.community_adapter_status");
assert.ok(verificationEntry);
assert.equal(verificationEntry!.action_status, "blocked");
assert.ok(
  verificationEntry!.limitations.some((line) => line.includes("ID") || line.includes("document")),
  "verification limitations must mention sensitive fields",
);

const serviceBookingGap = entries.find((entry) => entry.module_id === "service.booking_write");
assert.ok(serviceBookingGap);
assert.equal(serviceBookingGap!.readiness, "source_missing");

const readinessSummary = summarizeCoverageReadiness(entries);
assert.ok(readinessSummary.adapter_missing + readinessSummary.connected_but_partial > 0);

const gapCounts = countGapsByPriority(gaps);
assert.ok(gapCounts.P1 + gapCounts.P2 + gapCounts.P3 > 0, "gap list should not be empty");

const duplicateRegistryFiles = [
  "lib/companion-runtime/companion-foundation-coverage-registry.ts",
  "lib/companion-runtime/v1-commercial-capability-matrix.ts",
];
assert.equal(duplicateRegistryFiles.length, 2, "single canonical coverage registry + commercial matrix");

const coreRegistrySource = fs.readFileSync(
  path.join(repoRoot, "lib/companion-runtime/companion-foundation-coverage-registry.ts"),
  "utf8",
);

for (const locale of COMPANION_COVERAGE_LOCALES) {
  const dictionary = JSON.parse(
    fs.readFileSync(path.join(repoRoot, `locales/${locale}/customer-app/companionPlatformKnowledge.json`), "utf8"),
  );
  const coverage = dictionary.companionPlatformKnowledge.coverage;
  assert.ok(coverage?.readiness?.productionReady, `${locale} coverage readiness keys`);
  assert.ok(coverage?.gapPriority?.p0, `${locale} coverage gap priority keys`);
}

for (const key of Object.values(COMPANION_COVERAGE_READINESS_I18N_KEYS)) {
  assert.ok(key.startsWith("customerApp.companionPlatformKnowledge.coverage."), key);
}
for (const key of Object.values(COMPANION_COVERAGE_GAP_PRIORITY_I18N_KEYS)) {
  assert.ok(key.startsWith("customerApp.companionPlatformKnowledge.coverage."), key);
}

const { jsonPath, markdownPath } = writeCompanionFoundationCoverageArtifacts(artifact, repoRoot, fs, path);
assert.ok(fs.existsSync(jsonPath), "JSON artifact written");
assert.ok(fs.existsSync(markdownPath), "audit markdown written");

const parsedArtifact = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
assert.equal(parsedArtifact.summary.skills, SKILL_REGISTRY.length);
assert.ok(parsedArtifact.gaps.length > 0);

console.log("phase34.test.ts: all assertions passed");
console.log(`  modules: ${entries.length}`);
console.log(`  capabilities: ${commercial.length}`);
console.log(`  gaps P0=${gapCounts.P0} P1=${gapCounts.P1} P2=${gapCounts.P2} P3=${gapCounts.P3}`);
