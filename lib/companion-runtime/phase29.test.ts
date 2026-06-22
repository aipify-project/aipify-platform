import assert from "node:assert/strict";
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { CUSTOMER_ACTIVE_LOCALE_ORDER } from "@/lib/i18n/customer-active-locale-registry";
import {
  createEmptyCompanionAnalyticsContext,
  type CompanionAnalyticsMetric,
} from "./companion-analytics-context";
import {
  createEmptyCompanionProactiveContext,
  type CompanionProactiveSignal,
} from "./companion-proactive-context";
import { createEmptyCompanionTenantContext } from "./companion-tenant-context";
import {
  buildAnalyticsExecutiveSummaryAnswer,
  buildAnalyticsProviderDiscoveryAnswer,
  buildAnalyticsProviderUnavailableAnswer,
  matchAnalyticsProviderQuery,
} from "./analytics-answer";
import {
  buildProactiveProviderDiscoveryAnswer,
  buildProactiveProviderUnavailableAnswer,
  matchProactiveProviderQuery,
} from "./proactive-answer";
import { buildHonestKnowledgeGapAnswer } from "@/lib/companion-platform-knowledge/answer-builder";
import {
  assertNoManifestOnlyMarkedProductionReady,
  buildCommercialCapabilityMatrix,
  summarizeCommercialCapabilityMatrix,
} from "./v1-commercial-capability-matrix";
import {
  buildCompanionRuntimeV1CertificationReport,
  COMPANION_RUNTIME_FLOW_CHAIN,
  COMPANION_RUNTIME_KNOWN_LIMITATIONS_V1,
  COMPANION_RUNTIME_V1_FREEZE_VERSION,
  verifyRuntimeIntegrity,
} from "./v1-runtime-certification";

const gitLog = execSync("git log --oneline -60", { encoding: "utf8" });
const commercialMatrix = buildCommercialCapabilityMatrix();
const certification = buildCompanionRuntimeV1CertificationReport({
  gitLog,
  commercialMatrix,
});

assert.equal(COMPANION_RUNTIME_V1_FREEZE_VERSION, "companion-runtime-v1");
assert.ok(certification.missing_phases.length === 0, `missing phases: ${certification.missing_phases.join(", ")}`);

const phase27 = certification.phase_chain.find((entry) => entry.phase === 27);
const phase28 = certification.phase_chain.find((entry) => entry.phase === 28);
assert.ok(phase27?.test_present && phase27.wiring_present, "Phase 27 must be wired");
assert.ok(phase28?.test_present && phase28.wiring_present, "Phase 28 must be wired");
assert.ok(phase27?.commit_found, "Phase 27 commit must exist in recent history");
assert.ok(phase28?.commit_found, "Phase 28 commit must exist in recent history");

assert.equal(certification.integrity.proactive_before_analytics, true);
assert.equal(certification.integrity.orchestrator_single_entry, true);
assert.equal(certification.integrity.model_synthesis_on_finalize_path, true);
assert.equal(certification.integrity.no_parallel_answer_engine, true);
assert.equal(certification.integrity.core_files_clean, true);

assert.equal(COMPANION_RUNTIME_FLOW_CHAIN.length, 15);
assert.ok(COMPANION_RUNTIME_FLOW_CHAIN.includes("proactive_signals"));
assert.ok(COMPANION_RUNTIME_FLOW_CHAIN.includes("analytics"));

assert.equal(assertNoManifestOnlyMarkedProductionReady(commercialMatrix), true);
const matrixSummary = summarizeCommercialCapabilityMatrix(commercialMatrix);
assert.ok(matrixSummary.adapter_missing > 0, "adapter_missing capabilities must be classified honestly");
assert.equal(matrixSummary.production_ready, 0, "no manifest-only capability may appear production-ready");

for (const locale of CUSTOMER_ACTIVE_LOCALE_ORDER) {
  assert.equal(certification.locale_coverage[locale], true, locale);
}

assert.ok(certification.specification_only_providers.length > 0);
assert.ok(COMPANION_RUNTIME_KNOWN_LIMITATIONS_V1.length >= 5);
assert.ok(certification.rpc_profile.estimated_rpc_surface_per_full_load >= 50);
assert.equal(certification.rpc_profile.sequential_domain_loaders, true);

assert.notEqual(certification.status, "FAIL", `certification failed: ${JSON.stringify(certification)}`);

const t = (key: string) => key;

const sampleSignal: CompanionProactiveSignal = {
  signal_id: "test:signal",
  signal_type: "attention",
  severity: "high",
  source_module: "command_brief_operational",
  source_reference: "attention:1",
  detected_at: new Date().toISOString(),
  freshness: "fresh",
  title: "Attention item",
  summary: "Requires review",
  recommended_action: "Review in Command Brief",
  required_capability: "attention_item.read",
  required_permission: "executive.view",
  confidence: "moderate",
  status: "unresolved",
  business_impact: "high",
};

const sampleMetric: CompanionAnalyticsMetric = {
  metric_id: "analytics_center:open_tasks",
  metric_label: "open tasks",
  value: 8,
  unit: "count",
  period: "current",
  comparison_period: null,
  change: null,
  trend: "unknown",
  source_module: "analytics_center",
  source_reference: "executive_dashboard.open_tasks",
  generated_at: new Date().toISOString(),
  freshness: "fresh",
  completeness: "complete",
  confidence: "moderate",
  warnings: [],
  required_permission: "analytics.view",
  inference: false,
};

