import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { loadP1LiveE2eEnvFiles } from "@/lib/companion-runtime/p1-01-live-app-e2e-env";
import { assertArtifactContainsNoSecrets } from "@/lib/companion-runtime/p1-01-live-app-e2e-session";
import {
  POST_P1_COMPANION_PRODUCTION_READINESS_ARTIFACT_FILENAME,
  runPostP1CompanionProductionReadinessCertification,
  writePostP1CompanionProductionReadinessArtifact,
} from "@/lib/companion-runtime/post-p1-companion-production-readiness-certification";
import { POST_P1_COMPANION_PRODUCTION_READINESS_VERSION } from "@/lib/companion-runtime/post-p1-companion-production-readiness-types";

const repoRoot = path.join(import.meta.dirname, "..", "..");

async function main() {
  loadP1LiveE2eEnvFiles(repoRoot);

  const artifact = await runPostP1CompanionProductionReadinessCertification(repoRoot);
  assert.equal(artifact.version, POST_P1_COMPANION_PRODUCTION_READINESS_VERSION);

  const artifactPath = writePostP1CompanionProductionReadinessArtifact(artifact, repoRoot);
  assert.ok(fs.existsSync(artifactPath));
  assert.equal(path.basename(artifactPath), POST_P1_COMPANION_PRODUCTION_READINESS_ARTIFACT_FILENAME);

  const serialized = fs.readFileSync(artifactPath, "utf8");
  assert.ok(assertArtifactContainsNoSecrets(serialized), "artifact must not contain secrets");
  assert.ok(!serialized.includes(process.env.CRON_SECRET ?? "__cron_secret_missing__"));
  assert.ok(!serialized.includes(process.env.SUPABASE_SERVICE_ROLE_KEY ?? "__service_role_missing__"));

  assert.ok(artifact.post_p1_commits.length >= 5);
  assert.ok(artifact.unit_tests.length >= 5);
  assert.ok(artifact.static_audits.length > 0);
  assert.ok(artifact.open_limitations.length > 0);
  assert.ok(artifact.environment.cron_secret_configured === Boolean(process.env.CRON_SECRET?.trim()));
  assert.ok(
    artifact.environment.supabase_service_role_key_configured ===
      Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()),
  );

  console.log(`post-p1-companion-production-readiness.test.ts overall_status=${artifact.overall_status}`);
  console.log(`  max_readiness_certified=${artifact.max_readiness_certified}`);
  console.log(`  live_e2e_status=${artifact.live_e2e_status}`);
  console.log(`  session_mode=${artifact.session_mode}`);
  console.log(`  commit_hash=${artifact.commit_hash ?? "unknown"}`);

  for (const test of artifact.unit_tests) {
    console.log(`  unit ${test.phase}: ${test.status}`);
    assert.equal(test.status, "pass", `${test.test_file} failed`);
  }

  for (const audit of artifact.static_audits) {
    assert.notEqual(audit.status, "fail", audit.check_id);
  }

  if (artifact.overall_status === "fail") {
    for (const flow of artifact.flows.filter((entry) => entry.status === "fail")) {
      console.log(`  failed flow: ${flow.flow_id} — ${flow.failure_reason ?? "unknown"}`);
    }
    process.exit(1);
  }

  if (artifact.live_e2e_status === "blocked") {
    console.log("post-p1-companion-production-readiness.test.ts partial — live E2E blocked.");
    for (const blocker of artifact.blockers) {
      console.log(`  blocker: ${blocker.code}`);
    }
  }

  console.log("post-p1-companion-production-readiness.test.ts: certification complete");
}

void main();
