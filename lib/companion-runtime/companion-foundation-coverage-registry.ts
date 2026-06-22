import { SKILL_REGISTRY } from "@/lib/core/skills/registry";
import { MARKETING_BUSINESS_PACK_REGISTRY } from "@/lib/marketing/business-packs/registry";
import { mergeCommunityExternalAdapterIntoCommercial } from "@/lib/integration-intelligence/community/external-adapter-coverage-bridge";
import {
  buildCommercialCapabilityMatrix,
  type CommercialCapabilityEntry,
  type CommercialCapabilityStatus,
} from "./v1-commercial-capability-matrix";
import {
  HAIRDRESSER_SERVICE_COVERAGE_MODULES,
  MEMBER_VERIFICATION_COVERAGE_MODULES,
  COMMAND_BRIEF_COVERAGE_MODULES,
  SUPPORT_COVERAGE_MODULES,
  HOSTS_COVERAGE_MODULES,
  ORGANIZATION_DIRECTORY_COVERAGE_MODULES,
  COMMUNITY_EXTERNAL_ADAPTER_COVERAGE_OVERRIDES,
  COMMUNITY_EXTERNAL_ADAPTER_READINESS_OVERRIDES,
} from "./companion-foundation-coverage-overrides";
import { summarizeCoverageReadiness } from "./companion-foundation-coverage-readiness";
import { buildCompanionFoundationCoverageGaps } from "./companion-foundation-coverage-gaps";
import {
  attachReconciliationToArtifact,
  SUPERSEDED_PROVIDER_MODULE_IDS,
} from "./companion-foundation-coverage-reconciliation";
import { applyP1LiveE2eCoverageOverrides } from "./p1-01-live-app-e2e-coverage";
import { readP1LiveE2eCertificationArtifact } from "./p1-01-live-app-e2e-certification";
import type {
  CompanionCoverageEntry,
  CompanionCoverageReadiness,
  CompanionFoundationCoverageArtifact,
} from "./companion-foundation-coverage-types";

const DOMAIN_RUNTIME_LOADERS: Record<string, string> = {
  proactive: "load-companion-proactive-context.ts",
  analytics: "load-companion-analytics-context.ts",
  community: "load-companion-community-context.ts",
  security: "load-companion-security-context.ts",
  sales: "load-companion-sales-context.ts",
  finance: "load-companion-finance-context.ts",
  warehouse: "load-companion-warehouse-context.ts",
  hr: "load-companion-hr-context.ts",
  hosts: "load-companion-hosts-context.ts",
  industry_packs: "load-companion-industry-pack-context.ts",
  support: "load-companion-support-context.ts",
  services: "load-companion-services-context.ts",
  commerce: "load-companion-commerce-context.ts",
  workspace: "load-companion-workspace-context.ts",
  media: "load-companion-media-context.ts",
  creative: "load-companion-creative-context.ts",
  directory: "companion-directory-context.ts",
};

