import type {
  CompanionCoverageEntry,
  CompanionCoverageGap,
  CompanionCoveragePanel,
  CompanionCoverageReadiness,
  CompanionCoverageReconciledEntry,
  CompanionCoverageSourceClassification,
  CompanionDeprecatedRegistryEntry,
  CompanionFoundationCoverageArtifact,
  CompanionP1PriorityFreeze,
  CompanionP1WorkPackage,
  CompanionReconciliationSummary,
} from "./companion-foundation-coverage-types";
import { buildCompanionFoundationCoverageGaps } from "./companion-foundation-coverage-gaps";

/** Canonical readiness definitions — Phase 43. No other terminology in registry reports. */
export const CANONICAL_READINESS_DEFINITIONS: Readonly<
  Record<Exclude<CompanionCoverageReadiness, "placeholder">, string>
> = {
  production_ready:
    "Authenticated live APP E2E, verified provider source, tenant isolation, permissions, source/freshness, error states, customer UI — no blocking gaps.",
  production_ready_candidate:
    "Runtime and source connected with strong tests — missing authenticated live E2E or final certification.",
  connected: "Live source and runtime wiring; capability works; minor non-blocking limitations allowed.",
  connected_but_partial:
    "Partial source, fields, entities, or operations — proxy aggregates must not be presented as full coverage.",
  source_missing: "Core/provider contract exists — factual read/write source is not connected.",
  adapter_missing: "Source exists or is assumed — Companion provider/runtime adapter is missing.",
  manifest_only: "Capability registered in manifest — no verified runtime implementation.",
  specification_only: "Design, phase description, or future plan only.",
  disabled: "Explicitly deactivated — not available to customers.",
  blocked_by_governance:
    "Source or adapter may exist — execution blocked by policy, permissions, or security requirements.",
};

export const CANONICAL_SOURCE_CLASSIFICATION_DEFINITIONS: Readonly<
  Record<CompanionCoverageSourceClassification, string>
> = {
  source_exact: "Source represents the same factual entity, metric, or event.",
  source_compatible: "Same meaning with limited schema or scope.",
  source_partial: "Only part of the documented response is available.",
  source_proxy: "Indirect metric used as signal — not the primary fact.",
  source_seeded: "Manually seeded data — sync not proven.",
  source_simulated: "Test or simulation only — not customer facts.",
  source_missing: "No documented live source.",
  source_unknown: "Source not classified — requires audit.",
};

export const SUPERSEDED_PROVIDER_MODULE_IDS = new Set([
  "provider.supplier_directory",
  "provider.crm_customer_directory",
]);

export const DEPRECATED_REGISTRY_ENTRIES: readonly CompanionDeprecatedRegistryEntry[] = [
  {
    entry_id: "provider.supplier_directory",
    kind: "merge_candidate",
    canonical_replacement: "directory.supplier / supplier_vendor_directory",
    reason: "Legacy commercial matrix provider superseded by Phase 42 supplier_vendor_directory explicit modules.",
  },
  {
    entry_id: "provider.crm_customer_directory",
    kind: "merge_candidate",
    canonical_replacement: "directory.crm_customer / crm_customer_directory",
    reason: "Legacy commercial matrix provider superseded by Phase 41 explicit CRM directory modules.",
  },
  {
    entry_id: "supplier_directory",
    kind: "deprecated",
    canonical_replacement: "supplier_vendor_directory",
    reason: "Legacy provider key in commercial matrix — use supplier_vendor_directory.",
  },
  {
    entry_id: "readiness.placeholder",
    kind: "deprecated",
    canonical_replacement: "specification_only",
    reason: "Placeholder readiness removed from canonical registry terminology — Phase 43.",
  },
  {
    entry_id: "legacy_community_external_adapter_key",
    kind: "deprecated",
    canonical_replacement: "community_external_adapter",
    reason: "Legacy community adapter provider key removed from Core — use community_external_adapter.",
  },
  {
    entry_id: "legacy_community_member_directory_key",
    kind: "deprecated",
    canonical_replacement: "community_member_directory",
    reason: "Legacy community member directory provider key removed from Core — use community_member_directory.",
  },
  {
    entry_id: "legacy_community_member_directory_module",
    kind: "deprecated",
    canonical_replacement: "directory.community_member",
    reason: "Legacy community member directory module removed from Core — use directory.community_member.",
  },
  {
    entry_id: "legacy_community_adapter_status_module",
    kind: "deprecated",
    canonical_replacement: "verification.community_adapter_status",
    reason: "Legacy community adapter status module removed from Core — use verification.community_adapter_status.",
  },
  {
    entry_id: "hr_employee_directory",
    kind: "needs_migration",
    canonical_replacement: "app_employee_directory",
    reason: "APP organization members use app_employee_directory; HR pack adapter is separate scope.",
  },
];

