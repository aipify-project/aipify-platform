import fs from "node:fs";
import path from "node:path";
import { CUSTOMER_ACTIVE_LOCALE_ORDER } from "@/lib/i18n/customer-active-locale-registry";
import { FORBIDDEN_CUSTOMER_PILOT_NAMES } from "./companion-forbidden-customer-pilot-names";
import {
  assertNoManifestOnlyMarkedProductionReady,
  buildCommercialCapabilityMatrix,
  listSpecificationOnlyProviders,
  summarizeCommercialCapabilityMatrix,
  type CommercialCapabilityEntry,
} from "./v1-commercial-capability-matrix";

export type CompanionRuntimeCertificationStatus =
  | "PASS"
  | "PASS WITH KNOWN LIMITATIONS"
  | "FAIL";

export type CompanionPhaseChainEntry = {
  phase: number | string;
  required_test: string;
  required_wiring: string[];
  commit_hint: string;
};

const PILOT_ADAPTER_TESTS_ROOT = `lib/${FORBIDDEN_CUSTOMER_PILOT_NAMES[0]}/provider-adapter/tests`;

export const COMPANION_RUNTIME_PHASE_CHAIN: readonly CompanionPhaseChainEntry[] = [
  { phase: 1, required_test: "phase1.test.ts", required_wiring: ["companion-tenant-context.ts"], commit_hint: "Phase 1" },
  { phase: 2, required_test: "phase2.test.ts", required_wiring: ["load-companion-discovery-context.ts"], commit_hint: "Phase 2" },
  { phase: 3, required_test: "phase3.test.ts", required_wiring: ["load-companion-business-pack-context.ts"], commit_hint: "Phase 3" },
  { phase: 4, required_test: "phase4.test.ts", required_wiring: ["load-companion-schema-context.ts"], commit_hint: "Phase 4" },
  { phase: 5, required_test: "phase5.test.ts", required_wiring: ["load-companion-tool-registry.ts"], commit_hint: "Phase 5" },
  { phase: 6, required_test: "phase6.test.ts", required_wiring: ["provider-live-tools.ts"], commit_hint: "Phase 6" },
  { phase: 7, required_test: "phase7.test.ts", required_wiring: ["load-companion-operational-context.ts"], commit_hint: "Phase 7" },
  { phase: 8, required_test: "phase8.test.ts", required_wiring: ["load-companion-identity-context.ts"], commit_hint: "Phase 8" },
  { phase: 9, required_test: "phase9.test.ts", required_wiring: ["load-companion-memory-context.ts"], commit_hint: "Phase 9" },
  { phase: 10, required_test: "phase10.test.ts", required_wiring: ["companion-action-context.ts"], commit_hint: "Phase 10" },
  { phase: 11, required_test: "phase11.test.ts", required_wiring: ["companion-action-execute.ts"], commit_hint: "Phase 11" },
  { phase: 12, required_test: "phase12.test.ts", required_wiring: ["companion-model-synthesis.ts"], commit_hint: "Phase 12" },
  { phase: 13, required_test: "phase13.test.ts", required_wiring: ["load-companion-creative-context.ts"], commit_hint: "Phase 13" },
  { phase: 14, required_test: "phase14.test.ts", required_wiring: ["load-companion-media-context.ts"], commit_hint: "Phase 14" },
  { phase: 15, required_test: "phase15.test.ts", required_wiring: ["load-companion-workspace-context.ts"], commit_hint: "Phase 15" },
  { phase: 16, required_test: "phase16.test.ts", required_wiring: ["load-companion-commerce-context.ts"], commit_hint: "Phase 16" },
  { phase: 17, required_test: "phase17.test.ts", required_wiring: ["load-companion-services-context.ts"], commit_hint: "Phase 17" },
  { phase: 18, required_test: "phase18.test.ts", required_wiring: ["load-companion-support-context.ts"], commit_hint: "Phase 18" },
  { phase: 19, required_test: "phase19.test.ts", required_wiring: ["load-companion-industry-pack-context.ts"], commit_hint: "Phase 19" },
  { phase: 20, required_test: "phase20.test.ts", required_wiring: ["load-companion-hosts-context.ts"], commit_hint: "Phase 20" },
  { phase: 21, required_test: "phase21.test.ts", required_wiring: ["load-companion-hr-context.ts"], commit_hint: "Phase 21" },
  { phase: 22, required_test: "phase22.test.ts", required_wiring: ["load-companion-warehouse-context.ts"], commit_hint: "Phase 22" },
  { phase: 23, required_test: "phase23.test.ts", required_wiring: ["load-companion-finance-context.ts"], commit_hint: "Phase 23" },
  { phase: 24, required_test: "phase24.test.ts", required_wiring: ["load-companion-sales-context.ts"], commit_hint: "Phase 24" },
  { phase: 25, required_test: "phase25.test.ts", required_wiring: ["load-companion-security-context.ts"], commit_hint: "Phase 25" },
  { phase: 26, required_test: "phase26.test.ts", required_wiring: ["load-companion-community-context.ts"], commit_hint: "Phase 26" },
  {
    phase: 27,
    required_test: "phase27.test.ts",
    required_wiring: [
      "load-companion-proactive-context.ts",
      "normalize-proactive-signals.ts",
      "proactive-answer.ts",
    ],
    commit_hint: "Phase 27",
  },
  {
    phase: 28,
    required_test: "phase28.test.ts",
    required_wiring: [
      "load-companion-analytics-context.ts",
      "normalize-analytics-metrics.ts",
      "analytics-answer.ts",
    ],
    commit_hint: "Phase 28",
  },
  {
    phase: 33,
    required_test: `${PILOT_ADAPTER_TESTS_ROOT}/phase33.test.ts`,
    required_wiring: [
      "community-answer.ts",
      "community-provider-adapter-answer.ts",
      "companion-directory-policy.ts",
      "directory-search-orchestrator.ts",
      "directory-semantic-intent.ts",
    ],
    commit_hint: "Phase 33C",
  },
  {
    phase: 34,
    required_test: "phase34.test.ts",
    required_wiring: [
      "companion-foundation-coverage-registry.ts",
      "companion-foundation-coverage-gaps.ts",
      "companion-foundation-coverage-reconciliation.ts",
      "artifacts/companion-foundation-coverage-v1.json",
      "artifacts/companion-p1-priority-freeze-v1.json",
      "artifacts/companion-known-gaps-v1.json",
      "artifacts/companion-deprecated-registry-v1.json",
    ],
    commit_hint: "Phase 34",
  },
  {
    phase: 35,
    required_test: "phase35.test.ts",
    required_wiring: [
      "companion-verification-policy.ts",
      "verification-read-orchestrator.ts",
      "verification-semantic-intent.ts",
      "verification-audit.ts",
    ],
    commit_hint: "Phase 35",
  },
  {
    phase: 36,
    required_test: "phase36.test.ts",
    required_wiring: [
      "companion-booking-policy.ts",
      "booking-read-orchestrator.ts",
      "booking-write-orchestrator.ts",
      "booking-semantic-intent.ts",
      "booking-audit.ts",
    ],
    commit_hint: "Phase 36",
  },
  {
    phase: "36B",
    required_test: "phase36b.test.ts",
    required_wiring: [
      "../integration-intelligence/booking/action-outcomes.ts",
      "booking-write-orchestrator.ts",
      "../integration-intelligence/booking/outcomes.ts",
    ],
    commit_hint: "Phase 36B",
  },
  {
    phase: 37,
    required_test: "phase37.test.ts",
    required_wiring: [
      "../integration-intelligence/command-brief/types.ts",
      "command-brief-orchestrator.ts",
      "command-brief-signal-collector.ts",
    ],
    commit_hint: "Phase 37",
  },
  {
    phase: 38,
    required_test: "phase38.test.ts",
    required_wiring: [
      "../integration-intelligence/support/types.ts",
      "support-read-orchestrator.ts",
      "support-write-orchestrator.ts",
      "load-companion-support-context.ts",
    ],
    commit_hint: "Phase 38",
  },
  {
    phase: 39,
    required_test: "phase39.test.ts",
    required_wiring: [
      "../integration-intelligence/hosts/types.ts",
      "hosts-read-orchestrator.ts",
      "hosts-write-orchestrator.ts",
      "load-companion-hosts-context.ts",
    ],
    commit_hint: "Phase 39",
  },
  {
    phase: 40,
    required_test: "phase40.test.ts",
    required_wiring: [
      "../integration-intelligence/providers/app-employee-directory/app-employee-directory-contract.ts",
      "app-employee-read-orchestrator.ts",
      "load-companion-directory-context.ts",
    ],
    commit_hint: "Phase 40",
  },
  {
    phase: 41,
    required_test: "phase41.test.ts",
    required_wiring: [
      "../integration-intelligence/providers/crm-customer-directory/crm-customer-directory-contract.ts",
      "crm-customer-read-orchestrator.ts",
      "load-companion-directory-context.ts",
    ],
    commit_hint: "Phase 41",
  },
  {
    phase: 42,
    required_test: "phase42.test.ts",
    required_wiring: [
      "../integration-intelligence/providers/supplier-vendor-directory/supplier-vendor-directory-contract.ts",
      "supplier-vendor-read-orchestrator.ts",
      "load-companion-directory-context.ts",
    ],
    commit_hint: "Phase 42",
  },
  {
    phase: 43,
    required_test: "phase43.test.ts",
    required_wiring: [
      "companion-foundation-coverage-reconciliation.ts",
      "companion-foundation-coverage-registry.ts",
      "artifacts/companion-p1-priority-freeze-v1.json",
    ],
    commit_hint: "Phase 43",
  },
  {
    phase: "43B",
    required_test: "phase43b.test.ts",
    required_wiring: [
      "companion-core-customer-name-invariant.ts",
      "../integration-intelligence/community/external-adapter-coverage-bridge.ts",
      "../integration-intelligence/directory/community-member-directory-contract.ts",
    ],
    commit_hint: "Phase 43B",
  },
  {
    phase: "43C",
    required_test: "phase43c.test.ts",
    required_wiring: [
      "companion-foundation-coverage-summary.ts",
      "companion-forbidden-customer-pilot-names.ts",
      "companion-core-source-hygiene.ts",
    ],
    commit_hint: "Phase 43C",
  },
  {
    phase: "P1.01",
    required_test: "phase-p1-01.test.ts",
    required_wiring: [
      "p1-01-live-app-e2e-certification.ts",
      "p1-01-live-app-e2e-flows.ts",
      "p1-01-live-app-e2e-coverage.ts",
      "artifacts/companion-p1-01-live-e2e-certification-v1.json",
    ],
    commit_hint: "P1.01",
  },
  {
    phase: "P1.02",
    required_test: "phase-p1-02.test.ts",
    required_wiring: [
      "p1-02-live-app-employee-e2e-certification.ts",
      "p1-02-live-app-employee-e2e-flows.ts",
      "p1-02-live-app-employee-e2e-coverage.ts",
      "artifacts/companion-p1-02-live-app-employee-e2e-certification-v1.json",
    ],
    commit_hint: "P1.02",
  },
  {
    phase: "P1.03",
    required_test: "phase-p1-03.test.ts",
    required_wiring: [
      "p1-03-live-app-crm-customer-e2e-certification.ts",
      "p1-03-live-app-crm-customer-e2e-flows.ts",
      "p1-03-live-app-crm-customer-e2e-coverage.ts",
      "artifacts/companion-p1-03-live-app-crm-customer-e2e-certification-v1.json",
    ],
    commit_hint: "P1.03",
  },
  {
    phase: "P1.04",
    required_test: "phase-p1-04.test.ts",
    required_wiring: [
      "p1-04-live-app-supplier-vendor-e2e-certification.ts",
      "p1-04-live-app-supplier-vendor-e2e-flows.ts",
      "p1-04-live-app-supplier-vendor-e2e-coverage.ts",
      "artifacts/companion-p1-04-live-app-supplier-vendor-e2e-certification-v1.json",
    ],
    commit_hint: "P1.04",
  },
  {
    phase: "P1.05",
    required_test: "phase-p1-05.test.ts",
    required_wiring: [
      "p1-05-live-app-support-sla-e2e-certification.ts",
      "p1-05-live-app-support-sla-e2e-flows.ts",
      "p1-05-live-app-support-sla-e2e-coverage.ts",
      "artifacts/companion-p1-05-live-app-support-sla-e2e-certification-v1.json",
    ],
    commit_hint: "P1.05",
  },
  {
    phase: "P1.06",
    required_test: "phase-p1-06.test.ts",
    required_wiring: [
      "p1-06-live-app-support-case-write-e2e-certification.ts",
      "p1-06-live-app-support-case-write-e2e-flows.ts",
      "p1-06-live-app-support-case-write-e2e-coverage.ts",
      "support-write-provider-adapter.ts",
      "support-write-provider-bridge.ts",
      "artifacts/companion-p1-06-live-app-support-case-write-e2e-certification-v1.json",
    ],
    commit_hint: "P1.06",
  },
  {
    phase: "P1.07",
    required_test: "phase-p1-07.test.ts",
    required_wiring: [
      "p1-07-live-app-hosts-task-write-e2e-certification.ts",
      "p1-07-live-app-hosts-task-write-e2e-flows.ts",
      "p1-07-live-app-hosts-task-write-e2e-coverage.ts",
      "hosts-write-provider-adapter.ts",
      "hosts-write-provider-bridge.ts",
      "artifacts/companion-p1-07-live-app-hosts-task-write-e2e-certification-v1.json",
    ],
    commit_hint: "P1.07",
  },
  {
    phase: "P1.08",
    required_test: "phase-p1-08.test.ts",
    required_wiring: [
      "p1-08-live-app-member-verification-e2e-certification.ts",
      "p1-08-live-app-member-verification-e2e-flows.ts",
      "p1-08-live-app-member-verification-e2e-coverage.ts",
      "member-verification-read-provider-adapter.ts",
      "verification-read-provider-bridge.ts",
      "artifacts/companion-p1-08-live-app-member-verification-e2e-certification-v1.json",
    ],
    commit_hint: "P1.08",
  },
];