const CORE_COMPANION_MODULES: readonly CompanionCoverageEntry[] = [
  {
    module_id: "core.companion_orchestrator",
    domain: "companion_core",
    business_pack_key: null,
    provider_key: "companion_runtime",
    capability_ids: ["companion.query", "companion.ground", "companion.synthesize"],
    source_type: "api",
    source_reference: "lib/companion-runtime/companion-semantic-resolver.ts",
    runtime_loader: "companion-tenant-context.ts",
    schema_status: "wired",
    permission_status: "defined",
    activation_status: "active",
    command_brief_status: "linked",
    action_status: "approval_required",
    language_status: "complete",
    test_status: "phase_tested",
    readiness: "connected",
    limitations: ["Generic orchestration only — domain data via provider loaders."],
    next_required_step: null,
    panel: "app",
  },
  {
    module_id: "core.discovery",
    domain: "install_discovery",
    business_pack_key: null,
    provider_key: "install_discovery",
    capability_ids: ["discovery.read", "connection.read"],
    source_type: "rpc",
    source_reference: "load-companion-discovery-context.ts",
    runtime_loader: "load-companion-discovery-context.ts",
    schema_status: "wired",
    permission_status: "defined",
    activation_status: "active",
    command_brief_status: "partial",
    action_status: "none",
    language_status: "complete",
    test_status: "phase_tested",
    readiness: "connected",
    limitations: [],
    next_required_step: null,
    panel: "app",
  },
  {
    module_id: "core.business_packs",
    domain: "business_packs",
    business_pack_key: null,
    provider_key: "business_pack_entitlements",
    capability_ids: ["pack.read", "entitlement.read"],
    source_type: "rpc",
    source_reference: "load-companion-business-pack-context.ts",
    runtime_loader: "load-companion-business-pack-context.ts",
    schema_status: "wired",
    permission_status: "defined",
    activation_status: "active",
    command_brief_status: "none",
    action_status: "none",
    language_status: "complete",
    test_status: "phase_tested",
    readiness: "connected",
    limitations: [],
    next_required_step: null,
    panel: "app",
  },
  {
    module_id: "core.schema",
    domain: "schemas",
    business_pack_key: null,
    provider_key: "schema_discovery",
    capability_ids: ["schema.read", "entity.read"],
    source_type: "rpc",
    source_reference: "load-companion-schema-context.ts",
    runtime_loader: "load-companion-schema-context.ts",
    schema_status: "wired",
    permission_status: "defined",
    activation_status: "active",
    command_brief_status: "none",
    action_status: "none",
    language_status: "complete",
    test_status: "phase_tested",
    readiness: "connected",
    limitations: [],
    next_required_step: null,
    panel: "app",
  },
  {
    module_id: "core.tools",
    domain: "tools",
    business_pack_key: null,
    provider_key: "companion_tool_registry",
    capability_ids: ["tool.read", "tool.invoke.read"],
    source_type: "api",
    source_reference: "load-companion-tool-registry.ts",
    runtime_loader: "load-companion-tool-registry.ts",
    schema_status: "wired",
    permission_status: "defined",
    activation_status: "active",
    command_brief_status: "none",
    action_status: "blocked",
    language_status: "complete",
    test_status: "phase_tested",
    readiness: "connected",
    limitations: ["Read tools only in Companion runtime."],
    next_required_step: null,
    panel: "app",
  },
  {
    module_id: "core.memory",
    domain: "knowledge_organization_memory",
    business_pack_key: null,
    provider_key: "pame_memory",
    capability_ids: ["memory.read", "reminder.read"],
    source_type: "rpc",
    source_reference: "load-companion-memory-context.ts",
    runtime_loader: "load-companion-memory-context.ts",
    schema_status: "wired",
    permission_status: "defined",
    activation_status: "active",
    command_brief_status: "partial",
    action_status: "approval_required",
    language_status: "complete",
    test_status: "phase_tested",
    readiness: "connected_but_partial",
    limitations: ["Metadata-only memory — no raw chat transcripts."],
    next_required_step: null,
    panel: "app",
  },
  {
    module_id: "core.actions",
    domain: "actions",
    business_pack_key: null,
    provider_key: "trust_actions",
    capability_ids: ["action.prepare", "action.approve"],
    source_type: "rpc",
    source_reference: "load-companion-action-context.ts",
    runtime_loader: "load-companion-action-context.ts",
    schema_status: "wired",
    permission_status: "defined",
    activation_status: "active",
    command_brief_status: "linked",
    action_status: "approval_required",
    language_status: "complete",
    test_status: "phase_tested",
    readiness: "connected",
    limitations: ["Level 4 critical actions prohibited for Aipify."],
    next_required_step: null,
    panel: "app",
  },
  {
    module_id: "core.desktop_companion",
    domain: "desktop_companion",
    business_pack_key: null,
    provider_key: "desktop_command_center",
    capability_ids: ["desktop.session", "command_center.read"],
    source_type: "api",
    source_reference: "apps/command-center/ + /api/desktop/*",
    runtime_loader: null,
    schema_status: "partial",
    permission_status: "defined",
    activation_status: "gated",
    command_brief_status: "linked",
    action_status: "approval_required",
    language_status: "complete",
    test_status: "partial",
    readiness: "connected_but_partial",
    limitations: ["Business+ plan gate for desktop pairing."],
    next_required_step: "Extend Companion runtime loader for desktop session context.",
    panel: "app",
  },
  {
    module_id: "core.mobile_access",
    domain: "mobile_access",
    business_pack_key: null,
    provider_key: "mobile_companion",
    capability_ids: ["mobile.read"],
    source_type: "manifest",
    source_reference: "specification: mobile companion scaffold",
    runtime_loader: null,
    schema_status: "missing",
    permission_status: "partial",
    activation_status: "disabled",
    command_brief_status: "none",
    action_status: "none",
    language_status: "partial",
    test_status: "missing",
    readiness: "specification_only",
    limitations: ["Mobile client not shipped — specification only."],
    next_required_step: "Ship mobile thin client consuming same Core bundle.",
    panel: "app",
  },
  {
    module_id: "core.vacation_mode",
    domain: "vacation_mode",
    business_pack_key: null,
    provider_key: "absence_vacation_coverage",
    capability_ids: ["vacation_mode.read", "absence.read"],
    source_type: "rpc",
    source_reference: "services domain loader + absence RPCs",
    runtime_loader: "load-companion-services-context.ts",
    schema_status: "partial",
    permission_status: "defined",
    activation_status: "partial",
    command_brief_status: "none",
    action_status: "none",
    language_status: "complete",
    test_status: "phase_tested",
    readiness: "connected_but_partial",
    limitations: ["Vacation mode flags in services loader — not standalone provider."],
    next_required_step: "Register vacation_mode.read in services manifest.",
    panel: "app",
  },
];