const DIRECTORY_PROVIDER_MODULE_IDS = [
  "directory.app_employee",
  "directory.hr_employee",
  "directory.crm_customer",
  "directory.crm_lead",
  "directory.crm_contact",
  "directory.crm_organization",
  "directory.supplier",
  "directory.vendor",
  "directory.supplier_contact",
  "directory.manufacturer",
  "directory.distributor",
  "directory.subcontractor",
  "directory.community_member",
  "directory.core_search",
] as const;

const PHASE_38_42_MODULE_IDS = [
  "support.queue_read",
  "support.case_read",
  "support.response_draft",
  "support.case_write",
  "support.command_brief_signals",
  "hosts.property_read",
  "hosts.reservation_read",
  "hosts.operations_read",
  "hosts.finance_read",
  "hosts.guest_response_draft",
  "hosts.task_write",
  "hosts.command_brief_signals",
  "hosts.v2_specification_only",
  ...DIRECTORY_PROVIDER_MODULE_IDS,
] as const;

function hasLiveRpcReference(entry: CompanionCoverageEntry): boolean {
  const ref = String(entry.source_reference ?? "").toLowerCase();
  return ref.startsWith("rpc:") || ref.includes("get_");
}

function inferSourceClassification(entry: CompanionCoverageEntry): CompanionCoverageSourceClassification {
  if (entry.readiness === "source_missing" || !entry.source_reference) return "source_missing";
  const ref = entry.source_reference.toLowerCase();

  if (ref.includes("mock") || ref.includes("fixture") || ref.includes("simul")) return "source_simulated";
  if (ref.includes("seed")) return "source_seeded";
  if (ref.includes("specification") || ref.includes("scaffold")) return "source_missing";
  if (ref.includes("industry_blueprint") || ref.includes("blueprint:")) return "source_partial";
  if (ref.includes("best_practice") || ref.includes("proxy") || ref.includes("partial")) return "source_proxy";

  if (entry.readiness === "manifest_only" || entry.readiness === "specification_only") {
    return entry.source_type === "manifest" ? "source_missing" : "source_unknown";
  }

  if (entry.readiness === "connected_but_partial") {
    if (hasLiveRpcReference(entry)) return "source_partial";
    if (entry.source_type === "adapter") return "source_compatible";
    return "source_partial";
  }

  if (hasLiveRpcReference(entry)) {
    return entry.schema_status === "wired" ? "source_exact" : "source_compatible";
  }

  if (entry.source_type === "adapter" && entry.runtime_loader) return "source_compatible";
  if (entry.source_type === "manifest") return "source_missing";
  return "source_unknown";
}

function inferReadinessScope(entry: CompanionCoverageEntry): CompanionCoverageReconciledEntry["readiness_scope"] {
  const ids = entry.capability_ids.map((id) => id.toLowerCase());
  const hasRead = ids.some((id) => id.includes(".read") || id.includes("search") || id.includes(".draft"));
  const hasDraft = ids.some((id) => id.includes("draft") || id.includes("proposal"));
  const hasWrite = ids.some(
    (id) =>
      id.includes(".create") ||
      id.includes(".update") ||
      id.includes(".assign") ||
      id.includes(".escalate") ||
      id.includes(".send") ||
      id.includes(".write"),
  );

  let read: CompanionCoverageReadiness = entry.readiness;
  let draft: CompanionCoverageReadiness | null = null;
  let write: CompanionCoverageReadiness | null = null;
  let approval: CompanionCoverageReadiness | null = null;

  if (entry.action_status === "approval_required") approval = "blocked_by_governance";
  if (entry.action_status === "blocked") approval = "blocked_by_governance";

  if (hasDraft) draft = entry.readiness;
  if (hasWrite) {
    write =
      entry.readiness === "adapter_missing" || entry.readiness === "source_missing"
        ? entry.readiness
        : entry.action_status === "blocked"
          ? "blocked_by_governance"
          : entry.readiness;
  }

  if (!hasRead && !hasDraft && !hasWrite) {
    read = entry.readiness;
  }

  return { read, draft, write, approval };
}

