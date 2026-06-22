import type { CompanionFoundationCoverageArtifact } from "./companion-foundation-coverage-types";
import { countGapsByPriority } from "./companion-foundation-coverage-gaps";

/** Human-readable audit report — Phase 34. */
export function buildCompanionFoundationCoverageAuditMarkdown(
  artifact: CompanionFoundationCoverageArtifact,
): string {
  const { summary, gaps, panel_coverage } = artifact;
  const gapCounts = countGapsByPriority(gaps);
  const canonical = artifact.canonical_summary;
  const moduleReadinessLines = Object.entries(artifact.summary.readiness)
    .filter(([, count]) => count > 0)
    .map(([status, count]) => `- **${status}**: ${count}`)
    .join("\n");

  const capabilityStatusLines = canonical
    ? Object.entries(canonical.capability_status)
        .filter(([, count]) => count > 0)
        .map(([status, count]) => `- **${status}**: ${count}`)
        .join("\n")
    : "_not generated_";

  const scopeReadLines = canonical
    ? Object.entries(canonical.readiness_scope.read)
        .filter(([, count]) => count > 0)
        .map(([status, count]) => `- **${status}**: ${count}`)
        .join("\n")
    : "_not generated_";

  const readinessLines = moduleReadinessLines;

  const verificationModules = artifact.entries.filter((e) => e.domain === "member_verification");
  const serviceModules = artifact.entries.filter((e) => e.domain === "appointment_service");

  const gapList = gaps
    .slice(0, 50)
    .map((gap) => `- **[${gap.priority}]** \`${gap.module_id}\` — ${gap.reason}`)
    .join("\n");

  const panelLines = panel_coverage
    .map(
      (panel) =>
        `- **${panel.panel}** (\`${panel.module_id}\`): readiness \`${panel.readiness}\`, capabilities: ${panel.capability_ids.length}`,
    )
    .join("\n");

  return `# Companion Foundation Coverage Audit — Phase 34

Generated: ${artifact.generated_at}

## Summary

| Metric | Count |
|--------|------:|
| Total modules | ${summary.total_modules} |
| Total II capabilities | ${summary.total_capabilities} |
| Business packs (marketing) | ${summary.business_packs} |
| Providers | ${summary.providers} |
| Skills | ${summary.skills} |
| Panels | ${summary.panels} |

## Readiness distribution (modules)

${readinessLines}

_Module readiness sums to **${summary.total_modules}** registry modules._

## Commercial capability status (II matrix)

${capabilityStatusLines}

_Commercial capability rows sum to **${summary.total_capabilities}** — do not mix with module readiness above._

## Canonical counting model (Phase 43C)

- Model: \`${canonical?.counting_model ?? "not_generated"}\`
- Modules source: \`${canonical?.source_of_truth.modules ?? "n/a"}\`
- Capabilities source: \`${canonical?.source_of_truth.capabilities ?? "n/a"}\`
- Reconciled entries: ${canonical?.totals.reconciled_entries ?? 0}
- Unique capability IDs in modules: ${canonical?.totals.unique_capability_ids_in_modules ?? 0}

### Readiness scope — read (reconciled modules)

${scopeReadLines}

### Source classification (reconciled modules)

${
  canonical
    ? Object.entries(canonical.source_classification)
        .filter(([, count]) => count > 0)
        .map(([status, count]) => `- **${status}**: ${count}`)
        .join("\n")
    : "_not generated_"
}

### Gap priority

- **P0**: ${canonical?.gap_priority.P0 ?? gapCounts.P0}
- **P1**: ${canonical?.gap_priority.P1 ?? gapCounts.P1}
- **P2**: ${canonical?.gap_priority.P2 ?? gapCounts.P2}
- **P3**: ${canonical?.gap_priority.P3 ?? gapCounts.P3}

${canonical ? `### Reconciliation notes\n\n${canonical.reconciliation_notes.map((note) => `- ${note}`).join("\n")}` : ""}

## Member verification coverage

${verificationModules.map((m) => `- \`${m.module_id}\`: **${m.readiness}** — ${m.capability_ids.join(", ")}`).join("\n")}

## Appointment / salon / service coverage

${serviceModules.map((m) => `- \`${m.module_id}\`: **${m.readiness}** — ${m.capability_ids.join(", ")}`).join("\n")}

## Four-panel coverage

${panelLines}

## Gap priority counts

- **P0**: ${gapCounts.P0}
- **P1**: ${gapCounts.P1}
- **P2**: ${gapCounts.P2}
- **P3**: ${gapCounts.P3}

_(Canonical gap totals also appear under Phase 43C counting model.)_

## Phase 43 reconciliation

- Reconciliation version: \`${artifact.reconciliation_version ?? "not_generated"}\`
- P1 freeze packages: ${artifact.p1_priority_freeze?.packages.length ?? 0}
- Deprecated/merge entries: ${artifact.deprecated_registry?.length ?? 0}
- Duplicate capability IDs tracked: ${artifact.duplicate_capabilities?.length ?? 0}
- False production_ready violations: ${artifact.reconciliation_summary?.false_production_ready_violations ?? 0}

## Top gaps (first 50)

${gapList}

## Canonical registry

- TypeScript: \`lib/companion-runtime/companion-foundation-coverage-registry.ts\`
- JSON artifact: \`lib/companion-runtime/artifacts/companion-foundation-coverage-v1.json\`

## Principles verified

- Generic capability contracts in Core — provider adapters in Business Pack / provider layer.
- No false \`production_ready\` without live source + test.
- Member verification: metadata-only — no document images or ID fields.
- Service booking: generic appointment provider — no salon-specific Core logic.
`;
}

