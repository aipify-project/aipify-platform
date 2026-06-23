import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { readP1LiveE2eCertificationArtifact } from "./p1-01-live-app-e2e-certification";
import { resolveP1LiveE2eBlockers, resolveP1LiveE2eConfig } from "./p1-01-live-app-e2e-env";
import {
  assertArtifactContainsNoSecrets,
  attemptP1LiveAuthenticatedSession,
} from "./p1-01-live-app-e2e-session";
import { deriveP1_08LiveE2eCoverageUpdates } from "./p1-08-live-app-member-verification-e2e-coverage";
import {
  collectP1_08CapabilityOutcomes,
  runP1_08LiveAppMemberVerificationE2eFlows,
} from "./p1-08-live-app-member-verification-e2e-flows";
import {
  P1_08_AUTHORITATIVE_VERIFICATION_SOURCE,
  P1_08_LIVE_E2E_CERTIFICATION_VERSION,
  type P1_08LiveAppMemberVerificationE2eCertificationArtifact,
} from "./p1-08-live-app-member-verification-e2e-types";

export const P1_08_LIVE_E2E_ARTIFACT_FILENAME =
  "companion-p1-08-live-app-member-verification-e2e-certification-v1.json";

function resolveCommitHash(): string | null {
  try {
    return execSync("git rev-parse HEAD", { encoding: "utf8" }).trim();
  } catch {
    return null;
  }
}

function resolveP1_01Prerequisite(
  repoRoot: string,
): P1_08LiveAppMemberVerificationE2eCertificationArtifact["p1_01_prerequisite"] {
  const artifact = readP1LiveE2eCertificationArtifact(repoRoot);
  if (!artifact) return "missing";
  if (artifact.overall_status === "pass") return "pass";
  return "fail";
}

export function buildBlockedP1_08LiveAppMemberVerificationE2eArtifact(
  extraBlockers: P1_08LiveAppMemberVerificationE2eCertificationArtifact["blockers"] = [],
  p1_01_prerequisite: P1_08LiveAppMemberVerificationE2eCertificationArtifact["p1_01_prerequisite"] = "missing",
): P1_08LiveAppMemberVerificationE2eCertificationArtifact {
  const blockers = [...resolveP1LiveE2eBlockers(), ...extraBlockers];
  return {
    version: P1_08_LIVE_E2E_CERTIFICATION_VERSION,
    generated_at: new Date().toISOString(),
    environment: process.env.APP_LIVE_E2E_ENVIRONMENT?.trim() || "unknown",
    commit_hash: resolveCommitHash(),
    organization_reference: null,
    session_mode: "blocked",
    p1_01_prerequisite,
    authoritative_verification_source: P1_08_AUTHORITATIVE_VERIFICATION_SOURCE,
    live_pending_count: 0,
    overall_status: "blocked",
    blockers,
    flows: [],
    tenant_isolation: [],
    capabilities_passed: [],
    capabilities_failed: [],
    coverage_updates_applied: [],
  };
}

export async function runP1_08LiveAppMemberVerificationE2eCertification(
  repoRoot: string = process.cwd(),
): Promise<P1_08LiveAppMemberVerificationE2eCertificationArtifact> {
  const p1_01_prerequisite = resolveP1_01Prerequisite(repoRoot);
  if (p1_01_prerequisite !== "pass") {
    return buildBlockedP1_08LiveAppMemberVerificationE2eArtifact(
      [
        {
          code: "p1_01_prerequisite_failed",
          message:
            "P1.01 live APP E2E certification must pass before P1.08 member verification certification.",
        },
      ],
      p1_01_prerequisite,
    );
  }

  const { config, blockers } = resolveP1LiveE2eConfig();
  if (!config) {
    return buildBlockedP1_08LiveAppMemberVerificationE2eArtifact([], p1_01_prerequisite);
  }

  const authResult = await attemptP1LiveAuthenticatedSession(config);
  if (!authResult.ok) {
    return buildBlockedP1_08LiveAppMemberVerificationE2eArtifact(
      [
        {
          code: authResult.blocker_code,
          message: authResult.message,
        },
      ],
      p1_01_prerequisite,
    );
  }

  const { flows, tenantIsolation, livePendingCount } = await runP1_08LiveAppMemberVerificationE2eFlows({
    config,
    session: authResult.session,
  });

  const { passed, failed } = collectP1_08CapabilityOutcomes({ flows, tenantIsolation });
  const flowFailed = flows.some((flow) => flow.status === "fail");
  const isolationFailed = tenantIsolation.some((check) => check.status === "fail");
  const overall_status = flowFailed || isolationFailed ? "fail" : "pass";

  const draft: P1_08LiveAppMemberVerificationE2eCertificationArtifact = {
    version: P1_08_LIVE_E2E_CERTIFICATION_VERSION,
    generated_at: new Date().toISOString(),
    environment: config.environment,
    commit_hash: resolveCommitHash(),
    organization_reference: authResult.session.organizationReference,
    session_mode: "live_authenticated",
    p1_01_prerequisite: "pass",
    authoritative_verification_source: P1_08_AUTHORITATIVE_VERIFICATION_SOURCE,
    live_pending_count: livePendingCount,
    overall_status,
    blockers: [],
    flows,
    tenant_isolation: tenantIsolation,
    capabilities_passed: passed,
    capabilities_failed: failed,
    coverage_updates_applied: [],
  };

  draft.coverage_updates_applied =
    overall_status === "pass" ? deriveP1_08LiveE2eCoverageUpdates(draft) : [];

  return draft;
}

export function writeP1_08LiveAppMemberVerificationE2eCertificationArtifact(
  artifact: P1_08LiveAppMemberVerificationE2eCertificationArtifact,
  repoRoot: string = process.cwd(),
): string {
  const artifactDir = path.join(repoRoot, "lib/companion-runtime/artifacts");
  fs.mkdirSync(artifactDir, { recursive: true });
  const artifactPath = path.join(artifactDir, P1_08_LIVE_E2E_ARTIFACT_FILENAME);
  fs.writeFileSync(artifactPath, `${JSON.stringify(artifact, null, 2)}\n`, "utf8");
  return artifactPath;
}

export function readP1_08LiveAppMemberVerificationE2eCertificationArtifact(
  repoRoot: string = process.cwd(),
): P1_08LiveAppMemberVerificationE2eCertificationArtifact | null {
  const artifactPath = path.join(
    repoRoot,
    "lib/companion-runtime/artifacts",
    P1_08_LIVE_E2E_ARTIFACT_FILENAME,
  );
  if (!fs.existsSync(artifactPath)) return null;
  return JSON.parse(fs.readFileSync(artifactPath, "utf8")) as P1_08LiveAppMemberVerificationE2eCertificationArtifact;
}
