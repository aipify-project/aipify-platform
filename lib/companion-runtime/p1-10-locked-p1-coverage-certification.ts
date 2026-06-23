import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import {
  runLockedP1CoverageAudit,
  summarizeLockedP1Audit,
} from "./p1-10-locked-p1-coverage-audit";
import {
  P1_10_LOCKED_P1_COVERAGE_CERTIFICATION_VERSION,
  P1_10_LOCKED_SEQUENCE_LABEL,
  type P1_10LockedP1CoverageCertificationArtifact,
} from "./p1-10-locked-p1-coverage-certification-types";

export const P1_10_LOCKED_P1_COVERAGE_ARTIFACT_FILENAME =
  "companion-p1-10-locked-p1-coverage-certification-v1.json";

function resolveCommitHash(): string | null {
  try {
    return execSync("git rev-parse HEAD", { encoding: "utf8" }).trim();
  } catch {
    return null;
  }
}

export function runP1_10LockedP1CoverageCertification(
  repoRoot: string,
  testResults: P1_10LockedP1CoverageCertificationArtifact["test_results"] = {
    phase43: "not_run",
    phase43b: "not_run",
    typecheck: "not_run",
  },
): P1_10LockedP1CoverageCertificationArtifact {
  const { package_audits, open_deviations, registry_modules_audited } = runLockedP1CoverageAudit(repoRoot);
  const summary = summarizeLockedP1Audit(package_audits, open_deviations);

  return {
    version: P1_10_LOCKED_P1_COVERAGE_CERTIFICATION_VERSION,
    generated_at: new Date().toISOString(),
    commit_hash: resolveCommitHash(),
    locked_sequence: P1_10_LOCKED_SEQUENCE_LABEL,
    overall_status: summary.overall_status,
    max_readiness_certified: "production_ready_candidate",
    registry_modules_audited,
    packages_certified: summary.packages_certified,
    packages_failed: summary.packages_failed,
    package_audits,
    test_results: testResults,
    open_deviations,
    blockers: summary.blockers,
  };
}

export function writeP1_10LockedP1CoverageCertificationArtifact(
  artifact: P1_10LockedP1CoverageCertificationArtifact,
  repoRoot: string,
): string {
  const artifactDir = path.join(repoRoot, "lib/companion-runtime/artifacts");
  fs.mkdirSync(artifactDir, { recursive: true });
  const artifactPath = path.join(artifactDir, P1_10_LOCKED_P1_COVERAGE_ARTIFACT_FILENAME);
  fs.writeFileSync(artifactPath, `${JSON.stringify(artifact, null, 2)}\n`, "utf8");
  return artifactPath;
}

export function readP1_10LockedP1CoverageCertificationArtifact(
  repoRoot: string,
): P1_10LockedP1CoverageCertificationArtifact | null {
  const artifactPath = path.join(
    repoRoot,
    "lib/companion-runtime/artifacts",
    P1_10_LOCKED_P1_COVERAGE_ARTIFACT_FILENAME,
  );
  if (!fs.existsSync(artifactPath)) return null;
  return JSON.parse(fs.readFileSync(artifactPath, "utf8")) as P1_10LockedP1CoverageCertificationArtifact;
}