export function writeCompanionFoundationCoverageArtifacts(
  artifact: CompanionFoundationCoverageArtifact,
  repoRoot: string,
  fs: Pick<typeof import("node:fs"), "writeFileSync" | "mkdirSync">,
  path: Pick<typeof import("node:path"), "join">,
): {
  jsonPath: string;
  markdownPath: string;
  p1Path: string;
  knownGapsPath: string;
  deprecatedPath: string;
} {
  const artifactsDir = path.join(repoRoot, "lib/companion-runtime/artifacts");
  fs.mkdirSync(artifactsDir, { recursive: true });

  const jsonPath = path.join(artifactsDir, "companion-foundation-coverage-v1.json");
  fs.writeFileSync(jsonPath, `${JSON.stringify(artifact, null, 2)}\n`, "utf8");

  const p1Path = path.join(artifactsDir, "companion-p1-priority-freeze-v1.json");
  fs.writeFileSync(
    p1Path,
    `${JSON.stringify(artifact.p1_priority_freeze ?? { version: "companion-p1-priority-freeze-v1", packages: [] }, null, 2)}\n`,
    "utf8",
  );

  const knownGapsPath = path.join(artifactsDir, "companion-known-gaps-v1.json");
  fs.writeFileSync(
    knownGapsPath,
    `${JSON.stringify(artifact.known_gaps ?? { version: "companion-known-gaps-v1", gaps: [] }, null, 2)}\n`,
    "utf8",
  );

  const deprecatedPath = path.join(artifactsDir, "companion-deprecated-registry-v1.json");
  fs.writeFileSync(
    deprecatedPath,
    `${JSON.stringify(
      {
        version: "companion-deprecated-registry-v1",
        entries: artifact.deprecated_registry ?? [],
        duplicate_capabilities: artifact.duplicate_capabilities ?? [],
      },
      null,
      2,
    )}\n`,
    "utf8",
  );

  const markdownPath = path.join(repoRoot, "COMPANION_FOUNDATION_COVERAGE_AUDIT.md");
  fs.writeFileSync(markdownPath, buildCompanionFoundationCoverageAuditMarkdown(artifact), "utf8");

  return { jsonPath, markdownPath, p1Path, knownGapsPath, deprecatedPath };
}