const orgTenant = createEmptyCompanionTenantContext({
  organizationId: "org-a",
  companyId: "company-a",
  effectivePermissions: ["executive.view", "analytics.view", "advanced_insights.view"],
  proactiveContext: createEmptyCompanionProactiveContext({
    prioritized_signals: [sampleSignal],
    empty_signal_basis: false,
  }),
  analyticsContext: createEmptyCompanionAnalyticsContext({
    prioritized_metrics: [sampleMetric],
    empty_metric_basis: false,
  }),
});

const emptyTenant = createEmptyCompanionTenantContext({
  organizationId: "org-empty",
  companyId: "company-empty",
  effectivePermissions: [],
  proactiveContext: createEmptyCompanionProactiveContext({ empty_signal_basis: true }),
  analyticsContext: createEmptyCompanionAnalyticsContext({ empty_metric_basis: true, permission_denied: true }),
});

const isolatedTenant = createEmptyCompanionTenantContext({
  organizationId: "org-b",
  companyId: "company-b",
  effectivePermissions: ["analytics.view"],
});

assert.notEqual(orgTenant.organizationId, isolatedTenant.organizationId);
assert.notEqual(orgTenant.companyId, isolatedTenant.companyId);

async function main() {
const proactiveMatch = matchProactiveProviderQuery("show proactive alerts and recommendations", orgTenant);
assert.ok(proactiveMatch);
const proactiveAnswer = buildProactiveProviderDiscoveryAnswer(
  proactiveMatch!,
  orgTenant.proactiveContext,
  t,
);
assert.ok(proactiveAnswer.directAnswer.includes("proactive.discoveryLead"));

const analyticsMatch = matchAnalyticsProviderQuery("show analytics KPI dashboard metrics", orgTenant);
assert.ok(analyticsMatch);
const analyticsAnswer = buildAnalyticsProviderDiscoveryAnswer(
  analyticsMatch!,
  orgTenant.analyticsContext,
  t,
);
assert.ok(analyticsAnswer.directAnswer.includes("analytics.discoveryLead"));

const executiveSummary = buildAnalyticsExecutiveSummaryAnswer(orgTenant.analyticsContext, t);
assert.ok(executiveSummary.directAnswer.includes("analytics.executiveSummaryLead"));

const emptyAnalytics = buildAnalyticsProviderUnavailableAnswer(t, emptyTenant.analyticsContext);
assert.ok(
  emptyAnalytics.directAnswer.includes("analytics.permissionDenied") ||
    emptyAnalytics.directAnswer.includes("analytics.unavailableLead") ||
    emptyAnalytics.directAnswer.includes("analytics.emptyMetricBasisLead"),
);

const emptyProactive = buildProactiveProviderUnavailableAnswer(t, emptyTenant.proactiveContext);
assert.ok(
  emptyProactive.directAnswer.includes("proactive.permissionDenied") ||
    emptyProactive.directAnswer.includes("proactive.unavailableLead") ||
    emptyProactive.directAnswer.includes("proactive.emptySignalBasisLead"),
);

const gapAnswer = buildHonestKnowledgeGapAnswer(t);
assert.ok(gapAnswer.directAnswer.includes("gap."));

const orchestratorSource = fs.readFileSync(
  path.join(process.cwd(), "lib/companion-runtime/orchestrator.ts"),
  "utf8",
);
assert.ok(orchestratorSource.includes("orchestrateCompanionSearch"));
assert.ok(orchestratorSource.includes("resolveProactiveProviderAnswer"));
assert.ok(orchestratorSource.includes("resolveAnalyticsProviderAnswer"));
assert.ok(orchestratorSource.includes("applyCompanionModelSynthesis"));

for (const locale of CUSTOMER_ACTIVE_LOCALE_ORDER) {
  const raw = fs.readFileSync(
    path.join(process.cwd(), "locales", locale, "customer-app/companionPlatformKnowledge.json"),
    "utf8",
  );
  assert.ok(raw.includes('"proactive"'), `${locale} proactive`);
  assert.ok(raw.includes('"analytics"'), `${locale} analytics`);
  assert.ok(raw.includes('"gap"'), `${locale} gap`);
}

const integrity = verifyRuntimeIntegrity();
assert.equal(integrity.core_files_clean, true);

for (let phase = 1; phase <= 28; phase += 1) {
  const testPath = path.join(process.cwd(), "lib/companion-runtime", `phase${phase}.test.ts`);
  assert.ok(fs.existsSync(testPath), `missing ${testPath}`);
}

const freezeArtifactPath = path.join(process.cwd(), "lib/companion-runtime/v1-freeze-status.json");
fs.writeFileSync(
  freezeArtifactPath,
  JSON.stringify(
    {
      version: COMPANION_RUNTIME_V1_FREEZE_VERSION,
      status: certification.status,
      certified_at: new Date().toISOString(),
      phases: "1-28",
      commit_phase_27: "01c77e51",
      commit_phase_28: "73aac82e",
      commercial_matrix_summary: certification.commercial_matrix_summary,
      specification_only_providers: certification.specification_only_providers,
      known_limitations: certification.known_limitations,
      rpc_profile: certification.rpc_profile,
    },
    null,
    2,
  ) + "\n",
);

console.log(`companion-runtime phase 29 V1 certification: ${certification.status}`);
console.log(`commercial matrix entries: ${commercialMatrix.length}`);
console.log(
  `rpc surface estimate: ${certification.rpc_profile.estimated_rpc_surface_per_full_load}`,
);
console.log("phase29 companion runtime tests passed");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