function inferCommandBriefCoverage(
  entry: CompanionCoverageEntry,
): CompanionCoverageReconciledEntry["command_brief"] {
  const source = inferSourceClassification(entry);
  const catalog_registered =
    entry.module_id.includes("command_brief") || entry.command_brief_status !== "none";
  const runtime_collector_connected = entry.command_brief_status === "linked";

  let signal_source: CompanionCoverageReconciledEntry["command_brief"]["signal_source"] =
    "signal_source_missing";
  if (catalog_registered && !runtime_collector_connected) {
    signal_source = "signal_registered";
  } else if (runtime_collector_connected && source === "source_missing") {
    signal_source = "signal_runtime_connected";
  } else if (runtime_collector_connected && source === "source_exact") {
    signal_source = "signal_source_exact";
  } else if (
    runtime_collector_connected &&
    (source === "source_compatible" || source === "source_partial" || source === "source_proxy")
  ) {
    signal_source = "signal_source_partial";
  }

  return {
    catalog_registered,
    builder_exists: Boolean(entry.runtime_loader?.includes("orchestrator")),
    runtime_collector_connected,
    signal_source,
    deduplication_connected: runtime_collector_connected,
    action_connected: entry.action_status === "supported" || entry.action_status === "approval_required",
    panel_visibility: entry.panel === "app",
    locale_coverage: entry.language_status === "complete",
  };
}

function inferPanelCoverage(entry: CompanionCoverageEntry): CompanionCoverageReconciledEntry["panel_coverage"] {
  const panel = entry.panel ?? "app";
  const hasLoader = Boolean(entry.runtime_loader);
  const hasSource = inferSourceClassification(entry) !== "source_missing";

  const surface = (active: boolean): CompanionCoverageReconciledEntry["panel_coverage"]["app"] => ({
    data_source: hasSource,
    runtime_connection: hasLoader && entry.activation_status !== "disabled",
    permissions: entry.permission_status !== "missing",
    command_brief: entry.command_brief_status === "linked",
    ui_surface: entry.panel === "app" && entry.schema_status !== "missing",
    actions: entry.action_status !== "none",
    limitations: entry.limitations,
  });

  const empty = {
    data_source: false,
    runtime_connection: false,
    permissions: false,
    command_brief: false,
    ui_surface: false,
    actions: false,
    limitations: [] as readonly string[],
  };

  return {
    app: panel === "app" ? surface(true) : empty,
    platform: panel === "platform" ? surface(true) : empty,
    partners: panel === "partners" ? surface(true) : empty,
    super_admin: panel === "super_admin" ? surface(true) : empty,
  };
}

export function reconcileCoverageEntry(entry: CompanionCoverageEntry): CompanionCoverageReconciledEntry {
  const source_classification = inferSourceClassification(entry);
  const falseExact =
    (source_classification === "source_proxy" ||
      source_classification === "source_seeded" ||
      source_classification === "source_simulated") &&
    entry.readiness === "production_ready";

  return {
    ...entry,
    source_classification,
    readiness_scope: inferReadinessScope(entry),
    command_brief: inferCommandBriefCoverage(entry),
    panel_coverage: inferPanelCoverage(entry),
    reconciliation_notes: [
      ...(falseExact ? ["Proxy/seeded/simulated source cannot be production_ready."] : []),
      ...(entry.readiness === "placeholder" ? ["Migrate placeholder readiness to specification_only."] : []),
    ],
  };
}

export function reconcileCoverageRegistry(
  entries: readonly CompanionCoverageEntry[],
): CompanionCoverageReconciledEntry[] {
  return entries.map(reconcileCoverageEntry);
}