const PANEL_COVERAGE_ENTRIES: readonly CompanionCoverageEntry[] = [
  {
    module_id: "panel.super_admin",
    domain: "platform_governance",
    business_pack_key: null,
    provider_key: "super_admin_panel",
    capability_ids: ["platform_governance.read", "global_audit.read", "executive_oversight.read"],
    source_type: "api",
    source_reference: "lib/super-admin/nav-config.ts",
    runtime_loader: null,
    schema_status: "partial",
    permission_status: "defined",
    activation_status: "active",
    command_brief_status: "none",
    action_status: "blocked",
    language_status: "complete",
    test_status: "partial",
    readiness: "connected_but_partial",
    limitations: ["Executive oversight only — no customer operational data.", "Companion wiring partial on super routes."],
    next_required_step: "Link super-admin aggregate RPCs to read-only Companion governance context.",
    panel: "super_admin",
  },
  {
    module_id: "panel.platform",
    domain: "platform_admin",
    business_pack_key: null,
    provider_key: "platform_admin_panel",
    capability_ids: [
      "platform.customers.read",
      "platform.subscriptions.read",
      "platform.trust.read",
      "platform.skills.read",
      "platform.impact.read",
    ],
    source_type: "api",
    source_reference: "lib/platform/nav-config.ts",
    runtime_loader: null,
    schema_status: "partial",
    permission_status: "defined",
    activation_status: "active",
    command_brief_status: "partial",
    action_status: "approval_required",
    language_status: "complete",
    test_status: "partial",
    readiness: "connected_but_partial",
    limitations: ["Aggregates only — never customer operational records in Companion."],
    next_required_step: "Wire verified provider registry to platform Companion knowledge surface.",
    panel: "platform",
  },
  {
    module_id: "panel.partners",
    domain: "growth_partner",
    business_pack_key: null,
    provider_key: "partners_portal",
    capability_ids: ["partner.attribution.read", "partner.pipeline.read"],
    source_type: "api",
    source_reference: "lib/partners-portal/nav-config.ts",
    runtime_loader: null,
    schema_status: "partial",
    permission_status: "defined",
    activation_status: "partial",
    command_brief_status: "none",
    action_status: "none",
    language_status: "complete",
    test_status: "partial",
    readiness: "connected_but_partial",
    limitations: ["Attribution only — partners do not own customers."],
    next_required_step: "Connect partner growth metrics to read-only Companion briefing.",
    panel: "partners",
  },
  {
    module_id: "panel.app",
    domain: "app_organization",
    business_pack_key: null,
    provider_key: "customer_app_panel",
    capability_ids: [
      "app.executive.read",
      "app.support.read",
      "app.approvals.read",
      "app.command_center.read",
      "app.assistant.read",
    ],
    source_type: "api",
    source_reference: "lib/app/nav-config.ts",
    runtime_loader: "companion-tenant-context.ts",
    schema_status: "wired",
    permission_status: "defined",
    activation_status: "active",
    command_brief_status: "linked",
    action_status: "approval_required",
    language_status: "complete",
    test_status: "phase_tested",
    readiness: "connected",
    limitations: ["Primary Companion surface — tenant-scoped only."],
    next_required_step: null,
    panel: "app",
  },
];

