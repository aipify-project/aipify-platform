/** Canonical Companion Foundation Coverage Registry types — Phase 34 · reconciliation Phase 43. */

export type CompanionCoverageReadiness =
  | "production_ready"
  | "production_ready_candidate"
  | "connected"
  | "connected_but_partial"
  | "adapter_missing"
  | "source_missing"
  | "manifest_only"
  | "specification_only"
  | "placeholder"
  | "disabled"
  | "blocked_by_governance";

export type CompanionCoverageSourceClassification =
  | "source_exact"
  | "source_compatible"
  | "source_partial"
  | "source_proxy"
  | "source_seeded"
  | "source_simulated"
  | "source_missing"
  | "source_unknown";

export type CompanionCoveragePanel =
  | "super_admin"
  | "platform"
  | "partners"
  | "app";

export type CompanionCoverageSourceType =
  | "rpc"
  | "api"
  | "adapter"
  | "manifest"
  | "skill"
  | "none";

export type CompanionCoverageEntry = {
  module_id: string;
  domain: string;
  business_pack_key: string | null;
  provider_key: string;
  capability_ids: readonly string[];
  source_type: CompanionCoverageSourceType;
  source_reference: string | null;
  runtime_loader: string | null;
  schema_status: "wired" | "partial" | "missing" | "n/a";
  permission_status: "defined" | "partial" | "missing";
  activation_status: "active" | "partial" | "gated" | "disabled";
  command_brief_status: "linked" | "partial" | "none";
  action_status: "supported" | "approval_required" | "blocked" | "none";
  language_status: "complete" | "partial" | "missing";
  test_status: "phase_tested" | "partial" | "missing";
  readiness: CompanionCoverageReadiness;
  limitations: readonly string[];
  next_required_step: string | null;
  panel: CompanionCoveragePanel | null;
};

export type CompanionCoverageGapPriority = "P0" | "P1" | "P2" | "P3";

export type CompanionCoverageGap = {
  priority: CompanionCoverageGapPriority;
  module_id: string;
  provider_key: string;
  capability_ids: readonly string[];
  reason: string;
  next_required_step: string;
};

export type CompanionCoverageReadinessScope = {
  read: CompanionCoverageReadiness;
  draft: CompanionCoverageReadiness | null;
  write: CompanionCoverageReadiness | null;
  approval: CompanionCoverageReadiness | null;
};

export type CompanionCoverageCommandBriefCoverage = {
  catalog_registered: boolean;
  builder_exists: boolean;
  runtime_collector_connected: boolean;
  signal_source:
    | "signal_registered"
    | "signal_runtime_connected"
    | "signal_source_exact"
    | "signal_source_partial"
    | "signal_source_missing";
  deduplication_connected: boolean;
  action_connected: boolean;
  panel_visibility: boolean;
  locale_coverage: boolean;
};

export type CompanionCoveragePanelDetail = {
  data_source: boolean;
  runtime_connection: boolean;
  permissions: boolean;
  command_brief: boolean;
  ui_surface: boolean;
  actions: boolean;
  limitations: readonly string[];
};

export type CompanionCoverageReconciledEntry = CompanionCoverageEntry & {
  source_classification: CompanionCoverageSourceClassification;
  readiness_scope: CompanionCoverageReadinessScope;
  command_brief: CompanionCoverageCommandBriefCoverage;
  panel_coverage: {
    app: CompanionCoveragePanelDetail;
    platform: CompanionCoveragePanelDetail;
    partners: CompanionCoveragePanelDetail;
    super_admin: CompanionCoveragePanelDetail;
  };
  reconciliation_notes: readonly string[];
};

export type CompanionReconciliationSummary = {
  total_modules: number;
  total_capabilities: number;
  readiness: Record<CompanionCoverageReadiness, number>;
  source_classification: Record<CompanionCoverageSourceClassification, number>;
  by_layer: {
    core: number;
    app: number;
    platform: number;
    partners: number;
    super_admin: number;
    business_packs: number;
    directory_providers: number;
    command_brief: number;
  };
  by_panel: Record<
    CompanionCoveragePanel,
    { modules: number; readiness: Record<CompanionCoverageReadiness, number> }
  >;
  phase_38_42_modules: number;
  false_production_ready_violations: number;
};

export type CompanionP1WorkPackage = {
  priority_order: number;
  package_id: string;
  module_id: string;
  exact_gap: string;
  current_readiness: CompanionCoverageReadiness;
  verified_source: string;
  required_work: string;
  read_write_scope: string;
  dependencies: readonly string[];
  security_considerations: readonly string[];
  acceptance_criteria: readonly string[];
  why_p1: string;
  estimated_complexity: "small" | "medium" | "large";
};

export type CompanionP1PriorityFreeze = {
  version: "companion-p1-priority-freeze-v1";
  frozen_at: string;
  max_packages: number;
  packages: readonly CompanionP1WorkPackage[];
  principles: readonly string[];
};

export type CompanionDeprecatedRegistryEntry = {
  entry_id: string;
  kind: "canonical" | "deprecated" | "merge_candidate" | "removal_candidate" | "needs_migration";
  canonical_replacement: string | null;
  reason: string;
};

export type CompanionFoundationCoverageArtifact = {
  version: "companion-foundation-coverage-v1";
  reconciliation_version?: "companion-coverage-reconciliation-v1";
  generated_at: string;
  summary: {
    total_modules: number;
    total_capabilities: number;
    business_packs: number;
    providers: number;
    skills: number;
    panels: number;
    readiness: Record<CompanionCoverageReadiness, number>;
  };
  entries: CompanionCoverageEntry[];
  gaps: CompanionCoverageGap[];
  panel_coverage: CompanionCoverageEntry[];
  reconciled_entries?: CompanionCoverageReconciledEntry[];
  reconciliation_summary?: CompanionReconciliationSummary;
  p1_priority_freeze?: CompanionP1PriorityFreeze;
  known_gaps?: {
    version: string;
    generated_from: string;
    total_gaps: number;
    by_priority: Record<string, number>;
    gaps: readonly CompanionCoverageGap[];
    modules_without_live_source: string[];
  };
  deprecated_registry?: CompanionDeprecatedRegistryEntry[];
  duplicate_capabilities?: Array<{ capability_id: string; module_ids: string[] }>;
};
