import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { resolveP1LiveE2eBlockers, resolveP1LiveE2eConfig } from "./p1-01-live-app-e2e-env";
import { assertArtifactContainsNoSecrets, attemptP1LiveAuthenticatedSession } from "./p1-01-live-app-e2e-session";
import { runPostP1CompanionLiveE2eFlows } from "./post-p1-companion-live-e2e-flows";
import { resolvePostP1EnvironmentChecks } from "./post-p1-companion-production-readiness-env";
import {
  POST_P1_COMMIT_RECORDS,
  runPostP1StaticAudits,
  runPostP1UnitTests,
} from "./post-p1-companion-static-audit";
import {
  POST_P1_COMPANION_PRODUCTION_READINESS_VERSION,
  type PostP1CompanionProductionReadinessArtifact,
} from "./post-p1-companion-production-readiness-types";

export const POST_P1_COMPANION_PRODUCTION_READINESS_ARTIFACT_FILENAME =
  "companion-post-p1-production-readiness-certification-v1.json";

function resolveCommitHash(): string | null {
  try {
    return execSync("git rev-parse HEAD", { encoding: "utf8" }).trim();
  } catch {
    return null;
  }
}

export function buildBlockedPostP1Artifact(
  extraBlockers: PostP1CompanionProductionReadinessArtifact["blockers"] = [],
  partial: Partial<PostP1CompanionProductionReadinessArtifact> = {},
): PostP1CompanionProductionReadinessArtifact {
  const blockers = [...resolveP1LiveE2eBlockers(), ...extraBlockers];
  return {
    version: POST_P1_COMPANION_PRODUCTION_READINESS_VERSION,
    generated_at: new Date().toISOString(),
    commit_hash: resolveCommitHash(),
    overall_status: "blocked",
    max_readiness_certified: "blocked",
    live_e2e_status: "blocked",
    session_mode: "blocked",
    organization_reference: null,
    environment: resolvePostP1EnvironmentChecks(),
    post_p1_commits: POST_P1_COMMIT_RECORDS.map((entry) => ({ ...entry })),
    unit_tests: [],
    static_audits: [],
    flows: [],
    tenant_isolation: [],
    open_limitations: [
      "Live authenticated E2E requires APP_LIVE_E2E_ENABLED and credentials.",
      "Closed-browser cron processing requires CRON_SECRET and APP_LIVE_E2E_BASE_URL.",
      "Mobile surface is validated through shared backend state — no native mobile client in this certification.",
    ],
    blockers,
    ...partial,
  };
}

export async function runPostP1CompanionProductionReadinessCertification(
  repoRoot: string,
): Promise<PostP1CompanionProductionReadinessArtifact> {
  const environment = resolvePostP1EnvironmentChecks();
  const staticAudits = runPostP1StaticAudits(repoRoot);
  const unitTests = runPostP1UnitTests(repoRoot);

  const staticPassed =
    staticAudits.every((check) => check.status === "pass") &&
    unitTests.every((test) => test.status === "pass");

  const openLimitations = [
    "Provider-specific adapters remain outside Core — governed handoff only.",
    "Native mobile Companion client is not certified separately; shared queue/state is certified.",
    "Cron worker certification requires CRON_SECRET — values are never stored in artifacts.",
  ];

  if (!staticPassed) {
    return {
      ...buildBlockedPostP1Artifact([], {
        overall_status: "fail",
        max_readiness_certified: "partial",
        live_e2e_status: "skipped",
        environment,
        static_audits: staticAudits,
        unit_tests: unitTests,
        open_limitations: openLimitations,
        blockers: [{ code: "static_audit_failed", message: "Static audit or unit tests failed." }],
      }),
    };
  }

  const { config } = resolveP1LiveE2eConfig();
  if (!config) {
    return {
      ...buildBlockedPostP1Artifact([], {
        overall_status: "partial",
        max_readiness_certified: "partial",
        live_e2e_status: "blocked",
        environment,
        static_audits: staticAudits,
        unit_tests: unitTests,
        open_limitations: openLimitations,
      }),
    };
  }

  const authResult = await attemptP1LiveAuthenticatedSession(config);
  if (!authResult.ok) {
    return {
      ...buildBlockedPostP1Artifact(
        [{ code: authResult.blocker_code, message: authResult.message }],
        {
          overall_status: "partial",
          max_readiness_certified: "partial",
          live_e2e_status: "blocked",
          environment,
          static_audits: staticAudits,
          unit_tests: unitTests,
          open_limitations: openLimitations,
        },
      ),
    };
  }

  const { flows, tenantIsolation } = await runPostP1CompanionLiveE2eFlows({
    config,
    session: authResult.session,
  });

  const liveFlowsPassed = flows.every((entry) => entry.status === "pass" || entry.status === "skipped");
  const isolationPassed = tenantIsolation.every(
    (check) => check.status === "pass" || check.status === "skipped",
  );
  const envReady =
    environment.cron_secret_configured && environment.supabase_service_role_key_configured;

  const livePassed = liveFlowsPassed && isolationPassed;
  const overall_status = livePassed && envReady ? "pass" : livePassed ? "partial" : "fail";
  const max_readiness_certified =
    livePassed && envReady ? "production_ready_candidate" : livePassed ? "partial" : "partial";

  if (!environment.cron_secret_configured) {
    openLimitations.push("CRON_SECRET not configured — closed-browser worker path not fully certified.");
  }
  if (!environment.supabase_service_role_key_configured) {
    openLimitations.push(
      "SUPABASE_SERVICE_ROLE_KEY not configured — service-role worker recovery not fully certified.",
    );
  }

  return {
    version: POST_P1_COMPANION_PRODUCTION_READINESS_VERSION,
    generated_at: new Date().toISOString(),
    commit_hash: resolveCommitHash(),
    overall_status,
    max_readiness_certified,
    live_e2e_status: livePassed ? "pass" : "partial",
    session_mode: "live_authenticated",
    organization_reference: authResult.session.organizationReference,
    environment,
    post_p1_commits: POST_P1_COMMIT_RECORDS.map((entry) => ({ ...entry })),
    unit_tests: unitTests,
    static_audits: staticAudits,
    flows,
    tenant_isolation: tenantIsolation,
    open_limitations: openLimitations,
    blockers: [],
  };
}

export function writePostP1CompanionProductionReadinessArtifact(
  artifact: PostP1CompanionProductionReadinessArtifact,
  repoRoot: string,
): string {
  const artifactPath = path.join(
    repoRoot,
    "lib/companion-runtime/artifacts",
    POST_P1_COMPANION_PRODUCTION_READINESS_ARTIFACT_FILENAME,
  );
  const serialized = `${JSON.stringify(artifact, null, 2)}\n`;
  if (!assertArtifactContainsNoSecrets(serialized)) {
    throw new Error("POST-P1 certification artifact contains forbidden secret patterns.");
  }
  fs.mkdirSync(path.dirname(artifactPath), { recursive: true });
  fs.writeFileSync(artifactPath, serialized, "utf8");
  return artifactPath;
}

export function readPostP1CompanionProductionReadinessArtifact(
  repoRoot: string,
): PostP1CompanionProductionReadinessArtifact | null {
  const artifactPath = path.join(
    repoRoot,
    "lib/companion-runtime/artifacts",
    POST_P1_COMPANION_PRODUCTION_READINESS_ARTIFACT_FILENAME,
  );
  if (!fs.existsSync(artifactPath)) return null;
  return JSON.parse(fs.readFileSync(artifactPath, "utf8")) as PostP1CompanionProductionReadinessArtifact;
}