function mapCommercialStatusToReadiness(status: CommercialCapabilityStatus): CompanionCoverageReadiness {
  switch (status) {
    case "production_ready":
      return "production_ready";
    case "connected_but_partial":
      return "connected_but_partial";
    case "adapter_missing":
      return "adapter_missing";
    case "manifest_only":
      return "manifest_only";
    case "specification_only":
      return "specification_only";
    case "blocked_by_governance":
      return "blocked_by_governance";
    case "disabled":
      return "disabled";
    default:
      return "manifest_only";
  }
}

function resolveProviderReadiness(
  providerKey: string,
  capabilities: readonly CommercialCapabilityEntry[],
): CompanionCoverageReadiness {
  const statuses = capabilities.map((entry) => {
    const override = COMMUNITY_EXTERNAL_ADAPTER_READINESS_OVERRIDES[entry.capability_id];
    return override ?? mapCommercialStatusToReadiness(entry.status);
  });

  if (statuses.includes("production_ready")) return "production_ready";
  if (statuses.includes("production_ready_candidate")) return "production_ready_candidate";
  if (statuses.includes("connected")) return "connected";
  if (statuses.every((s) => s === "blocked_by_governance")) return "blocked_by_governance";
  if (statuses.every((s) => s === "specification_only")) return "specification_only";
  if (statuses.includes("connected_but_partial")) return "connected_but_partial";
  if (statuses.includes("adapter_missing")) return "adapter_missing";
  if (statuses.includes("manifest_only")) return "manifest_only";
  return "connected_but_partial";
}

function inferDomainFromProvider(providerKey: string, commercial: readonly CommercialCapabilityEntry[]): string {
  const first = commercial.find((entry) => entry.provider_key === providerKey);
  if (!first) return "unknown";
  const prefix = first.capability_id.split(".")[0];
  return prefix === providerKey ? "integration_intelligence" : "integration_intelligence";
}

function buildProviderEntriesFromCommercialMatrix(
  commercial: readonly CommercialCapabilityEntry[],
): CompanionCoverageEntry[] {
  const byProvider = new Map<string, CommercialCapabilityEntry[]>();
  for (const entry of commercial) {
    const list = byProvider.get(entry.provider_key) ?? [];
    list.push(entry);
    byProvider.set(entry.provider_key, list);
  }

  const entries: CompanionCoverageEntry[] = [];

  for (const [providerKey, caps] of byProvider) {
    const domain = inferDomainFromCapabilities(caps);
    const runtimeLoader = DOMAIN_RUNTIME_LOADERS[domain] ?? null;
    const readiness = resolveProviderReadiness(providerKey, caps);
    const hasWrite = caps.some((cap) => cap.operation === "write");
    const providerOverride = COMMUNITY_EXTERNAL_ADAPTER_COVERAGE_OVERRIDES[providerKey];

    entries.push({
      module_id: `provider.${providerKey}`,
      domain,
      business_pack_key: caps[0]?.business_pack_key ?? null,
      provider_key: providerKey,
      capability_ids: caps.map((cap) => `${cap.capability_key}.${cap.operation}`),
      source_type: providerOverride?.source_type ?? (runtimeLoader ? "rpc" : "manifest"),
      source_reference:
        providerOverride?.source_reference ??
        (runtimeLoader ? `lib/integration-intelligence/${domain}/manifests.ts` : null),
      runtime_loader: runtimeLoader,
      schema_status: caps[0]?.implementation_status === "specification_only" ? "missing" : "partial",
      permission_status: "defined",
      activation_status:
        providerOverride?.activation_status ??
        (readiness === "disabled" ? "disabled" : readiness === "blocked_by_governance" ? "gated" : "partial"),
      command_brief_status: providerOverride?.command_brief_status ?? "none",
      action_status: hasWrite ? "approval_required" : "none",
      language_status: "complete",
      test_status: providerOverride?.test_status ?? (providerKey === "community_external_adapter" ? "phase_tested" : "partial"),
      readiness,
      limitations: providerOverride?.limitations ?? [],
      next_required_step:
        providerOverride?.next_required_step ??
        (readiness === "adapter_missing"
          ? `Implement live provider adapter for ${providerKey}.`
          : readiness === "manifest_only"
            ? `Connect live source for ${providerKey}.`
            : null),
      panel: "app",
    });
  }

  return entries;
}

