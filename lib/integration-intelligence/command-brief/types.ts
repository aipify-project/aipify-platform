export type CommandBriefSignalType =
  | "alert"
  | "anomaly"
  | "recommendation"
  | "risk"
  | "opportunity"
  | "health_score"
  | "forecast_warning"
  | "follow_up"
  | "attention";

export type CommandBriefSignalSeverity =
  | "critical"
  | "high"
  | "medium"
  | "low"
  | "informational";

export type CommandBriefConfidence = "high" | "moderate" | "low" | null;

export type CommandBriefSignalStatus =
  | "new"
  | "unresolved"
  | "acknowledged"
  | "completed"
  | "dismissed"
  | "expired";

export type CommandBriefSignalFreshness = "fresh" | "stale" | "unknown";

export type CommandBriefSignalCompleteness = "complete" | "partial" | "empty";

export type CommandBriefSourceTier =
  | "exact_live"
  | "compatible_live"
  | "partial_proxy"
  | "source_missing"
  | "adapter_missing"
  | "specification_only";

export type CommandBriefPanel = "app" | "platform" | "partners" | "super_admin";

export type CommandBriefSectionKey =
  | "requires_attention"
  | "since_last"
  | "completed_by_aipify"
  | "opportunities"
  | "recommended_next_steps";

export type CommandBriefSinceLastBucket =
  | "since_last"
  | "still_unresolved"
  | "recently_completed"
  | "new_recommendation"
  | "none";

export type CommandBriefActionKind =
  | "open_page"
  | "view_details"
  | "create_task"
  | "draft"
  | "request_approval"
  | "execute_safe_action";

export type CommandBriefRelatedAction = {
  kind: CommandBriefActionKind;
  label_key: string;
  href: string | null;
  capability_key: string | null;
  executable: boolean;
};

/** Canonical Command Brief signal contract — Core only; providers supply normalized inputs. */
export type CommandBriefSignal = {
  signal_id: string;
  signal_type: CommandBriefSignalType;
  category: string;
  title_key: string;
  summary_key: string;
  severity: CommandBriefSignalSeverity;
  priority: number;
  status: CommandBriefSignalStatus;
  source_module: string;
  source_provider: string;
  source_reference: string;
  source_tier: CommandBriefSourceTier;
  detected_at: string | null;
  relevant_since: string | null;
  freshness: CommandBriefSignalFreshness;
  completeness: CommandBriefSignalCompleteness;
  confidence: CommandBriefConfidence;
  required_permission: string | null;
  required_entitlement: string | null;
  related_capability: string | null;
  related_action: CommandBriefRelatedAction | null;
  organization_id: string;
  dedupe_key: string;
  warnings: readonly string[];
  count: number | null;
  panel: CommandBriefPanel;
  since_last_bucket: CommandBriefSinceLastBucket;
};

export type CommandBriefSection = {
  section_key: CommandBriefSectionKey;
  title_key: string;
  empty_title_key: string;
  empty_explanation_key: string;
  empty_action_key: string;
  signals: readonly CommandBriefSignal[];
};

export type CommandBriefBundle = {
  organization_id: string;
  panel: CommandBriefPanel;
  since_boundary_at: string | null;
  since_boundary_source: "last_login_at" | "last_command_brief_view_at" | "none";
  generated_at: string;
  sections: readonly CommandBriefSection[];
  all_signals: readonly CommandBriefSignal[];
  prioritized_signals: readonly CommandBriefSignal[];
  permission_denied: boolean;
  app_entitlement_blocked: boolean;
  empty_signal_basis: boolean;
  source_modules: readonly string[];
};

export type CommandBriefRawDomainSignal = {
  signal_key: string;
  count: number | null;
  source_tier?: CommandBriefSourceTier;
  source_reference?: string | null;
  detected_at?: string | null;
  source_exact?: boolean;
};

export type CommandBriefDomainSignalSource = {
  source_module: string;
  source_provider: string;
  signals: readonly CommandBriefRawDomainSignal[];
  required_permission?: string | null;
  required_entitlement?: string | null;
  related_capability?: string | null;
  panel?: CommandBriefPanel;
};

export function isCommandBriefSourceDisplayable(tier: CommandBriefSourceTier): boolean {
  return tier === "exact_live" || tier === "compatible_live";
}
