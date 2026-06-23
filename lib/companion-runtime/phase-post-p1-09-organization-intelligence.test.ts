import path from "node:path";
import { loadP1LiveE2eEnvFiles, resolveP1LiveE2eConfig } from "@/lib/companion-runtime/p1-01-live-app-e2e-env";
import { attemptP1LiveAuthenticatedSession } from "@/lib/companion-runtime/p1-01-live-app-e2e-session";
import { runPostP109OrganizationIntelligenceLiveE2eFlows } from "@/lib/companion-runtime/post-p1-09-organization-intelligence-live-e2e-flows";

const repoRoot = path.join(import.meta.dirname, "..", "..");

async function main() {
  loadP1LiveE2eEnvFiles(repoRoot);

  const { config } = resolveP1LiveE2eConfig();
  if (!config) {
    console.log(
      "phase-post-p1-09-organization-intelligence.test.ts blocked — live E2E environment not configured.",
    );
    process.exit(0);
  }

  const auth = await attemptP1LiveAuthenticatedSession(config);
  if (!auth.ok) {
    console.log(
      "phase-post-p1-09-organization-intelligence.test.ts blocked — authenticated session unavailable.",
    );
    process.exit(0);
  }

  const { flows } = await runPostP109OrganizationIntelligenceLiveE2eFlows({
    config,
    session: auth.session,
  });

  const failures = flows.filter((flow) => flow.status === "fail");
  for (const flow of flows) {
    console.log(
      `[${flow.status}] ${flow.flow_id} · capability=${flow.expected_capability} · resolved=${flow.capability_resolved}`,
    );
    if (flow.failure_reason) {
      console.log(`  reason: ${flow.failure_reason}`);
    }
    if (flow.reply_excerpt) {
      console.log(`  reply: ${flow.reply_excerpt}`);
    }
  }

  if (failures.length > 0) {
    console.error(
      "phase-post-p1-09-organization-intelligence.test.ts failed — organization intelligence live E2E did not pass.",
    );
    process.exit(1);
  }

  console.log("phase-post-p1-09-organization-intelligence.test.ts passed");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
