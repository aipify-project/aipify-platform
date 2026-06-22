/** Canonical Companion Foundation Coverage Registry types — Phase 34. */

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

export type CompanionFoundationCoverageArtifact = {
  version: "companion-foundation-coverage-v1";
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
};