function summarizeReadiness(
  entries: readonly { readiness: CompanionCoverageReadiness }[],
): Record<CompanionCoverageReadiness, number> {
  const summary: Record<CompanionCoverageReadiness, number> = {
    production_ready: 0,
    production_ready_candidate: 0,
    connected: 0,
    connected_but_partial: 0,
    adapter_missing: 0,
    source_missing: 0,
    manifest_only: 0,
    specification_only: 0,
    placeholder: 0,
    disabled: 0,
    blocked_by_governance: 0,
  };
  for (const entry of entries) summary[entry.readiness] += 1;
  return summary;
}

function countSourceClassification(
  reconciled: readonly CompanionCoverageReconciledEntry[],
): Record<CompanionCoverageSourceClassification, number> {
  const summary: Record<CompanionCoverageSourceClassification, number> = {
    source_exact: 0,
    source_compatible: 0,
    source_partial: 0,
    source_proxy: 0,
    source_seeded: 0,
    source_simulated: 0,
    source_missing: 0,
    source_unknown: 0,
  };
  for (const entry of reconciled) {
    summary[entry.source_classification] += 1;
  }
  return summary;
}

function countByPanel(entries: readonly CompanionCoverageReconciledEntry[]): CompanionReconciliationSummary["by_panel"] {
  const panels: CompanionCoveragePanel[] = ["app", "platform", "partners", "super_admin"];
  const result = {} as CompanionReconciliationSummary["by_panel"];
  for (const panel of panels) {
    const scoped = entries.filter((entry) => entry.panel === panel);
    result[panel] = {
      modules: scoped.length,
      readiness: summarizeReadiness(scoped),
    };
  }
  return result;
}

export function buildReconciliationSummary(
  reconciled: readonly CompanionCoverageReconciledEntry[],
): CompanionReconciliationSummary {
  const businessPackModules = reconciled.filter((entry) => entry.module_id.startsWith("business_pack."));
  const directoryModules = reconciled.filter((entry) => entry.module_id.startsWith("directory."));
  const commandBriefModules = reconciled.filter(
    (entry) => entry.domain === "command_brief" || entry.module_id.includes("command_brief"),
  );
  const coreModules = reconciled.filter((entry) => entry.module_id.startsWith("core."));

  return {
    total_modules: reconciled.length,
    total_capabilities: new Set(reconciled.flatMap((entry) => entry.capability_ids)).size,
    readiness: summarizeReadiness(reconciled),
    source_classification: countSourceClassification(reconciled),
    by_layer: {
      core: coreModules.length,
      app: reconciled.filter((entry) => entry.panel === "app").length,
      platform: reconciled.filter((entry) => entry.panel === "platform").length,
      partners: reconciled.filter((entry) => entry.panel === "partners").length,
      super_admin: reconciled.filter((entry) => entry.panel === "super_admin").length,
      business_packs: businessPackModules.length,
      directory_providers: directoryModules.length,
      command_brief: commandBriefModules.length,
    },
    by_panel: countByPanel(reconciled),
    phase_38_42_modules: reconciled.filter((entry) =>
      (PHASE_38_42_MODULE_IDS as readonly string[]).includes(entry.module_id),
    ).length,
    false_production_ready_violations: reconciled.filter(
      (entry) =>
        entry.readiness === "production_ready" &&
        (!hasLiveRpcReference(entry) ||
          entry.test_status === "missing" ||
          entry.schema_status === "missing" ||
          ["source_proxy", "source_seeded", "source_simulated", "source_missing"].includes(
            entry.source_classification,
          )),
    ).length,
  };
}

function entryByModule(
  reconciled: readonly CompanionCoverageReconciledEntry[],
  moduleId: string,
): CompanionCoverageReconciledEntry | undefined {
  return reconciled.find((entry) => entry.module_id === moduleId);
}

function isP1PackageOpen(entry: CompanionCoverageReconciledEntry | undefined): boolean {
  if (!entry) return false;
  return !["production_ready", "connected", "disabled", "specification_only"].includes(entry.readiness);
}

