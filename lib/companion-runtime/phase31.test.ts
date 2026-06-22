import assert from "node:assert/strict";
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import {
  UNONIGHT_AUTHENTICATED_E2E_GATED_CAPABILITIES,
  buildCompanionPlatformKnowledgeTranslator,
  runUnonightAuthenticatedLiveE2e,
  UNONIGHT_LIVE_E2E_QUESTIONS,
} from "@/lib/unonight/provider-adapter";

const t = buildCompanionPlatformKnowledgeTranslator("no");
const report = runUnonightAuthenticatedLiveE2e({ t, locale: "no" });

assert.equal(report.phase, 31);
assert.equal(report.api_entry, "/api/aipify/support-assistant/search");
assert.equal(report.runtime_chain.length, 14);
assert.deepEqual(report.organizations_tested, ["unonight", "empty", "isolated"]);

for (const question of UNONIGHT_LIVE_E2E_QUESTIONS) {
  const result = report.question_results.find(
    (entry) => entry.question_id === question.id && entry.organization_key === "unonight",
  );
  assert.ok(result, question.id);
  if (question.id === "priority_now") {
    // Routed by full orchestrator Command Brief path — not the community adapter branch alone.
    continue;
  }
  assert.equal(result.resolved_intent, "community_provider", question.id);
  assert.ok(result.organization_scope.length > 0);
  assert.ok(result.response_time_ms >= 0);
  if (question.expectedCapability) {
    assert.equal(result.capability, question.expectedCapability, question.id);
    assert.ok(result.live_rpc, question.id);
    assert.ok(result.audit_reference, question.id);
  }
}

const moderation = report.capability_readiness_after_e2e.find(
  (entry) => entry.capability_key === "moderation_queue.read",
);
const reports = report.capability_readiness_after_e2e.find(
  (entry) => entry.capability_key === "report.read",
);
assert.equal(moderation?.readiness, "production_ready_candidate");
assert.equal(reports?.readiness, "production_ready_candidate");
assert.equal(moderation?.promoted_to_production_ready, false);
assert.equal(reports?.promoted_to_production_ready, false);

for (const capability of UNONIGHT_AUTHENTICATED_E2E_GATED_CAPABILITIES) {
  const control = report.question_results.find(
    (entry) =>
      entry.organization_key === "unonight" &&
      entry.capability === capability &&
      entry.answer_status === "grounded",
  );
  assert.ok(control, `${capability} grounded answer`);
  if (capability === "moderation_queue.read") {
    assert.ok(control.direct_answer.includes("3"));
  }
  if (capability === "report.read") {
    assert.ok(control.direct_answer.includes("1"));
  }
}

assert.equal(report.tenant_isolation.unonight_reads_own_data, true);
assert.equal(report.tenant_isolation.empty_org_honest_unavailable, true);
assert.equal(report.tenant_isolation.isolated_org_never_gets_unonight_data, true);
assert.equal(report.tenant_isolation.manipulated_organization_rejected, true);
assert.equal(report.permissions.every((entry) => entry.passed), true);
assert.equal(report.companion_ui.shared_scroll_policy_frozen, true);
assert.equal(report.companion_ui.no_translation_keys, true);
assert.equal(report.companion_ui.live_provider_grounded, true);
assert.equal(report.locales_smoke.every((entry) => entry.passed), true);
assert.ok(report.performance.average_response_time_ms >= 0);
assert.ok(report.performance.total_rpc_calls > 0);

const orchestratorSource = fs.readFileSync(
  path.join(process.cwd(), "lib/companion-runtime/orchestrator.ts"),
  "utf8",
);
assert.match(orchestratorSource, /resolveCommunityCompanionQuery/);

const communityQuerySource = fs.readFileSync(
  path.join(process.cwd(), "lib/companion-runtime/community-companion-query.ts"),
  "utf8",
);
assert.doesNotMatch(communityQuerySource, /unonight/i);

execSync("npx tsx lib/companion-runtime/phase30.test.ts", { stdio: "inherit" });
execSync("npx tsx lib/companion-runtime/phase29.test.ts", { stdio: "inherit" });

const routeSource = fs.readFileSync(
  path.join(process.cwd(), "app/api/aipify/support-assistant/search/route.ts"),
  "utf8",
);
assert.match(routeSource, /searchPlatformKnowledge/);
assert.match(routeSource, /loadCompanionTenantContext/);

const companionPanelSource = fs.readFileSync(
  path.join(process.cwd(), "components/app/companion-experience/CompanionPanel.tsx"),
  "utf8",
);
assert.match(companionPanelSource, /useCompanionChatScroll/);

console.log("phase31.test.ts: all assertions passed");
