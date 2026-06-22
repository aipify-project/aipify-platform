import type { CompanionFoundationCoverageArtifact } from "./companion-foundation-coverage-types";
import { countGapsByPriority } from "./companion-foundation-coverage-gaps";

/** Human-readable audit report — Phase 34. */
export function buildCompanionFoundationCoverageAuditMarkdown(
  artifact: CompanionFoundationCoverageArtifact,
): string {
  const { summary, gaps, panel_coverage } = artifact;
  const gapCounts = countGapsByPriority(gaps);
  const readinessLines = Object.entries(summary.readiness)
    .filter(([, count]) => count > 0)
    .map(([status, count]) => `- **${status}**: ${count}`)
    .join("\n");

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

## Readiness distribution

${readinessLines}

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
): { jsonPath: string; markdownPath: string } {
  const artifactsDir = path.join(repoRoot, "lib/companion-runtime/artifacts");
  fs.mkdirSync(artifactsDir, { recursive: true });

  const jsonPath = path.join(artifactsDir, "companion-foundation-coverage-v1.json");
  fs.writeFileSync(jsonPath, `${JSON.stringify(artifact, null, 2)}\n`, "utf8");

  const markdownPath = path.join(repoRoot, "COMPANION_FOUNDATION_COVERAGE_AUDIT.md");
  fs.writeFileSync(markdownPath, buildCompanionFoundationCoverageAuditMarkdown(artifact), "utf8");

  return { jsonPath, markdownPath };
}