export const COMPANION_RUNTIME_FLOW_CHAIN = [
  "tenant",
  "knowledge",
  "discovery",
  "business_packs",
  "schemas",
  "tools",
  "grounded_data",
  "operational_context",
  "identity",
  "memory",
  "actions",
  "model_synthesis",
  "domain_providers",
  "proactive_signals",
  "analytics",
] as const;

export const COMPANION_RUNTIME_KNOWN_LIMITATIONS_V1 = [
  "Domain provider runtime adapters are discovery-first — adapter_available is false across manifests except live integration tools.",
  "Specification-only providers (e.g. canva, proactive_pack_adapter, analytics_pack_adapter) are governed discovery only.",
  "Tenant context loads domain contexts sequentially after the initial parallel bootstrap — high RPC surface per request.",
  "Model synthesis may fall back when the synthesis adapter fails; grounded facts and sources must remain unchanged.",
  "Cross-module analytics views list compatible facts only — inferred correlation is blocked by governance.",
  "Auto-execute recommendation, report generation, and insight apply remain blocked in Companion runtime V1.",
  "Live read tools depend on registered integration adapters — not all connected providers expose live adapters.",
] as const;

const RUNTIME_ROOT = path.join(process.cwd(), "lib/companion-runtime");

const CORE_INTEGRITY_FILES = [
  "orchestrator.ts",
  "tenant-context.ts",
  "companion-tenant-context.ts",
  "companion-model-synthesis.ts",
  "companion-output-pipeline.ts",
  "load-companion-proactive-context.ts",
  "load-companion-analytics-context.ts",
  "normalize-proactive-signals.ts",
  "normalize-analytics-metrics.ts",
  "proactive-answer.ts",
  "analytics-answer.ts",
] as const;