function inferDomainFromCapabilities(caps: readonly CommercialCapabilityEntry[]): string {
  const providerKey = caps[0]?.provider_key ?? "";
  const domainHints: Record<string, string> = {
    community_network_center: "community",
    moderation_engine: "community",
    marketplace_listings: "community",
    membership_rewards: "community",
    community_external_adapter: "community",
    trust_center_verification: "security",
    appointment_booking: "services",
    local_service_beauty: "industry_packs",
    workforce_scheduling: "services",
    booking_customer_directory: "services",
    supplier_directory: "warehouse",
    organization_directory_core: "directory",
    crm_customer_directory: "sales",
    hr_employee_directory: "hr",
    community_member_directory: "community",
    partner_directory: "sales",
    commerce_customer_directory: "commerce",
  };
  if (domainHints[providerKey]) return domainHints[providerKey];

  for (const domain of Object.keys(DOMAIN_RUNTIME_LOADERS)) {
    if (providerKey.includes(domain.replace("_", ""))) return domain;
  }

  return "integration_intelligence";
}

function buildMarketingBusinessPackEntries(): CompanionCoverageEntry[] {
  return MARKETING_BUSINESS_PACK_REGISTRY.map((pack) => ({
    module_id: `business_pack.${pack.slug}`,
    domain: "business_packs",
    business_pack_key: pack.slug,
    provider_key: `marketing_pack_${pack.slug}`,
    capability_ids: [`pack.${pack.slug}.read`],
    source_type: "manifest" as const,
    source_reference: `lib/marketing/business-packs/registry.ts:${pack.slug}`,
    runtime_loader: "load-companion-business-pack-context.ts",
    schema_status: "partial" as const,
    permission_status: "defined" as const,
    activation_status: "gated" as const,
    command_brief_status: "none" as const,
    action_status: "none" as const,
    language_status: "complete" as const,
    test_status: "partial" as const,
    readiness: "manifest_only" as const,
    limitations: [`Min plan: ${pack.minPlan}. Registration: ${pack.registrationMode}.`],
    next_required_step: "Map marketing pack slug to II provider manifests and entitlements.",
    panel: "app" as const,
  }));
}

function buildSkillRegistryEntry(): CompanionCoverageEntry {
  return {
    module_id: "registry.skills",
    domain: "skill_engine",
    business_pack_key: null,
    provider_key: "skill_registry",
    capability_ids: SKILL_REGISTRY.map((skill) => skill.id),
    source_type: "skill",
    source_reference: "lib/core/skills/registry.ts",
    runtime_loader: "load-companion-tool-registry.ts",
    schema_status: "wired",
    permission_status: "defined",
    activation_status: "active",
    command_brief_status: "partial",
    action_status: "approval_required",
    language_status: "complete",
    test_status: "phase_tested",
    readiness: "connected_but_partial",
    limitations: [`${SKILL_REGISTRY.length} skills registered — Companion uses subset via tool registry.`],
    next_required_step: "Ensure every operational skill maps to a coverage provider or core module.",
    panel: "app",
  };
}