/** Locked P1 sequence — Phase 43. Max 10 packages. Not auto-implemented. */
export function buildP1PriorityFreeze(
  reconciled: readonly CompanionCoverageReconciledEntry[],
): CompanionP1PriorityFreeze {
  const packages: CompanionP1WorkPackage[] = [
    {
      priority_order: 1,
      package_id: "p1.01_live_app_e2e_certification",
      module_id: "certification.companion_runtime_v1",
      exact_gap: "No authenticated live APP E2E gate for production_ready_candidate promotion.",
      current_readiness: "connected_but_partial",
      verified_source: "phase tests + v1-runtime-certification.ts",
      required_work:
        "Ship repeatable authenticated APP session E2E harness covering directory, support, and hosts read paths.",
      read_write_scope: "read_certification",
      dependencies: ["core.companion_orchestrator", "panel.app"],
      security_considerations: ["Tenant isolation and permission denial must be exercised in live E2E."],
      acceptance_criteria: [
        "Authenticated APP session runs against staging or pilot tenant.",
        "Directory, support, and hosts read orchestrators return tenant-scoped outcomes.",
        "No production_ready without passing live E2E batch.",
      ],
      why_p1: "Blocks honest production_ready_candidate for Phase 38–42 modules and pilot/demo credibility.",
      estimated_complexity: "medium",
    },
    {
      priority_order: 2,
      package_id: "p1.02_directory_app_employee_e2e",
      module_id: "directory.app_employee",
      exact_gap: "APP employee directory connected_but_partial — missing live E2E certification.",
      current_readiness: entryByModule(reconciled, "directory.app_employee")?.readiness ?? "connected_but_partial",
      verified_source: "get_employee_directory",
      required_work: "Complete authenticated E2E and team/department enrichment from organization management RPC.",
      read_write_scope: "read_only",
      dependencies: ["p1.01_live_app_e2e_certification"],
      security_considerations: ["Mask contact fields without directory.search.contact permission."],
      acceptance_criteria: [
        "Employee search by name, email, role returns exact tenant-scoped matches.",
        "Cross-tenant and suspended APP cases fail closed.",
        "Readiness may advance to production_ready_candidate after E2E pass.",
      ],
      why_p1: "Central organization directory — live source already wired in Phase 40.",
      estimated_complexity: "small",
    },
    {
      priority_order: 3,
      package_id: "p1.03_directory_crm_customer_close_partial",
      module_id: "directory.crm_customer",
      exact_gap: "CRM customer directory partial — pipeline/opportunity enrichment incomplete.",
      current_readiness: entryByModule(reconciled, "directory.crm_customer")?.readiness ?? "connected_but_partial",
      verified_source: "get_customer_relationship_center + get_lead_management_center",
      required_work: "Document and wire remaining CRM fields; authenticated E2E for customer, lead, contact search.",
      read_write_scope: "read_only",
      dependencies: ["p1.01_live_app_e2e_certification"],
      security_considerations: ["Partner attribution is metadata — never customer ownership."],
      acceptance_criteria: [
        "Customer, lead, contact, and organization searches pass Phase 41 regression under live session.",
        "No CRM write-actions enabled in Companion.",
      ],
      why_p1: "High commercial value — sales/CRM directory is pilot-critical.",
      estimated_complexity: "medium",
    },
    {
      priority_order: 4,
      package_id: "p1.04_directory_supplier_vendor_close_partial",
      module_id: "directory.supplier",
      exact_gap: "Supplier directory partial — procurement vendor fields and E2E incomplete.",
      current_readiness: entryByModule(reconciled, "directory.supplier")?.readiness ?? "connected_but_partial",
      verified_source: "get_procurement_operations_center",
      required_work: "Enrich assigned buyer and performance fields when RPC exposes them; live E2E certification.",
      read_write_scope: "read_only",
      dependencies: ["p1.01_live_app_e2e_certification"],
      security_considerations: ["Never expose bank or contract body in directory search."],
      acceptance_criteria: [
        "Supplier search by company, org number, category works under live APP session.",
        "Marketplace candidates excluded from active supplier results.",
      ],
      why_p1: "Procurement source is exact live — close partial gaps before new modules.",
      estimated_complexity: "small",
    },
    {
      priority_order: 5,
      package_id: "p1.05_support_sla_exact_source",
      module_id: "support.queue_read",
      exact_gap: "Support queue uses ASO aggregates — SLA and assignment fields are partial/proxy.",
      current_readiness: entryByModule(reconciled, "support.queue_read")?.readiness ?? "connected_but_partial",
      verified_source: "get_customer_support_operations_center",
      required_work: "Connect dedicated SLA and assignment fields when ASO RPC exposes exact values.",
      read_write_scope: "read_only",
      dependencies: [],
      security_considerations: ["No private message content in queue metadata."],
      acceptance_criteria: [
        "SLA breach signals use source_exact fields only.",
        "Partial proxy counts excluded from Command Brief exact signals.",
      ],
      why_p1: "Support queue is pilot-facing — partial SLA misrepresents operational truth.",
      estimated_complexity: "medium",
    },
    {
      priority_order: 6,
      package_id: "p1.06_support_case_write_adapter",
      module_id: "support.case_write",
      exact_gap: "assign/escalate RPCs exist — Companion write adapter not connected.",
      current_readiness: entryByModule(reconciled, "support.case_write")?.readiness ?? "adapter_missing",
      verified_source: "assign_support_case / escalate_support_case",
      required_work: "Enable reversible assign/escalate adapter with user confirmation and audit.",
      read_write_scope: "write_approval_required",
      dependencies: ["support.case_read"],
      security_considerations: ["All writes require explicit approval — no auto-assign."],
      acceptance_criteria: [
        "Draft proposal flow returns approval_required outcome.",
        "Executed writes audit without raw case content.",
      ],
      why_p1: "Write RPCs exist — adapter gap blocks safe support actions.",
      estimated_complexity: "medium",
    },
    {
      priority_order: 7,
      package_id: "p1.07_hosts_task_write_adapter",
      module_id: "hosts.task_write",
      exact_gap: "Hosts task/status write adapter missing.",
      current_readiness: entryByModule(reconciled, "hosts.task_write")?.readiness ?? "adapter_missing",
      verified_source: "hosts write orchestrator scaffold",
      required_work: "Connect reversible Hosts task write adapter with confirmation.",
      read_write_scope: "write_approval_required",
      dependencies: ["hosts.operations_read"],
      security_considerations: ["No guest PII in task write payloads."],
      acceptance_criteria: [
        "Task write proposals require approval.",
        "No production_ready until reversible write path is proven.",
      ],
      why_p1: "Hosts operations read is live — write is the next safe execution step.",
      estimated_complexity: "medium",
    },
    {
      priority_order: 8,
      package_id: "p1.08_member_verification_exact_source",
      module_id: "verification.trust_center",
      exact_gap: "Verification queue exact read source not fully connected.",
      current_readiness: entryByModule(reconciled, "verification.trust_center")?.readiness ?? "source_missing",
      verified_source: "get_customer_trust_center / security dashboard RPCs",
      required_work: "Connect read-only verification queue with metadata-only audit fields.",
      read_write_scope: "read_only",
      dependencies: [],
      security_considerations: ["No document images, ID numbers, or sensitive profile fields."],
      acceptance_criteria: [
        "verification_status.read uses source_exact or source_compatible only.",
        "Command Brief signals exclude partial proxy verification counts.",
      ],
      why_p1: "Trust verification is security-sensitive — partial sources risk false confidence.",
      estimated_complexity: "medium",
    },
    {
      priority_order: 9,
      package_id: "p1.09_community_member_directory_source",
      module_id: "directory.community_member",
      exact_gap: "Community member directory has contract only — no live searchable member source.",
      current_readiness: entryByModule(reconciled, "directory.community_member")?.readiness ?? "source_missing",
      verified_source: "community_external_adapter (member.read partial)",
      required_work: "Approve and connect tenant-scoped member search source with masking and audit.",
      read_write_scope: "read_only",
      dependencies: [],
      security_considerations: ["Community member PII masked by default."],
      acceptance_criteria: [
        "Member search returns tenant-scoped masked records.",
        "No member list without explicit entitlement.",
      ],
      why_p1: "Community member directory needs honest source connection — currently source_missing.",
      estimated_complexity: "large",
    },
    {
      priority_order: 10,
      package_id: "p1.10_service_booking_write_rpc",
      module_id: "service.booking_write",
      exact_gap: "Booking write RPC not connected — proposals only.",
      current_readiness: entryByModule(reconciled, "service.booking_write")?.readiness ?? "source_missing",
      verified_source: "none — write orchestrator scaffold only",
      required_work: "Ship reversible booking create/update/cancel RPC with availability recheck.",
      read_write_scope: "write_approval_required",
      dependencies: ["service.booking_read"],
      security_considerations: ["Double-booking prevention and idempotency required."],
      acceptance_criteria: [
        "booking.create returns proposal until user confirms.",
        "Availability recheck runs before commit.",
      ],
      why_p1: "Services read is partial — write blocks appointment completion loop.",
      estimated_complexity: "large",
    },
  ];

  const openPackages = packages.filter((pkg) => {
    if (pkg.module_id.startsWith("certification.")) return true;
    return isP1PackageOpen(entryByModule(reconciled, pkg.module_id));
  });

  return {
    version: "companion-p1-priority-freeze-v1",
    frozen_at: "2026-06-22",
    max_packages: 10,
    packages: openPackages.slice(0, 10),
    principles: [
      "Close existing partial connections before speculative modules.",
      "Connect live sources before manifest-only expansions.",
      "Read before write.",
      "Safe draft before execution.",
      "Generic Core before provider-specific extension.",
      "One module at a time.",
    ],
  };
}