const FORBIDDEN_CORE_TERMS = [
  ...FORBIDDEN_CUSTOMER_PILOT_NAMES,
  "frisør",
  "salon",
  "vipps",
  "retail",
  "hospitality",
] as const;

const LOCALE_RUNTIME_KEYS = [
  "proactive",
  "analytics",
  "community",
  "blockReason",
  "grounded",
  "synthesis",
  "gap",
] as const;

export type PhaseChainVerification = {
  phase: number | string;
  test_present: boolean;
  wiring_present: boolean;
  commit_found: boolean;
};

export type RuntimeIntegrityReport = {
  core_files_clean: boolean;
  orchestrator_single_entry: boolean;
  proactive_before_analytics: boolean;
  model_synthesis_on_finalize_path: boolean;
  no_parallel_answer_engine: boolean;
};

export type TenantContextRpcProfile = {
  rpc_calls_in_tenant_context: number;
  rpc_calls_in_domain_loaders: number;
  estimated_rpc_surface_per_full_load: number;
  sequential_domain_loaders: boolean;
};

export type CompanionRuntimeV1CertificationReport = {
  status: CompanionRuntimeCertificationStatus;
  phase_chain: PhaseChainVerification[];
  missing_phases: (number | string)[];
  integrity: RuntimeIntegrityReport;
  commercial_matrix_summary: ReturnType<typeof summarizeCommercialCapabilityMatrix>;
  specification_only_providers: string[];
  locale_coverage: Record<string, boolean>;
  tenant_isolation_checks_passed: boolean;
  known_limitations: readonly string[];
  rpc_profile: TenantContextRpcProfile;
};