function mergeExternalCommunityAdapterIntoCommercial(
  commercial: CommercialCapabilityEntry[],
): CommercialCapabilityEntry[] {
  return mergeCommunityExternalAdapterIntoCommercial(commercial);
}

/** Canonical Companion Foundation Coverage Registry — Phase 34. */
export function buildCompanionFoundationCoverageRegistry(): CompanionCoverageEntry[] {
  const commercial = mergeExternalCommunityAdapterIntoCommercial(buildCommercialCapabilityMatrix());
  const providerEntries = buildProviderEntriesFromCommercialMatrix(commercial);

  const explicitModuleIds = new Set([
    ...MEMBER_VERIFICATION_COVERAGE_MODULES.map((entry) => entry.module_id),
    ...HAIRDRESSER_SERVICE_COVERAGE_MODULES.map((entry) => entry.module_id),
    ...COMMAND_BRIEF_COVERAGE_MODULES.map((entry) => entry.module_id),
    ...SUPPORT_COVERAGE_MODULES.map((entry) => entry.module_id),
    ...HOSTS_COVERAGE_MODULES.map((entry) => entry.module_id),
    ...ORGANIZATION_DIRECTORY_COVERAGE_MODULES.map((entry) => entry.module_id),
  ]);

  const filteredProviders = providerEntries.filter(
    (entry) =>
      !explicitModuleIds.has(entry.module_id) && !SUPERSEDED_PROVIDER_MODULE_IDS.has(entry.module_id),
  );

  return applyP1LiveE2eCoverageOverrides(
    [
      ...CORE_COMPANION_MODULES,
      ...buildMarketingBusinessPackEntries(),
      buildSkillRegistryEntry(),
      ...filteredProviders,
      ...MEMBER_VERIFICATION_COVERAGE_MODULES,
      ...HAIRDRESSER_SERVICE_COVERAGE_MODULES,
      ...COMMAND_BRIEF_COVERAGE_MODULES,
      ...SUPPORT_COVERAGE_MODULES,
      ...HOSTS_COVERAGE_MODULES,
      ...ORGANIZATION_DIRECTORY_COVERAGE_MODULES,
      ...PANEL_COVERAGE_ENTRIES,
    ],
    readP1LiveE2eCertificationArtifact(process.cwd()),
  );
}

export { summarizeCoverageReadiness } from "./companion-foundation-coverage-readiness";

export function listAllRegisteredCapabilityIds(entries: readonly CompanionCoverageEntry[]): string[] {
  const ids = new Set<string>();
  for (const entry of entries) {
    for (const capabilityId of entry.capability_ids) {
      ids.add(capabilityId);
    }
  }
  return [...ids].sort();
}

export function listAllProviderKeys(entries: readonly CompanionCoverageEntry[]): string[] {
  return [...new Set(entries.map((entry) => entry.provider_key))].sort();
}

export function buildCompanionFoundationCoverageArtifact(): CompanionFoundationCoverageArtifact {
  const entries = buildCompanionFoundationCoverageRegistry();
  const panel_coverage = entries.filter((entry) => entry.panel !== null && entry.module_id.startsWith("panel."));
  const gaps = buildCompanionFoundationCoverageGaps(entries);
  const commercial = mergeExternalCommunityAdapterIntoCommercial(buildCommercialCapabilityMatrix());

  const base: CompanionFoundationCoverageArtifact = {
    version: "companion-foundation-coverage-v1",
    generated_at: new Date().toISOString(),
    summary: {
      total_modules: entries.length,
      total_capabilities: commercial.length,
      business_packs: MARKETING_BUSINESS_PACK_REGISTRY.length,
      providers: listAllProviderKeys(entries).length,
      skills: SKILL_REGISTRY.length,
      panels: panel_coverage.length,
      readiness: summarizeCoverageReadiness(entries),
    },
    entries,
    gaps,
    panel_coverage,
  };

  return attachReconciliationToArtifact(base, entries, commercial);
}

export { DOMAIN_RUNTIME_LOADERS, PANEL_COVERAGE_ENTRIES, CORE_COMPANION_MODULES };
