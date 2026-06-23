import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { readP1LiveE2eCertificationArtifact } from "./p1-01-live-app-e2e-certification";
import { resolveP1LiveE2eBlockers, resolveP1LiveE2eConfig } from "./p1-01-live-app-e2e-env";
import {
  assertArtifactContainsNoSecrets,
  attemptP1LiveAuthenticatedSession,
} from "./p1-01-live-app-e2e-session";
import { deriveP1_03LiveE2eCoverageUpdates } from "./p1-03-live-app-crm-customer-e2e-coverage";
import {
  collectP1_03CapabilityOutcomes,
  runP1_03LiveAppCrmCustomerE2eFlows,
} from "./p1-03-live-app-crm-customer-e2e-flows";
import {
  P1_03_LIVE_E2E_CERTIFICATION_VERSION,
  type P1_03LiveAppCrmCustomerE2eCertificationArtifact,
} from "./p1-03-live-app-crm-customer-e2e-types";

export const P1_03_LIVE_E2E_ARTIFACT_FILENAME =
  "companion-p1-03-live-app-crm-customer-e2e-certification-v1.json";

function resolveCommitHash(): string | null {
  try {
    return execSync("git rev-parse HEAD", { encoding: "utf8" }).trim();
  } catch {
    return null;
  }
}

function resolveP1_01Prerequisite(
  repoRoot: string,
): P1_03LiveAppCrmCustomerE2eCertificationArtifact["p1_01_prerequisite"] {
  const artifact = readP1LiveE2eCertificationArtifact(repoRoot);
  if (!artifact) return "missing";
  if (artifact.overall_status === "pass") return "pass";
  return "fail";
}

export function buildBlockedP1_03LiveAppCrmCustomerE2eArtifact(
  extraBlockers: P1_03LiveAppCrmCustomerE2eCertificationArtifact["blockers"] = [],
  p1_01_prerequisite: P1_03LiveAppCrmCustomerE2eCertificationArtifact["p1_01_prerequisite"] = "missing",
): P1_03LiveAppCrmCustomerE2eCertificationArtifact {
  const blockers = [...resolveP1LiveE2eBlockers(), ...extraBlockers];
  return {
    version: P1_03_LIVE_E2E_CERTIFICATION_VERSION,
    generated_at: new Date().toISOString(),
    environment: process.env.APP_LIVE_E2E_ENVIRONMENT?.trim() || "unknown",
    commit_hash: resolveCommitHash(),
    organization_reference: null,
    session_mode: "blocked",
    p1_01_prerequisite,
    live_crm_candidate_count: 0,
    overall_status: "blocked",
    blockers,
    flows: [],
    tenant_isolation: [],
    capabilities_passed: [],
    capabilities_failed: [],
    coverage_updates_applied: [],
  };
}

export async function runP1_03LiveAppCrmCustomerE2eCertification(
  repoRoot: string = process.cwd(),
): Promise<P1_03LiveAppCrmCustomerE2eCertificationArtifact> {
  const p1_01_prerequisite = resolveP1_01Prerequisite(repoRoot);
  if (p1_01_prerequisite !== "pass") {
    return buildBlockedP1_03LiveAppCrmCustomerE2eArtifact(
      [
        {
          code: "p1_01_prerequisite_failed",
          message:
            "P1.01 live APP E2E certification must pass before P1.03 CRM customer directory certification.",
        },
      ],
      p1_01_prerequisite,
    );
  }

  const { config, blockers } = resolveP1LiveE2eConfig();
  if (!config) {
    return buildBlockedP1_03LiveAppCrmCustomerE2eArtifact([], p1_01_prerequisite);
  }

  const authResult = await attemptP1LiveAuthenticatedSession(config);
  if (!authResult.ok) {
    return buildBlockedP1_03LiveAppCrmCustomerE2eArtifact(
      [
        {
          code: authResult.blocker_code,
          message: authResult.message,
        },
      ],
      p1_01_prerequisite,
    );
  }

  const session = authResult.session;
  const { flows, tenantIsolation, liveCrmCandidateCount } = await runP1_03LiveAppCrmCustomerE2eFlows({
    config,
    session,
  });
  const capabilityOutcomes = collectP1_03CapabilityOutcomes({ flows, tenantIsolation });

  const flowsPassed = flows.every((flow) => flow.status === "pass");
  const isolationPassed = tenantIsolation.every((check) => check.status === "pass");
  const overall_status = flowsPassed && isolationPassed ? "pass" : "fail";

  const artifact: P1_03LiveAppCrmCustomerE2eCertificationArtifact = {
    version: P1_03_LIVE_E2E_CERTIFICATION_VERSION,
    generated_at: new Date().toISOString(),
    environment: config.environment,
    commit_hash: resolveCommitHash(),
    organization_reference: session.organizationReference,
    session_mode: "live_authenticated",
    p1_01_prerequisite,
    live_crm_candidate_count: liveCrmCandidateCount,
    overall_status,
    blockers,
    flows,
    tenant_isolation: tenantIsolation,
    capabilities_passed: capabilityOutcomes.passed,
    capabilities_failed: capabilityOutcomes.failed,
    coverage_updates_applied: [],
  };

  artifact.coverage_updates_applied = deriveP1_03LiveE2eCoverageUpdates(artifact);
  return artifact;
}

export function writeP1_03LiveAppCrmCustomerE2eCertificationArtifact(
  artifact: P1_03LiveAppCrmCustomerE2eCertificationArtifact,
  repoRoot: string,
): string {
  const artifactPath = path.join(
    repoRoot,
    "lib/companion-runtime/artifacts",
    P1_03_LIVE_E2E_ARTIFACT_FILENAME,
  );
  const serialized = `${JSON.stringify(artifact, null, 2)}\n`;
  if (!assertArtifactContainsNoSecrets(serialized)) {
    throw new Error("P1.03 certification artifact contains forbidden secret patterns.");
  }
  fs.mkdirSync(path.dirname(artifactPath), { recursive: true });
  fs.writeFileSync(artifactPath, serialized, "utf8");
  return artifactPath;
}

export function readP1_03LiveAppCrmCustomerE2eCertificationArtifact(
  repoRoot: string,
): P1_03LiveAppCrmCustomerE2eCertificationArtifact | null {
  const artifactPath = path.join(
    repoRoot,
    "lib/companion-runtime/artifacts",
    P1_03_LIVE_E2E_ARTIFACT_FILENAME,
  );
  if (!fs.existsSync(artifactPath)) return null;
  return JSON.parse(
    fs.readFileSync(artifactPath, "utf8"),
  ) as P1_03LiveAppCrmCustomerE2eCertificationArtifact;
}