function fileExists(relativePath: string): boolean {
  return fs.existsSync(path.join(RUNTIME_ROOT, relativePath));
}

function readRuntimeFile(relativePath: string): string {
  return fs.readFileSync(path.join(RUNTIME_ROOT, relativePath), "utf8");
}

function countRpcCallsInFile(relativePath: string): number {
  if (!fileExists(relativePath)) return 0;
  const source = readRuntimeFile(relativePath);
  return (source.match(/supabase\.rpc\(/g) ?? []).length;
}

export function verifyPhaseChain(gitLog = ""): PhaseChainVerification[] {
  return COMPANION_RUNTIME_PHASE_CHAIN.map((entry) => ({
    phase: entry.phase,
    test_present: fileExists(entry.required_test),
    wiring_present: entry.required_wiring.every((file) => fileExists(file)),
    commit_found: gitLog.toLowerCase().includes(entry.commit_hint.toLowerCase()),
  }));
}

export function verifyRuntimeIntegrity(): RuntimeIntegrityReport {
  const orchestrator = readRuntimeFile("orchestrator.ts");
  const proactiveIndex = orchestrator.indexOf("resolveProactiveProviderAnswer");
  const analyticsIndex = orchestrator.indexOf("resolveAnalyticsProviderAnswer");

  return {
    core_files_clean: CORE_INTEGRITY_FILES.every((file) => {
      const source = readRuntimeFile(file);
      return FORBIDDEN_CORE_TERMS.every(
        (term) => !new RegExp(`\\b${term}\\b`, "i").test(source),
      );
    }),
    orchestrator_single_entry: orchestrator.includes("export async function orchestrateCompanionSearch"),
    proactive_before_analytics:
      proactiveIndex >= 0 && analyticsIndex >= 0 && proactiveIndex < analyticsIndex,
    model_synthesis_on_finalize_path:
      orchestrator.includes("applyCompanionModelSynthesis") &&
      orchestrator.includes("finalizeCompanionSearchResult"),
    no_parallel_answer_engine:
      !orchestrator.includes("orchestrateCompanionSearchLegacy") &&
      orchestrator.includes("buildHonestKnowledgeGapAnswer"),
  };
}

export function profileTenantContextRpcSurface(): TenantContextRpcProfile {
  const tenantRpc = countRpcCallsInFile("tenant-context.ts");
  const loaderFiles = fs
    .readdirSync(RUNTIME_ROOT)
    .filter((name) => name.startsWith("load-companion-") && name.endsWith(".ts"));

  const domainRpc = loaderFiles.reduce((sum, file) => sum + countRpcCallsInFile(file), 0);

  return {
    rpc_calls_in_tenant_context: tenantRpc,
    rpc_calls_in_domain_loaders: domainRpc,
    estimated_rpc_surface_per_full_load: tenantRpc + domainRpc,
    sequential_domain_loaders: readRuntimeFile("tenant-context.ts").includes(
      "await loadCompanionCreativeContext",
    ),
  };
}

export function verifyLocaleRuntimeCoverage(): Record<string, boolean> {
  const coverage: Record<string, boolean> = {};
  for (const locale of CUSTOMER_ACTIVE_LOCALE_ORDER) {
    const filePath = path.join(
      process.cwd(),
      "locales",
      locale,
      "customer-app/companionPlatformKnowledge.json",
    );
    const raw = fs.readFileSync(filePath, "utf8");
    coverage[locale] = LOCALE_RUNTIME_KEYS.every((key) => raw.includes(`"${key}"`));
  }
  return coverage;
}

export function buildCompanionRuntimeV1CertificationReport(input?: {
  gitLog?: string;
  commercialMatrix?: CommercialCapabilityEntry[];
}): CompanionRuntimeV1CertificationReport {
  const gitLog =
    input?.gitLog ??
    fs.readFileSync(path.join(process.cwd(), ".git/logs/HEAD"), "utf8").slice(-200_000);
  const phaseChain = verifyPhaseChain(gitLog);
  const missingPhases = phaseChain
    .filter((entry) => !entry.test_present || !entry.wiring_present)
    .map((entry) => entry.phase);
  const integrity = verifyRuntimeIntegrity();
  const commercialMatrix = input?.commercialMatrix ?? buildCommercialCapabilityMatrix();
  const matrixSummary = summarizeCommercialCapabilityMatrix(commercialMatrix);
  const localeCoverage = verifyLocaleRuntimeCoverage();

  const phase27Ok = phaseChain.find((entry) => entry.phase === 27);
  const phase28Ok = phaseChain.find((entry) => entry.phase === 28);

  const tenantIsolationChecksPassed =
    integrity.core_files_clean &&
    integrity.proactive_before_analytics &&
    Object.values(localeCoverage).every(Boolean);

  let status: CompanionRuntimeCertificationStatus = "PASS";
  if (
    missingPhases.length > 0 ||
    !integrity.orchestrator_single_entry ||
    !integrity.model_synthesis_on_finalize_path ||
    !phase27Ok?.wiring_present ||
    !phase28Ok?.wiring_present
  ) {
    status = "FAIL";
  } else if (
    matrixSummary.production_ready === 0 ||
    matrixSummary.adapter_missing > 0 ||
    listSpecificationOnlyProviders().length > 0
  ) {
    status = "PASS WITH KNOWN LIMITATIONS";
  }

  assertNoManifestOnlyMarkedProductionReady(commercialMatrix);

  return {
    status,
    phase_chain: phaseChain,
    missing_phases: missingPhases,
    integrity,
    commercial_matrix_summary: matrixSummary,
    specification_only_providers: listSpecificationOnlyProviders(),
    locale_coverage: localeCoverage,
    tenant_isolation_checks_passed: tenantIsolationChecksPassed,
    known_limitations: COMPANION_RUNTIME_KNOWN_LIMITATIONS_V1,
    rpc_profile: profileTenantContextRpcSurface(),
  };
}

export const COMPANION_RUNTIME_V1_FREEZE_VERSION = "companion-runtime-v1";
