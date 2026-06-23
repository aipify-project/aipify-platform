import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { readP1LiveE2eCertificationArtifact } from "./p1-01-live-app-e2e-certification";
import { resolveP1LiveE2eBlockers, resolveP1LiveE2eConfig } from "./p1-01-live-app-e2e-env";
import {
  assertArtifactContainsNoSecrets,
  attemptP1LiveAuthenticatedSession,
} from "./p1-01-live-app-e2e-session";
import { deriveP1_09LiveE2eCoverageUpdates } from "./p1-09-live-app-community-member-directory-e2e-coverage";
import {
  collectP1_09CapabilityOutcomes,
  runP1_09LiveAppCommunityMemberDirectoryE2eFlows,
} from "./p1-09-live-app-community-member-directory-e2e-flows";
import {
  P1_09_AUTHORITATIVE_DIRECTORY_SOURCE,
  P1_09_LIVE_E2E_CERTIFICATION_VERSION,
  type P1_09LiveAppCommunityMemberDirectoryE2eCertificationArtifact,
} from "./p1-09-live-app-community-member-directory-e2e-types";

export const P1_09_LIVE_E2E_ARTIFACT_FILENAME =
  "companion-p1-09-live-app-community-member-directory-e2e-certification-v1.json";

function resolveCommitHash(): string | null {
  try {
    return execSync("git rev-parse HEAD", { encoding: "utf8" }).trim();
  } catch {
    return null;
  }
}

function resolveP1_01Prerequisite(
  repoRoot: string,
): P1_09LiveAppCommunityMemberDirectoryE2eCertificationArtifact["p1_01_prerequisite"] {
  const artifact = readP1LiveE2eCertificationArtifact(repoRoot);
  if (!artifact) return "missing";
  if (artifact.overall_status === "pass") return "pass";
  return "fail";
}

export function buildBlockedP1_09LiveAppCommunityMemberDirectoryE2eArtifact(
  extraBlockers: P1_09LiveAppCommunityMemberDirectoryE2eCertificationArtifact["blockers"] = [],
  p1_01_prerequisite: P1_09LiveAppCommunityMemberDirectoryE2eCertificationArtifact["p1_01_prerequisite"] = "missing",
): P1_09LiveAppCommunityMemberDirectoryE2eCertificationArtifact {
  const blockers = [...resolveP1LiveE2eBlockers(), ...extraBlockers];
  return {
    version: P1_09_LIVE_E2E_CERTIFICATION_VERSION,
    generated_at: new Date().toISOString(),
    environment: process.env.APP_LIVE_E2E_ENVIRONMENT?.trim() || "unknown",
    commit_hash: resolveCommitHash(),
    organization_reference: null,
    session_mode: "blocked",
    p1_01_prerequisite,
    authoritative_directory_source: P1_09_AUTHORITATIVE_DIRECTORY_SOURCE,
    live_member_count: 0,
    overall_status: "blocked",
    blockers,
    flows: [],
    tenant_isolation: [],
    capabilities_passed: [],
    capabilities_failed: [],
    coverage_updates_applied: [],
  };
}

export async function runP1_09LiveAppCommunityMemberDirectoryE2eCertification(
  repoRoot: string = process.cwd(),
): Promise<P1_09LiveAppCommunityMemberDirectoryE2eCertificationArtifact> {
  const p1_01_prerequisite = resolveP1_01Prerequisite(repoRoot);
  if (p1_01_prerequisite !== "pass") {
    return buildBlockedP1_09LiveAppCommunityMemberDirectoryE2eArtifact(
      [
        {
          code: "p1_01_prerequisite_failed",
          message:
            "P1.01 live APP E2E certification must pass before P1.09 community member directory certification.",
        },
      ],
      p1_01_prerequisite,
    );
  }

  const { config, blockers } = resolveP1LiveE2eConfig();
  if (!config) {
    return buildBlockedP1_09LiveAppCommunityMemberDirectoryE2eArtifact([], p1_01_prerequisite);
  }

  const authResult = await attemptP1LiveAuthenticatedSession(config);
  if (!authResult.ok) {
    return buildBlockedP1_09LiveAppCommunityMemberDirectoryE2eArtifact(
      [
        {
          code: authResult.blocker_code,
          message: authResult.message,
        },
      ],
      p1_01_prerequisite,
    );
  }

  const { flows, tenantIsolation, liveMemberCount } = await runP1_09LiveAppCommunityMemberDirectoryE2eFlows({
    config,
    session: authResult.session,
  });

  const { passed, failed } = collectP1_09CapabilityOutcomes({ flows, tenantIsolation });
  const flowFailed = flows.some((flow) => flow.status === "fail");
  const isolationFailed = tenantIsolation.some((check) => check.status === "fail");
  const overall_status = flowFailed || isolationFailed ? "fail" : "pass";

  const draft: P1_09LiveAppCommunityMemberDirectoryE2eCertificationArtifact = {
    version: P1_09_LIVE_E2E_CERTIFICATION_VERSION,
    generated_at: new Date().toISOString(),
    environment: config.environment,
    commit_hash: resolveCommitHash(),
    organization_reference: authResult.session.organizationReference,
    session_mode: "live_authenticated",
    p1_01_prerequisite: "pass",
    authoritative_directory_source: P1_09_AUTHORITATIVE_DIRECTORY_SOURCE,
    live_member_count: liveMemberCount,
    overall_status,
    blockers: [],
    flows,
    tenant_isolation: tenantIsolation,
    capabilities_passed: passed,
    capabilities_failed: failed,
    coverage_updates_applied: [],
  };

  draft.coverage_updates_applied =
    overall_status === "pass" ? deriveP1_09LiveE2eCoverageUpdates(draft) : [];

  return draft;
}

export function writeP1_09LiveAppCommunityMemberDirectoryE2eCertificationArtifact(
  artifact: P1_09LiveAppCommunityMemberDirectoryE2eCertificationArtifact,
  repoRoot: string = process.cwd(),
): string {
  const artifactDir = path.join(repoRoot, "lib/companion-runtime/artifacts");
  fs.mkdirSync(artifactDir, { recursive: true });
  const artifactPath = path.join(artifactDir, P1_09_LIVE_E2E_ARTIFACT_FILENAME);
  fs.writeFileSync(artifactPath, `${JSON.stringify(artifact, null, 2)}\n`, "utf8");
  return artifactPath;
}

export function readP1_09LiveAppCommunityMemberDirectoryE2eCertificationArtifact(
  repoRoot: string = process.cwd(),
): P1_09LiveAppCommunityMemberDirectoryE2eCertificationArtifact | null {
  const artifactPath = path.join(
    repoRoot,
    "lib/companion-runtime/artifacts",
    P1_09_LIVE_E2E_ARTIFACT_FILENAME,
  );
  if (!fs.existsSync(artifactPath)) return null;
  return JSON.parse(fs.readFileSync(artifactPath, "utf8")) as P1_09LiveAppCommunityMemberDirectoryE2eCertificationArtifact;
}
