import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { resolveP1LiveE2eBlockers, resolveP1LiveE2eConfig } from "./p1-01-live-app-e2e-env";
import {
  collectP1CapabilityOutcomes,
  runP1LiveAppE2eFlows,
} from "./p1-01-live-app-e2e-flows";
import { deriveP1LiveE2eCoverageUpdates } from "./p1-01-live-app-e2e-coverage";
import {
  assertArtifactContainsNoSecrets,
  createP1LiveAuthenticatedSession,
} from "./p1-01-live-app-e2e-session";
import {
  P1_01_LIVE_E2E_CERTIFICATION_VERSION,
  type P1LiveE2eCertificationArtifact,
} from "./p1-01-live-app-e2e-types";

export const P1_01_LIVE_E2E_ARTIFACT_FILENAME = "companion-p1-01-live-e2e-certification-v1.json";

function resolveCommitHash(): string | null {
  try {
    return execSync("git rev-parse HEAD", { encoding: "utf8" }).trim();
  } catch {
    return null;
  }
}

export function buildBlockedP1LiveE2eArtifact(): P1LiveE2eCertificationArtifact {
  const blockers = resolveP1LiveE2eBlockers();
  return {
    version: P1_01_LIVE_E2E_CERTIFICATION_VERSION,
    generated_at: new Date().toISOString(),
    environment: process.env.APP_LIVE_E2E_ENVIRONMENT?.trim() || "unknown",
    commit_hash: resolveCommitHash(),
    organization_reference: null,
    session_mode: "blocked",
    overall_status: "blocked",
    blockers,
    flows: [],
    tenant_isolation: [],
    capabilities_passed: [],
    capabilities_failed: [],
    coverage_updates_applied: [],
  };
}

export async function runP1LiveAppE2eCertification(): Promise<P1LiveE2eCertificationArtifact> {
  const { config, blockers } = resolveP1LiveE2eConfig();
  if (!config) {
    return buildBlockedP1LiveE2eArtifact();
  }

  const session = await createP1LiveAuthenticatedSession(config);
  const { flows, tenantIsolation } = await runP1LiveAppE2eFlows({ config, session });
  const capabilityOutcomes = collectP1CapabilityOutcomes(flows);

  const flowsPassed = flows.every((flow) => flow.status === "pass");
  const isolationPassed = tenantIsolation.every((check) => check.status === "pass");
  const overall_status = flowsPassed && isolationPassed ? "pass" : "fail";

  const artifact: P1LiveE2eCertificationArtifact = {
    version: P1_01_LIVE_E2E_CERTIFICATION_VERSION,
    generated_at: new Date().toISOString(),
    environment: config.environment,
    commit_hash: resolveCommitHash(),
    organization_reference: session.organizationReference,
    session_mode: "live_authenticated",
    overall_status,
    blockers,
    flows,
    tenant_isolation: tenantIsolation,
    capabilities_passed: capabilityOutcomes.passed,
    capabilities_failed: capabilityOutcomes.failed,
    coverage_updates_applied: [],
  };

  artifact.coverage_updates_applied = deriveP1LiveE2eCoverageUpdates(artifact);
  return artifact;
}

export function writeP1LiveE2eCertificationArtifact(
  artifact: P1LiveE2eCertificationArtifact,
  repoRoot: string,
): string {
  const artifactPath = path.join(
    repoRoot,
    "lib/companion-runtime/artifacts",
    P1_01_LIVE_E2E_ARTIFACT_FILENAME,
  );
  const serialized = `${JSON.stringify(artifact, null, 2)}\n`;
  if (!assertArtifactContainsNoSecrets(serialized)) {
    throw new Error("P1.01 certification artifact contains forbidden secret patterns.");
  }
  fs.mkdirSync(path.dirname(artifactPath), { recursive: true });
  fs.writeFileSync(artifactPath, serialized, "utf8");
  return artifactPath;
}

export function readP1LiveE2eCertificationArtifact(
  repoRoot: string,
): P1LiveE2eCertificationArtifact | null {
  const artifactPath = path.join(
    repoRoot,
    "lib/companion-runtime/artifacts",
    P1_01_LIVE_E2E_ARTIFACT_FILENAME,
  );
  if (!fs.existsSync(artifactPath)) return null;
  return JSON.parse(fs.readFileSync(artifactPath, "utf8")) as P1LiveE2eCertificationArtifact;
}