export function findDuplicateCanonicalCapabilityIds(
  reconciled: readonly CompanionCoverageReconciledEntry[],
): Array<{ capability_id: string; module_ids: string[] }> {
  const map = new Map<string, Set<string>>();
  for (const entry of reconciled) {
    for (const capabilityId of entry.capability_ids) {
      const set = map.get(capabilityId) ?? new Set<string>();
      set.add(entry.module_id);
      map.set(capabilityId, set);
    }
  }
  return [...map.entries()]
    .filter(([, modules]) => modules.size > 1)
    .map(([capability_id, module_ids]) => ({
      capability_id,
      module_ids: [...module_ids].sort(),
    }))
    .sort((a, b) => a.capability_id.localeCompare(b.capability_id));
}

export function assertNoFalseExactSource(reconciled: readonly CompanionCoverageReconciledEntry[]): boolean {
  return !reconciled.some(
    (entry) =>
      entry.readiness === "production_ready" &&
      ["source_proxy", "source_seeded", "source_simulated", "source_missing"].includes(
        entry.source_classification,
      ),
  );
}

export function assertCanonicalReadinessOnly(
  reconciled: readonly CompanionCoverageReconciledEntry[],
): boolean {
  const allowed = new Set(Object.keys(CANONICAL_READINESS_DEFINITIONS));
  return reconciled.every((entry) => allowed.has(entry.readiness) || entry.readiness === "placeholder");
}

export function buildKnownGapsSnapshot(
  entries: readonly CompanionCoverageEntry[],
  gaps: readonly CompanionCoverageGap[],
) {
  return {
    version: "companion-known-gaps-v1",
    generated_from: "buildCompanionFoundationCoverageGaps",
    total_gaps: gaps.length,
    by_priority: gaps.reduce(
      (acc, gap) => {
        acc[gap.priority] = (acc[gap.priority] ?? 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    ),
    gaps,
    modules_without_live_source: entries
      .filter((entry) => !hasLiveRpcReference(entry) && entry.readiness !== "specification_only")
      .map((entry) => entry.module_id),
  };
}

export function attachReconciliationToArtifact(
  artifact: CompanionFoundationCoverageArtifact,
  entries: readonly CompanionCoverageEntry[],
): CompanionFoundationCoverageArtifact {
  const reconciled = reconcileCoverageRegistry(entries);
  const gaps = buildCompanionFoundationCoverageGaps(entries);

  return {
    ...artifact,
    reconciliation_version: "companion-coverage-reconciliation-v1",
    reconciled_entries: reconciled,
    reconciliation_summary: buildReconciliationSummary(reconciled),
    p1_priority_freeze: buildP1PriorityFreeze(reconciled),
    known_gaps: buildKnownGapsSnapshot(entries, gaps),
    deprecated_registry: [...DEPRECATED_REGISTRY_ENTRIES],
    duplicate_capabilities: findDuplicateCanonicalCapabilityIds(reconciled),
  };
}
